// import { MongoDBConnector } from './MongoDBConnector';
import { MongoDBDurableConnector } from './MongoDBDurableConnector';

interface Env {
  MONGODB_URI: string;
  MY_DURABLE_OBJECT: DurableObjectNamespace<MongoDBDurableConnector>;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      const id = env.MY_DURABLE_OBJECT.idFromName("mongodb-connector");
      const proxy = env.MY_DURABLE_OBJECT.get(id);
      // proxy = new MongoDBConnector(env);

      const result = await proxy.getMovie();
      return Response.json(result);
    } catch (error) {
      console.error('Error:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return new Response(`Error: ${message}`, { status: 500 });
    }
  }
} satisfies ExportedHandler<Env>;

export { MongoDBDurableConnector };