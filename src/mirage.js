import { createServer, Model, Response } from 'miragejs';
import { authorizedUsers } from './mockUserDB';

export function makeServer() {
  const server = createServer({
    models: {
      user: Model,
    },

    seeds(server) {
        authorizedUsers.forEach(user => server.create('user', user));
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
          { message: 'Incorrect email or password' }
        );
      });
    },
  });

  return server;
}
