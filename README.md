Letsencrypt-bot
===============

### Simple letsencrypt script - can be used with cron

![logo](https://github.com/blocklime/letsencrypt-bot/raw/master/bot.png)

Built on [Greenlock](https://www.npmjs.com/package/greenlock)!

## Installation

Just install with npm:

    npm install -g letsencrypt-bot

## Usage

	letsencrypt bot [options] [command]
  
Commands:

- `help`    : Display help
- `version` : Display version
  
Options:

- `-c, --conf`    : Path to config file (defaults to /etc/letsencrypt-bot/config.json or ~/.letsencrypt-bot.json)
- `-h, --help`    : Output usage information
- `-v, --version` : Output the version number

## Configuration

Letsencrypt-bot reads all its settings from a configuration file.

By default letsencrypt-bot tries to load settings from 
`/etc/letsencrypt-bot/config.json`. If the file can't be read then 
it tries to load from `.letsencrypt-bot.json` in the user's home directory.

The config file location may be overridden using the `--conf` argument.

The format of the config file is as follows:

    {
        "acme" : "/path/to/.well-known/acme-challenge",
        "workdir" : "/path/to/ssl/directory",
        "domains" : [ "your.domain.com", "domain2.com" ]
    }

### The "acme" directory

The `acme` directory is used to verify that you own the domain you are 
requesting the ssl certificate for. You must ensure that this directory
is both writable by letsencrypt-bot and accessible over the internet
via your web server.

The letsencrypt service will send a special file to letsencrypt-bot
and then will try to download the file from
`http://your.domain.com/.well-known/acme-challenge/some_special_filename`.
The `some_special_filename` will be a long string of random characters.
The file itself contains a long string of random characters.

Once the letsencrypt service is able to download the file and verify its
contents it will issue a set of ssl certificate files for letsencrypt-bot
to download.

> Note: The "acme" directory must **always** end with ".well-known/acme-challenge"

### The "workdir" directory

Letsencrypt-bot uses this directory to both store files to keep track of the
state of the letsencrypt service and to download the ssl certificates.

Once letsencrypt-bot successfully downloads the certificates you may configure
your web server to load the certificates from the `workdir`.

The structure of the `workdir` is as follows:


    /path/to/workdir
    ├── accounts
    ├── archive
    ├── live
    ├── renewal
    ├── ssl.crt
    │   └── your.domain.com.crt
    ├── ssl.key
    │   └── your.domain.com.key
    ├── your.domain.com.ca_bundle
    └── your.domain.com.full_ca_bundle


Notice that all generated files are named after the domain you registered.

#### Nginx setup

For Nginx, set your `ssl_certificate` to `your.domain.com.full_ca_bundle`.
Then set your `ssl_certificate_key` to `ssl.key/your.domain.com.key`.

#### Apache setup

For Apache set your `SSLCertificateFile` to `ssl.crt/your.domain.com.crt` and
your `SSLCertificateChainFile` to `your.domain.com.ca_bundle`.
Then set your `SSLCertificateKeyFile` to `ssl.key/your.domain.com.key`.
