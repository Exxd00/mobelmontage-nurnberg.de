"use client";

import { Download } from "lucide-react";

// Ad Banner Component
function AdBanner({
  width,
  height,
  title,
  variant = "main",
}: {
  width: number;
  height: number;
  title: string;
  variant?: "main" | "kitchen" | "ikea" | "delivery";
}) {
  const isLandscape = width > height;
  const isSquare = width === height;
  const isSmall = width < 400 || height < 150;
  const isTiny = width < 350 && height < 100;

  const gradients = {
    main: "from-amber-500 via-orange-500 to-red-500",
    kitchen: "from-emerald-500 via-teal-500 to-cyan-500",
    ikea: "from-blue-500 via-blue-600 to-indigo-600",
    delivery: "from-violet-500 via-purple-500 to-fuchsia-500",
  };

  const headlines = {
    main: "Möbelmontage Nürnberg",
    kitchen: "Küchenmontage",
    ikea: "IKEA Montage",
    delivery: "Möbel Lieferung",
  };

  const sublines = {
    main: "Professionell & Schnell",
    kitchen: "Komplett-Service",
    ikea: "PAX, METOD & mehr",
    delivery: "Sicher & Pünktlich",
  };

  const ctas = {
    main: "Jetzt Angebot",
    kitchen: "Termin buchen",
    ikea: "Preis anfragen",
    delivery: "Kostenlos anfragen",
  };

  return (
    <div className="mb-8">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">
        {title} ({width}x{height}px)
      </h3>
      <div
        className={`relative overflow-hidden rounded-lg shadow-xl bg-gradient-to-br ${gradients[variant]}`}
        style={{ width: `${Math.min(width, 800)}px`, height: `${Math.min(height, 400)}px` }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Content */}
        <div className={`relative h-full flex ${isLandscape ? 'flex-row' : 'flex-col'} items-center justify-between p-${isTiny ? '2' : isSmall ? '3' : '6'}`}>

          {/* Left/Top Section - Text */}
          <div className={`${isLandscape ? 'flex-1' : 'text-center'} text-white`}>
            {/* Badge */}
            {!isTiny && (
              <div className={`inline-block bg-white/20 backdrop-blur-sm rounded-full px-${isSmall ? '2' : '3'} py-1 mb-${isSmall ? '1' : '2'}`}>
                <span className={`text-${isTiny ? 'xs' : isSmall ? 'xs' : 'sm'} font-medium`}>
                  12 Jahre Erfahrung
                </span>
              </div>
            )}

            {/* Headline */}
            <h2 className={`font-bold ${isTiny ? 'text-sm' : isSmall ? 'text-lg' : isSquare ? 'text-2xl' : 'text-3xl'} leading-tight mb-${isSmall ? '1' : '2'}`}>
              {headlines[variant]}
            </h2>

            {/* Subline */}
            {!isTiny && (
              <p className={`${isSmall ? 'text-xs' : 'text-lg'} opacity-90 mb-${isSmall ? '2' : '3'}`}>
                {sublines[variant]}
              </p>
            )}

            {/* Features - Only for larger banners */}
            {!isSmall && isLandscape && (
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-white/20 rounded-full px-3 py-1 text-sm">Festpreis</span>
                <span className="bg-white/20 rounded-full px-3 py-1 text-sm">24h Service</span>
                <span className="bg-white/20 rounded-full px-3 py-1 text-sm">Alle Marken</span>
              </div>
            )}

            {/* CTA Button */}
            <button className={`bg-white text-gray-900 font-bold rounded-full shadow-lg hover:shadow-xl transition-all ${
              isTiny ? 'px-3 py-1 text-xs' : isSmall ? 'px-4 py-2 text-sm' : 'px-6 py-3'
            }`}>
              {ctas[variant]}
            </button>
          </div>

          {/* Right/Bottom Section - Visual */}
          {!isTiny && (
            <div className={`${isLandscape ? 'flex-shrink-0 ml-4' : 'mt-4'}`}>
              {/* Stats Circle */}
              <div className={`bg-white/20 backdrop-blur-sm rounded-full flex flex-col items-center justify-center ${
                isSmall ? 'w-16 h-16' : 'w-24 h-24'
              }`}>
                <span className={`font-bold ${isSmall ? 'text-lg' : 'text-2xl'}`}>5000+</span>
                <span className={`${isSmall ? 'text-xs' : 'text-xs'} opacity-80`}>Kunden</span>
              </div>
            </div>
          )}
        </div>

        {/* Corner Logo */}
        <div className={`absolute ${isTiny ? 'bottom-1 right-1' : 'bottom-3 right-3'} bg-white/90 rounded-lg ${isTiny ? 'px-1 py-0.5' : 'px-2 py-1'}`}>
          <span className={`font-bold ${isTiny ? 'text-xs' : 'text-sm'} text-gray-800`}>MöbelMontage</span>
        </div>
      </div>
    </div>
  );
}

