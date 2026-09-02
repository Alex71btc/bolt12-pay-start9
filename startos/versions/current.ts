import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.3.2:2',

  releaseNotes: {
    en_US: `Test build for BIP353 DNS resolution on StartOS.

The app now tries the normal container resolver first and retries the same BIP353 TXT lookup through Cloudflare DNS-over-HTTPS on port 443 only after NXDOMAIN, no answer, no nameservers, or a timeout. This uses the HTTPS path verified inside StartOS, because direct DNS traffic to 1.1.1.1 on port 53 is unavailable there. The service log reports when the fallback is used and whether it succeeds. Other DNS behavior is unchanged.

The setup and console pages now show the BOLT12 Pay app version. The console also correctly labels the public BOLT12/BIP353 address instead of calling it an LNURL fallback.

Existing application data and payment history are preserved. No manual migration is required.`,

    es_ES: `Versión de prueba para la resolución DNS de BIP353 en StartOS.

La aplicación utiliza primero el resolvedor normal del contenedor y solo vuelve a intentar la misma consulta TXT de BIP353 mediante DNS-over-HTTPS de Cloudflare por el puerto 443 después de NXDOMAIN, ausencia de respuesta, ausencia de servidores de nombres o un tiempo de espera agotado. Se utiliza la ruta HTTPS verificada en StartOS, ya que allí no está disponible el tráfico DNS directo hacia 1.1.1.1 por el puerto 53. El registro del servicio indica cuándo se utiliza la alternativa y si funciona. El resto del comportamiento DNS no cambia.

Las páginas de configuración y consola muestran ahora la versión de BOLT12 Pay. La consola también etiqueta correctamente la dirección pública BOLT12/BIP353 en lugar de llamarla alternativa LNURL.

Los datos existentes de la aplicación y el historial de pagos se conservan. No se requiere migración manual.`,

    de_DE: `Testversion für die BIP353-DNS-Auflösung unter StartOS.

Die App verwendet zuerst den normalen Resolver des Containers und wiederholt denselben BIP353-TXT-Lookup nur nach NXDOMAIN, fehlender Antwort, fehlenden Nameservern oder einem Timeout über Cloudflare DNS-over-HTTPS auf Port 443. Damit wird der unter StartOS erfolgreich geprüfte HTTPS-Weg genutzt, weil direkter DNS-Verkehr zu 1.1.1.1 auf Port 53 dort nicht verfügbar ist. Das Service-Log zeigt an, wann der Fallback verwendet wird und ob er erfolgreich ist. Das übrige DNS-Verhalten bleibt unverändert.

Setup und Konsole zeigen jetzt die BOLT12-Pay-App-Version an. Außerdem bezeichnet die Konsole die öffentliche BOLT12-/BIP353-Adresse nun korrekt, statt sie als LNURL-Fallback zu beschriften.

Bestehende App-Daten und der Zahlungsverlauf bleiben erhalten. Keine manuelle Migration erforderlich.`,

    pl_PL: `Wersja testowa rozwiązywania DNS BIP353 w StartOS.

Aplikacja najpierw używa standardowego resolwera kontenera i ponawia to samo zapytanie TXT BIP353 przez Cloudflare DNS-over-HTTPS na porcie 443 tylko po odpowiedzi NXDOMAIN, braku odpowiedzi, braku serwerów nazw lub przekroczeniu limitu czasu. Wykorzystywana jest ścieżka HTTPS sprawdzona w StartOS, ponieważ bezpośredni ruch DNS do 1.1.1.1 na porcie 53 nie jest tam dostępny. Dziennik usługi informuje o użyciu mechanizmu zapasowego i jego wyniku. Pozostałe zachowanie DNS nie ulega zmianie.

Strony konfiguracji i konsoli pokazują teraz wersję aplikacji BOLT12 Pay. Konsola prawidłowo opisuje też publiczny adres BOLT12/BIP353 zamiast nazywać go mechanizmem zapasowym LNURL.

Istniejące dane aplikacji i historia płatności zostają zachowane. Ręczna migracja nie jest wymagana.`,

    fr_FR: `Version de test pour la résolution DNS BIP353 sous StartOS.

L'application utilise d'abord le résolveur normal du conteneur et ne relance la même requête TXT BIP353 via le DNS-over-HTTPS de Cloudflare sur le port 443 qu'après une réponse NXDOMAIN, une absence de réponse, une absence de serveurs de noms ou un délai d'attente dépassé. Elle utilise ainsi le chemin HTTPS vérifié sous StartOS, car le trafic DNS direct vers 1.1.1.1 sur le port 53 n'y est pas disponible. Le journal du service indique quand le mécanisme de secours est utilisé et s'il réussit. Les autres comportements DNS restent inchangés.

Les pages de configuration et de console affichent désormais la version de BOLT12 Pay. La console identifie aussi correctement l'adresse publique BOLT12/BIP353 au lieu de la présenter comme solution de secours LNURL.

Les données existantes de l'application et l'historique des paiements sont conservés. Aucune migration manuelle n'est nécessaire.`,
  },

  migrations: {
    up: async () => {},
    down: async () => {},
  },
})
