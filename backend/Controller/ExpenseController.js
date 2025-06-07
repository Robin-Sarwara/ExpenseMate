const User = require("../Models/user");
const Expense = require("../Models/expense");
const e = require("express");

const addExpense = async (req, res) => {
  try {
    const { amount, paymentMethod, notes, description, category, expenseDate } =
      req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    console.log(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newExpense = new Expense({
      userId,
      amount,
      description,
      category,
      expenseDate: expenseDate ? new Date(expenseDate) : new Date(),
      paymentMethod,
      notes,
    });
    await newExpense.save();
    return res
      .status(201)
      .json({ message: "Expense added successfully", expense: newExpense });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const updateExpense = async(req, res) =>{
    try {
        const {amount, paymentMethod, notes, description, category, expenseDate } = req.body;
        const expenseId = req.params.id;
        if (!expenseId) {
            return res.status(400).json({ message: "Expense ID is required" });
        }
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const expense = await Expense.findByIdAndUpdate(expenseId, {
            amount,
            description,
            category,
            expenseDate: expenseDate ? new Date(expenseDate) : new Date(),
            paymentMethod,
            notes
        }, { new: true });
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        return res.status(200).json({message:"Expense updated successfully", updatedExpense:expense})
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const deleteExpense = async (req, res) => {
    try {
       const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const expenseId = req.params.id;
    if (!expenseId) {
        return res.status(400).json({ message: "Expense ID is required" });
    }
    const expense = await Expense.findByIdAndDelete(expenseId);
    if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
    }
    return res.status(200).json({ message: "Expense deleted successfully" }); 
    } catch (error) {
       return res.status(500).json({ message: "Internal server error", error: error.message });
    }
    

}

    const getExpense = async(req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);   
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Period filter logic
    const { period, year, month } = req.query;
    let filter = { userId };
    if (period) {
      const now = new Date();
      let start, end;
      switch (period) {
        case 'today':
          start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
          break;
        case 'week':
          if (req.query.year !== undefined && req.query.week !== undefined) {
            // Specific week of a specific year
            const year = Number(req.query.year);
            const week = Number(req.query.week);
            // Get first day of the year
            const firstDayOfYear = new Date(year, 0, 1);
            // Calculate the start of the week (ISO week: Monday as first day)
            const daysOffset = (week - 1) * 7;
            start = new Date(firstDayOfYear.getTime());
            start.setDate(firstDayOfYear.getDate() + daysOffset);
            // Set to Monday
            start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
            start.setHours(0,0,0,0);
            end = new Date(start);
            end.setDate(start.getDate() + 7);
          } else {
            // Current week (Monday to Sunday)
            start = new Date(now);
            const day = start.getDay();
            // If today is Sunday (0), go back 6 days, else go back (day-1) days
            const diffToMonday = day === 0 ? 6 : day - 1;
            start.setDate(now.getDate() - diffToMonday);
            start.setHours(0,0,0,0);
            end = new Date(start);
            end.setDate(start.getDate() + 7);
          }
          break;
        case 'lastWeek':
          // Previous week (Monday to Sunday)
          start = new Date(now);
          const dayOfWeek = start.getDay();
          // If today is Sunday (0), go back 6 days, else go back (day-1) days
          const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
          // Go to this week's Monday
          start.setDate(now.getDate() - diffToMonday - 7); // Go back 7 more days for last week
          start.setHours(0,0,0,0);
          end = new Date(start);
          end.setDate(start.getDate() + 7);
          break;
        case 'month':
          if (year !== undefined && month !== undefined) {
            // Specific month and year
            start = new Date(Number(year), Number(month) - 1, 1);
            end = new Date(Number(year), Number(month), 1);
          } else {
            // Current month
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          }
          break;
        case 'lastMonth':
          // Previous month
          const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          start = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 1);
          end = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 1);
          break;
        case 'year':
          if (year !== undefined) {
            start = new Date(Number(year), 0, 1);
            end = new Date(Number(year) + 1, 0, 1);
          } else {
            start = new Date(now.getFullYear(), 0, 1);
            end = new Date(now.getFullYear() + 1, 0, 1);
          }
          break;
        case 'lastYear':
          // Previous year
          start = new Date(now.getFullYear() - 1, 0, 1);
          end = new Date(now.getFullYear(), 0, 1);
          break;
        case 'day':
          // Specific day in any month/year: ?period=day&year=YYYY&month=MM&day=DD
          if (req.query.year !== undefined && req.query.month !== undefined && req.query.day !== undefined) {
            const year = Number(req.query.year);
            const month = Number(req.query.month) - 1;
            const day = Number(req.query.day);
            start = new Date(year, month, day);
            end = new Date(year, month, day + 1);
          }
          break;
        default:
          start = null;
      }
      if (start && end) {
        filter.expenseDate = { $gte: start, $lt: end };
      }
    }

    const expenses = await Expense.find(filter).sort({ expenseDate: -1 });
    return res.status(200).json({ message: "Expenses retrieved successfully", expenses });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

const getSingleExpense = async(req, res)=>{
try {
  const expenseId = req.params.id;
  if(!expenseId) {
    return res.status(400).json({ message: "Expense ID is required" });
  }
  const expense = await Expense.findById(expenseId);
  if(!expense) {
    return res.status(404).json({ message: "Expense not found" });
  }
  return res.status(200).json({ message: "Expense retrieved successfully", expense });
} catch (error) {
  return res.status(500).json({ message: "Internal server error", error: error.message });
}
}

module.exports = {
  addExpense,
  updateExpense,
  deleteExpense,
  getExpense,
  getSingleExpense
};
