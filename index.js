const chalk = require('chalk')
const program = require('commander')

let project = ''

program
  .version('0.1.0')
  .arguments('[dir]')
  .action(function (dir) { project = dir })

program.parse(process.argv)

if (!project) {
  console.error(chalk.red('[project] argument is missing'))
  process.exit(1)
}

const path = require('path')
const destination = path.join(process.cwd(), project)

if (require('fs').existsSync(destination)) {
  console.error(chalk.red('Project destination: ' + destination + ' already exists'))
  process.exit(1)
}

console.log(chalk.green('Cloning to ' + destination + ' ...'))
require('shelljs').exec('git clone https://github.com/travlrcom/expressive ' + project, { silent: true }, () => {
  require('rimraf')(path.join(destination, '.git'), {}, () => {
    console.log(chalk.blue('Successfully cloned to ' + destination))
  })
})
