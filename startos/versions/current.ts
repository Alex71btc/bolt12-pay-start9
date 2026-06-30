import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.2.116:0',

  releaseNotes: {
    en_US:
      'Fixes RouterRPC payments on LND 0.21 by applying a default fee limit only when using the RouterRPC payment endpoint, restoring compatibility with both LND 0.20.x and LND 0.21.x. Also adds automatic detection of native Onion Messaging support in LND 0.21+, displaying a native status message instead of legacy setup instructions when available.',
  },

  migrations: {
    up: async () => {},
    down: async () => {},
  },
})
