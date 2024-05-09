## Installation

```console
$ npm install node-server
```

Usage example

```ts
import Apex, { sendJson, parseJsonBody } from 'node-server';

const app = new Apex();

app.get('/', function ({ req, res ) {
  sendJson(res, { message: 'Hello node-server' });
});

app.post('/', function({ req, res }) {
  const body = await parseJsonBody(req);

  sendJson(req, body);
});

app.start(3000);
```
