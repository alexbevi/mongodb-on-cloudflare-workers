import { DurableObject, DurableObjectState } from "cloudflare:workers";
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

      const database = this.client.db("sample_mflix");
      const movies = database.collection("movies");
      const query = { title: "The Room" };
      const options = {
        sort: { "imdb.rating": -1 },
        projection: { title: 1, imdb: 1 },
      };
      const movie = await movies.findOne(query, options);

      const queryTime = Date.now() - queryStartTime;
      return {
        movie: {
          ...movie,
          // Fixes "Error: Could not serialize object of type "_ObjectId". This type does not support serialization.""
          _id: movie._id.toString()
        },
        queryTime
      };

    } catch (error) {
      console.error('MongoDB error:', error);
      throw error;
    }
  }
}