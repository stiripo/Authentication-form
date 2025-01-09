import { createServer, Model, Response } from 'miragejs';

export function makeServer() {
  const server = createServer({
    models: {
      user: Model,
    },

    seeds(server) {
      server.create('user', { email: 'test@example.com', password: 'password123' });
    },

    routes() {
      this.namespace = 'api';
      this.post('/authenticate', (schema, request) => {
        const { email, password } = JSON.parse(request.requestBody);

        const user = schema.users.findBy({ email, password });
        if (user) {
          return new Response(
            200,
            { 'Content-Type': 'application/json' },
            { token: 'mock-token' }
          );
        }

        return new Response(
          400,
          { 'Content-Type': 'application/json' },
          { message: 'Authentication failed' }
        );
      });
    },
  });

  return server;
}
