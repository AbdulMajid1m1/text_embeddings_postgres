// dataController.js

import fs from 'fs';
import csvParser from 'csv-parser';
import multer from 'multer';
import { gpc1Config, hsCodeConfig } from '../config/dbConfig.js';
import { getPGVectorStore } from '../utils/pgvectorStoreManager.js';
import { createObjectCsvWriter } from 'csv-writer';


// // Helper function to insert a batch of records
// const insertBatch = async (records, tableConfig) => {
//     const pgvectorStore = await getPGVectorStore(tableConfig);

//     const documents = records.map(record => ({
//         pageContent: `${record.YourTextField}`, // Modify according to your data schema
//         metadata: record,
//     }));

//     await pgvectorStore.addDocuments(documents);
// };

// // API endpoint for bulk insert
// export const bulkInsert = async (req, res) => {
//     const upload = multer({ dest: 'temp/' }).single('file');

//     upload(req, res, async (err) => {
//         if (err) {
//             return res.status(400).json({ message: err.message });
//         }

//         try {
//             const filePath = req.file.path;
//             const allRecords = await readCSV(filePath);
//             const batchSize = 500;
//             const tableName = req.body.tableName;
//             let tableConfig = tableName === 'gpc1' ? gpc1Config : hsCodeConfig;

//             for (let i = 0; i < allRecords.length; i += batchSize) {
//                 const batch = allRecords.slice(i, i + batchSize);
//                 await insertBatch(batch, tableConfig);
//             }

//             res.status(200).json({ message: 'Data imported successfully.' });
//         } catch (error) {
//             res.status(500).send({ message: error.message });
//         }
//     });
// };


// // Helper function to read data from CSV file
const readCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
};

// Helper function to write data to CSV file
const writeCSV = async (filePath, records) => {
    const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: Object.keys(records[0]).map(key => ({ id: key, title: key })),
        append: false
    });

    await csvWriter.writeRecords(records);
};

// Helper function to insert a batch of records
const insertBatch = async (records, tableConfig) => {
    const pgvectorStore = await getPGVectorStore(tableConfig);

    const documents = records.map(record => ({
        pageContent: `${record.BrickTitle} ${record.AttributeValueTitle}`, // Modify according to your data schema
        metadata: record,
    }));

    await pgvectorStore.addDocuments(documents);
};

// API endpoint for bulk insert
export const bulkInsert = async (req, res) => {
    const upload = multer({ dest: 'temp/' }).single('file');

    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        try {
            const originalFilePath = req.file.path;
            const tempFilePath = 'temp/RemainingRecords.csv';
            fs.renameSync(originalFilePath, tempFilePath);

            let allRecords = await readCSV(tempFilePath);
            const batchSize = 500;
            const tableName = req.body.tableName;
            let tableConfig = tableName === 'gpc1' ? gpc1Config : hsCodeConfig;

            while (allRecords.length > 0) {
                const batch = allRecords.slice(0, batchSize);
                await insertBatch(batch, tableConfig);

                // Remove the processed batch from allRecords
                allRecords = allRecords.slice(batchSize);

                // Update the RemainingRecords.csv file
                if (allRecords.length > 0) {
                    await writeCSV(tempFilePath, allRecords);
                } else {
                    // Clear the file if no records are left
                    fs.writeFileSync(tempFilePath, '');
                }
            }

            res.status(200).json({ message: 'Data imported successfully.' });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Error during data import' });
        }
    });
};


// API endpoint for single insert
export const singleInsert = async (req, res) => {
    try {
        const record = req.body.data;
        const tableName = req.body.tableName;
        const tableConfig = tableName === 'gpc1' ? gpc1Config : hsCodeConfig;
        const pgvectorStore = await getPGVectorStore(tableConfig);

        const document = {
            pageContent: `${record.BrickTitle} ${record.AttributeValueTitle}`, // Modify according to your data schema
            metadata: record,
        };

        await pgvectorStore.addDocuments([document]);
        res.status(200).send({ message: 'Record inserted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
};

// API endpoint for semantic search
export const semanticSearch = async (req, res) => {
    try {
        const queryText = req.query.text;
        const tableName = req.query.tableName;
        const tableConfig = tableName === 'gpc1' ? gpc1Config : hsCodeConfig;
        const pgvectorStore = await getPGVectorStore(tableConfig);

        const results = await pgvectorStore.similaritySearch(queryText, 10); // Adjust the number as needed
        return res.status(200).json(results);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
