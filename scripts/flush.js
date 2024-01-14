const { PrismaClient } = require("@prisma/client");
const { list, del } = require("@vercel/blob");

const prisma = new PrismaClient();

async function flushDatabase() {
  try {
    const models = Reflect.ownKeys(prisma).filter(
      (key) => typeof prisma[key].deleteMany === "function",
    );

    for (const model of models) {
      await prisma[model].deleteMany();
    }

    console.log("Database flushed successfully.");
  } catch (e) {
    console.error("Error while flushing database:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function flushVercelBlob() {
  try {
    let hasMore = true;
    let cursor;

    while (hasMore) {
      const listResult = await list({
        cursor,
      });
      hasMore = listResult.hasMore;
      cursor = listResult.cursor;

      const urls = listResult.blobs.map((blob) => blob.url);

      if (urls.length > 0) {
        await del(urls);
      }
    }

    console.log("Vercel Blob storage flushed successfully.");
  } catch (e) {
    console.error("Error while flushing Vercel Blob storage:", e);
    throw e;
  }
}

async function main() {
  await flushDatabase();
  await flushVercelBlob();
}

main()
  .then(() => {
    prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error in main function:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
