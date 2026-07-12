import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.3.0:0',

releaseNotes: {
  en_US:
    'Major feature release introducing Transaction History with automatic synchronization of incoming and outgoing Lightning payments. Payments are classified by type (BOLT12, Lightning Address, LNURL, BOLT11, Keysend, NWC and Zaps), enriched with metadata, and updated automatically while preserving application-specific information. Also includes improved Last Payment Result handling, payment memo support, native Onion Messaging detection for LND 0.21+, and compatibility with both LND 0.20.x and LND 0.21.x.',
},

  migrations: {
    up: async () => {},
    down: async () => {},
  },
})
