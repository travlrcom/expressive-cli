import chalk from 'chalk'
import * as program from 'commander'

let project = ''

program
  .version('0.1.0')
  .arguments('[dir]')
  .action(dir => project = dir)

program.parse(process.argv)

if (!project) {
  console.error(chalk.red('[project] argument is missing'))
  process.exit(1)
}

import * as fs from 'fs'
import * as path from 'path'

const destination = path.join(process.cwd(), project)

if (fs.existsSync(destination)) {
  console.error(chalk.red(`Project destination: ${destination} already exists`))
  process.exit(1)
}

import * as shell from 'shelljs'
import * as rimraf from 'rimraf'

console.log(chalk.green(`Cloning to ${destination} ...`))
shell.exec(`git clone https://github.com/travlrcom/expressive ${project}`, { silent: true }, () => {
  rimraf(path.join(destination, '.git'), {}, () => {
    console.log(chalk.blue(`Successfully cloned to ${destination}`))
  })
})
