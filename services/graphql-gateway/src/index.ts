/**
 * GraphQL Gateway with Apollo Server
 */

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { typeDefs } from './schema/typeDefs';
import { resolvers } from './schema/resolvers';

dotenv.config();

const PORT = process.env.PORT || 4000;

async function startApolloServer() {
  const app = express();
  const httpServer = createServer(app);

  // Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  // Middleware
  app.use(
    '/graphql',
    cors<cors.CorsRequest>({
      origin: process.env.ALLOWED_ORIGINS?.split(','),
      credentials: true,
    }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        // Extract token from Authorization header
        const token = req.headers.authorization?.replace('Bearer ', '') || '';
        return { token };
      },
    })
  );

  // Health check
  app.get('/health', (_req, res) => {
    res.json({
      success: true,
      message: 'GraphQL Gateway is running',
      timestamp: new Date().toISOString(),
    });
  });

  await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`HTTP Port: ${PORT.toString().padEnd(30)}`);
}

startApolloServer().catch((error) => {
  console.error('❌ Failed to start GraphQL Gateway:', error);
  process.exit(1);
});
