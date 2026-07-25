import { T } from '@start9labs/start-sdk'
import {
  controlHostId,
  gRPCHostId,
  gRPCPort,
  restPort,
} from 'lnd-startos/startos/interfaces'
import { sdk } from './sdk'

export const uiPort = 8081

// Host id (the `sdk.MultiHost.of` group) carrying the ui interface — distinct
// from the interface id exported on it. Used for `sdk.host.getOwn` lookups.
export const uiHostId = 'main'
export const uiInterfaceId = 'ui'

export async function getNonLocalUrls(effects: T.Effects): Promise<string[]> {
  return sdk.host
    .getOwn(effects, uiHostId, (host) => {
      const iface =
        host &&
        Object.values(host.bindings)
          .flatMap((b) => Object.values(b.interfaces))
          .find((i) => i.id === uiInterfaceId)
      return iface ? iface.addressInfo.nonLocal.format() : []
    })
    .const()
}

/**
 * LND's REST + gRPC addresses over the LXC bridge, injected into start.sh as
 * LND_REST_URL / LND_GRPC_ADDRESS. The mounted `tls.cert` validates both legs:
 * it is a fullchain ending in the StartOS root CA, which also signed what the
 * proxy presents on REST. LND's REST/gRPC bindings appear only once its wallet
 * macaroon exists, so each address resolves null until the first unlock — the env var is
 * omitted meanwhile (start.sh blocks on its own cert/macaroon wait and the
 * health check stays red until LND is reachable), and the `.const()` heals main
 * onto the real address (one restart) when LND binds.
 */
export async function lndBridgeEnv(
  effects: T.Effects,
): Promise<Record<string, string>> {
  const rest = await sdk.host
    .getBridgeAddress(effects, {
      packageId: 'lnd',
      hostId: controlHostId,
      internalPort: restPort,
    })
    .const()
  const grpc = await sdk.host
    .getBridgeAddress(effects, {
      packageId: 'lnd',
      hostId: gRPCHostId,
      internalPort: gRPCPort,
    })
    .const()
  return {
    ...(rest && { LND_REST_URL: `https://${rest}` }),
    ...(grpc && { LND_GRPC_ADDRESS: `https://${grpc}` }),
  }
}

/**
 * Map the StartOS primary URL onto the app's native LNURL / BIP353 env vars.
 * Upstream reads these as defaults; the in-app admin config still overrides
 * them. Returns {} when no primary URL is set.
 */
export function lnurlEnv(
  primaryUrl: string | null | undefined,
): Record<string, string> {
  if (!primaryUrl) return {}
  const url = primaryUrl.trim().replace(/\/+$/, '')
  let host = ''
  try {
    host = new URL(url).hostname.toLowerCase()
  } catch {
    return {}
  }
  return {
    LNURL_BASE_URL: url,
    LNURL_BASE_DOMAIN: host,
    PUBLIC_LNURL_ADDRESS: `lnurl@${host}`,
    PUBLIC_BIP353_ADDRESS: `bolt12@${host}`,
  }
}
