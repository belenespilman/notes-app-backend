import { config } from 'dotenv';
config();

export const environment = {
  postgres: {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    entitiesDir: process.env.DATABASE_ENTITIES_DIR,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  saltRounds: Number(process.env.SALT_ROUNDS),
};
