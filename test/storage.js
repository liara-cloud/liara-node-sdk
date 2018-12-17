import test from 'ava';
import nock from 'nock';
import { join } from 'path';
import { createReadStream } from 'fs';

import Liara from '..';

const API_URL = 'https://api.liara.ir';
const NAMESPACE = 'my-namespace';
const APIMock = nock(API_URL);

const { Storage } = new Liara({
	namespace: NAMESPACE,
	secret_key: 'my key',
});

test('get string body size', async t => {
	const size = await Storage._getBodySize('wow');
	t.is(size, 3);
});

test('get buffer body size', async t => {
	const size = await Storage._getBodySize(Buffer.from('boom'));
	t.is(size, 4);
});

test('get readable stream body size', async t => {
	const stream = createReadStream(join(__dirname, 'fixtures/text.txt'));

	const size = await Storage._getBodySize(stream)
	t.is(size, 8);
});

test('upload a buffer', async t => {
	APIMock.post('/v1/objects').reply(200, { code: 'success' });

	const key = 'my-object.txt';
	const result = await Storage.put(key, Buffer.from('the content'));

	t.is(result.size, 11);
	t.is(result.path, `${API_URL}/v1/storage/${NAMESPACE}/${key}`);
});

test('list objects', async t => {
	APIMock.get(/\/v1\/objects\/list/).reply(200, {
		objects: [{ key: 'first.txt', size: 1, lastModified: 'boom' }],
	});

	const result = await Storage.files();

	t.true(Array.isArray(result));
	t.is(result.length, 1);
	t.deepEqual(result[0], { key: 'first.txt', size: 1, lastModified: 'boom' });
});
