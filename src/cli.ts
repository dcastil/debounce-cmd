#!/usr/bin/env node

import hardRejection from 'hard-rejection'
import sade from 'sade'

import { version } from '../package.json'

import { clearCacheDirectory } from './cache-clear'
import { showCacheDirectory } from './cache-dir'
import { debounceCommand } from './run'

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
    .option('-t, --time', 'Run command only after specified time (unit with s,m,h,d,w,mo,y)')
    .option('--cache-on-error', 'Cache command run even when command exits with non-zero exit code')
    .example('run "echo ran this command" --time 20s')
    .example('run "./may-fail" --time 20s --cache-on-error')
    .example('run "yarn install" --file yarn.lock')
    .example('run "yarn install" --file yarn.lock --cache-dir .config/cache')
    .example('run "yarn install" --time 1mo --file yarn.lock --file package.json')
    .action((command: unknown, options: Record<string, unknown>) => {
        const cacheDirectory = options['cache-dir']
        const time = options.time
        const file = options.file
        const shouldCacheOnError = options['cache-on-error']
        const files: unknown[] = file === undefined ? [] : Array.isArray(file) ? file : [file]

        if (typeof command !== 'string') {
            throw Error('Invalid <command> supplied')
        }

        if (cacheDirectory !== undefined && typeof cacheDirectory !== 'string') {
            throw Error('Invalid --cache-dir supplied')
        }

        if (time !== undefined && typeof time !== 'string') {
            throw Error('Invalid --time supplied')
        }

        if (files.some((file) => typeof file !== 'string')) {
            throw Error('Invalid --file supplied')
        }

        if (shouldCacheOnError !== undefined && typeof shouldCacheOnError !== 'boolean') {
            throw Error('Invalid --cache-on-error supplied')
        }

        debounceCommand({
            relativeCacheDirectory: cacheDirectory,
            command,
            debounceByTime: time,
            debounceByFiles: files as string[],
            shouldCacheOnError,
        })
    })

program
    .command('cache dir', 'Show cache directory path used by debounce-cmd')
    .action((options: Record<string, unknown>) => {
        const cacheDirectory = options['cache-dir']

        if (cacheDirectory !== undefined && typeof cacheDirectory !== 'string') {
            throw Error('Invalid --cache-dir supplied')
        }

        showCacheDirectory(cacheDirectory)
    })

program
    .command('cache clear', 'Clear cache used by debounce-cmd')
    .action((options: Record<string, unknown>) => {
        const cacheDirectory = options['cache-dir']

        if (cacheDirectory !== undefined && typeof cacheDirectory !== 'string') {
            throw Error('Invalid --cache-dir supplied')
        }

        clearCacheDirectory(cacheDirectory)
    })

program.parse(process.argv)
