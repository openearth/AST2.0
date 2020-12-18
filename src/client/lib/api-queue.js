import EventEmitter from 'events'

const delay = ms => new Promise(resolve => setTimeout(() => resolve(), ms))

export default class Queue extends EventEmitter {
  constructor({ concurrency = 1, delayAfterBatch = 0 } = {}) {
    super()
    this.isRunning = false
    this.queue = []
    this.concurrency = concurrency
    this.currentBatch = []
    this.delayAfterBatch = delayAfterBatch
  }

  get size() {
    return this.queue.length
  }

  get batchSize() {
    return this.currentBatch.length
  }

  enqueue(fn) {
    return function call(...args) {
      let resolver
      let rejecter
      const promiseInstance = new Promise((resolve, reject) => {
        resolver = resolve
        rejecter = reject
      })

      async function executer() {
        try {
          const result = await fn(...args)
          resolver(result)
        } catch (error) {
          rejecter(error)
        }
      }

      this.queue.push(executer)
      this.emit('add')

      this.run()

      return promiseInstance
    }.bind(this)
  }

  async runBatch() {
    await delay(0)

    this.currentBatch = this.queue.splice(0, this.concurrency)

    this.emit('batch-start')
    await Promise.all(this.currentBatch.map(fn => fn()))
    this.currentBatch = []
    this.emit('batch-end')

    await delay(this.delayAfterBatch)
  }

  async run() {
    if (this.isRunning) return
    this.isRunning = true
    this.emit('running')

    while (this.size > 0) {
      await this.runBatch()
    }

    this.isRunning = false
    this.emit('idle')
  }
}

// export default function Queue({ concurrency = 1 } = {}) {

//   let isRunning = false
//   let theQueue = []

//   function enqueue(fn) {
//     return function call(...args) {
//       let resolver
//       let rejecter
//       const promiseInstance = new Promise((resolve, reject) => {
//         resolver = resolve
//         rejecter = reject
//       })

//       async function executer() {
//         try {
//           const result = await fn(...args)
//           resolver(result)
//         } catch (error) {
//           rejecter(error)
//         }
//       }

//       theQueue.push(executer)

//       run()

//       return promiseInstance
//     }
//   }

//   async function run() {
//     if (isRunning) return
//     isRunning = true

//     await delay(0)

//     const batch = theQueue.splice(0, concurrency)
//     console.log(`queue is running batch of ${batch.length}`)

//     await Promise.all(batch.map(fn => fn()))

//     isRunning = false
//     console.log('queue is done running batch')
//     if (theQueue.length) {
//       console.log('\nqueue is not empty yet\n')
//       await delay(0)
//       await run()
//     }
//   }

//   return { enqueue }
// }
