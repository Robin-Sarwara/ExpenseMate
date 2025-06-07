const joi = require('joi');

const expenseValidation = (req, res, next) => {
    const schema = joi.object({
        amount: joi.number().positive().required(),
        description: joi.string().min(3).max(500).required(),
        category: joi.string().required().valid(
            'Food & Dining',
            'Transportation',
            'Shopping',
            'Entertainment',
            'Healthcare',
            'Bills & Utilities',
            'Education',
            'Travel',
            'Business',
            'Technology',
            'Personal',
            'Home & Living',
            'Other'
        ),
        paymentMethod: joi.string().required().valid(
           'Cash', 'Credit Card', 'Debit Card', 'Online Payment', 'UPI', 'Wallet', 'Net Banking', 'Other'
        ),
        notes: joi.string().optional().max(500).allow(''),
        expenseDate: joi.date().optional()
    });

    const {error} = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next(); 
}

module.exports = {expenseValidation};