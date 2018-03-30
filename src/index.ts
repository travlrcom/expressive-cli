#!/usr/bin/env node

import * as fs from 'fs'
import chalk from 'chalk'
import * as ora from 'ora'
import * as path from 'path'
import * as program from 'commander'
const ghDownload = require('github-download')
import * as request from 'request-promise-native'

program
  .version('1.1.2')
  .command('new [project]')
  .description('Create new project under given directory.')
  .action(async project => {
    if (!project) {
      console.error(chalk.red('[project] argument is missing'))
      process.exit(1)
    }

    const originalDirectory = process.cwd()
    const destination = path.join(originalDirectory, project)

    if (fs.existsSync(destination)) {
      console.error(chalk.red(`Project destination: ${destination} already exists`))
      process.exit(1)
    }

    const spinner = ora(`Bootstraping to ${destination}`).start()
    // tslint:disable-next-line
    const response = await request.get({
      uri: 'https://api.github.com/repos/travlrcom/expressive/tags',
      headers: {
        'User-Agent': 'node'
      }
    })

    const result = JSON.parse(response)
    const latest = (result.length) ? result.pop() : { name: 'master' }

    spinner.info(`Using Expressive v${latest.name}`)

    ghDownload({ user: 'travlrcom', repo: 'expressive', ref: latest.name }, destination)
      .on('end', () => {
        spinner.info('Downloaded')

        process.chdir(destination)

        spinner.succeed(`Expressive is ready on ${destination}`)
        spinner.stop()

        console.log('')
        console.log(chalk.bold('Next thing you need to do:'))
        console.log('  - cd ' + chalk.green(project))
        console.log('  - yarn install ' + chalk.gray('# or npm install, but using yarn is recommended'))
        console.log('  - yarn dev     ' + chalk.gray('# or npm run dev'))
      })
  })

program.parse(process.argv)
