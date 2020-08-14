const chromium = require('chrome-aws-lambda');


async function loadProjectInPage(project) {
  try {
    const projectFile = new File([project], 'project-name')
    const event = { target: { files: [projectFile] } }
    await $nuxt.$store.dispatch('project/importProject', event) //eslint-disable-line no-undef
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

exports.handler = async event => {
  const timings = []
  let browser = null
  let result = null
  let pdf = null

  try {
    const origin = event.headers.origin
    const referer = event.headers.referer
    const requestingPath = referer.replace(origin, '')
    const [, locale] = /^(?:\/)(\w+)/.exec(requestingPath)

    const endBrowserTimer = startTimer('launch', 'Launch Puppeteer')
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
    timings.push(endBrowserTimer())

    const endPageCreation = startTimer('newpage', 'Create New Page')
    const page = await browser.newPage()
    page.on('pageerror', console.error);
    // page.on('console', console.log);
    timings.push(endPageCreation())

    const endLoadPage = startTimer('load', 'Load page')
    await page.goto(`${origin}/${locale}/pdf-export`, { waitUntil: ['networkidle2'] })
    timings.push(endLoadPage())

    const endLoadProject = startTimer('project', 'Load project')
    result = await page.evaluate(loadProjectInPage, event.body)
    if (result.error) {
      timings.push(endLoadProject())
      throw new Error(result.error)
    }
    timings.push(endLoadProject())

    const endLoadImages = startTimer('images', 'Allow images to load')
    await page.evaluate(allowImagesToLoad)
    timings.push(endLoadImages())

    const endCreatePdf = startTimer('pdf', 'Create Pdf')
    pdf = await page.pdf({ format: 'A4' })
    timings.push(endCreatePdf())

  } catch (error) {
    console.log('error', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error }),
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