// Responsive Display Ad Component
function ResponsiveDisplayAd({
  variant = "main",
}: {
  variant?: "main" | "kitchen" | "ikea" | "delivery";
}) {
  const images = {
    main: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    kitchen: "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&q=80",
    ikea: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    delivery: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&q=80",
  };

  const headlines = {
    main: "Möbelmontage Nürnberg",
    kitchen: "Professionelle Küchenmontage",
    ikea: "IKEA Montage Spezialist",
    delivery: "Möbel Lieferung & Aufbau",
  };

  const descriptions = {
    main: "Professioneller Möbelaufbau in Nürnberg. IKEA, PAX, Küchen & mehr. Festpreis-Garantie!",
    kitchen: "Komplette Kücheninstallation inkl. Elektro & Wasseranschluss. Termin in 24h!",
    ikea: "PAX, METOD, BESTA - Wir bauen alle IKEA Möbel auf. Schnell & sauber!",
    delivery: "Abholung vom Möbelhaus + Aufbau bei Ihnen. Alles aus einer Hand!",
  };

  const colors = {
    main: "bg-gradient-to-br from-amber-500 to-orange-600",
    kitchen: "bg-gradient-to-br from-emerald-500 to-teal-600",
    ikea: "bg-gradient-to-br from-blue-500 to-indigo-600",
    delivery: "bg-gradient-to-br from-violet-500 to-purple-600",
  };

  return (
    <div className="mb-12">
      <h3 className="text-lg font-semibold mb-4 text-foreground">
        Responsive Display Ad - {variant.charAt(0).toUpperCase() + variant.slice(1)}
      </h3>

      {/* Landscape Version */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-2">Landscape (1200x628)</p>
        <div className="relative w-full max-w-3xl h-80 rounded-xl overflow-hidden shadow-2xl">
          <img
            src={images[variant]}
            alt={headlines[variant]}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 p-8 flex flex-col justify-center">
            <div className="max-w-md">
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-1 mb-3">
                <span className="text-white text-sm font-medium">12 Jahre Erfahrung</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-3">{headlines[variant]}</h2>
              <p className="text-white/90 text-lg mb-4">{descriptions[variant]}</p>
              <div className="flex items-center gap-4">
                <button className={`${colors[variant]} text-white font-bold px-6 py-3 rounded-full shadow-lg`}>
                  Jetzt Angebot erhalten
                </button>
                <div className="text-white">
                  <span className="text-2xl font-bold">5.000+</span>
                  <span className="text-sm ml-1 opacity-80">Kunden</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-4 right-4 bg-white rounded-lg px-3 py-2 shadow-lg">
            <span className="font-bold text-gray-800">MöbelMontage Nürnberg</span>
          </div>
        </div>
      </div>

      {/* Square Version */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-2">Square (1200x1200)</p>
        <div className="relative w-80 h-80 rounded-xl overflow-hidden shadow-2xl">
          <img
            src={images[variant]}
            alt={headlines[variant]}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-2 w-fit">
              <span className="text-white text-xs font-medium">12 Jahre Erfahrung</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{headlines[variant]}</h2>
            <p className="text-white/80 text-sm mb-3 line-clamp-2">{descriptions[variant]}</p>
            <button className={`${colors[variant]} text-white font-bold px-4 py-2 rounded-full shadow-lg text-sm w-fit`}>
              Jetzt Angebot erhalten
            </button>
          </div>
          <div className="absolute top-4 right-4 bg-white rounded-lg px-2 py-1 shadow-lg">
            <span className="font-bold text-gray-800 text-sm">MöbelMontage</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdsPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Google Ads Banner Designs
            </h1>
            <p className="text-xl text-gray-600">
              إعلانات Display جاهزة للاستخدام في حملات Google Ads
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-2xl p-6 mb-12 shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Download className="w-5 h-5" />
              كيفية استخدام هذه التصاميم
            </h2>
            <ol className="space-y-2 text-gray-700" dir="rtl">
              <li><strong>1.</strong> خذ لقطة شاشة (Screenshot) لكل بانر</li>
              <li><strong>2.</strong> استخدم أداة مثل Canva أو Figma لتعديل الأبعاد بدقة</li>
              <li><strong>3.</strong> أو استخدم Responsive Display Ads في Google Ads (الأفضل)</li>
              <li><strong>4.</strong> ارفع الصور في قسم Assets داخل Google Ads</li>
            </ol>
          </div>

          {/* Section: Responsive Display Ads */}
          <div className="bg-white rounded-2xl p-8 mb-12 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              1. Responsive Display Ads (الأفضل)
            </h2>
            <p className="text-gray-600 mb-8" dir="rtl">
              Google يقوم تلقائياً بتعديل حجم الإعلان ليناسب جميع المساحات. فقط ارفع:
              <br />• صورة Landscape (1200x628)
              <br />• صورة Square (1200x1200)
              <br />• شعار (1200x1200)
              <br />• العناوين والوصف
            </p>

            <ResponsiveDisplayAd variant="main" />
            <ResponsiveDisplayAd variant="kitchen" />
            <ResponsiveDisplayAd variant="ikea" />
            <ResponsiveDisplayAd variant="delivery" />
          </div>

          {/* Section: Standard Banner Sizes */}
          <div className="bg-white rounded-2xl p-8 mb-12 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              2. Standard Display Banner Sizes
            </h2>
            <p className="text-gray-600 mb-8" dir="rtl">
              أحجام البانرات القياسية لشبكة Google Display:
            </p>

            {/* Main Service Banners */}
            <h3 className="text-xl font-semibold mb-4 text-orange-600">Möbelmontage (الخدمة الرئيسية)</h3>
            <AdBanner width={728} height={90} title="Leaderboard" variant="main" />
            <AdBanner width={300} height={250} title="Medium Rectangle" variant="main" />
            <AdBanner width={336} height={280} title="Large Rectangle" variant="main" />
            <AdBanner width={300} height={600} title="Half Page" variant="main" />
            <AdBanner width={320} height={50} title="Mobile Banner" variant="main" />
            <AdBanner width={320} height={100} title="Large Mobile Banner" variant="main" />

            {/* Kitchen Banners */}
            <h3 className="text-xl font-semibold mb-4 mt-12 text-emerald-600">Küchenmontage (المطابخ)</h3>
            <AdBanner width={728} height={90} title="Leaderboard" variant="kitchen" />
            <AdBanner width={300} height={250} title="Medium Rectangle" variant="kitchen" />
            <AdBanner width={320} height={100} title="Large Mobile Banner" variant="kitchen" />

            {/* IKEA Banners */}
            <h3 className="text-xl font-semibold mb-4 mt-12 text-blue-600">IKEA Montage</h3>
            <AdBanner width={728} height={90} title="Leaderboard" variant="ikea" />
            <AdBanner width={300} height={250} title="Medium Rectangle" variant="ikea" />
            <AdBanner width={320} height={100} title="Large Mobile Banner" variant="ikea" />

            {/* Delivery Banners */}
            <h3 className="text-xl font-semibold mb-4 mt-12 text-violet-600">Lieferung (التوصيل)</h3>
            <AdBanner width={728} height={90} title="Leaderboard" variant="delivery" />
            <AdBanner width={300} height={250} title="Medium Rectangle" variant="delivery" />
            <AdBanner width={320} height={100} title="Large Mobile Banner" variant="delivery" />
          </div>

          {/* Section: Ad Copy Reference */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              3. نصوص الإعلانات للنسخ
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Headlines */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4">Headlines (العناوين)</h3>
                <ul className="space-y-2 text-sm">
                  <li className="bg-white p-2 rounded">Möbelmontage Nürnberg</li>
                  <li className="bg-white p-2 rounded">Professioneller Möbelaufbau</li>
                  <li className="bg-white p-2 rounded">IKEA Montage Spezialist</li>
                  <li className="bg-white p-2 rounded">Küchenmontage vom Profi</li>
                  <li className="bg-white p-2 rounded">Jetzt Angebot erhalten</li>
                  <li className="bg-white p-2 rounded">12 Jahre Erfahrung</li>
                  <li className="bg-white p-2 rounded">Festpreis-Garantie</li>
                  <li className="bg-white p-2 rounded">5.000+ zufriedene Kunden</li>
                  <li className="bg-white p-2 rounded">Termin in 24h möglich</li>
                  <li className="bg-white p-2 rounded">Heute noch verfügbar</li>
                </ul>
              </div>

              {/* Descriptions */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4">Descriptions (الأوصاف)</h3>
                <ul className="space-y-2 text-sm">
                  <li className="bg-white p-2 rounded">Professionelle Möbelmontage in Nürnberg & Umgebung. IKEA, PAX, Küchen & mehr. Festpreis!</li>
                  <li className="bg-white p-2 rounded">Über 5.000 zufriedene Kunden. Schneller Service. Jetzt kostenloses Angebot erhalten!</li>
                  <li className="bg-white p-2 rounded">12 Jahre Erfahrung. Alle Möbelmarken. Montage, Lieferung & Entsorgung aus einer Hand.</li>
                  <li className="bg-white p-2 rounded">Expressservice möglich. Zahlung nach Fertigstellung. Werkzeug inklusive!</li>
                </ul>
              </div>

              {/* Long Headlines */}
              <div className="bg-gray-50 rounded-xl p-6 md:col-span-2">
                <h3 className="font-bold text-lg mb-4">Long Headlines (للـ Responsive Ads)</h3>
                <ul className="space-y-2 text-sm">
                  <li className="bg-white p-2 rounded">Professionelle Möbelmontage in Nürnberg - IKEA, Küchen & mehr</li>
                  <li className="bg-white p-2 rounded">Ihr Möbelaufbau-Service in Nürnberg - Schnell, Zuverlässig, Festpreis</li>
                  <li className="bg-white p-2 rounded">IKEA Montage Spezialist - PAX, METOD, BESTA & alle anderen Möbel</li>
                  <li className="bg-white p-2 rounded">Komplette Küchenmontage inkl. Elektro & Wasseranschluss - Termin in 24h</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-12 bg-amber-50 border border-amber-200 rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-4 text-amber-800">💡 نصائح مهمة</h2>
            <ul className="space-y-3 text-amber-900" dir="rtl">
              <li>• <strong>استخدم Responsive Display Ads:</strong> هذا أفضل خيار لأن Google يعدل الحجم تلقائياً</li>
              <li>• <strong>اختبر A/B:</strong> جرب ألوان وعناوين مختلفة لترى أيها يعمل أفضل</li>
              <li>• <strong>أضف صور حقيقية:</strong> صور من أعمالك الحقيقية أفضل من صور المخزون</li>
              <li>• <strong>Call-to-Action واضح:</strong> تأكد أن زر الـ CTA واضح ومرئي</li>
              <li>• <strong>حافظ على البساطة:</strong> لا تضع معلومات كثيرة - الأقل هو الأفضل</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
