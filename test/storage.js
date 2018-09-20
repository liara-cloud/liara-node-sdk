import test from 'ava';
import { join } from 'path';
import { createReadStream } from 'fs';

import { Storage } from '..';

const storage = new Storage({
	secret_key: 'my key',
});

test('get string body size', async t => {
	const size = await storage.getBodySize('wow');
	t.is(size, 3);
});

test('get buffer body size', async t => {
	const size = await storage.getBodySize(Buffer('boom'));
	t.is(size, 4);
});

test('get readable stream body size', async t => {
	const stream = createReadStream(join(__dirname, 'fixtures/text.txt'));

	const size = await storage.getBodySize(stream)
	t.is(size, 8);
});
