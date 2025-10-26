import { db } from "./db";
import { foods } from "../shared/schema";
import { isNull, or, eq } from "drizzle-orm";
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

// Bu script görseli olmayan gıdalar için AI ile görsel oluşturur, optimize eder ve WebP'ye çevirir

interface Food {
  id: string;
  name: string;
  nameEn: string | null;
  category: string | null;
  subcategory: string | null;
}

async function generateAndOptimizeImage(food: Food): Promise<string | null> {
  try {
    console.log(`📸 ${food.name} için görsel oluşturuluyor...`);
    
    // Türkçe ve İngilizce isimlerden en uygununu seç
    const foodName = food.name;
    const englishName = food.nameEn || food.name;
    
    // AI için prompt oluştur
    const prompt = `Professional food photography of ${englishName}, clean white background, studio lighting, high quality product shot, appetizing presentation, ${foodName} (Turkish cuisine), commercial photography style, sharp focus, no text, no watermark`;
    
    console.log(`   Prompt: ${prompt.substring(0, 80)}...`);
    
    // Burada AI ile görsel oluşturma çağrısı yapılacak
    // Şimdilik placeholder döndürelim
    console.log(`   ⚠️  AI görsel oluşturma fonksiyonu henüz entegre edilmedi`);
    
    // TODO: Buraya generate_image_tool çağrısı eklenecek
    // const imagePath = await generateImage(prompt);
    
    return null;
  } catch (error) {
    console.error(`❌ ${food.name} için görsel oluşturulurken hata:`, error);
    return null;
  }
}

async function optimizeImage(imagePath: string, outputDir: string): Promise<string> {
  try {
    // Dosya adını al
    const fileName = path.basename(imagePath, path.extname(imagePath));
    const outputPath = path.join(outputDir, `${fileName}.webp`);
    
    console.log(`   🔧 Optimizasyon yapılıyor: ${fileName}`);
    
    // Sharp ile optimize et ve WebP'ye çevir
    await sharp(imagePath)
      .resize(800, 800, {
        fit: 'cover',
        position: 'center'
      })
      .webp({
        quality: 85,
        effort: 6
      })
      .toFile(outputPath);
    
    // Dosya boyutunu kontrol et
    const stats = await fs.stat(outputPath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`   ✅ Optimizasyon tamamlandı: ${sizeKB} KB`);
    
    return outputPath;
  } catch (error) {
    console.error(`   ❌ Optimizasyon hatası:`, error);
    throw error;
  }
}

async function updateFoodImage(foodId: string, imageUrl: string): Promise<void> {
  try {
    await db
      .update(foods)
      .set({ imageUrl })
      .where(eq(foods.id, foodId));
    
    console.log(`   💾 Veritabanı güncellendi`);
  } catch (error) {
    console.error(`   ❌ Veritabanı güncellenemedi:`, error);
    throw error;
  }
}

async function main() {
  console.log("🚀 AI Görsel Oluşturma ve Optimizasyon Başlatılıyor...\n");
  
  // Görseli olmayan gıdaları çek
  const foodsWithoutImages = await db
    .select({
      id: foods.id,
      name: foods.name,
      nameEn: foods.nameEn,
      category: foods.category,
      subcategory: foods.subcategory
    })
    .from(foods)
    .where(or(isNull(foods.imageUrl), eq(foods.imageUrl, "")))
    .orderBy(foods.category, foods.subcategory, foods.name);
  
  console.log(`📊 Toplam ${foodsWithoutImages.length} ürün bulundu\n`);
  
  if (foodsWithoutImages.length === 0) {
    console.log("✅ Tüm ürünlerin görseli mevcut!");
    return;
  }
  
  // Output dizinini oluştur
  const outputDir = path.join(process.cwd(), "attached_assets", "generated_images");
  await fs.mkdir(outputDir, { recursive: true });
  
  let successCount = 0;
  let errorCount = 0;
  
  // Her gıda için işlem yap
  for (let i = 0; i < foodsWithoutImages.length; i++) {
    const food = foodsWithoutImages[i];
    console.log(`\n[${i + 1}/${foodsWithoutImages.length}] ${food.name}`);
    
    try {
      // AI ile görsel oluştur
      const imagePath = await generateAndOptimizeImage(food);
      
      if (!imagePath) {
        console.log(`   ⏭️  Atlandı (görsel oluşturulamadı)`);
        errorCount++;
        continue;
      }
      
      // Görseli optimize et ve WebP'ye çevir
      const optimizedPath = await optimizeImage(imagePath, outputDir);
      
      // Relative URL oluştur
      const imageUrl = `/attached_assets/generated_images/${path.basename(optimizedPath)}`;
      
      // Veritabanını güncelle
      await updateFoodImage(food.id, imageUrl);
      
      successCount++;
      
      // Rate limiting için kısa bekleme
      if ((i + 1) % 10 === 0) {
        console.log(`\n⏸️  10 görsel işlendi, 2 saniye bekleniyor...\n`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
    } catch (error) {
      console.error(`   ❌ Hata: ${error}`);
      errorCount++;
    }
  }
  
  console.log("\n" + "=".repeat(50));
  console.log(`✅ Başarılı: ${successCount}`);
  console.log(`❌ Hatalı: ${errorCount}`);
  console.log(`📊 Toplam: ${foodsWithoutImages.length}`);
  console.log("=".repeat(50) + "\n");
}

main().catch(console.error);
