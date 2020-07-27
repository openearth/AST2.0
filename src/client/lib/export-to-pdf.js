if (process.browser) {
  window.addProject = async function (projectData, title) {
    const file = new File([projectData], title)
    const event = { target: { files: [file] } }
    await $nuxt.$store.dispatch('project/importProject', event)
  }
}


export default function exportToPdf({ locale, project }) {
  console.groupCollapsed('export iframe')
  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe')
    iframe.src = `${location.origin}/${locale}/pdf-export`
    iframe.addEventListener('load', async () => {
      await iframe.contentWindow.addProject(JSON.stringify(project))
      console.groupEnd()
      setTimeout(() => {
        resolve(iframe.contentWindow.document.documentElement.outerHTML)
      }, 0)
    })
    document.body.appendChild(iframe)
  }).then(async markup => {
    return await fetch('/.netlify/functions/export-to-pdf-from-markup', {
      method: 'POST',
      body: markup,
    }).then(response => response.blob())
  })
}
