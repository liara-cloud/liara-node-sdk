'use strict';

require('util.promisify/shim')();

const Storage = require('./lib/storage');

class Liara {
	constructor(options) {
		this.Storage = new Storage(options);
	}
}

module.exports = Liara;
