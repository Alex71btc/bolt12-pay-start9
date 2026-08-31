import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.3.2:0',

  releaseNotes: {
    en_US: `Improves BIP353 DNS reliability with automatic detection and guided repair of missing public TXT records, plus manual verification of published Alias Manager and Offer History BIP353 addresses.

Fixes parsing of long Cloudflare TXT records split into multiple DNS strings, improves BIP353 and NWC diagnostics, and fixes Contacts modal scrolling and usability on mobile screens.

Existing application data and payment history are preserved. No manual migration is required.`,

    es_ES: `Mejora la fiabilidad DNS de BIP353 con detección automática y reparación guiada de registros TXT públicos ausentes, además de verificación manual de direcciones BIP353 publicadas desde Alias Manager y Offer History.

Corrige el análisis de registros TXT largos de Cloudflare divididos en varias cadenas DNS, mejora los diagnósticos de BIP353 y NWC y corrige el desplazamiento y la usabilidad del cuadro de Contactos en pantallas móviles.

Los datos existentes de la aplicación y el historial de pagos se conservan. No se requiere migración manual.`,

    de_DE: `Verbessert die Zuverlässigkeit von BIP353-DNS durch automatische Erkennung und geführte Reparatur fehlender öffentlicher TXT-Einträge sowie durch die manuelle Prüfung veröffentlichter BIP353-Adressen aus Alias Manager und Offer History.

Behebt die Verarbeitung langer, von Cloudflare in mehrere DNS-Strings aufgeteilter TXT-Einträge, verbessert die BIP353- und NWC-Diagnose und behebt Scroll- und Bedienprobleme des Kontakte-Fensters auf mobilen Bildschirmen.

Bestehende App-Daten und der Zahlungsverlauf bleiben erhalten. Keine manuelle Migration erforderlich.`,

    pl_PL: `Poprawia niezawodność DNS BIP353 dzięki automatycznemu wykrywaniu i prowadzonej naprawie brakujących publicznych rekordów TXT oraz ręcznej weryfikacji opublikowanych adresów BIP353 z Alias Manager i Offer History.

Naprawia obsługę długich rekordów TXT Cloudflare podzielonych na wiele ciągów DNS, ulepsza diagnostykę BIP353 i NWC oraz poprawia przewijanie i obsługę okna Kontaktów na urządzeniach mobilnych.

Istniejące dane aplikacji i historia płatności zostają zachowane. Ręczna migracja nie jest wymagana.`,

    fr_FR: `Améliore la fiabilité DNS de BIP353 grâce à la détection automatique et à la réparation guidée des enregistrements TXT publics manquants, ainsi qu'à la vérification manuelle des adresses BIP353 publiées depuis Alias Manager et Offer History.

Corrige l'analyse des longs enregistrements TXT Cloudflare divisés en plusieurs chaînes DNS, améliore les diagnostics BIP353 et NWC et corrige le défilement et l'utilisation de la fenêtre Contacts sur les écrans mobiles.

Les données existantes de l'application et l'historique des paiements sont conservés. Aucune migration manuelle n'est nécessaire.`,
  },

  migrations: {
    up: async () => {},
    down: async () => {},
  },
})
