# cache-cmd

Run and cache a command based on

-   time since last run
-   file change

## Install

```sh
# Using npm
npm add --save-dev cache-cmd
# Using pnpm
pnpm add --save-dev cache-cmd
# Using yarn
yarn add --dev cache-cmd
```

## Usage

```sh
# Shows help
npm exec -- cache-cmd --help

# Runs command if it was not run in the last 20s
npm exec -- cache-cmd "echo ran this command" --time 20s

# Runs command if package-lock.json in current directory changed since last run
npm exec -- cache-cmd "npm install" --file package-lock.json

# Additionally uses custom cache directory instead of default in node_modules
npm exec -- cache-cmd "npm install" --file package-lock.json --cache-dir .config/cache

# Runs command if it was not run in a month or any of the files changed
npm exec -- cache-cmd "npm install" --time 1mo --file package-lock.json --file package.json

# Shows path to cache directory
npm exec -- cache-cmd cache dir

# Clear cache
npm exec -- cache-cmd cache clear

# You can also run it with npx to skip the install step
npx cache-cmd "echo ran this command" --time 20s
```

You can use it to execute commands conditionally in `package.json` scripts.

```json
{
    "scripts": {
        "start-dev": "cache-cmd \"npm install\" --file package-lock.json && start-dev-server"
    }
}
```

## Contribute

If you find a bug or something you don't like, please [submit an issue](https://github.com/dcastil/cache-cmd/issues/new) or a pull request. I'm happy about any kind of feedback!
