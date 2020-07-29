import log from '../lib/log'

if (process.browser) {
  window.addProject = async function (projectData, title) {
    const file = new File([projectData], title)
    const event = { target: { files: [file] } }
    await $nuxt.$store.dispatch('project/importProject', event)
  }
}

export default function exportToPdf({ locale, project, title }) {
  return new Promise((resolve, reject) => {
    try {
      log.groupStart.info('Loading Iframe')
      const iframe = document.createElement('iframe')
      iframe.src = `${location.origin}/${locale}/pdf-export`
      iframe.style.width = '297mm'
      iframe.style.height = '210mm'
      iframe.addEventListener('load', () => {
        log.groupEnd()
        log.groupStart.info('Creating PDF')
        log.info('Iframe loaded')
        iframe.contentWindow.document.addEventListener('mapbox-loaded', async () => {
          log.info('MapBox loaded')
          await iframe.contentWindow.window.addProject(JSON.stringify(project), title)
          log.info('Project added')
          iframe.contentWindow.document.addEventListener('mapbox-image-created', async () => {
            log.info('MapBox Image created')
            ;[...iframe.contentWindow.document.querySelectorAll('script')].forEach(scriptElement => {
              scriptElement.parentNode.removeChild(scriptElement)
            })
            resolve(iframe.contentWindow.document.documentElement.outerHTML)
            log.info('Removing iframe')
            iframe.parentElement.removeChild(iframe)
          })
        })
      })
      document.body.appendChild(iframe)
    } catch (error) {
      log.error('', error)
      throw new Error(error)
    }
  })
  .then(markup => {
    log.info('Sending markup to server')
    return fetch('/.netlify/functions/export-to-pdf-from-markup', {
      method: 'POST',
      body: markup,
    })
  })
  .then(response => {
    log.info('Received PDF response from server')
    log.groupEnd()
    return response.blob()
  })
  .catch(error => {
    log.groupEnd()
    log.error(error)
  })
}
