import { DurableObject } from "cloudflare:workers";
import { MongoClient } from 'mongodb';

interface Env {
  MONGODB_URI: string;
}

export class MongoDBDurableConnector extends DurableObject {
  private env: Env;
  private client: MongoClient;

  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
    this.env = env;
    this.client = new MongoClient(this.env.MONGODB_URI);
  }

  async getMovie() {
    try {
      const queryStartTime = Date.now();

      await this.client.connect();
      const db = this.client.db("sample_mflix");
      const movies = db.collection("movies");

      const movie = await movies.findOne({ title: 'Back to the Future' });
      const queryTime = Date.now() - queryStartTime;

      if (!movie) {
        throw new Error('Movie not found');
      }

      return {
        movie: {
          ...movie,
          _id: movie._id.toString(),
        },
        queryTime
      };

    } catch (error) {
      console.error('MongoDB error:', error);
      throw error;
    }
  }
}