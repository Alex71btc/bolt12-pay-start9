import { ExtendedVersion, VersionRange } from '@start9labs/start-sdk'
import { sdk } from './sdk'

// LND advertises onion messages natively from 0.21 (feature bit 39); below that
// BOLT12 needs them turned on in lnd.conf. Setting them on 0.21 is not merely
// redundant — LND aborts server creation ("feature bit: 39 already set") and
// crash-loops — so the Auto-Configure task is posted only to pre-0.21 nodes, and
// cleared once the user upgrades. LND 0.21's config spec drops the toggle
// entirely, which is why the task is posted through the raw effect rather than
// `sdk.action.createTask`: the typed action we import is 0.21's, and it can no
// longer describe a field that only pre-0.21 LND accepts.
const nativeOnionMessages = VersionRange.parse('>=0.21.0-beta:0')

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  // `.const()` re-runs init when LND's version changes, so upgrading LND to 0.21
  // clears the task rather than leaving a critical one the user cannot satisfy.
  const lndVersion = await sdk
    .getServiceManifest(effects, 'lnd', (m) => m?.version ?? null)
    .const()

  if (
    lndVersion &&
    !ExtendedVersion.parse(lndVersion).satisfies(nativeOnionMessages)
  ) {
    await effects.action.createTask({
      replayId: 'lnd:autoconfig',
      packageId: 'lnd',
      actionId: 'autoconfig',
      severity: 'critical',
      when: { condition: 'input-not-matches', once: false },
      input: {
        kind: 'partial',
        accept: [{ 'onion-messages': true }],
        set: { 'onion-messages': true },
      },
      reason:
        'BOLT12 Pay needs onion messages enabled on LND to create and pay BOLT12 offers.',
    })
  } else {
    await sdk.action.clearTask(effects, 'lnd:autoconfig')
  }

  return {
    lnd: {
      kind: 'running',
      versionRange: '>=0.20.1-beta:12',
      healthChecks: ['lnd'],
    },
  }
})
