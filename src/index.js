const chromium = require('chrome-aws-lambda')

let browser = null

module.exports = async function (siren) {
  if (siren.length < 9) { throw new Error(`This siren is not valid : ${siren}`) }

  if (!browser) {
    const executablePath = await chromium.executablePath

    browser = await chromium.puppeteer.launch({
      executablePath,
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      headless: true
    })
  }

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
