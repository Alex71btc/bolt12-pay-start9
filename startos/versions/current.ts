import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.3.0:2',


releaseNotes: {
  en_US:
    'Follow-up release for Transaction History. Increases the default Transaction History API limit from 10 to 200 entries and restores Nostr Wallet Connect (NWC) initialization after the admin page startup refactor. Re-tested on LND v0.20.x and v0.21.x with BOLT12 Offers, LNURL, Lightning Address, BOLT11, NWC, Keysend and external wallet payments.',
},

  migrations: {
    up: async () => {},
    down: async () => {},
  },
})
