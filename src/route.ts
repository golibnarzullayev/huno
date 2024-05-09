import { HttpMethod, RouteHandler } from './types';

export class Route {
  public readonly method: HttpMethod;
  public readonly path: string;
  public readonly handler: RouteHandler;
  public readonly pathSegments: string[];

  constructor(method: HttpMethod, path: string, handler: RouteHandler) {
    this.method = method;
    this.path = path;
    this.handler = handler;

    this.pathSegments = path.split('/').filter((segment) => segment !== '');
  }

  public matches(url?: string): boolean {
    const urlSegments = url?.split('/').filter((segment) => segment !== '');
    if (urlSegments?.length !== this.pathSegments.length) return false;

    for (let i = 0; i < this.pathSegments.length; i++) {
      const pathSegment = this.pathSegments[i];
      if (pathSegment.startsWith(':')) {
        if (!urlSegments[i]) return false;
      } else if (pathSegment !== urlSegments[i]) {
        return false;
      }
    }

    return true;
  }

  public extractParams(url: string): { [key: string]: string } | undefined {
    if (!this.matches(url)) return undefined;

    const params: { [key: string]: string } = {};
    const urlSegments = url.split('/').filter((segment) => segment !== '');

    for (let i = 0; i < this.pathSegments.length; i++) {
      const pathSegment = this.pathSegments[i];
      if (pathSegment.startsWith(':')) {
        params[pathSegment.slice(1)] = urlSegments[i];
      }
    }

    return params;
  }
}
