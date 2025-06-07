const { addExpense, updateExpense, getExpense, deleteExpense, getSingleExpense } = require('../Controller/ExpenseController');
const { authenticateToken } = require('../Middleware/AuthenticateToken');
const { expenseValidation } = require('../Middleware/ExpenseValidation');

const router = require('express').Router();

router.post('/add/expense',authenticateToken ,expenseValidation, addExpense )
router.put('/update/expense/:id', authenticateToken, expenseValidation, updateExpense);
router.delete('/delete/expense/:id', authenticateToken, deleteExpense)
router.get('/get/expense', authenticateToken,getExpense)
router.get('/get/expense/:id', authenticateToken, getSingleExpense);

module.exports = router;