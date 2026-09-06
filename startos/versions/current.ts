import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.3.4:0',

  releaseNotes: {
    en_US: `BOLT12 Pay 0.3.4 improves BIP353 DNS reliability with a Cloudflare DNS-over-HTTPS fallback and clearer TXT repair handling.

Public Alias pages no longer create a BOLT11 invoice when opened or refreshed. A visitor can generate one optional fallback invoice when an older wallet requires it.

Nostr notification keys and the private app signer are now encrypted with AES-256-GCM and unlocked automatically by LND after restarts. Existing plaintext keys are migrated automatically. Notifications use encrypted NIP-04 self-DMs through the relays saved with the Nostr Identity. The notification nsec can be replaced and a compromised app signer can be regenerated from the UI.

The QR scanner has a larger mobile preview with smooth two-finger pinch-to-zoom, a visible zoom slider and tap-to-focus where supported. Unexpected HTML proxy responses now produce understandable errors. Existing application data and payment history are preserved. No manual migration is required.`,

    de_DE: `BOLT12 Pay 0.3.4 verbessert die BIP353-DNS-Zuverlässigkeit durch einen Cloudflare-DNS-over-HTTPS-Fallback und eine verständlichere TXT-Reparatur.

Öffentliche Alias-Seiten erzeugen beim Öffnen oder Aktualisieren keine BOLT11-Invoice mehr. Nur wenn eine ältere Wallet sie benötigt, kann der Besucher bewusst eine optionale Fallback-Invoice erzeugen.

Nostr-Benachrichtigungsschlüssel und der private App-Signierer werden jetzt mit AES-256-GCM verschlüsselt und nach Neustarts automatisch durch LND entsperrt. Vorhandene Klartext-Schlüssel werden automatisch migriert. Benachrichtigungen werden als verschlüsselte NIP-04-Selbst-DMs über die mit der Nostr Identity gespeicherten Relays versendet. Der Notification-nsec kann ersetzt und ein kompromittierter App-Signierer in der Oberfläche neu erzeugt werden.

Der QR-Scanner besitzt eine größere mobile Vorschau mit flüssigem Zwei-Finger-Zoom, sichtbarem Zoomregler und Antippen zum Fokussieren, sofern unterstützt. Unerwartete HTML-Antworten eines Proxys werden verständlich erklärt. Bestehende App-Daten und der Zahlungsverlauf bleiben erhalten. Keine manuelle Migration erforderlich.`,

    es_ES: `BOLT12 Pay 0.3.4 mejora la fiabilidad DNS de BIP353 con un sistema alternativo DNS-over-HTTPS de Cloudflare y una reparación TXT más clara.

Las páginas públicas de alias ya no crean una factura BOLT11 al abrirse o actualizarse. El visitante puede generar una factura alternativa opcional solo cuando una cartera antigua la necesite.

Las claves de notificación Nostr y el firmante privado de la aplicación se cifran ahora con AES-256-GCM y LND las desbloquea automáticamente después de los reinicios. Las claves existentes en texto sin cifrar se migran automáticamente. También se puede sustituir el nsec de notificación y regenerar un firmante comprometido desde la interfaz.

El escáner QR es más compacto en el escritorio, se ha mejorado el diseño móvil y las respuestas HTML inesperadas del proxy muestran errores comprensibles. Se conservan los datos y el historial de pagos. No se requiere migración manual.`,

    fr_FR: `BOLT12 Pay 0.3.4 améliore la fiabilité DNS de BIP353 grâce à un mécanisme de secours DNS-over-HTTPS de Cloudflare et à une réparation TXT plus claire.

Les pages publiques d'alias ne créent plus de facture BOLT11 à l'ouverture ou à l'actualisation. Le visiteur peut générer une facture de secours facultative uniquement lorsqu'un ancien portefeuille en a besoin.

Les clés de notification Nostr et le signataire privé de l'application sont désormais chiffrés avec AES-256-GCM et déverrouillés automatiquement par LND après les redémarrages. Les clés existantes en clair sont migrées automatiquement. Le nsec de notification peut être remplacé et un signataire compromis peut être régénéré depuis l'interface.

Le scanner QR est plus compact sur ordinateur, l'affichage mobile est amélioré et les réponses HTML inattendues du proxy produisent des erreurs compréhensibles. Les données et l'historique des paiements sont conservés. Aucune migration manuelle n'est nécessaire.`,

    pl_PL: `BOLT12 Pay 0.3.4 poprawia niezawodność DNS dla BIP353 dzięki zapasowemu mechanizmowi Cloudflare DNS-over-HTTPS i czytelniejszej naprawie rekordów TXT.

Publiczne strony aliasów nie tworzą już faktury BOLT11 przy otwarciu lub odświeżeniu. Użytkownik może wygenerować opcjonalną fakturę zapasową tylko wtedy, gdy wymaga jej starszy portfel.

Klucze powiadomień Nostr oraz prywatny klucz podpisujący aplikacji są teraz szyfrowane za pomocą AES-256-GCM i automatycznie odblokowywane przez LND po ponownym uruchomieniu. Istniejące klucze zapisane jawnym tekstem są migrowane automatycznie. W interfejsie można również zastąpić nsec powiadomień i odtworzyć przejęty klucz podpisujący.

Skaner QR jest bardziej kompaktowy na komputerze, poprawiono układ mobilny, a nieoczekiwane odpowiedzi HTML z proxy pokazują zrozumiałe błędy. Dane aplikacji i historia płatności pozostają zachowane. Ręczna migracja nie jest wymagana.`,
  },

  migrations: {
    up: async () => {},
    down: async () => {},
  },
})
