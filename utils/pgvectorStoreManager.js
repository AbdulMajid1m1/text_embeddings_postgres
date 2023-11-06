import { PGVectorStore } from 'langchain/vectorstores/pgvector';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

const stores = {};

const initializeStore = async (tableConfig) => {
    if (!stores[tableConfig.tableName]) {
        stores[tableConfig.tableName] = await PGVectorStore.initialize(
            new OpenAIEmbeddings(),
            tableConfig
        );
    }
    return stores[tableConfig.tableName];
};

export const getPGVectorStore = async (tableConfig) => {
    return await initializeStore(tableConfig);
};

export const closeAllPGVectorStores = async () => {
    for (const store of Object.values(stores)) {
        await store.end();
    }
};

