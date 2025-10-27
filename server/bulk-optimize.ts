import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { db } from "./db";
import { foods } from "../shared/schema";
import { eq, or, isNull } from "drizzle-orm";

async function main() {
  console.log("🔧 Toplu Optimizasyon Başlatılıyor...\n");
  
  const dir = path.join(process.cwd(), "attached_assets", "generated_images");
  const files = await fs.readdir(dir);
  const pngFiles = files.filter(f => f.endsWith('.png'));
  
  console.log(`📊 ${pngFiles.length} PNG dosyası bulundu\n`);
  
  let success = 0;
  let errors = 0;
  
  for (const file of pngFiles) {
    const input = path.join(dir, file);
    const output = path.join(dir, file.replace('.png', '.webp'));
    
    console.log(`📸 ${file}`);
    
    try {
      const before = await fs.stat(input);
      
      await sharp(input)
        .resize(800, 800, { 
          fit: 'cover', 
          position: 'center',
          withoutEnlargement: true 
        })
        .webp({ quality: 85, effort: 6 })
        .toFile(output);
      
      const after = await fs.stat(output);
      const reduction = ((1 - after.size / before.size) * 100).toFixed(1);
      
      console.log(`   ${(before.size / 1024).toFixed(2)} KB → ${(after.size / 1024).toFixed(2)} KB (${reduction}% azalma)`);
      
      // PNG'yi sil
      await fs.unlink(input);
      
      success++;
    } catch (error) {
      console.error(`   ❌ Hata: ${error}`);
      errors++;
    }
  }
  
  console.log("\n" + "=".repeat(50));
  console.log(`✅ Başarılı: ${success}`);
  console.log(`❌ Hatalı: ${errors}`);
  console.log("=".repeat(50) + "\n");
  
  console.log("💾 Veritabanı güncellemesi başlatılıyor...\n");
  
  // WebP dosyalarını al
  const allFiles = await fs.readdir(dir);
  const webpFiles = allFiles.filter(f => f.endsWith('.webp'));
  
  console.log(`${webpFiles.length} WebP dosyası bulundu\n`);
  
  // Görseli olmayan gıdaları al
  const foodsWithoutImages = await db
    .select({ id: foods.id, name: foods.name })
    .from(foods)
    .where(or(isNull(foods.imageUrl), eq(foods.imageUrl, "")));
  
  console.log(`${foodsWithoutImages.length} ürünün görseli eksik\n`);
  
  let dbUpdates = 0;
  
  // İlk WebP dosyasını ilk gıdaya, ikincisini ikincisine vs. ata
  for (let i = 0; i < Math.min(webpFiles.length, foodsWithoutImages.length); i++) {
    const file = webpFiles[i];
    const food = foodsWithoutImages[i];
    
    const imageUrl = `attached_assets/generated_images/${file}`;
    
    await db
      .update(foods)
      .set({ imageUrl })
      .where(eq(foods.id, food.id));
    
    console.log(`✅ ${food.name} → ${file.substring(0, 40)}...`);
    dbUpdates++;
  }
  
  console.log("\n" + "=".repeat(50));
  console.log(`💾 ${dbUpdates} ürün güncellendi`);
  console.log("=".repeat(50));
}

main().catch(console.error);
