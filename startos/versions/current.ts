import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.3.0:5',

  releaseNotes: {
    en_US: `Keeps the LND connection working when LND changes how it serves TLS.

BOLT12 Pay resolved LND's REST and gRPC addresses from a field that is only populated for one of the two ways a service can publish a port. It now reads the addresses themselves, which is correct either way — so the connection survives LND's next update instead of going unreachable.`,
    es_ES: `Mantiene la conexión con LND cuando LND cambia su forma de servir TLS.

BOLT12 Pay resolvía las direcciones REST y gRPC de LND a partir de un campo que solo se rellena en una de las dos formas en que un servicio puede publicar un puerto. Ahora lee las direcciones en sí, correctas en ambos casos, así que la conexión sobrevive a la próxima actualización de LND en lugar de quedar inaccesible.`,
    de_DE: `Hält die LND-Verbindung aufrecht, wenn LND die Art der TLS-Bereitstellung ändert.

BOLT12 Pay ermittelte die REST- und gRPC-Adressen von LND aus einem Feld, das nur bei einer der beiden Arten gefüllt ist, auf die ein Dienst einen Port veröffentlichen kann. Jetzt werden die Adressen selbst gelesen, die in beiden Fällen stimmen — die Verbindung übersteht damit das nächste LND-Update, statt unerreichbar zu werden.`,
    pl_PL: `Utrzymuje połączenie z LND, gdy LND zmienia sposób udostępniania TLS.

BOLT12 Pay ustalał adresy REST i gRPC LND na podstawie pola wypełnianego tylko przy jednym z dwóch sposobów publikowania portu przez usługę. Teraz odczytuje same adresy, poprawne w obu przypadkach — dzięki temu połączenie przetrwa kolejną aktualizację LND, zamiast stać się nieosiągalne.`,
    fr_FR: `Maintient la connexion à LND lorsque LND change sa façon de servir TLS.

BOLT12 Pay déterminait les adresses REST et gRPC de LND à partir d'un champ renseigné dans un seul des deux modes de publication d'un port par un service. Il lit désormais les adresses elles-mêmes, correctes dans les deux cas — la connexion survit donc à la prochaine mise à jour de LND au lieu de devenir injoignable.`,
  },

  migrations: {
    up: async () => {},
    down: async () => {},
  },
})
