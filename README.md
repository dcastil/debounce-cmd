# debounce-cmd

Debounce a command based on

-   time since last run
-   file change

## Install

```sh
yarn add --dev debounce-cmd
```

or

```sh
npm install --save-dev debounce-cmd
```

## Usage

```sh
# Shows help
yarn debounce-cmd --help

# Runs command if it was not run in the last 20s
yarn debounce-cmd "echo ran this command" --time 20s

# Runs comand if yarn.lock in current directory changed since last run
yarn debounce-cmd "yarn install" --file yarn.lock

# Additionally uses custom cache directory instead of default in node_modules
yarn debounce-cmd "yarn install" --file yarn.lock --cache-dir .config/cache

# Runs command if it was not run in a month or any of the files changed
yarn debounce-cmd "yarn install" --time 1mo --file yarn.lock --file package.json

# Shows path to cache directory
yarn debounce-cmd cache dir

# Clear cache
yarn debounce-cmd cache clear
```

You can use it to execute commands conditionally in `package.json` scripts.

```json
{
    "scripts": {
        "dev": "debounce-cmd \"yarn\" --file yarn.lock && start-dev-server"
    }
}
```

## Contribute

If you find a bug or something you don't like, please [submit an issue](https://github.com/dcastil/debounce-cmd/issues/new) or a pull request. I'm happy about any kind of feedback!
