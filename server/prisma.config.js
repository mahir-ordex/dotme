const { defineConfig } = require('prisma/config');

module.exports = defineConfig({
    schema: 'prisma/schema.prisma',
    datasource: {
        db: {
            url: process.env.DATABASE_URL,
            // directUrl: process.env.DIRECT_URL, // Optional, can add if needed
        },
    },
});
