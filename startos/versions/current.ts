import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.3.2:1',

  releaseNotes: {
    en_US: `Test build for BIP353 DNS resolution on StartOS.

The app now tries the normal container resolver first and retries the same BIP353 TXT lookup through 1.1.1.1 only after NXDOMAIN, no answer, no nameservers, or a timeout. The service log reports when the fallback is used and whether it succeeds. Other DNS behavior is unchanged.

Existing application data and payment history are preserved. No manual migration is required.`,

    es_ES: `Versión de prueba para la resolución DNS de BIP353 en StartOS.

La aplicación utiliza primero el resolvedor normal del contenedor y solo vuelve a intentar la misma consulta TXT de BIP353 mediante 1.1.1.1 después de NXDOMAIN, ausencia de respuesta, ausencia de servidores de nombres o un tiempo de espera agotado. El registro del servicio indica cuándo se utiliza la alternativa y si funciona. El resto del comportamiento DNS no cambia.

Los datos existentes de la aplicación y el historial de pagos se conservan. No se requiere migración manual.`,

    de_DE: `Testversion für die BIP353-DNS-Auflösung unter StartOS.

Die App verwendet zuerst den normalen Resolver des Containers und wiederholt denselben BIP353-TXT-Lookup nur nach NXDOMAIN, fehlender Antwort, fehlenden Nameservern oder einem Timeout über 1.1.1.1. Das Service-Log zeigt an, wann der Fallback verwendet wird und ob er erfolgreich ist. Das übrige DNS-Verhalten bleibt unverändert.

Bestehende App-Daten und der Zahlungsverlauf bleiben erhalten. Keine manuelle Migration erforderlich.`,

    pl_PL: `Wersja testowa rozwiązywania DNS BIP353 w StartOS.

Aplikacja najpierw używa standardowego resolwera kontenera i ponawia to samo zapytanie TXT BIP353 przez 1.1.1.1 tylko po odpowiedzi NXDOMAIN, braku odpowiedzi, braku serwerów nazw lub przekroczeniu limitu czasu. Dziennik usługi informuje o użyciu mechanizmu zapasowego i jego wyniku. Pozostałe zachowanie DNS nie ulega zmianie.

Istniejące dane aplikacji i historia płatności zostają zachowane. Ręczna migracja nie jest wymagana.`,

    fr_FR: `Version de test pour la résolution DNS BIP353 sous StartOS.

L'application utilise d'abord le résolveur normal du conteneur et ne relance la même requête TXT BIP353 via 1.1.1.1 qu'après une réponse NXDOMAIN, une absence de réponse, une absence de serveurs de noms ou un délai d'attente dépassé. Le journal du service indique quand le mécanisme de secours est utilisé et s'il réussit. Les autres comportements DNS restent inchangés.

Les données existantes de l'application et l'historique des paiements sont conservés. Aucune migration manuelle n'est nécessaire.`,
  },

  migrations: {
    up: async () => {},
    down: async () => {},
  },
})
