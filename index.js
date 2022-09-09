#!/usr/bin/env node

import { Command } from 'commander';
import cdnjs from './services/cdnjs.service.js';

const program = new Command();

program
    .name('ppfang')
    .description('A tool which helps identifying client-side prototype polluting libraries');

program.command('check')
    .option('-c, --concurrency [concurrency]', 'the level of concurrency', '10')
    .addHelpText('afterAll', '\nThanks for using this tool :)');

const opts = program.opts();

const concurrency = Number.parseInt(opts.concurrency);

if (concurrency > 0) {
    cdnjs.probeAll(concurrency)
} else {
    cdnjs.probeAll();
}

program.parse();