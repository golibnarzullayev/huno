## Installation

```console
$ npm install huno-server
```

Usage example

```ts
import { HunoServer, sendJson, parseJsonBody } from 'huno-server';

const app = new HunoServer();

app.get('/', function ({ req, res ) {
  sendJson(res, { message: 'Hello Huno' });
});

app.post('/', function({ req, res }) {
  const body = await parseJsonBody(req);

  sendJson(req, body);
});

app.start(3000);
```
