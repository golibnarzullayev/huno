import http from 'node:http';

export enum HttpMethod {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
  Patch = 'PATCH',
}

export interface RouteHandler {
  (params: {
    req: http.IncomingMessage;
    res: http.ServerResponse;
    params?: { [key: string]: string };
  }): Promise<void> | void;
}

export type Middleware = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  next: () => void,
) => void;

export const HEADERS = {
  CONTENT_TYPE: 'content-type',
} as const;

export const CONTENT_TYPES = {
  JSON: 'application/json',
} as const;
