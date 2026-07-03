import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.2.116:1',

  releaseNotes: {
    en_US:
      'Minor follow-up release. Adds copy-to-clipboard support for Last Payment Result output, fixes LNURL payment success messages not respecting the selected UI language, and includes small documentation and setup instruction improvements. Also includes automatic native Onion Messaging detection for LND 0.21+ and maintains compatibility with both LND 0.20.x and LND 0.21.x.',
  },

  migrations: {
    up: async () => {},
    down: async () => {},
  },
})
