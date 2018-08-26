#! /usr/bin/env node

var ACME = '/home/wallet/public_html/.well-known/acme-challenge';
var HOME = '.';

var store = require('le-store-certbot').create({
		configDir: HOME,
		privKeyPath: ':configDir/ssl.key/:hostname.key',
		fullchainPath: ':configDir/:hostname.full_ca_bundle',
		certPath: ':configDir/ssl.crt/:hostname.crt',
		chainPath: ':configDir/:hostname.ca_bundle',
		webrootPath: ACME,
		debug: false
	});
	
var challenge = require('le-challenge-fs').create({
		webrootPath: ACME,
		loopbackPort: 5001,
		loopbackTimeout: 10000,
		debug: false
	});
	
var greenlock = require('greenlock').create({
		version: 'draft-12',
		server: 'https://acme-v02.api.letsencrypt.org/directory',
		store: store,
		challenge: challenge
	});
	
console.log(greenlock.stagingServerUrl);
console.log(greenlock.productionServerUrl);
