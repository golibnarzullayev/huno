import http from 'node:http';
import { Server } from './server';
import { Route } from './route';
import { HttpMethod, Middleware, RouteHandler } from './types';
import { sendJson } from './send-json';

export class Apex {
  private readonly server: Server;
  private readonly routes: Route[];
  private readonly middleware: Middleware[];

  constructor() {
    this.server = new Server(this.handleRequest.bind(this));
    this.routes = [];
    this.middleware = [];
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
    this.routes.push(new Route(method, path, handler));
  }

  private async handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    const matchingRoute = this.routes.find(
      (route) => route.method === req.method && route.matches(req.url),
    );

    if (matchingRoute) {
      const params = matchingRoute.extractParams(req.url as string);

      for (const middleware of this.middleware) {
        await new Promise((resolve: any) => middleware(req, res, resolve));
      }
      await matchingRoute.handler({ req, res, params });
    } else {
      sendJson(res, { message: `No route for ${req.method} ${req.url}` }, 404);
    }
  }

  public start(port: number, callback?: () => void): void {
    this.server.start(port, callback);
  }

  public stop(): void {
    this.server.stop();
  }
}
