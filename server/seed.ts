// Comprehensive seed script - 300+ Turkish foods from USDA with Pexels images
import { searchFoods, getFoodById, normalizeFoodDataWithImage, generateSlug } from "./usda-client";
import { storage } from "./storage";

// Comprehensive Turkish foods with USDA queries and categories
const turkishFoods = [
  // 🌾 Tahıllar & Ürünleri
  { query: "wheat grain", turkishName: "Buğday", category: "Tahıllar & Ürünleri" },
  { query: "rice white cooked", turkishName: "Beyaz Pirinç", fdcId: 169756, category: "Tahıllar & Ürünleri" },
  { query: "rice brown cooked", turkishName: "Esmer Pirinç", fdcId: 169704, category: "Tahıllar & Ürünleri" },
  { query: "oats", turkishName: "Yulaf", fdcId: 169705, category: "Tahıllar & Ürünleri" },
  { query: "barley", turkishName: "Arpa", category: "Tahıllar & Ürünleri" },
  { query: "rye", turkishName: "Çavdar", category: "Tahıllar & Ürünleri" },
  { query: "corn grain", turkishName: "Mısır Tanesi", fdcId: 169998, category: "Tahıllar & Ürünleri" },
  { query: "corn flour", turkishName: "Mısır Unu", category: "Tahıllar & Ürünleri" },
  { query: "quinoa cooked", turkishName: "Kinoa", category: "Tahıllar & Ürünleri" },
  { query: "buckwheat", turkishName: "Karabuğday", category: "Tahıllar & Ürünleri" },
  { query: "millet cooked", turkishName: "Darı", category: "Tahıllar & Ürünleri" },
  { query: "bulgur cooked", turkishName: "Bulgur", fdcId: 170286, category: "Tahıllar & Ürünleri" },
  { query: "semolina", turkishName: "İrmik", category: "Tahıllar & Ürünleri" },
  { query: "couscous cooked", turkishName: "Kuskus", category: "Tahıllar & Ürünleri" },
  { query: "amaranth grain", turkishName: "Amarant", category: "Tahıllar & Ürünleri" },
  { query: "teff grain", turkishName: "Teff", category: "Tahıllar & Ürünleri" },
  { query: "sorghum", turkishName: "Sorgum", category: "Tahıllar & Ürünleri" },
  { query: "rice basmati", turkishName: "Basmati Pirinç", category: "Tahıllar & Ürünleri" },
  { query: "rice jasmine", turkishName: "Jasmine Pirinç", category: "Tahıllar & Ürünleri" },
  { query: "bread white", turkishName: "Beyaz Ekmek", fdcId: 172687, category: "Tahıllar & Ürünleri" },
  { query: "bread whole wheat", turkishName: "Tam Buğday Ekmeği", fdcId: 172816, category: "Tahıllar & Ürünleri" },
  { query: "tortilla corn", turkishName: "Mısır Tortilla", category: "Tahıllar & Ürünleri" },
  { query: "tortilla flour", turkishName: "Buğday Tortilla", category: "Tahıllar & Ürünleri" },
  { query: "pasta dry", turkishName: "Makarna (Kuru)", fdcId: 169738, category: "Tahıllar & Ürünleri" },
  { query: "noodles dry", turkishName: "Noodle (Kuru)", category: "Tahıllar & Ürünleri" },

  // 🫘 Bakliyat & Soya Ürünleri
  { query: "chickpeas dry", turkishName: "Nohut (Kuru)", fdcId: 173757, category: "Bakliyat" },
  { query: "beans white dry", turkishName: "Beyaz Fasulye", category: "Bakliyat" },
  { query: "beans pinto dry", turkishName: "Barbunya", category: "Bakliyat" },
  { query: "beans black dry", turkishName: "Siyah Fasulye", category: "Bakliyat" },
  { query: "beans pinto", turkishName: "Pinto Fasulye", category: "Bakliyat" },
  { query: "beans kidney dry", turkishName: "Kırmızı Fasulye", fdcId: 173735, category: "Bakliyat" },
  { query: "lentils green", turkishName: "Yeşil Mercimek", category: "Bakliyat" },
  { query: "lentils red", turkishName: "Kırmızı Mercimek", fdcId: 169401, category: "Bakliyat" },
  { query: "broadbeans dry", turkishName: "Bakla (Kuru)", category: "Bakliyat" },
  { query: "peas split dry", turkishName: "Bezelye (Kuru)", category: "Bakliyat" },
  { query: "soybeans dry", turkishName: "Soya Fasulyesi", category: "Bakliyat" },
  { query: "edamame", turkishName: "Edamame", category: "Bakliyat" },
  { query: "tofu", turkishName: "Tofu", category: "Bakliyat" },
  { query: "tempeh", turkishName: "Tempeh", category: "Bakliyat" },
  { query: "lupini beans", turkishName: "Lupin Fasulyesi", category: "Bakliyat" },
  { query: "mung beans", turkishName: "Mungo Fasulyesi", category: "Bakliyat" },
  { query: "lima beans", turkishName: "Lima Fasulyesi", category: "Bakliyat" },
  { query: "peanuts", turkishName: "Yer Fıstığı", fdcId: 172430, category: "Bakliyat" },
  { query: "chickpea flour", turkishName: "Nohut Unu", category: "Bakliyat" },
  { query: "soy flour", turkishName: "Soya Unu", category: "Bakliyat" },

  // 🥦 Sebzeler
  { query: "tomato raw", turkishName: "Domates", fdcId: 170457, category: "Sebzeler" },
  { query: "cucumber raw", turkishName: "Salatalık", fdcId: 168409, category: "Sebzeler" },
  { query: "carrot raw", turkishName: "Havuç", fdcId: 170393, category: "Sebzeler" },
  { query: "potato raw", turkishName: "Patates", fdcId: 170026, category: "Sebzeler" },
  { query: "onion raw", turkishName: "Soğan", fdcId: 170000, category: "Sebzeler" },
  { query: "garlic raw", turkishName: "Sarımsak", fdcId: 169230, category: "Sebzeler" },
  { query: "pepper bell green", turkishName: "Yeşil Biber", fdcId: 170108, category: "Sebzeler" },
  { query: "pepper bell red", turkishName: "Kırmızı Biber", category: "Sebzeler" },
  { query: "chili pepper", turkishName: "Acı Biber", category: "Sebzeler" },
  { query: "zucchini raw", turkishName: "Kabak", fdcId: 169291, category: "Sebzeler" },
  { query: "eggplant raw", turkishName: "Patlıcan", fdcId: 169228, category: "Sebzeler" },
  { query: "broccoli raw", turkishName: "Brokoli", fdcId: 170379, category: "Sebzeler" },
  { query: "cauliflower raw", turkishName: "Karnabahar", fdcId: 170390, category: "Sebzeler" },
  { query: "spinach raw", turkishName: "Ispanak", fdcId: 168462, category: "Sebzeler" },
  { query: "lettuce raw", turkishName: "Marul", fdcId: 169248, category: "Sebzeler" },
  { query: "arugula raw", turkishName: "Roka", category: "Sebzeler" },
  { query: "cabbage white raw", turkishName: "Beyaz Lahana", category: "Sebzeler" },
  { query: "cabbage red raw", turkishName: "Kırmızı Lahana", category: "Sebzeler" },
  { query: "brussels sprouts", turkishName: "Brüksel Lahanası", category: "Sebzeler" },
  { query: "leeks raw", turkishName: "Pırasa", category: "Sebzeler" },
  { query: "celery raw", turkishName: "Kereviz Sapı", category: "Sebzeler" },
  { query: "celery root", turkishName: "Kereviz Kökü", category: "Sebzeler" },
  { query: "radish raw", turkishName: "Turp", category: "Sebzeler" },
  { query: "turnip raw", turkishName: "Şalgam", category: "Sebzeler" },
  { query: "beets raw", turkishName: "Pancar", category: "Sebzeler" },
  { query: "artichoke", turkishName: "Enginar", category: "Sebzeler" },
  { query: "asparagus raw", turkishName: "Kuşkonmaz", category: "Sebzeler" },
  { query: "corn sweet", turkishName: "Taze Mısır", category: "Sebzeler" },
  { query: "peas green raw", turkishName: "Bezelye (Taze)", category: "Sebzeler" },
  { query: "beans green raw", turkishName: "Taze Fasulye", fdcId: 169961, category: "Sebzeler" },
  { query: "okra raw", turkishName: "Bamya", category: "Sebzeler" },
  { query: "sweet potato raw", turkishName: "Tatlı Patates", category: "Sebzeler" },
  { query: "ginger root", turkishName: "Zencefil", category: "Sebzeler" },
  { query: "turmeric root", turkishName: "Zerdeçal", category: "Sebzeler" },
  { query: "kale raw", turkishName: "Kale", category: "Sebzeler" },
  { query: "bok choy", turkishName: "Çin Lahanası", category: "Sebzeler" },
  { query: "bamboo shoots", turkishName: "Bambu Filizi", category: "Sebzeler" },
  { query: "watercress raw", turkishName: "Su Teresi", category: "Sebzeler" },
  { query: "seaweed nori", turkishName: "Deniz Yosunu - Nori", category: "Sebzeler" },
  { query: "seaweed wakame", turkishName: "Deniz Yosunu - Wakame", category: "Sebzeler" },

  // 🍎 Meyveler
  { query: "apple raw", turkishName: "Elma", fdcId: 171688, category: "Meyveler" },
  { query: "pear raw", turkishName: "Armut", fdcId: 169118, category: "Meyveler" },
  { query: "banana raw", turkishName: "Muz", fdcId: 173944, category: "Meyveler" },
  { query: "orange raw", turkishName: "Portakal", fdcId: 169097, category: "Meyveler" },
  { query: "tangerine raw", turkishName: "Mandalina", fdcId: 169103, category: "Meyveler" },
  { query: "lemon raw", turkishName: "Limon", fdcId: 167747, category: "Meyveler" },
  { query: "grapefruit raw", turkishName: "Greyfurt", fdcId: 173949, category: "Meyveler" },
  { query: "grapes raw", turkishName: "Üzüm", fdcId: 174682, category: "Meyveler" },
  { query: "strawberries raw", turkishName: "Çilek", fdcId: 167762, category: "Meyveler" },
  { query: "raspberries raw", turkishName: "Ahududu", category: "Meyveler" },
  { query: "blackberries raw", turkishName: "Böğürtlen", category: "Meyveler" },
  { query: "blueberries raw", turkishName: "Yaban Mersini", category: "Meyveler" },
  { query: "cherries raw", turkishName: "Kiraz", fdcId: 173032, category: "Meyveler" },
  { query: "cherries sour", turkishName: "Vişne", category: "Meyveler" },
  { query: "watermelon raw", turkishName: "Karpuz", fdcId: 167765, category: "Meyveler" },
  { query: "melon cantaloupe", turkishName: "Kavun", fdcId: 169092, category: "Meyveler" },
  { query: "peach raw", turkishName: "Şeftali", fdcId: 169905, category: "Meyveler" },
  { query: "nectarine raw", turkishName: "Nektarin", category: "Meyveler" },
  { query: "apricot raw", turkishName: "Kayısı", fdcId: 171697, category: "Meyveler" },
  { query: "plum raw", turkishName: "Erik", category: "Meyveler" },
  { query: "pomegranate raw", turkishName: "Nar", category: "Meyveler" },
  { query: "pineapple raw", turkishName: "Ananas", category: "Meyveler" },
  { query: "mango raw", turkishName: "Mango", category: "Meyveler" },
  { query: "papaya raw", turkishName: "Papaya", category: "Meyveler" },
  { query: "kiwi raw", turkishName: "Kivi", fdcId: 173942, category: "Meyveler" },
  { query: "avocado raw", turkishName: "Avokado", fdcId: 171705, category: "Meyveler" },
  { query: "guava raw", turkishName: "Guava", category: "Meyveler" },
  { query: "persimmon raw", turkishName: "Trabzon Hurması", category: "Meyveler" },
  { query: "figs raw", turkishName: "İncir", category: "Meyveler" },
  { query: "dates", turkishName: "Hurma", category: "Meyveler" },
  { query: "coconut meat", turkishName: "Hindistan Cevizi", category: "Meyveler" },
  { query: "lychee raw", turkishName: "Lichi", category: "Meyveler" },
  { query: "pomelo raw", turkishName: "Pomelo", category: "Meyveler" },
  { query: "passion fruit", turkishName: "Passion Fruit", category: "Meyveler" },
  { query: "cranberries raw", turkishName: "Kızılcık", category: "Meyveler" },

  // 🍄 Mantarlar
  { query: "mushrooms white", turkishName: "Kültür Mantarı", fdcId: 169251, category: "Mantarlar" },
  { query: "mushrooms shiitake", turkishName: "Şitake", category: "Mantarlar" },
  { query: "mushrooms oyster", turkishName: "İstiridye Mantarı", category: "Mantarlar" },
  { query: "mushrooms portabella", turkishName: "Portobello", category: "Mantarlar" },
  { query: "mushrooms brown", turkishName: "Kestane Mantarı", category: "Mantarlar" },

  // 🥜 Kuruyemiş & Yağlı Tohumlar
  { query: "almonds", turkishName: "Badem", category: "Kuruyemiş" },
  { query: "hazelnuts", turkishName: "Fındık", category: "Kuruyemiş" },
  { query: "walnuts", turkishName: "Ceviz", category: "Kuruyemiş" },
  { query: "pistachios", turkishName: "Antep Fıstığı", category: "Kuruyemiş" },
  { query: "cashews", turkishName: "Kaju", category: "Kuruyemiş" },
  { query: "peanuts", turkishName: "Yer Fıstığı", fdcId: 172430, category: "Kuruyemiş" },
  { query: "macadamia nuts", turkishName: "Makadamya Fındığı", category: "Kuruyemiş" },
  { query: "brazil nuts", turkishName: "Brezilya Fındığı", category: "Kuruyemiş" },
  { query: "pine nuts", turkishName: "Çam Fıstığı", category: "Kuruyemiş" },
  { query: "pecans", turkishName: "Pekan Cevizi", category: "Kuruyemiş" },
  { query: "sunflower seeds", turkishName: "Ay Çekirdeği", category: "Tohumlar" },
  { query: "pumpkin seeds", turkishName: "Kabak Çekirdeği", category: "Tohumlar" },
  { query: "sesame seeds", turkishName: "Susam", category: "Tohumlar" },
  { query: "chia seeds", turkishName: "Chia Tohumu", category: "Tohumlar" },
  { query: "flax seeds", turkishName: "Keten Tohumu", category: "Tohumlar" },
  { query: "hemp seeds", turkishName: "Kenevir Tohumu", category: "Tohumlar" },
  { query: "poppy seeds", turkishName: "Haşhaş Tohumu", category: "Tohumlar" },
  { query: "black cumin", turkishName: "Çörek Otu", category: "Tohumlar" },
  { query: "watermelon seeds", turkishName: "Karpuz Çekirdeği", category: "Tohumlar" },

  // 🥩 Kırmızı Et & Sakatatlar
  { query: "beef lean", turkishName: "Sığır Eti (Yağsız)", fdcId: 174032, category: "Et & Tavuk" },
  { query: "beef ground", turkishName: "Sığır Kıyma", category: "Et & Tavuk" },
  { query: "beef tenderloin", turkishName: "Sığır Bonfile", category: "Et & Tavuk" },
  { query: "veal", turkishName: "Dana Eti", category: "Et & Tavuk" },
  { query: "lamb", turkishName: "Kuzu Eti", fdcId: 174347, category: "Et & Tavuk" },
  { query: "lamb chop", turkishName: "Kuzu Pirzola", category: "Et & Tavuk" },
  { query: "mutton", turkishName: "Koyun Eti", category: "Et & Tavuk" },
  { query: "goat meat", turkishName: "Keçi Eti", category: "Et & Tavuk" },
  { query: "beef liver", turkishName: "Sığır Karaciğer", category: "Et & Tavuk" },
  { query: "beef kidney", turkishName: "Sığır Böbrek", category: "Et & Tavuk" },
  { query: "beef tongue", turkishName: "Sığır Dili", category: "Et & Tavuk" },
  { query: "veal liver", turkishName: "Dana Ciğer", category: "Et & Tavuk" },
  { query: "lamb liver", turkishName: "Kuzu Ciğer", category: "Et & Tavuk" },
  { query: "bone marrow", turkishName: "Dana İlik", category: "Et & Tavuk" },
  { query: "beef stew meat", turkishName: "Dana Kuşbaşı", category: "Et & Tavuk" },

  // 🍗 Kümes Hayvanları & Yumurta
  { query: "chicken breast", turkishName: "Tavuk Göğsü", fdcId: 171477, category: "Et & Tavuk" },
  { query: "chicken thigh", turkishName: "Tavuk But", fdcId: 173626, category: "Et & Tavuk" },
  { query: "chicken wing", turkishName: "Tavuk Kanat", category: "Et & Tavuk" },
  { query: "turkey breast", turkishName: "Hindi Eti (Göğüs)", fdcId: 171116, category: "Et & Tavuk" },
  { query: "turkey thigh", turkishName: "Hindi But", category: "Et & Tavuk" },
  { query: "duck meat", turkishName: "Ördek Eti", category: "Et & Tavuk" },
  { query: "goose meat", turkishName: "Kaz Eti", category: "Et & Tavuk" },
  { query: "quail meat", turkishName: "Bıldırcın Eti", category: "Et & Tavuk" },
  { query: "chicken liver", turkishName: "Tavuk Ciğer", category: "Et & Tavuk" },
  { query: "egg whole raw", turkishName: "Yumurta (Tam)", fdcId: 173424, category: "Yumurta & Kahvaltılıklar" },
  { query: "egg white raw", turkishName: "Yumurta Beyazı", category: "Yumurta & Kahvaltılıklar" },
  { query: "egg yolk raw", turkishName: "Yumurta Sarısı", category: "Yumurta & Kahvaltılıklar" },
  { query: "quail egg", turkishName: "Bıldırcın Yumurtası", category: "Yumurta & Kahvaltılıklar" },
  { query: "turkey ham", turkishName: "Hindi Jambon", category: "Et & Tavuk" },
  { query: "chicken ham", turkishName: "Tavuk Jambon", category: "Et & Tavuk" },

  // 🐟 Deniz Ürünleri
  { query: "salmon atlantic", turkishName: "Somon (Atlantik)", fdcId: 175168, category: "Balık & Deniz Ürünleri" },
  { query: "tuna fresh", turkishName: "Ton Balığı (Taze)", fdcId: 175149, category: "Balık & Deniz Ürünleri" },
  { query: "tuna canned", turkishName: "Ton Balığı (Konserve)", category: "Balık & Deniz Ürünleri" },
  { query: "sardines", turkishName: "Sardalya", category: "Balık & Deniz Ürünleri" },
  { query: "anchovy", turkishName: "Hamsi", category: "Balık & Deniz Ürünleri" },
  { query: "mackerel", turkishName: "Uskumru", category: "Balık & Deniz Ürünleri" },
  { query: "cod", turkishName: "Morina", category: "Balık & Deniz Ürünleri" },
  { query: "whiting fish", turkishName: "Mezgit", category: "Balık & Deniz Ürünleri" },
  { query: "sea bass", turkishName: "Levrek", category: "Balık & Deniz Ürünleri" },
  { query: "sea bream", turkishName: "Çipura", category: "Balık & Deniz Ürünleri" },
  { query: "trout", turkishName: "Alabalık", category: "Balık & Deniz Ürünleri" },
  { query: "halibut", turkishName: "Halibut", category: "Balık & Deniz Ürünleri" },
  { query: "tilapia", turkishName: "Tilapia", category: "Balık & Deniz Ürünleri" },
  { query: "pollock fish", turkishName: "Pollock", category: "Balık & Deniz Ürünleri" },
  { query: "herring", turkishName: "Ringabalığı", category: "Balık & Deniz Ürünleri" },
  { query: "swordfish", turkishName: "Kılıç Balığı", category: "Balık & Deniz Ürünleri" },
  { query: "shrimp", turkishName: "Karides", fdcId: 175180, category: "Balık & Deniz Ürünleri" },
  { query: "lobster", turkishName: "Istakoz", category: "Balık & Deniz Ürünleri" },
  { query: "crab", turkishName: "Yengeç", category: "Balık & Deniz Ürünleri" },
  { query: "mussels", turkishName: "Midye", category: "Balık & Deniz Ürünleri" },
  { query: "oysters", turkishName: "İstiridye", category: "Balık & Deniz Ürünleri" },
  { query: "squid", turkishName: "Kalamar", category: "Balık & Deniz Ürünleri" },
  { query: "octopus", turkishName: "Ahtapot", category: "Balık & Deniz Ürünleri" },
  { query: "scallop", turkishName: "Deniztarağı", category: "Balık & Deniz Ürünleri" },
  { query: "fish roe", turkishName: "Balık Yumurtası", category: "Balık & Deniz Ürünleri" },

  // 🧀 Süt & Süt Ürünleri
  { query: "milk whole", turkishName: "Süt (Tam Yağlı)", fdcId: 171265, category: "Süt Ürünleri" },
  { query: "milk 2%", turkishName: "Süt (Yarım Yağlı)", category: "Süt Ürünleri" },
  { query: "milk skim", turkishName: "Süt (Yağsız)", category: "Süt Ürünleri" },
  { query: "milk lactose free", turkishName: "Laktozsuz Süt", category: "Süt Ürünleri" },
  { query: "yogurt plain", turkishName: "Yoğurt (Tam Yağlı)", fdcId: 170903, category: "Süt Ürünleri" },
  { query: "yogurt low fat", turkishName: "Yoğurt (Light)", category: "Süt Ürünleri" },
  { query: "yogurt greek", turkishName: "Süzme Yoğurt", category: "Süt Ürünleri" },
  { query: "kefir", turkishName: "Kefir", category: "Süt Ürünleri" },
  { query: "ayran", turkishName: "Ayran", category: "Süt Ürünleri" },
  { query: "cheese feta", turkishName: "Beyaz Peynir", fdcId: 172193, category: "Süt Ürünleri" },
  { query: "cheese kashkaval", turkishName: "Kaşar Peynir", category: "Süt Ürünleri" },
  { query: "cheese mozzarella", turkishName: "Mozzarella", fdcId: 173418, category: "Süt Ürünleri" },
  { query: "cheese cheddar", turkishName: "Cheddar", fdcId: 173417, category: "Süt Ürünleri" },
  { query: "cheese gouda", turkishName: "Gouda", category: "Süt Ürünleri" },
  { query: "cheese parmesan", turkishName: "Parmesan", category: "Süt Ürünleri" },
  { query: "cheese tulum", turkishName: "Tulum Peyniri", category: "Süt Ürünleri" },
  { query: "cheese ricotta", turkishName: "Ricotta", category: "Süt Ürünleri" },
  { query: "cheese cottage", turkishName: "Cottage Cheese", fdcId: 170851, category: "Süt Ürünleri" },
  { query: "labneh", turkishName: "Labne", category: "Süt Ürünleri" },
  { query: "cream cheese", turkishName: "Krem Peynir", category: "Süt Ürünleri" },
  { query: "butter", turkishName: "Tereyağı", fdcId: 173410, category: "Süt Ürünleri" },
  { query: "clotted cream", turkishName: "Kaymak", category: "Süt Ürünleri" },
  { query: "heavy cream", turkishName: "Krema", fdcId: 170859, category: "Süt Ürünleri" },
  { query: "ice cream vanilla", turkishName: "Dondurma (Vanilya)", fdcId: 170899, category: "Süt Ürünleri" },
  { query: "whey protein powder", turkishName: "Peynir Altı Suyu Proteini", category: "Süt Ürünleri" },

  // 🧴 Yağlar & Katı Yağlar
  { query: "olive oil", turkishName: "Zeytinyağı", fdcId: 172336, category: "Yağlar" },
  { query: "sunflower oil", turkishName: "Ayçiçek Yağı", category: "Yağlar" },
  { query: "canola oil", turkishName: "Kanola Yağı", category: "Yağlar" },
  { query: "corn oil", turkishName: "Mısır Yağı", category: "Yağlar" },
  { query: "soybean oil", turkishName: "Soya Yağı", category: "Yağlar" },
  { query: "peanut oil", turkishName: "Yer Fıstığı Yağı", category: "Yağlar" },
  { query: "sesame oil", turkishName: "Susam Yağı", category: "Yağlar" },
  { query: "coconut oil", turkishName: "Hindistan Cevizi Yağı", category: "Yağlar" },
  { query: "avocado oil", turkishName: "Avokado Yağı", category: "Yağlar" },
  { query: "grapeseed oil", turkishName: "Üzüm Çekirdeği Yağı", category: "Yağlar" },
  { query: "ghee", turkishName: "Ghee (Sade Yağ)", category: "Yağlar" },
  { query: "margarine", turkishName: "Margarin", category: "Yağlar" },
  { query: "lard", turkishName: "Domuz Yağı", category: "Yağlar" },
  { query: "beef tallow", turkishName: "Sığır Yağı", category: "Yağlar" },
  { query: "palm oil", turkishName: "Palm Yağı", category: "Yağlar" },

  // 🍯 Şeker & Tatlandırıcılar
  { query: "sugar white", turkishName: "Beyaz Şeker", category: "Tatlandırıcılar" },
  { query: "sugar brown", turkishName: "Esmer Şeker", category: "Tatlandırıcılar" },
  { query: "honey", turkishName: "Bal", fdcId: 169640, category: "Tatlandırıcılar" },
  { query: "molasses", turkishName: "Pekmez", category: "Tatlandırıcılar" },
  { query: "maple syrup", turkishName: "Akçaağaç Şurubu", category: "Tatlandırıcılar" },
  { query: "agave syrup", turkishName: "Agave Şurubu", category: "Tatlandırıcılar" },
  { query: "glucose syrup", turkishName: "Glukoz Şurubu", category: "Tatlandırıcılar" },
  { query: "fructose", turkishName: "Fruktoz Şurubu", category: "Tatlandırıcılar" },
  { query: "aspartame", turkishName: "Aspartam", category: "Tatlandırıcılar" },
  { query: "stevia", turkishName: "Stevia", category: "Tatlandırıcılar" },

  // 🥤 Alkolsüz İçecekler
  { query: "water", turkishName: "Su", fdcId: 171288, category: "İçecekler" },
  { query: "sparkling water", turkishName: "Maden Suyu", category: "İçecekler" },
  { query: "soda water", turkishName: "Soda", category: "İçecekler" },
  { query: "tea black", turkishName: "Siyah Çay", fdcId: 171890, category: "İçecekler" },
  { query: "tea green", turkishName: "Yeşil Çay", category: "İçecekler" },
  { query: "tea herbal chamomile", turkishName: "Bitki Çayı (Papatya)", category: "İçecekler" },
  { query: "coffee brewed", turkishName: "Filtre Kahve", category: "İçecekler" },
  { query: "espresso", turkishName: "Espresso", category: "İçecekler" },
  { query: "latte", turkishName: "Latte", category: "İçecekler" },
  { query: "hot chocolate", turkishName: "Sıcak Kakao", category: "İçecekler" },
  { query: "lemonade", turkishName: "Limonata", category: "İçecekler" },
  { query: "orange juice", turkishName: "Portakal Suyu", fdcId: 169098, category: "İçecekler" },
  { query: "apple juice", turkishName: "Elma Suyu", fdcId: 167753, category: "İçecekler" },
  { query: "grape juice", turkishName: "Üzüm Suyu", category: "İçecekler" },
  { query: "tomato juice", turkishName: "Domates Suyu", category: "İçecekler" },
  { query: "vegetable juice", turkishName: "Sebze Suyu", category: "İçecekler" },
  { query: "sports drink", turkishName: "Spor İçeceği", category: "İçecekler" },
  { query: "energy drink", turkishName: "Enerji İçeceği", category: "İçecekler" },
  { query: "coconut water", turkishName: "Hindistan Cevizi Suyu", category: "İçecekler" },

  // 🧂 Soslar, Çeşniler & Fermente Ürünler
  { query: "tomato sauce", turkishName: "Domates Sosu", category: "Soslar" },
  { query: "ketchup", turkishName: "Ketçap", category: "Soslar" },
  { query: "mayonnaise", turkishName: "Mayonez", category: "Soslar" },
  { query: "mustard", turkishName: "Hardal", category: "Soslar" },
  { query: "bbq sauce", turkishName: "Barbekü Sosu", category: "Soslar" },
  { query: "soy sauce", turkishName: "Soya Sosu", category: "Soslar" },
  { query: "vinegar white", turkishName: "Sirke (Beyaz)", category: "Soslar" },
  { query: "apple cider vinegar", turkishName: "Elma Sirkesi", category: "Soslar" },
  { query: "balsamic vinegar", turkishName: "Balzamik Sirke", category: "Soslar" },
  { query: "hot sauce", turkishName: "Acı Sos", category: "Soslar" },
  { query: "salsa", turkishName: "Salsa", category: "Soslar" },
  { query: "hummus", turkishName: "Humus", category: "Soslar" },
  { query: "tahini", turkishName: "Tahin", category: "Soslar" },
  { query: "peanut butter", turkishName: "Yer Fıstığı Ezmesi", fdcId: 172470, category: "Soslar" },
  { query: "pesto", turkishName: "Pesto Sosu", category: "Soslar" },
  { query: "pickles cucumber", turkishName: "Turşu (Salatalık)", category: "Soslar" },
  { query: "kimchi", turkishName: "Kimchi", category: "Soslar" },

  // 🥣 Kahvaltılık Gevrekler & Barlar
  { query: "corn flakes", turkishName: "Mısır Gevreği", fdcId: 173901, category: "Kahvaltılıklar" },
  { query: "oatmeal instant", turkishName: "Yulaf Ezmesi (Instant)", category: "Kahvaltılıklar" },
  { query: "granola", turkishName: "Granola", category: "Kahvaltılıklar" },
  { query: "muesli", turkishName: "Müsli", category: "Kahvaltılıklar" },
  { query: "protein bar", turkishName: "Protein Bar", category: "Kahvaltılıklar" },

  // 🍜 Çorbalar & Temel Hazır Ürünler
  { query: "vegetable soup", turkishName: "Sebze Çorbası", category: "Çorbalar" },
  { query: "chicken broth", turkishName: "Tavuk Suyu Çorbası", category: "Çorbalar" },
  { query: "tomato soup", turkishName: "Domates Çorbası", category: "Çorbalar" },
  { query: "beef broth", turkishName: "Et Suyu/Bulyon", category: "Çorbalar" },
  { query: "instant noodles", turkishName: "Noodle Çorbası (Instant)", category: "Çorbalar" },
  { query: "tomato paste", turkishName: "Domates Püresi", category: "Konserve Ürünler" },
  { query: "beans canned", turkishName: "Fasulye Konservesi", category: "Konserve Ürünler" },
  { query: "tuna canned water", turkishName: "Ton Balığı Konservesi", category: "Konserve Ürünler" },
  { query: "corn canned", turkishName: "Mısır Konservesi", category: "Konserve Ürünler" },
  { query: "peas canned", turkishName: "Bezelye Konservesi", category: "Konserve Ürünler" },
];

