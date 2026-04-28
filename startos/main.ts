import { sdk } from './sdk'
import { uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info('Starting BOLT12 Pay!')

  return sdk.Daemons.of(effects).addDaemon('primary', {
    subcontainer: await sdk.SubContainer.of(
      effects,
      { imageId: 'main' },
      sdk.Mounts.of()
        .mountVolume({
          volumeId: 'main',
          subpath: null,
          mountpoint: '/data',
          readonly: false,
        })
        .mountDependency({
          dependencyId: 'lnd',
          volumeId: 'main',
          subpath: null,
          mountpoint: '/mnt/lnd',
          readonly: true,
        }),
      'bolt12-pay-sub',
    ),
    exec: {
      command: ['/usr/local/bin/docker_entrypoint.sh'],
    },
    ready: {
      display: 'Web UI',
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, uiPort, {
          successMessage: 'BOLT12 Pay is ready',
          errorMessage: 'BOLT12 Pay web interface is not ready',
        }),
    },
    requires: [],
  })
})
