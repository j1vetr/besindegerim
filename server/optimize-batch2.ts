import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { db } from "./db";
import { foods } from "../shared/schema";
import { eq } from "drizzle-orm";

const mappings = [
  { file: "Fresh_parsley_leaves_photo_f105eb0a.png", id: "f73431a3-1dab-4906-9b9d-4a9e4f023645", name: "Maydanoz" },
  { file: "Fresh_mint_leaves_photo_142eba83.png", id: "7be4523b-ba55-40e4-9ee3-33296b9272b8", name: "Nane" },
  { file: "Pistachio_nuts_photo_04be5f70.png", id: "ad288246-fdc5-4aff-88ce-1bf1993c15d3", name: "Antep Fıstığı" },
  { file: "Sunflower_seeds_photo_3856163f.png", id: "47bdfceb-acb1-481d-ad3c-76d86b44caa2", name: "Ayçiçek Çekirdeği" },
  { file: "Raw_almonds_photo_83183007.png", id: "9f2bb174-f7f3-424c-a52d-2bb9cd065698", name: "Badem" },
  { file: "Brazil_nuts_photo_c4dfa5c2.png", id: "cd727a05-8cd4-4543-bf6d-10ddc2ac56df", name: "Brezilya Fıstığı" },
  { file: "English_walnuts_photo_96f451f5.png", id: "4fd3fd5d-bbcb-4fca-abf9-6e7e47013ed7", name: "Ceviz" },
  { file: "Chia_seeds_photo_8b4e3dfd.png", id: "3a459766-f6d8-460b-ae5f-4f8b39b72721", name: "Chia Tohumu" },
  { file: "Raw_hazelnuts_photo_6d73a457.png", id: "de1b0c04-0fd2-455e-929b-92f7b36f9096", name: "Fındık" },
  { file: "Peanut_butter_photo_8c814ce1.png", id: "e246ffe5-a64b-40ec-ba8c-37dbac11b460", name: "Fıstık Ezmesi" },
];

async function main() {
  const dir = path.join(process.cwd(), "attached_assets", "generated_images");
  
  for (const m of mappings) {
    const input = path.join(dir, m.file);
    const output = path.join(dir, m.file.replace(".png", ".webp"));
    
    console.log(`📸 ${m.name}`);
    
    try {
      const before = await fs.stat(input);
      await sharp(input).resize(800, 800, { fit: 'cover', withoutEnlargement: true }).webp({ quality: 85, effort: 6 }).toFile(output);
      const after = await fs.stat(output);
      const reduction = ((1 - after.size / before.size) * 100).toFixed(1);
      console.log(`   ${(before.size / 1024).toFixed(2)} KB → ${(after.size / 1024).toFixed(2)} KB (${reduction}% azalma)`);
      
      await db.update(foods).set({ imageUrl: `attached_assets/generated_images/${path.basename(output)}` }).where(eq(foods.id, m.id));
      console.log(`   ✅ Kaydedildi`);
      await fs.unlink(input);
    } catch (e) {
      console.error(`   ❌ ${e}`);
    }
  }
}

main();
