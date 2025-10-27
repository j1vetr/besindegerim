import { db } from "./db";
import { foods } from "../shared/schema";
import { isNull } from "drizzle-orm";

async function listUnmapped() {
  const unmapped = await db.select({ name: foods.name, slug: foods.slug })
    .from(foods)
    .where(isNull(foods.imageUrl))
    .orderBy(foods.name);

  console.log(`🔍 Görselsiz Gıdalar (${unmapped.length} adet):\n`);

  unmapped.forEach((f, i) => {
    console.log(`${i+1}. ${f.name} (${f.slug})`);
  });

  process.exit(0);
}

listUnmapped();
