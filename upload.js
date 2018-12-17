const fs = require('fs');

const Liara = require('.');

const { Storage } = new Liara({
  namespace: 'test-storage',
  secret_key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI1YmFmOWRlZjc1ZjlkOTAwMTMzZDQ2OGUiLCJpYXQiOjE1MzgyMzU4ODd9.H75QhhlF6dXhvKYL2y5w9IgoOECRacY7oI_OVSLF5G0',
});

async function upload() {
	try {
		await Storage.put('/README.md', fs.createReadStream('./README.md'));
		console.log('Object put successfully.');

	} catch (error) {
		// if(error instanceof Storage.ServiceIsNotEnabled) {
		// 	return console.error('===>', error.message);
		// }

		// if(error instanceof Storage.NotEnoughBalance) {
		// 	return console.error('===>', error.message);
		// }

		// if(error instanceof Storage.HTTPError) {
		// 	return console.error(error.message);
		// }

		console.error(error);
	}
}

async function list() {
	const list = await storage.list();
	console.log(list);
}

async function get() {
	const obj = storage.getStream('Slice2.png');

	obj.on('error', function (error) {
	});

	obj.pipe(fs.createWriteStream('out.png'));
}

async function mkdir() {
	await storage.makeDirectory('my-dir');
	await storage.makeDirectory('my-dir/boom');
	await storage.makeDirectory('my-dir/2');
	await storage.makeDirectory('another/sub/');
}

async function stat() {
	try {
		console.log(await storage.metadata('my-dir'));
	} catch (error) {
		if(error instanceof Storage.NotFound) {
			console.log('not found');
		}
	}
	console.log(await storage.size('1.txt'));
	console.log(await storage.lastModified('1.txt'));
}

async function download() {
	await storage.download('Slice.png', 'boom.png');
}

async function deleteObject() {
	await storage.deleteDirectory('my-dir');
}

async function dirs() {
	console.log(await storage.directories('my-dir'));
}

upload()
	.then(console.log);
