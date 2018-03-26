#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const chalk_1 = require("chalk");
const path = require("path");
const rimraf = require("rimraf");
const shell = require("shelljs");
const program = require("commander");
program
    .version('1.0.0')
    .command('new [project]')
    .description('Create new project under given directory.')
    .action(project => {
    if (!project) {
        console.error(chalk_1.default.red('[project] argument is missing'));
        process.exit(1);
    }
    const destination = path.join(process.cwd(), project);
    if (fs.existsSync(destination)) {
        console.error(chalk_1.default.red(`Project destination: ${destination} already exists`));
        process.exit(1);
    }
    console.log(chalk_1.default.green(`Cloning to ${destination} ...`));
    shell.exec(`git clone https://github.com/travlrcom/expressive ${project}`, { silent: true }, () => {
        rimraf(path.join(destination, '.git'), {}, () => {
            console.log(chalk_1.default.blue(`Successfully cloned to ${destination}`));
        });
    });
});
program.parse(process.argv);
