"use client";

import { Phone, Download, X } from "lucide-react";
import { businessInfo } from "@/lib/data";
import { useEffect, useState } from "react";
import { trackPhoneClick, trackWhatsAppClick, trackEvent } from "@/lib/analytics";
import { usePWAInstall } from "@/hooks/usePWAInstall";

// WhatsApp SVG icon for proper branding
const WhatsAppIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// iOS Install Instructions Modal
const IOSInstallModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-card rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">App installieren</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
            aria-label="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Um die App auf Ihrem iPhone/iPad zu installieren:
          </p>

          <ol className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 font-bold text-xs">1</span>
              <span>Tippen Sie auf das <strong>Teilen</strong>-Symbol unten in Safari</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 font-bold text-xs">2</span>
              <span>Scrollen Sie nach unten und tippen Sie auf <strong>"Zum Home-Bildschirm"</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 font-bold text-xs">3</span>
              <span>Tippen Sie auf <strong>"Hinzufügen"</strong></span>
            </li>
          </ol>

          {/* Safari Share Icon illustration */}
          <div className="flex justify-center py-4">
            <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span className="text-sm font-medium">Teilen</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors"
        >
          Verstanden
        </button>
      </div>
    </div>
  );
};

export default function FloatingButtons() {
  const [isVisible, setIsVisible] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const { isInstallable, isInstalled, isIOS, installApp } = usePWAInstall();

  // Delay visibility for better LCP
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    trackWhatsAppClick("floating_button");
  };

  const handlePhoneClick = () => {
    trackPhoneClick(businessInfo.phone, "floating_button");
  };

  const handleInstallClick = async () => {
    trackEvent({
      action: "cta_click",
      category: "engagement",
      label: "app_install_button",
    });

    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    setIsInstalling(true);
    const result = await installApp();
    setIsInstalling(false);

    if (result.success) {
      trackEvent({
        action: "cta_click",
        category: "conversion",
        label: "app_installed",
      });
    }
  };

  if (!isVisible) return null;

  // Show app install button if installable or on iOS (not yet installed)
  const showAppButton = (isInstallable || isIOS) && !isInstalled;

  return (
    <>
      <div
        className="fixed bottom-6 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-3 no-print"
        role="group"
        aria-label="Schnellkontakt"
        style={{
          contain: 'layout style',
          willChange: 'auto'
        }}
      >
        {/* App Install Button - with LIVE indicator */}
        {showAppButton && (
          <button
            onClick={handleInstallClick}
            disabled={isInstalling}
            className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-gradient-to-br from-primary to-orange-600 text-white rounded-full shadow-lg shadow-primary/40 hover:shadow-xl hover:scale-105 active:scale-95 transition-transform duration-200 disabled:opacity-70"
            aria-label="App installieren"
            style={{ touchAction: 'manipulation' }}
          >
            {/* LIVE indicator - pulsing dot */}
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500 items-center justify-center">
                <span className="text-[8px] font-bold text-white">NEU</span>
              </span>
            </span>

            {isInstalling ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-6 h-6 sm:w-7 sm:h-7" aria-hidden="true" />
            )}
          </button>
        )}

        {/* Phone Button */}
        <a
          href={`tel:${businessInfo.phone}`}
          onClick={handlePhoneClick}
          className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-primary text-white rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:scale-105 active:scale-95 transition-transform duration-200 no-underline"
          aria-label={`Jetzt anrufen: ${businessInfo.phone}`}
          style={{ touchAction: 'manipulation' }}
        >
          <Phone className="w-6 h-6 sm:w-7 sm:h-7" aria-hidden="true" />
        </a>

        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/${businessInfo.whatsapp.replace(/\+/g, '')}?text=Hallo, ich interessiere mich für Ihre Dienstleistungen.`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-[#25D366] text-white rounded-full shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:scale-105 active:scale-95 transition-transform duration-200 no-underline"
          aria-label="Nachricht per WhatsApp senden"
          style={{ touchAction: 'manipulation' }}
        >
          <WhatsAppIcon />
        </a>
      </div>

      {/* iOS Install Modal */}
      <IOSInstallModal isOpen={showIOSModal} onClose={() => setShowIOSModal(false)} />
    </>
  );
}
