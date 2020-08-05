import log from '../lib/log'

if (process.browser) {
  window.addProject = async function (projectData, title) {
    const file = new File([projectData], title)
    const event = { target: { files: [file] } }
    await $nuxt.$store.dispatch('project/importProject', event) // eslint-disable-line no-undef
  }
}

export default function exportToPdf({ locale, project, title }) {
  const dispatch = (message, percentage) => {
    log.info(message)
    document.dispatchEvent(
      new CustomEvent(
        'pdf-export-progress',
        {
          detail: {
            percentage: percentage * 100,
            message,
          },
        },
      ),
    )
  }
  return new Promise(resolve => {
    try {
      log.groupStart.info('Loading Iframe')
      const iframe = document.createElement('iframe')
      iframe.src = `${location.origin}/${locale}/pdf-export`
      iframe.style.width = '210mm'
      iframe.style.height = '297mm'
      iframe.addEventListener('load', () => {
        log.groupEnd()
        log.groupStart.info('Creating PDF')
        dispatch('Iframe loaded', 1/7)
        iframe.contentWindow.document.addEventListener('mapbox-loaded', async () => {
          dispatch('MapBox loaded', 2/7)
          await iframe.contentWindow.window.addProject(JSON.stringify(project), title)
          dispatch('Project added', 3/7)
          iframe.contentWindow.document.addEventListener('mapbox-image-created', async () => {
            dispatch('MapBox Image created', 4/7)
            ;[...iframe.contentWindow.document.querySelectorAll('script')].forEach(scriptElement => {
              scriptElement.parentNode.removeChild(scriptElement)
            })
            resolve(iframe.contentWindow.document.documentElement.outerHTML)
            dispatch('Removing iframe', 5/7)
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
    dispatch('Sending markup to server', 6/7)
    return fetch('/.netlify/functions/export-to-pdf-from-markup', {
      method: 'POST',
      body: markup,
    })
  })
  .then(response => {
    dispatch('Received PDF response from server', 7/7)
    log.groupEnd()
    return response.blob()
  })
  .catch(error => {
    log.groupEnd()
    log.error(error)
  })
}
