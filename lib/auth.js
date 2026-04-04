import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";

const mongoUrl = process.env.MONGODB_URI || process.env.MONGO_URL;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!mongoUrl) {
  throw new Error("Missing MongoDB connection string. Set MONGODB_URI.");
}

const mongoClient = new MongoClient(mongoUrl);
const mongoDb = mongoClient.db();

const socialProviders =
  googleClientId && googleClientSecret
    ? {
        google: {
          prompt: "select_account",
          clientId: googleClientId,
          clientSecret: googleClientSecret,
        },
      }
    : undefined;

export const auth = betterAuth({
  database: mongodbAdapter(mongoDb, {
    client: mongoClient,
    transaction: false,
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
});
