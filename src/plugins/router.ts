import type { Router } from 'vue-router'
import type { PiniaPluginContext } from 'pinia'

export function createRouterPlugin(router: Router) {
  return ({ store }: PiniaPluginContext) => {
    store.router = router
  }
}
