function startTimer(id, description) {
  const start = Date.now()

  return function endTimer() {
    const end = Date.now()
    console.log(`${description} (${end - start}ms)`)
    return `${id};dur=${end - start};desc="${description}"`
  }
}

exports.handler = async event => {
  const endTotalTimer = startTimer('total', 'Total Time')
  const timings = []
  let browser = null
  let pdf = null

  try {
    const endBrowserTimer = startTimer('launch', 'Launch Playwright')
    if (!process.env.NETLIFY_DEV) {
      const playwright = require('playwright-aws-lambda');
      browser = await playwright.launchChromium();
    } else {
      const playwright = await import('playwright-chromium')
      browser = await playwright.chromium.launch({ headless: true })
    }

    timings.push(endBrowserTimer())

    const endPageCreation = startTimer('newpage', 'Create New Page')
    const page = await browser.newPage()
    page.on('pageerror', console.error);
    timings.push(endPageCreation())

    const endLoadPage = startTimer('load', 'Load page')
    await page.setContent(event.body, { waitUntil: 'networkidle0' })
    timings.push(endLoadPage())

    const endCreatePdf = startTimer('pdf', 'Create Pdf')
    pdf = await page.pdf({ format: 'A4', margin: { top: '1cm', bottom: '1cm' }  })
    timings.push(endCreatePdf())

  } catch (error) {
    console.log('error', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error, message: error.message }),
    }

  } finally {
    if (browser !== null) {
      const endClosingBrowser = startTimer('closebrowser', 'Close browser')
      await browser.close()
      timings.push(endClosingBrowser())
    }
  }

  timings.push(endTotalTimer())
  return {
    statusCode: 200,
    body: JSON.stringify({ pdf: pdf.toString('base64') }),
    isBase64Encoded : false,
    headers: {
      'Server-Timing': timings.join(', '),
      'Content-Type': 'application/json',
    },
  }
}
