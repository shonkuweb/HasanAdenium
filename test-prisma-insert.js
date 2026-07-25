const { prisma } = require('./lib/prisma.js');

async function main() {
  try {
    const p = await prisma.product.create({
      data: {
        slug: 'test-slug',
        title: 'test title',
        price: '100',
      }
    });
    console.log("Insert success:", p.id);
    await prisma.product.delete({
      where: { id: p.id }
    });
    console.log("Delete success");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}
main();
