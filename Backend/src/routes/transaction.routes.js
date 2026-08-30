import express from 'express'

import protect from '../middleware/auth.middleware.js'

import{
    createTransaction,
    getTransactions,
    getTransaction,
    updateTransaction,
    deleteTransaction,
    getSummary
} from '../controllers/transaction.controller.js'

const router=express.Router()

router.use(protect)
router.post('/',createTransaction);
router.get('/',getTransactions);
router.get('/summary/overview',getSummary);
router.get('/:id',getTransaction);

router.put('/:id',updateTransaction);
router.delete("/:id", deleteTransaction);

export default router