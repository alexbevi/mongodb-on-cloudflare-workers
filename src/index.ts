import { MongoClient, ServerApiVersion } from 'mongodb';

/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

interface Env {
  MONGODB_URI: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const client = new MongoClient(env.MONGODB_URI);
    const events = ["commandStarted","commandSucceeded","serverHeartbeatFailed","serverOpening","serverClosed","topologyOpening",
      "topologyClosed","connectionCheckOutStarted","connectionCheckedIn","connectionPoolCleared",
      "connectionClosed","connectionPoolClosed"];
    const messages: string[] = [];
    for(var i = 0; i < events.length; i++) {
      client.on(events[i], (event) => {
        messages.push(`${Date.now()} | ${JSON.stringify(event)}`);
      });
    }

    try {
      const queryStartTime = Date.now();

			await client.connect();

      const db = client.db("sample_mflix");
      const movies = db.collection("movies");

      // Find the movie
      const movie = await movies.findOne({ title: 'Back to the Future' });

			const queryTime = Date.now() - queryStartTime;

      if (!movie) {
        return new Response('Movie not found', { status: 404 });
      }

      return Response.json({
				messages,
        movie,
				queryTime
			});

    } catch (error) {
      console.error('MongoDB error:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return new Response(`Error: ${message}`, { status: 500 });
    } finally {
      await client.close();
    }
  }
} satisfies ExportedHandler<Env>;
