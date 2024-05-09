## Installation

```console
$ npm install huno
```

Usage example

```ts
import Apex, { sendJson, parseJsonBody } from 'huno';

const app = new Apex();

app.get('/', function ({ req, res ) {
  sendJson(res, { message: 'Hello Huno });
});

app.post('/', function({ req, res }) {
  const body = await parseJsonBody(req);

  sendJson(req, body);
});

app.start(3000);
```
