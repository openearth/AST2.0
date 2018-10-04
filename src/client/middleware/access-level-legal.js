import hasFlowLevel from "../lib/has-flow-level";
import { LEVEL_LEGAL } from "../lib/flow-levels";

export default function ({ redirect, store }) {
  const hasLevelInStore = hasFlowLevel(store)
  const currentLevel = store.getters['flow/currentFilledInLevel']
  if (!hasLevelInStore(LEVEL_LEGAL)) {
    try {
      window.location = `${window.location.origin}${currentLevel.uri}`
    } catch(e) {
      redirect(currentLevel.uri)
    }
  }
}
