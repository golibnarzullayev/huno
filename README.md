## Installation

```console
$ npm install apex
```

Usage example

```ts
import Apex, { sendJson, parseJsonBody } from 'apex';

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
