const puppeteer = require('puppeteer')

module.exports = async function (siren) {
  if (siren.length < 9) { throw new Error(`This siren is not valid : ${siren}`) }

  const browser = await puppeteer.launch()
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
