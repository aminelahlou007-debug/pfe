// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { Collection, Db, MongoClient, ObjectId } from "mongodb";

const rawUri = process.env.MONGODB_URI?.trim();
const isMongoUri = rawUri && /^mongodb(\+srv)?:\/\//i.test(rawUri);
const uri = isMongoUri
  ? rawUri
  : process.env.NODE_ENV === "production"
    ? null
    : "mongodb://127.0.0.1:27017/wildflower-co";
const options = {};

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient> | null = null;

// Only initialize a connection when a valid URI is present.
if (uri) {
  if (process.env.NODE_ENV === "development") {
    // Preserve client promise across HMR in development
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise!;
  } else {
    // Production: create a fresh client promise
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
} else {
  // No URI available — avoid throwing during build-time. Consumers
  // should handle `null` results from `getCollection`.
  clientPromise = null;
}

export default clientPromise;

export async function getDb(): Promise<Db> {
  if (!clientPromise) throw new Error("MONGODB_URI not configured");
  const c = await clientPromise;
  return c.db();
}

export async function getCollection<TSchema extends Record<string, unknown> = Record<string, unknown>>(
  name: string
): Promise<Collection<TSchema> | null> {
  if (!clientPromise) return null;
  try {
    const db = await getDb();
    return db.collection<TSchema>(name);
  } catch {
    return null;
  }
}

export { ObjectId };
