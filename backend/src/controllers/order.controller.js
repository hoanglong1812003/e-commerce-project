const prisma = require("../config/db");

async function create(req, res, next) {
  try {
    const { items } = req.body; // [{ productId, quantity }]
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "items must be a non-empty array" });
    }

    const productIds = items.map((i) => Number(i.productId));
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

    if (products.length !== productIds.length) {
      return res.status(400).json({ message: "One or more products not found" });
    }

    const productMap = new Map(products.map((p) => [p.id, p]));
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = productMap.get(Number(item.productId));
      const quantity = Number(item.quantity);
      if (!quantity || quantity < 1) {
        return res.status(400).json({ message: `Invalid quantity for product ${item.productId}` });
      }
      if (product.stock < quantity) {
        return res.status(400).json({ message: `Not enough stock for "${product.name}"` });
      }
      const price = Number(product.price);
      totalAmount += price * quantity;
      orderItemsData.push({ productId: product.id, quantity, price });
    }

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId: req.user.id,
          totalAmount,
          status: "PENDING",
          items: { create: orderItemsData },
        },
        include: { items: { include: { product: true } } },
      });

      for (const item of orderItemsData) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return created;
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

async function listMine(req, res, next) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const id = Number(req.params.id);
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } }, user: { select: { id: true, name: true, email: true } } },
    });
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (req.user.role !== "ADMIN" && order.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
}

async function listAll(req, res, next) {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};
    const orders = await prisma.order.findMany({
      where,
      include: { items: { include: { product: true } }, user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    const allowed = ["PENDING", "PAID", "FAILED", "SHIPPED", "CANCELLED"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: `status must be one of ${allowed.join(", ")}` });
    }
    const order = await prisma.order.update({ where: { id }, data: { status } });
    res.json(order);
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ message: "Order not found" });
    next(err);
  }
}

module.exports = { create, listMine, getOne, listAll, updateStatus };
