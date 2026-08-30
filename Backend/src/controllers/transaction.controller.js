import Transaction from "../models/Transaction.js";

const createTransaction = async (req, res, next) => {
    try {
        const {
            title,
            amount,
            type,
            category,
            description,
            date,
            priority,
            quantity
        } = req.body;

        if (!title || amount === undefined || !type || !category) {
            return res.status(400).json({
                success: false,
                message: "Title, amount, type and category are required"
            });
        }

        const transaction = await Transaction.create({
            user: req.userId,
            title,
            amount,
            type,
            category,
            description: description || '',
            date,
            priority: priority || 'medium',
            quantity: quantity || 1
        });

        return res.status(201).json({
            success: true,
            message: "Transaction created successfully",
            data: transaction
        });

    } catch (error) {
        next(error);
    }
};

const getTransactions = async (req, res, next) => {
    try {
        const transactions = await Transaction.find({
            user: req.userId
        }).sort({ date: -1 });

        return res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions
        });

    } catch (error) {
        next(error);
    }
};

// GET SINGLE TRANSACTION
const getTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: transaction
        });

    } catch (error) {
        next(error);
    }
};

// UPDATE TRANSACTION
const updateTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.userId
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Transaction updated successfully",
            data: transaction
        });

    } catch (error) {
        next(error);
    }
};

const deleteTransaction=async (req,res,next)=>{
    try{
        const transaction=await Transaction.findOneAndDelete({
            _id:req.params.id,
            user: req.userId
        })
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }
        return res.status(200).json({
            success:true,
            message:'Transaction Deleted Successfully'
        })
    }catch(error){
        next(error);
    }
}
const getSummary = async (req, res, next) => {
    try {
        const result = await Transaction.aggregate([
            {
                $match: {
                    user: req.userId
                }
            },
            {
                $group: {
                    _id: "$type",
                    total: {
                        $sum: "$amount"
                    }
                }
            }
        ]);

        let totalIncome = 0;
        let totalExpense = 0;

        result.forEach((item) => {
            if (item._id === "income") {
                totalIncome = item.total;
            }

            if (item._id === "expense") {
                totalExpense = item.total;
            }
        });

        return res.status(200).json({
            success: true,
            data: {
                totalIncome,
                totalExpense,
                balance: totalIncome - totalExpense
            }
        });

    } catch (error) {
        next(error);
    }
};
export {
    createTransaction,
    getTransactions,
    getTransaction,
    updateTransaction,
    deleteTransaction,
    getSummary
}


