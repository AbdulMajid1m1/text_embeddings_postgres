// pgvectorSetup.js
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PGVectorStore } from 'langchain/vectorstores/pgvector';

const config = {
  postgresConnectionOptions: {
    host: "127.0.0.1",
    port: 5433,
    user: "myuser",
    password: "ChangeMe",
    database: "api",
  },
  tableName: "embeddings",
  columns: {
    idColumnName: "id",
    vectorColumnName: "vector",
    contentColumnName: "content",
    metadataColumnName: "metadata",
  },
};

let pgvectorStore;

export const initializePgVectorStore = async () => {
  pgvectorStore = await PGVectorStore.initialize(new OpenAIEmbeddings(), config);
};

export const getPgVectorStore = () => {
  if (!pgvectorStore) {
    throw new Error("PGVectorStore is not initialized");
  }
  return pgvectorStore;
};

export const closePgVectorStore = async () => {
  if (pgvectorStore) {
    await pgvectorStore.end();
  }
};
