## Installation

```console
$ npm install apex
```

Usage examples

```js
const Apex = require('apex');

const { sendJson, parseJsonBody } = require('zedpress');

const app = new Apex();

app.get('/', function ({ req, res ) {
  sendJson(res, { message: 'Hello apex' });
});

app.post('/', function({ req, res }) {
  const body = await parseJsonBody(req);

  sendJson(req, body);
});

app.start(3000);
```

```ts
import Apex, { sendJson, parseJsonBody } from 'apex';

const app = new Apex();

app.get('/', function ({ req, res ) {
  sendJson(res, { message: 'Hello zedpress' });
});

app.post('/', function({ req, res }) {
  const body = await parseJsonBody(req);

  sendJson(req, body);
});

app.start(3000);
```
