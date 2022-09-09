#!/usr/bin/env node

import { Command } from 'commander';
import cdnjs from './services/cdnjs.service.js';

const program = new Command();

program.name('ppfang').description('A tool which helps identifying client-side prototype polluting libraries');

program
    .command('check')
    .description('Verifies the latest libraries from cdnjs.com')
    .option('-c, --concurrency <concurrency>', 'concurrency level', '10')
    .action((options) => {
        const concurrency = Number.parseInt(options.concurrency);
        (concurrency) ? cdnjs.probeAll(concurrency) : cdnjs.probeAll(10)
    })
    .addHelpText('afterAll', '\nThanks for using this tool :)');

program.parse();
