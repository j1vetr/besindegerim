import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { db } from "./db";
import { foods } from "../shared/schema";
import { eq } from "drizzle-orm";

interface ImageMapping {
  originalFileName: string;
  foodId: string;
  foodName: string;
}

const imageMappings: ImageMapping[] = [
  { originalFileName: "Fresh_dill_herb_photo_72240fea.png", foodId: "86a7b341-d40c-446e-a8bd-15ae9abffaf0", foodName: "Dereotu" },
  { originalFileName: "Fresh_basil_leaves_photo_a339e0f5.png", foodId: "be5be6b2-be7f-4955-b001-7b379298aeea", foodName: "Fesleğen" },
  { originalFileName: "Fresh_thyme_sprigs_photo_377dc26a.png", foodId: "09a8e6e9-78dd-4f5b-87ab-dbd82e83221a", foodName: "Kekik" },
  { originalFileName: "Dried_oregano_photo_f7e0f327.png", foodId: "b9200cba-f661-46b2-a5be-6b3323d19c96", foodName: "Kekik (Oregan)" },
  { originalFileName: "Fresh_cilantro_leaves_photo_76f28119.png", foodId: "0f713c23-e5df-4795-af51-c7cfb62dd928", foodName: "Kişniş" },
];

async function main() {
  console.log("🔧 Görsel Optimizasyonu Başlatılıyor...\n");
  
  const inputDir = path.join(process.cwd(), "attached_assets", "generated_images");
  
  for (const mapping of imageMappings) {
    const inputPath = path.join(inputDir, mapping.originalFileName);
    const outputFileName = mapping.originalFileName.replace(".png", ".webp");
    const outputPath = path.join(inputDir, outputFileName);
    
    console.log(`\n📸 ${mapping.foodName}`);
    
    try {
      const stats = await fs.stat(inputPath);
      const originalSizeKB = (stats.size / 1024).toFixed(2);
      
      await sharp(inputPath)
        .resize(800, 800, { fit: 'cover', position: 'center', withoutEnlargement: true })
        .webp({ quality: 85, effort: 6 })
        .toFile(outputPath);
      
      const optimizedStats = await fs.stat(outputPath);
      const optimizedSizeKB = (optimizedStats.size / 1024).toFixed(2);
      const reduction = ((1 - optimizedStats.size / stats.size) * 100).toFixed(1);
      
      console.log(`   ${originalSizeKB} KB → ${optimizedSizeKB} KB (${reduction}% azalma)`);
      
      const imageUrl = `attached_assets/generated_images/${outputFileName}`;
      await db.update(foods).set({ imageUrl }).where(eq(foods.id, mapping.foodId));
      
      console.log(`   ✅ Veritabanına kaydedildi`);
      
      await fs.unlink(inputPath);
      console.log(`   🗑️  PNG silindi`);
      
    } catch (error) {
      console.error(`   ❌ Hata: ${error}`);
    }
  }
}

main().catch(console.error);
