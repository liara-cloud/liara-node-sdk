# liara-js-sdk [![Build Status](https://travis-ci.org/liara-ir/liara-js-sdk.svg?branch=master)](https://travis-ci.org/liara-ir/liara-js-sdk)

>


## Install

```
$ npm install @liara/sdk
```


## Usage

```js
const LiaraSDK = require('@liara/sdk');

const storage = new LiaraSDK.Storage({
	secret_key: 'YOUR_SECRET_KEY'
});

storage.put('file.txt', 'Hello World!');
```

## Documentation

برای مطالعه‌ی مستندات فارسی، به این لینک مراجعه کنید.

## License

MIT © [Liara](https://github.com/liara-ir)
