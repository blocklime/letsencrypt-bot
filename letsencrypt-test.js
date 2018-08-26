#! /usr/bin/env node

var ACME = '/home/wallet/public_html/.well-known/acme-challenge';
var HOME = './ssl';
var domains = [ 'wallet.nchain.ir' ];

var G_LOCK = require('greenlock');
var mkdirp = require('mkdirp');

var store = require('le-store-certbot').create({
		configDir: HOME,
		privkeyPath: ':configDir/ssl.key/:hostname.key',
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
	
var greenlock = G_LOCK.create({
		version: 'draft-12',
		server: 'https://acme-v02.api.letsencrypt.org/directory',
		store: store,
		challenges: {
			'http-01': challenge
		},
		challengeType: 'http-01'
	});

mkdirp.sync(HOME + '/ssl.key');
mkdirp.sync(HOME + '/ssl.crt');
greenlock.check({ domains: domains })
	.then(ok => {
		if (ok) return;
		
		greenlock.register({
			domains: domains,
			email: 'amouha@visionsoba.com',
			agreeTos: true,
			rsaKeySize: 2048,
			challengeType: 'http-01'
		})
		.then(() => console.log('success'))
		.catch(err => console.error(err));
	});
	
