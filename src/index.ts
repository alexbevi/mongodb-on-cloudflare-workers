import { MongoDBConnector } from './MongoDBConnector';
// import { MongoDBDurableConnector } from './MongoDBDurableConnector';
interface Env {
  MONGODB_URI: string;
  // MY_DURABLE_OBJECT: DurableObjectNamespace<MongoDBConnector>;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const { searchParams } = new URL(request.url)
    let durable = searchParams.get('durable')
    try {
      // const id = env.MY_DURABLE_OBJECT.idFromName("mongodb-connector");
      // const stub = env.MY_DURABLE_OBJECT.get(id);

      const proxy = new MongoDBConnector(env)
      const result = await proxy.getMovie();
      return Response.json(result);
    } catch (error) {
      console.error('Error:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return new Response(`Error: ${message}`, { status: 500 });
    }
  }
} satisfies ExportedHandler<Env>;

export { MongoDBConnector };