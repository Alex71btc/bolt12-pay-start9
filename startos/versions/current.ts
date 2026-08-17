import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.3.0:7',

  releaseNotes: {
    en_US: `Fixes BIP353 resolution on StartOS 0.4.x by using the system DNS resolver instead of hardcoded public DNS servers.

Also improves Lightning Address fallback handling so temporary DNS transport failures correctly fall back to LNURL. Verified on Docker, Umbrel and StartOS.`,

    es_ES: `Corrige la resolución BIP353 en StartOS 0.4.x utilizando el resolvedor DNS del sistema en lugar de servidores DNS públicos configurados de forma fija.

También mejora el mecanismo de respaldo para Lightning Address, de modo que los fallos temporales de transporte DNS vuelvan correctamente a LNURL. Verificado en Docker, Umbrel y StartOS.`,

    de_DE: `Behebt die BIP353-Auflösung unter StartOS 0.4.x durch Verwendung des systemeigenen DNS-Resolvers anstelle fest eingetragener öffentlicher DNS-Server.

Verbessert außerdem den Fallback für Lightning Addresses, sodass bei temporären DNS-Transportfehlern korrekt auf LNURL zurückgegriffen wird. Verifiziert unter Docker, Umbrel und StartOS.`,

    pl_PL: `Naprawia rozwiązywanie BIP353 w StartOS 0.4.x poprzez użycie systemowego resolvera DNS zamiast na stałe skonfigurowanych publicznych serwerów DNS.

Poprawia również mechanizm awaryjny Lightning Address, dzięki czemu tymczasowe błędy transportu DNS prawidłowo przechodzą na LNURL. Zweryfikowano na Dockerze, Umbrel i StartOS.`,

    fr_FR: `Corrige la résolution BIP353 sur StartOS 0.4.x en utilisant le résolveur DNS du système au lieu de serveurs DNS publics codés en dur.

Améliore également le mécanisme de repli des Lightning Address afin que les erreurs temporaires de transport DNS reviennent correctement à LNURL. Vérifié sur Docker, Umbrel et StartOS.`,
  },

  migrations: {
    up: async () => {},
    down: async () => {},
  },
})
