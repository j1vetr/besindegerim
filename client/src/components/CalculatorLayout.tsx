import { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calculator } from "lucide-react";
import { Link } from "wouter";
import type { CategoryGroup } from "@shared/schema";

interface CalculatorLayoutProps {
  categoryGroups?: CategoryGroup[];
  currentPath?: string;
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
  children: ReactNode;
  article: ReactNode;
}

export function CalculatorLayout({
  categoryGroups,
  currentPath,
  title,
  description,
  icon,
  color,
  children,
  article
}: CalculatorLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header categoryGroups={categoryGroups} currentPath={currentPath} />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <section className="bg-gray-50 py-4 px-4 border-b">
          <div className="max-w-7xl mx-auto">
            <Link href="/hesaplayicilar">
              <a className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Hesaplayıcılara Dön</span>
              </a>
            </Link>
          </div>
        </section>

        {/* Hero Section */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-green-50 via-white to-emerald-50">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${color} rounded-3xl mb-6 shadow-xl`}>
                {icon}
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
                {title}
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Calculator */}
              <div className="lg:col-span-2">
                <Card className="shadow-xl border-2 border-gray-100">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                      <Calculator className="w-6 h-6 text-green-600" />
                      <h2 className="text-2xl font-bold text-gray-900">Hesaplama Aracı</h2>
                    </div>
                    
                    {children}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Tips Sidebar */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      💡 İpuçları
                    </h3>
                    
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Doğru sonuçlar için sabah ölçümlerinizi kullanın</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Sonuçlar kılavuz niteliğindedir, hekim önerisi alın</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Gerçek porsiyon bazlı besinlerimize göz atın</span>
                      </li>
                    </ul>

                    <div className="mt-6 pt-6 border-t border-green-300">
                      <Link href="/">
                        <a className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold text-sm">
                          <span>Besin Değerleri</span>
                          <span>→</span>
                        </a>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-4xl mx-auto prose prose-lg prose-headings:font-black prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-li:text-gray-700">
            {article}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
