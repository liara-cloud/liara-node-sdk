const fs = require('fs');
const got = require('got');
const util = require('util');
var stream = require('stream');
const is = require('@sindresorhus/is');

const pkg = require('../package.json');

const BASE_URL = 'http://localhost:3000';

class Storage {
	constructor(options) {
		if( ! options.secret_key) {
			throw new Error('options.secret_key is required.');
		}

		this.options = options;
	}

	/**
	 * Put an object
	 * @api public
	 * @param {string} key Object key
	 * @param {string|Buffer|Readable} body Object body
	 * @returns {Promise} Response
	 */
	put(key, body) {
		if ( ! key) {
			throw new Error('key is required.');
		}

		if (typeof body !== 'string' && ! body) {
			throw new Error('body is required.');
		}

		return this.getBodySize(body)
			.then(size => {
				const config = {
					body,
					method: 'POST',
					headers: {
						'X-Liara-Object-Key': key,
						'X-Liara-Object-Size': size,
						'User-Agent': `LiaraNodeSDK/${pkg.version}`,
						'Authorization': `Bearer ${this.options.secret_key}`,
					}
				};

				return got(`${BASE_URL}/v1/storage/objects`, config);
			})
			.then(response => {
				return JSON.parse(response.body);
			})
			.catch(error => {
				if(error instanceof Storage.HTTPError) {
					const { statusCode } = error.response;
					const { code, message } = JSON.parse(error.response.body);

					if(code === 'storage_service_is_not_enabled') {
						throw new Storage.ServiceIsNotEnabled('You must enable storage service from your dashboard first.');
					}

					if(code === 'object_is_too_large') {
						throw new Storage.ObjectIsTooLarge(message);
					}

					if(code === 'not_enough_balance') {
						throw new Storage.NotEnoughBalance(`You don't have enough balance.`);
					}

					if(statusCode === 500) {
						throw new Storage.InternalServerError('Internal Server Error. Please try again later.');
					}
				}

				throw error;
			});
	}

	list({
		marker,
		directory = '',
		limit = 100,
		delimiter = '/',
	} = {}) {
		const config = {
			json: true,
			query: {
				marker,
				delimiter,
				prefix: directory,
				maxKeys: limit,
			},
			headers: {
				'Authorization': `Bearer ${this.options.secret_key}`,
			}
		};
		return got(`${BASE_URL}/v1/storage/objects`, config)
			.then(response => response.body);
	}

	// TODO:
	// listAll({
	// 	marker,
	// 	directory = '',
	// 	delimiter = '/',
	// } = {}) {
	// 	const config = {
	// 		json: true,
	// 		query: {
	// 			marker,
	// 			delimiter,
	// 			prefix: directory,
	// 			maxKeys: limit,
	// 		},
	// 		headers: {
	// 			'Authorization': `Bearer ${this.options.secret_key}`,
	// 		}
	// 	};
	// 	return got(`${BASE_URL}/v1/storage/objects`, config)
	// 		.then(response => response.body)
	// 		.then(({ objects, isTruncated }) => {

	// 			if(isTruncated) {
	// 				//
	// 			}

	// 			return {
	// 				_index: 0,
	// 				next: function* () {
	// 					if(objects.length > this._index) {
	// 						yield objects[this._index++];
	// 					}
	// 				},
	// 				[Symbol.iterator]: function() { return this }
	// 			};
	// 		})
	// }

	/**
	 * Get an object
	 * @api public
	 * @param {string} key Object key
	 */
	get(key) {
		if( ! key) {
			throw new Error('key is required.');
		}

		if( ! is.string(key)) {
			throw new TypeError('key must be a string');
		}

		const config = {
			encoding: null,
			headers: {
				'Authorization': `Bearer ${this.options.secret_key}`,
			}
		};

		return got.get(`${BASE_URL}/v1/storage/objects/${key}`, config)
			.catch(error => {
				if(error instanceof Storage.HTTPError) {
					const { statusCode } = error.response;
					const { code, message } = JSON.parse(error.response.body);

					if(code === 'NoSuchKey') {
						throw new Storage.NoSuchKey(message);
					}

					if(statusCode === 400) {
						error.response.body = JSON.parse(error.response.body);
						throw error;
					}

					if(statusCode === 500) {
						throw new Storage.InternalServerError('Internal Server Error. Please try again later.');
					}
				}

				throw error;
			});
	}

	/**
	 * Get an object as stream
	 * @api public
	 * @param {string} key Object key
	 */
	getStream(key) {
		if( ! key) {
			throw new Error('key is required.');
		}

		if( ! is.string(key)) {
			throw new TypeError('key must be a string');
		}

		const config = {
			encoding: null,
			headers: {
				'Authorization': `Bearer ${this.options.secret_key}`,
			}
		};

		return got.stream(`${BASE_URL}/v1/storage/objects/${key}`, config);
	}

	/**
	 * Get body size
	 * @api private
	 * @param {string|Buffer|Readable} body Object body
	 * @returns {number} Object size
	 */
	getBodySize(body) {
		return new Promise((resolve, reject) => {
			if (is.string(body) || is.buffer(body)) {
				return resolve(Buffer.byteLength(body));
			}

			if (body instanceof fs.ReadStream) {
				util.promisify(fs.stat)(body.path)
					.then(({ size }) => resolve(size))
					.catch(reject);
				return;
			}

			if (is.nodeStream(body) && is.buffer(body._buffer)) {
				return resolve(body._buffer.length);
			}

			reject(new TypeError('Unknown body type'));
		});
	}
}

Storage.HTTPError = got.HTTPError;
Storage.RequestError = got.RequestError;
Storage.NotEnoughBalance = class NotEnoughBalance extends Error {}
Storage.ServiceIsNotEnabled = class ServiceIsNotEnabled extends Error {}
Storage.ObjectIsTooLarge = class ObjectIsTooLarge extends Error {}
Storage.NoSuchKey = class NoSuchKey extends Error {}
Storage.InternalServerError = class InternalServerError extends Error {}

module.exports = Storage;
