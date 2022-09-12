#!/usr/bin/env node

import { Command } from 'commander';
import readline from 'node:readline';
import cdnjs from './services/cdnjs.service.js';
import check from './services/check.service.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
});

const program = new Command();

program.addHelpText(
    'afterAll',
    `

Examples:

  ppfang cdnjs

  ppfang cdnjs -c 50

  cat urls.txt | ppfang pipe -c 10

  echo "https://somesite.com/" | ppfang pipe

  gau --blacklist png,jpg,gif,txt,json,js some-random-domain.com | ppfang pipe -c 50

  ppfang --help || ppfang

Happy hunting!
`
);

program
    .name('ppfang')
    .usage('[command] [option]')
    .description('A tool which helps identifying client-side prototype polluting libraries');

program
    .command('cdnjs')
    .description('Verifies the latest libraries from cdnjs.com')
    .action(async (options) => {
        const concurrency = Number.parseInt(options.concurrency);
        concurrency ? await cdnjs.probeAll(concurrency) : await cdnjs.probeAll();
        process.exit(0);
    });

program
    .command('pipe')
    .description('Checks a list of urls provided through stdin for client-side prototype polluting functions')
    .action(async (options) => {
        const concurrency = Number.parseInt(options.concurrency);
        let urls = [];
        rl.on('line', (line) => urls.push(line));
        rl.on('close', async () => {
            concurrency ? await check.probeAll(urls, concurrency) : await check.probeAll(urls);
            process.exit(0);
        });
    });

program.commands.forEach((command) => command.option('-c, --concurrency <concurrency>', 'concurrency level', '10'));

program.parse();