async function seedDatabase() {
  console.log("🌱 Starting comprehensive database seed with 300+ foods...\n");
  console.log("📝 This will take several minutes due to USDA API rate limits.\n");

  let imported = 0;
  let updated = 0;
  let failed = 0;

  for (const food of turkishFoods) {
    try {
      // Check if already exists
      const existing = food.fdcId ? await storage.getFoodByFdcId(food.fdcId) : null;
      
      if (existing) {
        console.log(`🔄 Updating ${food.turkishName}...`);
        const usdaFood = await getFoodById(food.fdcId!);
        const normalizedData = await normalizeFoodDataWithImage(usdaFood, food.turkishName, food.category);
        
        await storage.updateFood(existing.id, {
          category: normalizedData.category,
          imageUrl: normalizedData.imageUrl,
          servingLabel: normalizedData.servingLabel,
        });
        console.log(`✅ Updated: ${food.turkishName} (${food.category})\n`);
        updated++;
        
        // Rate limit protection
        await new Promise((resolve) => setTimeout(resolve, 300));
        continue;
      }

      console.log(`📥 Importing ${food.turkishName}...`);

      // Search or fetch directly
      let usdaFood;
      if (food.fdcId) {
        usdaFood = await getFoodById(food.fdcId);
      } else {
        // Search for the food
        const results = await searchFoods(food.query);
        if (results.length === 0) {
          console.log(`⚠️  No USDA results for: ${food.turkishName}\n`);
          failed++;
          continue;
        }
        usdaFood = await getFoodById(results[0].fdcId);
      }

      // Normalize to our schema and fetch Pexels image
      const normalizedData = await normalizeFoodDataWithImage(usdaFood, food.turkishName, food.category);

      // Generate slug
      const slug = generateSlug(normalizedData.name);

      // Create in database
      const createdFood = await storage.createFood({
        ...normalizedData,
        slug,
      });

      console.log(`✅ Imported: ${createdFood.name} (${createdFood.calories} kcal per ${createdFood.servingLabel}) [${food.category}]\n`);
      imported++;

      // Rate limit protection - 500ms delay between requests
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Failed to import ${food.turkishName}:`, error);
      failed++;
    }
  }

  console.log(`\n🎉 Seed complete!`);
  console.log(`   ✅ Imported: ${imported} foods`);
  console.log(`   🔄 Updated: ${updated} foods`);
  console.log(`   ❌ Failed: ${failed} foods`);
}

// Main execution
async function main() {
  try {
    await seedDatabase();
    console.log("\n✨ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

main();
