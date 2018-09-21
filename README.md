# liara-js-sdk [![Build Status](https://travis-ci.org/liara-ir/liara-js-sdk.svg?branch=master)](https://travis-ci.org/liara-ir/liara-js-sdk)

>


<div dir="rtl">
	<h2>نصب</h2>
</div>

```
$ npm install @liara/sdk
```


<div dir="rtl">
	<h2>نحوه‌ی استفاده</h2>
</div>

```js
const LiaraSDK = require('@liara/sdk');

const storage = new LiaraSDK.Storage({
  secret_key: 'YOUR_SECRET_KEY'
});

storage.put('file.txt', 'Hello World!');
```

<div dir="rtl">
	<h2>مستندات</h2>
	برای مطالعه‌ی مستندات فارسی، به این لینک مراجعه کنید.
</div>

## License

MIT © [Liara](https://github.com/liara-ir)
