import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.3.1:0',

  releaseNotes: {
    en_US: `Introduces Contacts for reusable Lightning payment destinations, including Lightning Address, BOLT12 Offer, LNURL, BIP353, Nostr and Node ID contacts.

Adds outgoing Keysend payments, automatic contact matching in Lightning Activity, full-history transaction search, paginated history loading, improved payment metadata handling, and numerous UI refinements.

Existing application data and payment history are preserved. No manual migration is required.`,

    es_ES: `Introduce Contactos para destinos de pago Lightning reutilizables, incluyendo Lightning Address, BOLT12 Offer, LNURL, BIP353, Nostr y Node ID.

Añade pagos Keysend salientes, asociación automática de contactos en Lightning Activity, búsqueda en todo el historial de transacciones, carga paginada del historial, mejoras en los metadatos de pago y numerosos ajustes de interfaz.

Los datos existentes de la aplicación y el historial de pagos se conservan. No se requiere migración manual.`,

    de_DE: `Führt Kontakte für wiederverwendbare Lightning-Zahlungsziele ein, darunter Lightning Address, BOLT12 Offer, LNURL, BIP353, Nostr und Node ID.

Fügt ausgehende Keysend-Zahlungen, automatische Kontaktzuordnung in Lightning Activity, Suche über den gesamten Transaktionsverlauf, paginiertes Nachladen der Historie, verbesserte Zahlungsmetadaten und zahlreiche UI-Verbesserungen hinzu.

Bestehende App-Daten und der Zahlungsverlauf bleiben erhalten. Keine manuelle Migration erforderlich.`,

    pl_PL: `Wprowadza Kontakty dla wielokrotnego użytku celów płatności Lightning, w tym Lightning Address, BOLT12 Offer, LNURL, BIP353, Nostr i Node ID.

Dodaje wychodzące płatności Keysend, automatyczne dopasowywanie kontaktów w Lightning Activity, wyszukiwanie w całej historii transakcji, stronicowane ładowanie historii, ulepszoną obsługę metadanych płatności oraz liczne usprawnienia interfejsu.

Istniejące dane aplikacji i historia płatności zostają zachowane. Ręczna migracja nie jest wymagana.`,

    fr_FR: `Introduit les Contacts pour les destinations de paiement Lightning réutilisables, notamment Lightning Address, BOLT12 Offer, LNURL, BIP353, Nostr et Node ID.

Ajoute les paiements Keysend sortants, l'association automatique des contacts dans Lightning Activity, la recherche dans l'ensemble de l'historique des transactions, le chargement paginé de l'historique, une meilleure gestion des métadonnées de paiement et de nombreuses améliorations de l'interface.

Les données existantes de l'application et l'historique des paiements sont conservés. Aucune migration manuelle n'est nécessaire.`,
  },

  migrations: {
    up: async () => {},
    down: async () => {},
  },
})
