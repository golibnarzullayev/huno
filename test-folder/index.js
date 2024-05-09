const Apex = require('../dist');
const { sendJson, parseJsonBody } = require('../dist');

const app = new Apex();

app.get('/:id/:customer', ({ res, params }) => {
  const id = params.id;
  const customer = params.customer;
  sendJson(res, { message: 'Hello world', id: id, customer });
});

app.post('/', async ({ req, res }) => {
  const parsedBody = await parseJsonBody(req);

  sendJson(res, { data: parsedBody });
});

app.start(3000, () => {
  console.log(`Server running on port 3000`);
});
