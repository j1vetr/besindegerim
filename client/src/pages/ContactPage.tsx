import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Mail, Clock, Send, CheckCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { CategoryGroup } from "@shared/schema";

interface ContactPageProps {
  categoryGroups?: CategoryGroup[];
  currentPath?: string;
}

export function ContactPage({ categoryGroups = [], currentPath = "/iletisim" }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      setIsSubmitted(true);
      setIsSubmitting(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header categoryGroups={categoryGroups} currentPath={currentPath} />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-white via-green-50 to-emerald-50 overflow-hidden">
          <div className="absolute top-20 left-20 w-96 h-96 bg-green-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"></div>
          
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-5xl sm:text-6xl font-black mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent" data-testid="text-contact-title">
              İletişim
            </h1>
            <p className="text-xl sm:text-2xl text-slate-700 leading-relaxed" data-testid="text-contact-subtitle">
              Bizimle iletişime geçin, size yardımcı olmaktan mutluluk duyarız
            </p>
          </div>
        </section>

        <div className="py-16 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <div className="backdrop-blur-xl bg-white/70 border-2 border-green-200/50 rounded-3xl p-8 shadow-xl shadow-green-500/10">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">İletişim Bilgileri</h2>
                
                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start gap-4" data-testid="card-contact-email">
                    <div className="bg-green-100 rounded-xl p-3 flex-shrink-0">
                      <Mail className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">E-posta</h3>
                      <a 
                        href="mailto:info@besindegerim.com" 
                        className="text-green-600 hover:text-green-700 font-medium"
                        data-testid="link-email"
                      >
                        info@besindegerim.com
                      </a>
                      <p className="text-sm text-slate-600 mt-1">
                        Sorularınız, önerileriniz ve işbirliği teklifleri için
                      </p>
                    </div>
                  </div>

                  {/* Response Time */}
                  <div className="flex items-start gap-4" data-testid="card-response-time">
                    <div className="bg-green-100 rounded-xl p-3 flex-shrink-0">
                      <Clock className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">Yanıt Süresi</h3>
                      <p className="text-slate-700">Hafta içi: <strong className="text-green-600">24-48 saat</strong></p>
                      <p className="text-slate-700">Hafta sonu: <strong className="text-green-600">48-72 saat</strong></p>
                      <p className="text-sm text-slate-600 mt-1">
                        Tüm mesajları dikkatle okur ve en kısa sürede yanıtlarız
                      </p>
                    </div>
                  </div>

                  {/* Message Types */}
                  <div className="flex items-start gap-4" data-testid="card-message-types">
                    <div className="bg-green-100 rounded-xl p-3 flex-shrink-0">
                      <MessageSquare className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">Mesaj Konuları</h3>
                      <ul className="space-y-1 text-slate-700 text-sm">
                        <li>• Genel sorular ve öneriler</li>
                        <li>• Besin değerleri ile ilgili geri bildirimler</li>
                        <li>• Yeni gıda ekleme talepleri</li>
                        <li>• İşbirliği ve ortaklık teklifleri</li>
                        <li>• Teknik destek ve hata bildirimleri</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200/50 rounded-2xl p-6">
                <p className="text-sm text-slate-700 leading-relaxed">
                  <strong className="text-green-600">Not:</strong> Tıbbi tavsiye veya kişisel beslenme 
                  planlaması için lütfen bir diyetisyen veya sağlık profesyoneline danışınız. 
                  Bu platform sadece bilgilendirme amaçlıdır.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="backdrop-blur-xl bg-white/70 border-2 border-green-200/50 rounded-3xl p-8 shadow-xl shadow-green-500/10">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Bize Mesaj Gönderin</h2>
              
              {isSubmitted ? (
                <div className="text-center py-12" data-testid="message-success">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Mesajınız Gönderildi!</h3>
                  <p className="text-slate-700 mb-6">
                    Teşekkür ederiz. En kısa sürede size geri dönüş yapacağız.
                  </p>
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    data-testid="button-send-another"
                  >
                    Başka Mesaj Gönder
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-contact">
                  {/* Name Field */}
                  <div>
                    <Label htmlFor="name" className="text-slate-900 font-semibold mb-2 block">
                      Adınız Soyadınız *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Adınızı girin"
                      className="border-green-200 focus:border-green-500"
                      data-testid="input-name"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <Label htmlFor="email" className="text-slate-900 font-semibold mb-2 block">
                      E-posta Adresiniz *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ornek@email.com"
                      className="border-green-200 focus:border-green-500"
                      data-testid="input-email"
                    />
                  </div>

                  {/* Subject Field */}
                  <div>
                    <Label htmlFor="subject" className="text-slate-900 font-semibold mb-2 block">
                      Konu *
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Mesajınızın konusu"
                      className="border-green-200 focus:border-green-500"
                      data-testid="input-subject"
                    />
                  </div>

                  {/* Message Field */}
                  <div>
                    <Label htmlFor="message" className="text-slate-900 font-semibold mb-2 block">
                      Mesajınız *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Mesajınızı buraya yazın..."
                      rows={6}
                      className="border-green-200 focus:border-green-500 resize-none"
                      data-testid="textarea-message"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-6 text-lg font-bold shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/50 disabled:opacity-50"
                    data-testid="button-submit"
                  >
                    {isSubmitting ? (
                      "Gönderiliyor..."
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Mesajı Gönder
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-slate-600 text-center">
                    * işaretli alanlar zorunludur
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ / Help Section */}
        <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-center mb-8 text-slate-900">Sıkça Sorulan Sorular</h2>
            
            <div className="space-y-4">
              <div className="bg-white border-2 border-green-200/50 rounded-2xl p-6" data-testid="faq-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Platformunuz ücretsiz mi?
                </h3>
                <p className="text-slate-700">
                  Evet, besindegerim.com tamamen <strong className="text-green-600">ücretsizdir</strong>. 
                  Tüm besin değerleri ve hesaplayıcılar herkesin kullanımına açıktır.
                </p>
              </div>

              <div className="bg-white border-2 border-green-200/50 rounded-2xl p-6" data-testid="faq-2">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Verilerin kaynağı nedir?
                </h3>
                <p className="text-slate-700">
                  Besin değerleri <strong className="text-green-600">USDA FoodData Central</strong> gibi 
                  güvenilir kaynaklardan alınır ve bilimsel verilere dayanır.
                </p>
              </div>

              <div className="bg-white border-2 border-green-200/50 rounded-2xl p-6" data-testid="faq-3">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Yeni gıda ekleme talebi nasıl yapılır?
                </h3>
                <p className="text-slate-700">
                  Yukarıdaki formu kullanarak bize mesaj gönderebilir, eklemek istediğiniz gıdayı belirtebilirsiniz. 
                  Taleplerinizi değerlendirip en kısa sürede eklemeye çalışırız.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

export default ContactPage;
