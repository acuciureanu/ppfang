#!/usr/bin/env node

import { Command } from 'commander';
import cdnjs from './services/cdnjs.service.js';

const program = new Command();

program
    .description('A tool which helps identifying client-side prototype polluting libraries')
    .option('-c, --cdnjs', 'Test the latest libraries from cdnjs.com');

program.parse();

const options = program.opts();

if (options.cdnjs) {
    cdnjs.probeAll();
} else {
    program.help();
}

program.parse();
