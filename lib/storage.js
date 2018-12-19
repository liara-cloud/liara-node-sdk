const Minio = require('minio');

function Storage(options) {
	return new Minio.Client({
		useSSL: true,
		...options,
	});
}

module.exports = Storage;
