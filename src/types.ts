import http, { IncomingMessage, ServerResponse } from 'node:http';
import { MatchFunction } from 'path-to-regexp';

export enum HttpMethod {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
  Patch = 'PATCH',
}

type HandlerParams = {
  req: IncomingMessage;
  res: ServerResponse;
  pathParams: Record<string, string>;
  searchParams: URLSearchParams;
  next: () => Promise<void>;
};

export type RouteHandler = (params: HandlerParams) => void | Promise<void>;

export type Route = {
  method?: HttpMethod;
  path?: string;
  handler: RouteHandler;
}

export type RouteWithParams = Route & {
  match?: MatchFunction<Record<string, string>>
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

export class HttpError extends Error {
  constructor(
    public readonly details: unknown,
    public readonly statusCode: number,
  ) {
    super(typeof details === 'string' ? details : undefined);
  }
}
