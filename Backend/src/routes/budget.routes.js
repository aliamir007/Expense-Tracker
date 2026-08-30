import express from 'express'

import protect from '../middleware/auth.middleware.js'

import {
    getBudget,
    updateBudget
} from '../controllers/budget.controller.js'

const router = express.Router()

router.use(protect)
router.get('/', getBudget)
router.put('/', updateBudget)

export default router
