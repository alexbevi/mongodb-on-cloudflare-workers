import { MongoClient } from 'mongodb';

interface Env {
  MONGODB_URI: string;
}

export class MongoDBConnector {
  private env: Env;
  private client: MongoClient;

  constructor(env: Env) {
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