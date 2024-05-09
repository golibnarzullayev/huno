import http from 'node:http';

export class Server {
  private readonly handler: http.RequestListener;
  private app: http.Server | null = null;

  constructor(handler: http.RequestListener) {
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
