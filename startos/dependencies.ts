import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async () => {
  return {
    lnd: {
      kind: 'running',
      versionRange: '>=0.20.0 <0.22.0',
      healthChecks: []
    }
  }
})
