import hasFlowLevel from "../lib/has-flow-level";
import { LEVEL_PROJECT_AREA } from "../lib/flow-levels";

export default function ({ redirect, store }) {
  const hasLevelInStore = hasFlowLevel(store)
  const currentLevel = store.getters['flow/currentFilledInLevel']
  if (!hasLevelInStore(LEVEL_PROJECT_AREA)) {
    redirect(currentLevel.uri)
  }
}
