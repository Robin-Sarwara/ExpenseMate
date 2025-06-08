const mongoose = require("mongoose");
const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
      validate: {
        validator: function (v) {
          return v > 0;
        },
        message: (props) => `${props.value} is not a valid amount!`,
      },
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Description must be at least 3 characters long"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Food & Dining",
        "Transportation",
        "Shopping",
        "Entertainment",
        "Healthcare",
        "Bills & Utilities",
        "Education",
        "Travel",
        "Business",
        "Technology",
        "Personal",
        "Gas",
        "Groceries",
        "Car Expense",
        "Home & Living",
        "Other",
      ],
      default: "Other",
    },
    expenseDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: [
        "Cash",
        "Credit Card",
        "Debit Card",
        "Online Payment",
        "UPI",
        "Wallet",
        "Net Banking",
        "Other",
      ],
      default: "Cash",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.model("Expense", expenseSchema);
module.exports = Expense;
