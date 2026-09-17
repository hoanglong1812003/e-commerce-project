require("dotenv").config();
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: { name: "Administrator", email: adminEmail, passwordHash, role: "ADMIN" },
    });
    console.log(`Seeded admin account: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log("Admin account already exists, skipping.");
  }

  const productCount = await prisma.product.count();
  if (productCount === 0) {
    await prisma.product.createMany({
      data: [
        {
          name: "Áo thun basic",
          description: "Áo thun cotton 100%, form regular, nhiều màu sắc.",
          price: 199000,
          stock: 50,
          category: "Thời trang",
          imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
        },
        {
          name: "Tai nghe Bluetooth",
          description: "Tai nghe không dây chống ồn, pin 20 giờ.",
          price: 890000,
          stock: 30,
          category: "Điện tử",
          imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
        },
        {
          name: "Bàn phím cơ",
          description: "Bàn phím cơ switch đỏ, đèn RGB, layout 87 phím.",
          price: 1250000,
          stock: 15,
          category: "Điện tử",
          imageUrl: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600",
        },
        {
          name: "Bình giữ nhiệt",
          description: "Bình giữ nhiệt inox 500ml, giữ nóng/lạnh 12 giờ.",
          price: 259000,
          stock: 60,
          category: "Gia dụng",
          imageUrl: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600",
        },
      ],
    });
    console.log("Seeded sample products.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
