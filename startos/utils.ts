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
 * Bridge address (`10.0.3.1:<assigned external port>`) of a dependency's
 * binding, as a minimal reactive value. Chain `.const()` in main: the mapped
 * string only changes when the address itself does, so main restarts exactly
 * on dependency install/uninstall/port-change and never on dependency
 * updates. Chain `.once()` in an action context. `fallbackPort` keeps the
 * value non-null while the dependency is absent — sanctioned only for tor's
 * allocator-guaranteed SOCKS 9050. Drop-in for the planned SDK
 * `sdk.host.getBridgeAddress` helper.
 */
export function bridgeAddress(
  effects: T.Effects,
  opts: {
    packageId: string
    hostId: string
    internalPort: number
    fallbackPort: number
  },
): { const(): Promise<string>; once(): Promise<string> }
export function bridgeAddress(
  effects: T.Effects,
  opts: { packageId: string; hostId: string; internalPort: number },
): { const(): Promise<string | null>; once(): Promise<string | null> }
export function bridgeAddress(
  effects: T.Effects,
  opts: {
    packageId: string
    hostId: string
    internalPort: number
    fallbackPort?: number
  },
) {
  const watchable = async () => {
    const osIp = await sdk.getOsIp(effects)
    return sdk.host.get(
      effects,
      { packageId: opts.packageId, hostId: opts.hostId },
      (host) => {
        const port =
          host?.bindings[opts.internalPort]?.net.assignedPort ??
          opts.fallbackPort
        if (port == null) return null
        return `${osIp}:${port}`
      },
    )
  }
  return {
    const: async () => (await watchable()).const(),
    once: async () => (await watchable()).once(),
  }
}

/**
 * LND's REST + gRPC addresses over the LXC bridge, injected into start.sh as
 * LND_REST_URL / LND_GRPC_ADDRESS. LND's `lnd.startos` DNS name is gone in 2.0;
 * its StartOS-issued TLS cert now covers the bridge address, so lndk and curl
 * still pin it. LND's REST/gRPC bindings appear only once its wallet macaroon
 * exists, so each address resolves null until the first unlock — the env var is
 * omitted meanwhile (start.sh blocks on its own cert/macaroon wait and the
 * health check stays red until LND is reachable), and the `.const()` heals main
 * onto the real address (one restart) when LND binds.
 */
export async function lndBridgeEnv(
  effects: T.Effects,
): Promise<Record<string, string>> {
  const rest = await bridgeAddress(effects, {
    packageId: 'lnd',
    hostId: controlHostId,
    internalPort: restPort,
  }).const()
  const grpc = await bridgeAddress(effects, {
    packageId: 'lnd',
    hostId: gRPCHostId,
    internalPort: gRPCPort,
  }).const()
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
