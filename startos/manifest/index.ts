import { setupManifest } from '@start9labs/start-sdk'

export const manifest = setupManifest({
  id: 'bolt-pay',
  title: 'BOLT12 Pay',
  license: 'mit',
  packageRepo: 'https://github.com/Alex71btc/bolt12-pay-start9',
  upstreamRepo: 'https://github.com/Alex71btc/lndk-pay',
  marketingUrl: 'https://github.com/Alex71btc/lndk-pay',
  donationUrl: null,
  docsUrls: ['https://github.com/Alex71btc/bolt12-pay-start9'],
  icon: 'assets/icon.png',
  description: {
    short: 'Self-hosted Lightning payment server with BOLT12 support.',
    long:
      'BOLT12 Pay is a self-hosted Lightning payment and identity server. It runs BOLT12 Pay with an embedded LNDK runtime and connects to the official StartOS LND package.'
  },
  volumes: ['main'],
  images: {
    main: {
      source: {
        dockerBuild: {
          dockerfile: 'Dockerfile',
          workdir: '.'
        }
      },
      arch: ['x86_64', 'aarch64']
    }
  },
  dependencies: {
    lnd: {
      optional: false,
      description:
        'Official StartOS LND with protocol.custom-message=513, protocol.custom-nodeann=39 and protocol.custom-init=39 enabled.',
      s9pk: null
    }
  }
})
