#!/usr/bin/env node

import hardRejection from 'hard-rejection'
import sade from 'sade'

import { showCacheDirectory } from './cache-dir'

import { version } from '../package.json'

hardRejection()

const program = sade('debounce-cmd')

program
    .version(version)
    .describe('Debounce a command based on various factors')
    .option(
        '-c, --cache-dir',
        'Cache directory to use (default: .cache/debounce-cmd in nearest node_modules)'
    )

program
    .command(
        'run <command>',
        'Run debounced command (if no <command> provided, this is the default)',
        { default: true }
    )
    .option('-f, --file', 'Run command only when file content changes')
    .option('-t, --time', 'Run command only after specified time (unit with s,m,h,d,mo,y)')
    .example('run "echo \'ran this command\'" --time 20s')
    .example('run "yarn install" --file yarn.lock')
    .example('run "yarn install" --file yarn.lock --cache-dir .config/cache')
    .example('run "yarn install" --time 1mo --file yarn.lock --file package.json')

program
    .command('cache dir', 'Show cache directory path used by debounce-cmd')
    .action((options: Record<string, unknown>) => {
        const cacheDir = options['cache-dir']

        if (cacheDir !== undefined && typeof cacheDir !== 'string') {
            throw Error('Invalid --cache-dir supplied')
        }

        showCacheDirectory(cacheDir)
    })

program.command('cache clear', 'Clear cache used by debounce-cmd')

program.parse(process.argv)
