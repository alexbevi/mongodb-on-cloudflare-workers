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

      // Get the database and collection on which to run the operation
      const database = this.client.db("sample_mflix");
      const movies = database.collection("movies");
      // Query for a movie that has the title 'The Room'
      const query = { title: "The Room" };
      const options = {
        // Sort matched documents in descending order by rating
        sort: { "imdb.rating": -1 },
        // Include only the `title` and `imdb` fields in the returned document
        projection: { _id: 0, title: 1, imdb: 1 },
      };
      // Execute query
      const movie = await movies.findOne(query, options);
      const queryTime = Date.now() - queryStartTime;
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