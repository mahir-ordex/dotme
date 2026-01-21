module.exports = {
    schema: 'prisma/schema.prisma',
    datasource: {
        db: {
            url: process.env.DATABASE_URL,
            //pV: process.env.DIRECT_URL, // Optional, can add if needed
        },
    },
};
