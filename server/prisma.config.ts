import { defineConfig } from 'prisma/config'

// dotenv is loaded via the build command, not here
// This avoids issues in CI/CD where dotenv may not be installed yet

export default defineConfig({
  schema: 'prisma/schema.prisma',

  datasource: {
    db: {
      url: process.env.DATABASE_URL!,
      directUrl: process.env.DIRECT_URL,
    },
  },

  migrations: {
    path: 'prisma/migrations',
  },
})
