const express = require('express');
require('dotenv').config();
require('./Models/dbConnection')
const app = express();
const PORT = process.env.PORT || 5000;
const auth = require("./Routes/Auth")
const refreshToken = require("./Routes/refreshToken")
const cors = require('cors');
const cookieParser = require('cookie-parser');
const useData = require("./Routes/UserData")
const expense = require("./Routes/Expense")

app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use("/api", auth)
app.use("/api", refreshToken)
app.use("/api", useData)
app.use("/api", expense)

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
