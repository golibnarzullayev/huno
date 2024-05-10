import { RequestListener, ServerResponse } from 'node:http';
import { match as pathMatch } from 'path-to-regexp'
import { Server } from './server';
import { HttpError, HttpMethod, Middleware, RouteHandler, RouteWithParams } from './types';
import { sendJson } from './send-json';

export class HunoServer {
  private readonly server: Server;
  private readonly routes: RouteWithParams[];
  private readonly middleware: Middleware[];

  constructor() {
    this.routes = [];
    this.middleware = [];
    this.server = this.createServer();
  }

  public use(middleware: Middleware): void {
    this.middleware.push(middleware);
  }

  public get(path: string, handler: RouteHandler): void {
    this.addRoute(HttpMethod.Get, path, handler);
  }

  public post(path: string, handler: RouteHandler): void {
    this.addRoute(HttpMethod.Post, path, handler);
  }

  public put(path: string, handler: RouteHandler): void {
    this.addRoute(HttpMethod.Put, path, handler);
  }

  public delete(path: string, handler: RouteHandler): void {
    this.addRoute(HttpMethod.Delete, path, handler);
  }

  public patch(path: string, handler: RouteHandler): void {
    this.addRoute(HttpMethod.Patch, path, handler);
  }

  private addRoute(method: HttpMethod, path: string, handler: RouteHandler): void {
    const match = path === undefined ? undefined : pathMatch<Record<string, string>>(path);

    this.routes.push({ method, path, match, handler });
  };

  private handleRequest(routesWithMatch: RouteWithParams[]): RequestListener {
    return async (request, response) => {
      const { pathname, searchParams } = new URL(request.url ?? '', `http://${request.headers.host}`);
      let matched = false;
      const processRoute = async (routeIndex: number) => {
        if (routeIndex > routesWithMatch.length - 1) {
          return;
        }
        const route = routesWithMatch[routeIndex];
        const { method, match, handler } = route;
        if (method !== undefined && method !== request.method) {
          return;
        }
        let pathParams: Record<string, string> = {};
        if (match !== undefined) {
          const matchResult = match(pathname);
          if (matchResult === false) {
            return;
          }
          pathParams = matchResult.params;
        }
        matched = true;
        let nextIsCalled = false;
        const next = () => {
          nextIsCalled = true;
          return processRoute(routeIndex + 1);
        };
        try {
          const result = handler({ req: request, res: response, pathParams, searchParams, next });
          if (result instanceof Promise) {
            await result;
          }
          if (!nextIsCalled) {
            await next();
          }
        } catch (error) {
          let statusCode = 500;
          let message: string | object = 'Something went wrong';
          if (error instanceof Error) {
            message = error.message;
          }
          if (error instanceof HttpError) {
            statusCode = error.statusCode;
            if (typeof error.details === 'string') {
              message = error.details;
            }
          }
          sendJson(response, { message }, statusCode);
          console.error(error);
        }
      };
      for (let routeIndex = 0; routeIndex < routesWithMatch.length; routeIndex++) {
        await processRoute(routeIndex);
      }
      if (!matched) {
        sendJson(response, { message: `No route for ${request.method} ${pathname}` }, 404);
      }
    };
  }

  public handleError = (error: Error | HttpError, response: ServerResponse) => {
    let statusCode = 500;
    let message: string | object = 'Something went wrong';

    message = error.message;

    if (error instanceof HttpError) {
      statusCode = error.statusCode;
      if (typeof error.details === 'string') {
        message = error.details;
      }
    }

    sendJson(response, { message }, statusCode);
    console.error(error);
  };

  private createServer = (): Server => {
    return new Server(this.handleRequest(this.routes));
  }

  public start(port: number, callback?: () => void): void {
    this.server.start(port, callback);
  }

  public stop(): void {
    this.server.stop();
  }
}
