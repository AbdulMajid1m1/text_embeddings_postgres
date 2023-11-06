// routes/schemaRoutes.js
import express from 'express';
import { bulkInsert, semanticSearch, singleInsert } from '../controllers/SchemaController.js';

const router = express.Router();

router.post('/createSchema', singleInsert);
router.get('/findSimilarRecords', semanticSearch);
router.post('/bulkInsert', bulkInsert);

export default router;
