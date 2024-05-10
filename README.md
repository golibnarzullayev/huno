## Installation

```console
$ npm install huno-server
```

Usage example

```ts
import { HunoServer, sendJson, parseJsonBody } from 'huno-server';

const app = new HunoServer();

app.get('/', function ({ req, res }) {
  sendJson(res, { message: 'Hello Huno' });
});

app.post('/', async function ({ req, res }) {
  const body = await parseJsonBody(req);

  sendJson(req, body);
});

// using params
app.get('/:id', function ({ req, res, pathParams }) {
  const id = pathParams.id;
  sendJson(res, { id: id });
});

// using query params
// url: http://localhost:3000?search=huno
app.get('/', function ({ req, res, searchParams }) {
  const search = searchParams.get('search');
  sendJson(res, { search: search });
});

app.start(3000);
```
