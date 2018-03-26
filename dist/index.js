"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const program = require("commander");
let project = '';
program
    .version('0.1.0')
    .arguments('[dir]')
    .action(dir => project = dir);
program.parse(process.argv);
if (!project) {
    console.error(chalk_1.default.red('[project] argument is missing'));
    process.exit(1);
}
const fs = require("fs");
const path = require("path");
const destination = path.join(process.cwd(), project);
if (fs.existsSync(destination)) {
    console.error(chalk_1.default.red(`Project destination: ${destination} already exists`));
    process.exit(1);
}
const shell = require("shelljs");
const rimraf = require("rimraf");
console.log(chalk_1.default.green(`Cloning to ${destination} ...`));
shell.exec(`git clone https://github.com/travlrcom/expressive ${project}`, { silent: true }, () => {
    rimraf(path.join(destination, '.git'), {}, () => {
        console.log(chalk_1.default.blue(`Successfully cloned to ${destination}`));
    });
});
