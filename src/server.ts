import http, { RequestListener, Server as HttpServer } from 'node:http';

export class Server {
  private readonly handler: RequestListener;
  private app: HttpServer | null = null;

  constructor(handler: RequestListener) {
    this.handler = handler;
  }

  public start(port: number, callback?: () => void): void {
    this.app = http.createServer(this.handler);
    this.app.listen(port, callback);
  }

  public stop(): void {
    if (this.app) {
      this.app.close();
    }
  }
}
