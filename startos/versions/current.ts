import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.3.0:1',


releaseNotes: {
  en_US:
    'Major feature release introducing Transaction History with automatic synchronization of incoming and outgoing Lightning payments. Payments are classified by type (BOLT12, Lightning Address, LNURL, BOLT11, NWC, Zaps, and Keysend) while preserving application-specific metadata. This release also significantly improves the Nostr Wallet Connect (NWC) experience with enhanced connection management, integrated transaction history, persistent wallet metadata, and more reliable payment handling. Includes native Onion Messaging support for LND v0.21+, automatic payment API compatibility between LND v0.20.x and v0.21.x, UI improvements, performance optimizations, and numerous bug fixes.',
},

  migrations: {
    up: async () => {},
    down: async () => {},
  },
})
