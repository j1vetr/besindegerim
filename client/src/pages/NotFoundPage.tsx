import React from "react";

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1
          className="text-6xl md:text-7xl font-bold text-foreground mb-4"
          data-testid="text-404"
        >
          404
        </h1>
        <h2
          className="text-2xl md:text-3xl font-semibold text-foreground mb-4"
          data-testid="text-not-found-title"
        >
          Sayfa Bulunamadı
        </h2>
        <p className="text-base text-muted-foreground mb-8" data-testid="text-not-found-message">
          Aradığınız gıda bulunamadı veya sayfa mevcut değil.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover-elevate active-elevate-2 transition-shadow"
          data-testid="link-home-404"
        >
          Ana Sayfaya Dön
        </a>
      </div>
    </div>
  );
}
