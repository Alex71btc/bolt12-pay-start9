import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
version: '0.3.5:0',

releaseNotes: {
en_US: `BOLT12 Pay 0.3.5 adds payment-method selection for Lightning Addresses that support both BOLT12 through BIP353 and LNURL.

When both methods are available, the payment screen lets the user choose between paying the BIP353 BOLT12 Offer directly or requesting a BOLT11 invoice through LNURL. If only one method is available, it is used automatically.

The Lightning Address preview now shows when BOLT12 is also available, without incorrectly marking aliases that only resolve through an LNURL wildcard.

Mobile login and admin dialogs have also been improved so they remain usable on small screens, in landscape mode and while the on-screen keyboard is open.

Existing application data and payment history are preserved. No manual migration is required.`,

de_DE: `BOLT12 Pay 0.3.5 fügt eine Auswahl des Zahlungswegs für Lightning-Adressen hinzu, die sowohl BOLT12 über BIP353 als auch LNURL unterstützen.

Wenn beide Verfahren verfügbar sind, kann beim Bezahlen zwischen dem direkten BIP353-BOLT12-Offer und einer über LNURL angeforderten BOLT11-Invoice gewählt werden. Ist nur ein Verfahren verfügbar, wird es automatisch verwendet.

Die Vorschau einer Lightning-Adresse zeigt jetzt zusätzlich an, wenn BOLT12 verfügbar ist, ohne Aliase fälschlich zu markieren, die lediglich über eine LNURL-Wildcard funktionieren.

Außerdem wurden mobiles Login und Admin-Dialoge verbessert, damit sie auch auf kleinen Displays, im Querformat und bei geöffneter Bildschirmtastatur vollständig nutzbar bleiben.

Bestehende App-Daten und der Zahlungsverlauf bleiben erhalten. Keine manuelle Migration erforderlich.`,

es_ES: `BOLT12 Pay 0.3.5 añade la selección del método de pago para direcciones Lightning compatibles tanto con BOLT12 mediante BIP353 como con LNURL.

Cuando ambos métodos están disponibles, la pantalla de pago permite elegir entre pagar directamente la oferta BOLT12 de BIP353 o solicitar una factura BOLT11 mediante LNURL. Si solo hay un método disponible, se utiliza automáticamente.

La vista previa de la dirección Lightning ahora también indica cuándo BOLT12 está disponible, sin marcar incorrectamente los alias que solo funcionan mediante un comodín LNURL.

También se han mejorado el inicio de sesión móvil y los diálogos de administración para que sigan siendo utilizables en pantallas pequeñas, en modo horizontal y con el teclado en pantalla abierto.

Se conservan los datos existentes de la aplicación y el historial de pagos. No se requiere migración manual.`,

fr_FR: `BOLT12 Pay 0.3.5 ajoute le choix du mode de paiement pour les adresses Lightning compatibles à la fois avec BOLT12 via BIP353 et avec LNURL.

Lorsque les deux méthodes sont disponibles, l'écran de paiement permet de choisir entre le paiement direct de l'offre BOLT12 issue de BIP353 et la demande d'une facture BOLT11 via LNURL. Si une seule méthode est disponible, elle est utilisée automatiquement.

L'aperçu de l'adresse Lightning indique désormais également lorsque BOLT12 est disponible, sans marquer à tort les alias qui ne fonctionnent que grâce à un joker LNURL.

La connexion mobile et les boîtes de dialogue d'administration ont également été améliorées afin de rester utilisables sur les petits écrans, en mode paysage et lorsque le clavier à l'écran est ouvert.

Les données existantes de l'application et l'historique des paiements sont conservés. Aucune migration manuelle n'est nécessaire.`,

pl_PL: `BOLT12 Pay 0.3.5 dodaje wybór metody płatności dla adresów Lightning obsługujących zarówno BOLT12 przez BIP353, jak i LNURL.

Jeśli dostępne są obie metody, ekran płatności pozwala wybrać bezpośrednią płatność za pomocą oferty BOLT12 z BIP353 albo pobranie faktury BOLT11 przez LNURL. Jeśli dostępna jest tylko jedna metoda, zostanie użyta automatycznie.

Podgląd adresu Lightning pokazuje teraz również dostępność BOLT12, bez błędnego oznaczania aliasów działających wyłącznie dzięki wildcardowi LNURL.

Poprawiono także mobilny ekran logowania i okna dialogowe administratora, aby pozostały użyteczne na małych ekranach, w orientacji poziomej i przy otwartej klawiaturze ekranowej.

Istniejące dane aplikacji i historia płatności zostają zachowane. Ręczna migracja nie jest wymagana.`,
},

migrations: {
up: async () => {},
down: async () => {},
},
})
