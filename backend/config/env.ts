import dotenv from "dotenv";

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

const result = dotenv.config({
  path: envFile,
});

if (result.error) {
  console.error(`❌ Failed to load ${envFile}`);
  throw result.error;
}

console.log(`◇ Loaded environment from ${envFile}`);