#!/usr/bin/env node

const ora = require('ora')
const consola = require('consola')
const yargs = require('yargs')
const { setRootDir, install } = require('lmify')
const { join } = require('path')

yargs
  .usage('$0 [siren]', 'analyze a siren', (yargs) => {
    yargs.positional('siren', {
      describe: 'the siren to analyze',
      type: 'string'
    })
  }, async (argv) => {
    if (!argv.siren) {
      consola.error('Please provide a siren to analyze')
      return yargs.showHelp()
    }
    // Check if puppeteer is installed
    try { require('puppeteer') }
    catch(err) {
      setRootDir(join(__dirname, '..'))
      await install('puppeteer')
    }

    const spinner = ora('Connecting to Bodacc').start()
    setTimeout(() => spinner.color = 'magenta', 2500)
    setTimeout(() => spinner.color = 'blue', 5000)
    setTimeout(() => spinner.color = 'yellow', 7500)

    const hrstart = process.hrtime()
    try {
      const links = await require('..')(argv.siren)
      spinner.stop()
      if (links.length) {
        consola.log(`${links.length} file(s) found :\n`)
        links.forEach((l, i) => {
          consola.log(`${i + 1} - ${l}`)
        })
        consola.log('\n')
      } else {
        consola.log('No results found.\n')
      }

      const hrend = process.hrtime(hrstart)
      consola.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
      process.exit(0)
    } catch (err) {
      consola.error(err.message)
      if (err.body) consola.log(err.body)
      process.exit(1)
    }
  })
  .argv

