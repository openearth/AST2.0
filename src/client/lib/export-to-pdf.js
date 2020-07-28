import log from '../lib/log'

if (process.browser) {
  window.addProject = async function (projectData, title) {
    const file = new File([projectData], title)
    const event = { target: { files: [file] } }
    await $nuxt.$store.dispatch('project/importProject', event)
  }
}

export default function exportToPdf({ locale, project, title }) {
  log.groupStart.info('export iframe')
  return new Promise((resolve, reject) => {
    try {
      const iframe = document.createElement('iframe')
      iframe.src = `${location.origin}/${locale}/pdf-export`
      iframe.addEventListener('load', () => {
        log.info('iframe loaded')
        setTimeout(async () => {
          await iframe.contentWindow.window.addProject(JSON.stringify(project), title)
          log.groupEnd()
          setTimeout(() => {
            resolve(iframe.contentWindow.document.documentElement.outerHTML)
            iframe.parentElement.removeChild(iframe)
          }, 0)
        }, 10)
      })
      document.body.appendChild(iframe)
    } catch (error) {
      log.error('', error)
      throw new Error(error)
    }
  })
  .then(markup => fetch('/.netlify/functions/export-to-pdf-from-markup', {
    method: 'POST',
    body: markup,
  }))
  .then(response => response.blob())
}
