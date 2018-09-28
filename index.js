'use strict';

require('util.promisify/shim')();

const Storage = require('./lib/storage');

class Liara {
	constructor(options) {
		if( ! options.secret_key) {
			throw new Error('options.secret_key is required.');
		}

		this.Storage = new Storage(options);
	}
}

module.exports = Liara;
