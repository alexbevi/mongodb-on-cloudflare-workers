# Demo Cloudflare Worker with MongoDB

This is a simple Cloudflare Worker that demonstrates the usage of MongoDB and MongoDB drivers to connect to a MongoDB Atlas cluster.

The performance for connecting to Workers from MongoDb, especially when your Worker is located far from your origin MongoDB cluster, is not great. This repository is a PoC that
demonstrates that the drivers work and it is possible to connect to a MongoDB cluster, but it is not a recommendation.

https://www.cloudflare.com/en-ca/developer-platform/products/durable-objects/
https://developers.cloudflare.com/durable-objects/get-started/tutorial/
https://developers.cloudflare.com/workers/configuration/smart-placement/