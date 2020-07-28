const chromium = require('chrome-aws-lambda');
// const puppeteer = require('puppeteer')

const delay = ms => new Promise(resolve => setTimeout(() => resolve(), ms))

async function loadProjectInPage(project) {
  try {
    const projectFile = new File([project], 'project-name')
    const event = { target: { files: [projectFile] } }
    await $nuxt.$store.dispatch('project/importProject', event)
    return {}
  } catch (error) {
    return { error: error.message }
  }
}

async function allowImagesToLoad() {
  const eventListeners = [...document.querySelectorAll('img')]
    .map(image => new Promise(resolve => {
      image.addEventListener('load', () => resolve())
    }))

  return Promise.all(eventListeners)
}

function startTimer(id, description) {
  const start = Date.now()

  return function endTimer() {
    const end = Date.now()
    console.log(`${description} (${end - start}ms)`)
    return `${id};dur=${end - start};desc="${description}"`
  }
}

exports.handler = async (event, context) => {
  const start = Date.now()
  const timings = []
  let browser = null
  let result = null
  let pdf = null
  const log = message => console.log(new Date(Date.now() - start).getSeconds(), 's: ', message)

  try {
    const endBrowserTimer = startTimer('launch', 'Launch Puppeteer')
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
    // browser = await puppeteer.launch({ headless: true })
    timings.push(endBrowserTimer())

    const endPageCreation = startTimer('newpage', 'Create New Page')
    const page = await browser.newPage()
    page.on('pageerror', console.error);
    // page.on('console', console.log);
    timings.push(endPageCreation())

    const endLoadPage = startTimer('load', 'Load page')
    await page.setContent(event.body, { waitUntil: 'networkidle0' })
    timings.push(endLoadPage())

    const endCreatePdf = startTimer('pdf', 'Create Pdf')
    pdf = await page.pdf({ format: 'A4' })
    timings.push(endCreatePdf())

  } catch (error) {
    console.log('error', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error, message: error.message }),
    }

  } finally {
    if (browser !== null) {
      await browser.close()
    }
  }

  return {
    statusCode: 200,
    body: pdf.toString('base64'),
    isBase64Encoded : true,
    headers: {
      'Server-Timing': timings.join(', '),
      'Content-Type': 'application/pdf',
    },
  }
}
