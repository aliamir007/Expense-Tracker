import User from '../models/User.js';

const getBudget = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).select('budget currency');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                budget: user.budget,
                currency: user.currency
            }
        });

    } catch (error) {
        next(error);
    }
};

const updateBudget = async (req, res, next) => {
    try {
        const { budget, currency } = req.body;

        if (budget === undefined || budget === null || budget < 0) {
            return res.status(400).json({
                success: false,
                message: "A valid budget amount is required"
            });
        }

        const update = { budget };
        if (currency) update.currency = currency;

        const user = await User.findByIdAndUpdate(
            req.userId,
            update,
            { new: true, runValidators: true }
        ).select('budget currency');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Budget updated successfully",
            data: {
                budget: user.budget,
                currency: user.currency
            }
        });

    } catch (error) {
        next(error);
    }
};

export {
    getBudget,
    updateBudget
};
