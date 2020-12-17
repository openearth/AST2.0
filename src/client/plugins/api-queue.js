import ApiQueue from '../lib/api-queue'
import log from '../lib/log';

export const apiQueue = new ApiQueue({
  concurrency: 36,
  delayAfterBatch: 500,
})

export default ({ store }) => {
  apiQueue.on('running', () => {
    log.groupStart.info(`Api Queue is running. Queue size: ${apiQueue.size}`)
    store.commit('flow/isFetchingApiData')
  })

  apiQueue.on('idle', () => {
    log.info(`Api Queue is idle. Queue size: ${apiQueue.size}`)
    log.groupEnd()
    store.commit('flow/doneFetchingApiData')
  })

  apiQueue.on('batch-start', () => {
    log.info(`Batch is starting. Batch size: ${apiQueue.batchSize}. Queue size: ${apiQueue.size}`)
  })
}
