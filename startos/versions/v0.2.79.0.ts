import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v_0_2_79_0 = VersionInfo.of({
  version: '0.2.79:0',
  releaseNotes: {
    en_US: 'Initial StartOS 0.4 rebuild for BOLT12 Pay.'
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE
  }
})
