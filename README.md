buttercms
=========

CLI tool to work with ButterCMS

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/buttercms.svg)](https://npmjs.org/package/buttercms-cli)
[![Downloads/week](https://img.shields.io/npm/dw/buttercms.svg)](https://npmjs.org/package/buttercms-cli)
[![License](https://img.shields.io/npm/l/buttercms.svg)](https://github.com/deleteman/buttercms-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g buttercms-cli
$ buttercms COMMAND
running command...
$ buttercms (-v|--version|version)
buttercms/0.0.1 linux-x64 node-v10.5.0
$ buttercms --help [COMMAND]
USAGE
  $ buttercms COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`buttercms generate:blog`](#buttercms-generate)
* [`buttercms generate:page`](#buttercms-generate-page)
* [`buttercms generate:pages`](#buttercms-generate-pages)
* [`buttercms help [COMMAND]`](#buttercms-help-command)

## `buttercms generate:blog`

Create a brand new blog with a set of sample templates

```
USAGE
  $ buttercms generate:blog

OPTIONS
  --for=target  Target tech stack to generate the blog for (currently available: express)
  --auth_token=token The Auth token provided by ButterCMS, this CLI will auto-populate your configuration file with it

```

## `buttercms generate:page`

Create a new page inside your blog, based on the page you configured on ButterCMS

```
USAGE
  $ buttercms generate:page

OPTIONS
  --for=target  Target tech stack to generate the blog for (currently available: express)
  --page=page 	The slug of the page you want to retrieve
  --auth_token=token The Auth token provided by ButterCMS, this CLI will auto-populate your configuration file with it

```
## `buttercms generate:pages`

Create a list of links for the same type of page

```
USAGE
  $ buttercms generate:pages

OPTIONS
  --for=target  Target tech stack to generate the blog for (currently available: express)
  --page_type=type 	The slug for the page type you previously created in ButterCMS
  --auth_token=token The Auth token provided by ButterCMS, this CLI will auto-populate your configuration file with it

``


## `buttercms help [COMMAND]`

display help for buttercms

```
USAGE
  $ buttercms help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

<!-- commandsstop -->
