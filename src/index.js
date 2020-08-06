const chromium = require('chrome-aws-lambda')

async function getPuppeteerPath() {
  let executablePath = await chromium.executablePath

  if (process.env.NETLIFY_DEV) {
    executablePath = null // forces to use local puppeteer
  }

  return executablePath
}

module.exports = async function (siren) {
  const executablePath = await getPuppeteerPath()
  const browser = await chromium.puppeteer.launch({
    executablePath,
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    headless: true
  })

  if (siren.length < 9) { throw new Error(`This siren is not valid : ${siren}`) }

  const page = await browser.newPage()

  await page.goto(`https://www.bodacc.fr/annonce/liste/${siren}`)
  await page.select('select#categorieannonce', 'vente')
  await page.select('select#typeannonce', 'annonce')
  await page.click('form#searchCriteres > p > input[type=submit]')
  
  const links = await page.evaluate(() => {
    let elements = Array.from(document.querySelectorAll('#resultats > table > tbody > tr > td > p > a'))
    let arr = elements.map(element => {
      return element.href
    })
    return arr
  })

  // close browser
  await browser.close()

  return links
}
