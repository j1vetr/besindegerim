import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { db } from "./db";
import { foods } from "../shared/schema";
import { eq } from "drizzle-orm";

const m = [
  { file: "Poppy_seeds_photo_87c22fc9.png", id: "bd01d8e4-6dab-45ab-abba-0cbb96ffd83a", name: "Haşhaş" },
  { file: "Cashew_nuts_photo_91772409.png", id: "dbb03d12-4df0-4962-abad-3a35a78df58a", name: "Kaju" },
  { file: "Flaxseed_oil_photo_c739b915.png", id: "aa99e2a7-25dd-45c0-bf03-cc5bd1782825", name: "Keten Tohumu" },
  { file: "Macadamia_nuts_photo_8761d16e.png", id: "44f49aee-c0a4-4b50-96f4-ab463dc86bae", name: "Makadamya" },
  { file: "Pecan_halves_photo_636a0856.png", id: "4629a3b1-06ef-40aa-b841-345601ad840c", name: "Pekan Cevizi" },
  { file: "Sesame_seeds_photo_7f837c62.png", id: "826918b2-1f7a-4d4a-bd31-0d41b51c51b1", name: "Susam" },
  { file: "Sesame_oil_photo_1b9c4e8b.png", id: "914ca1a5-881c-4523-8d28-57e81a78c911", name: "Susam Yağı" },
  { file: "Tahini_sesame_butter_60fe0d67.png", id: "958da231-2eab-47e1-8945-6ab54cf2eb06", name: "Tahin" },
  { file: "Pine_nuts_photo_096d0b84.png", id: "150c1d1c-33bc-402d-859e-192c1c45d3a1", name: "Çam Fıstığı" },
  { file: "Fresh_raspberries_photo_c4c09e56.png", id: "156cc975-8c37-4300-a2af-e5691630f563", name: "Ahududu" },
];

async function main() {
  const dir = path.join(process.cwd(), "attached_assets", "generated_images");
  for (const x of m) {
    console.log(`📸 ${x.name}`);
    try {
      const inp = path.join(dir, x.file);
      const out = path.join(dir, x.file.replace(".png", ".webp"));
      const b = await fs.stat(inp);
      await sharp(inp).resize(800, 800, { fit: 'cover', withoutEnlargement: true }).webp({ quality: 85, effort: 6 }).toFile(out);
      const a = await fs.stat(out);
      console.log(`   ${(b.size/1024).toFixed(2)} KB → ${(a.size/1024).toFixed(2)} KB (${((1-a.size/b.size)*100).toFixed(1)}% azalma)`);
      await db.update(foods).set({ imageUrl: `attached_assets/generated_images/${path.basename(out)}` }).where(eq(foods.id, x.id));
      console.log(`   ✅ Kaydedildi`);
      await fs.unlink(inp);
    } catch (e) { console.error(`   ❌ ${e}`); }
  }
}
main();
