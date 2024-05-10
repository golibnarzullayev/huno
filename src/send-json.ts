import { type ServerResponse } from 'node:http';

export const sendJson = (response: ServerResponse, payload: unknown, statusCode = 200) => {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(payload));
};
