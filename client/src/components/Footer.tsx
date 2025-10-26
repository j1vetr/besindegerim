import React from "react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-green-50 to-emerald-50 border-t-2 border-green-200/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Logo */}
          <a href="/" className="inline-block mb-6 hover:scale-105 transition-transform">
            <img 
              src="/logo.png" 
              alt="Besin Değerim" 
              className="h-20 mx-auto"
              data-testid="img-footer-logo"
            />
          </a>
          
          {/* Description */}
          <p className="text-lg text-slate-700 font-medium mb-2">
            Gerçek porsiyon bazlı kalori ve besin değerleri
          </p>
          
          {/* Credits */}
          <p className="text-sm text-slate-600 mb-6">
            USDA FoodData Central ile destekleniyor
          </p>
          
          {/* Copyright */}
          <p className="text-xs text-slate-500 mb-6" data-testid="text-copyright">
            © {currentYear} besindegerim.com - Tüm hakları saklıdır
          </p>
          
          {/* Green Accent Line */}
          <div className="mx-auto w-32 h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 rounded-full shadow-lg shadow-green-500/30"></div>
        </div>
      </div>
    </footer>
  );
}
