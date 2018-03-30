#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const chalk_1 = require("chalk");
const ora = require("ora");
const path = require("path");
const program = require("commander");
const ghDownload = require('github-download');
const request = require("request-promise-native");
program
    .version('1.1.2')
    .command('new [project]')
    .description('Create new project under given directory.')
    .action((project) => __awaiter(this, void 0, void 0, function* () {
    if (!project) {
        console.error(chalk_1.default.red('[project] argument is missing'));
        process.exit(1);
    }
    const originalDirectory = process.cwd();
    const destination = path.join(originalDirectory, project);
    if (fs.existsSync(destination)) {
        console.error(chalk_1.default.red(`Project destination: ${destination} already exists`));
        process.exit(1);
    }
    const spinner = ora(`Bootstraping to ${destination}`).start();
    // tslint:disable-next-line
    const response = yield request.get({
        uri: 'https://api.github.com/repos/travlrcom/expressive/tags',
        headers: {
            'User-Agent': 'node'
        }
    });
    const result = JSON.parse(response);
    const latest = (result.length) ? result.pop() : { name: 'master' };
    spinner.info(`Using Expressive v${latest.name}`);
    ghDownload({ user: 'travlrcom', repo: 'expressive', ref: latest.name }, destination)
        .on('end', () => {
        spinner.info('Downloaded');
        process.chdir(destination);
        spinner.succeed(`Expressive is ready on ${destination}`);
        spinner.stop();
        console.log('');
        console.log(chalk_1.default.bold('Next thing you need to do:'));
        console.log('  - cd ' + chalk_1.default.green(project));
        console.log('  - yarn install ' + chalk_1.default.gray('# or npm install, but using yarn is recommended'));
        console.log('  - yarn dev     ' + chalk_1.default.gray('# or npm run dev'));
    });
}));
program.parse(process.argv);
