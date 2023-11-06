import dotenv from 'dotenv';
dotenv.config();

export const baseConfig = {
    postgresConnectionOptions: {
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DB,
        password: "1panzer00",
        port: process.env.POSTGRES_PORT,
    }
};

export const gpc1Config = {

    postgresConnectionOptions: {
        user: 'postgres',
        host: 'localhost',
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: 5432,
    },
    tableName: "gpc1",
    columns: {
        idColumnName: "id",
        vectorColumnName: "vector",
        contentColumnName: "content",
        metadataColumnName: "metadata",
    }
};

export const hsCodeConfig = {
    ...baseConfig,
    tableName: "hs_code",
    columns: {
        idColumnName: "CNKEY",
        vectorColumnName: "DescriptionENEmbedding",
        contentColumnName: "DescriptionEN",
        metadataColumnName: "metadata",
    }
};
