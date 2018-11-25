# liara-node-sdk [![Build Status](https://travis-ci.org/liara-ir/liara-node-sdk.svg?branch=master)](https://travis-ci.org/liara-ir/liara-node-sdk)

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
const Liara = require('@liara/sdk')

const { Storage } = new Liara({
  namespace: 'YOUR_NAMESPACE',
  secret_key: 'YOUR_SECRET_KEY'
})

Storage.put('file.txt', 'Hello World!')
  .then(result => {
    console.log('file.txt uploaded successfully.')
  })
```

<div dir="rtl">
	<h2>مستندات</h2>
	برای مطالعه‌ی مستندات فارسی، به این لینک مراجعه کنید:
	<a href="https://docs.liara.ir">مستندات لیارا</a>
</div>

## License

MIT © [Liara](https://github.com/liara-ir)
