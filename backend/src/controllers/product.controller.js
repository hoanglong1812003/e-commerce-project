const prisma = require("../config/db");

async function list(req, res, next) {
  try {
    const { category, search } = req.query;
    const where = {};
    if (category) where.category = category;
    if (search) where.name = { contains: search, mode: "insensitive" };

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const product = await prisma.product.findUnique({ where: { id: Number(req.params.id) } });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { name, description, price, stock, category } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: "name and price are required" });
    }
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl || null;

    const product = await prisma.product.create({
      data: {
        name,
        description: description || "",
        price,
        stock: stock ? Number(stock) : 0,
        category: category || "general",
        imageUrl,
      },
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { name, description, price, stock, category } = req.body;
    const data = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = price;
    if (stock !== undefined) data.stock = Number(stock);
    if (category !== undefined) data.category = category;
    if (req.file) data.imageUrl = `/uploads/${req.file.filename}`;
    else if (req.body.imageUrl !== undefined) data.imageUrl = req.body.imageUrl;

    const product = await prisma.product.update({ where: { id }, data });
    res.json(product);
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ message: "Product not found" });
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    await prisma.product.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ message: "Product not found" });
    next(err);
  }
}

module.exports = { list, getOne, create, update, remove };
