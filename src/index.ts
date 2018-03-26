#!/usr/bin/env node

import * as fs from 'fs'
import chalk from 'chalk'
import * as path from 'path'
import * as rimraf from 'rimraf'
import * as shell from 'shelljs'
import * as program from 'commander'

program
  .version('1.0.0')
  .command('new [project]')
  .description('Create new project under given directory.')
  .action(project => {
    if (!project) {
      console.error(chalk.red('[project] argument is missing'))
      process.exit(1)
    }

    const destination = path.join(process.cwd(), project)

    if (fs.existsSync(destination)) {
      console.error(chalk.red(`Project destination: ${destination} already exists`))
      process.exit(1)
    }

    console.log(chalk.green(`Cloning to ${destination} ...`))
    shell.exec(`git clone https://github.com/travlrcom/expressive ${project}`, { silent: true }, () => {
      rimraf(path.join(destination, '.git'), {}, () => {
        console.log(chalk.blue(`Successfully cloned to ${destination}`))
      })
    })
  })

program.parse(process.argv)
