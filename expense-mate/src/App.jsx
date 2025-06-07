import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./Components/Auth/Login";
import Home from "./Components/Home/Home";
import Signup from "./Components/Auth/Signup";
import AuthProvider from "./Utilis/AuthProvider"; // ✅ Default import only
import RefreshHandler from "./Utilis/RefreshHandler";
import LoadingProvider from "./Utilis/LoadingProvider";
import ForgetPassword from "./Components/Auth/ForgetPassword";
import ResetPassword from "./Components/Auth/ResetPassword";
import Layout from "./Components/Layout/Layout";
import { UserDetailsProvider } from "./Utilis/UserDetails";
import AddExpense from "./Components/Expense/AddExpense";
import EditExpense from "./Components/Expense/EditExpense";
import ExpenseReport from "./Components/Expense/ExpenseReport";
import { ExpenseSummaryProvider } from "./Utilis/UseExpenseSummary";
import { PeriodAnalyticsProvider } from "./Utilis/PeriodAnalytics";
import DetailedExpense from "./Components/Expense/DetailedExpense";
import ExpenseVisualAnalytics from "./Components/Expense/ExpenseVisualAnalytics";
import AccountSetting from "./Components/Profile/AccountSetting";
import AccountDetailsUpdate from "./Components/Profile/AccountDetailsUpdate";

function App() {
  return (
    <>
      <UserDetailsProvider>
        <AuthProvider>
          <LoadingProvider>
            <PeriodAnalyticsProvider>
              <ExpenseSummaryProvider>
                <RefreshHandler>
                  <ToastContainer />
                  <Routes>
                    <Route path="/" element={<Navigate to="/home" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route
                      path="/forget-password"
                      element={<ForgetPassword />}
                    />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route
                      path="/home"
                      element={
                        <Layout>
                          <Home />
                        </Layout>
                      }
                    />
                    <Route path="/add-expense" element={<AddExpense />} />
                    <Route path="/edit-expense/:id" element={<EditExpense />} />
                    <Route
                      path="/expenses/report"
                      element={<ExpenseReport />}
                    />
                    <Route path="/expense/:id" element={<DetailedExpense/>}/>
                  <Route path="/expense/analytics" element={<ExpenseVisualAnalytics/>}/>
                  <Route path="/account" element={<AccountSetting/>}/>
                  <Route path="/account/update-details" element={<AccountDetailsUpdate/>}/>
                  </Routes>
                </RefreshHandler>
              </ExpenseSummaryProvider>
            </PeriodAnalyticsProvider>
          </LoadingProvider>
        </AuthProvider>
      </UserDetailsProvider>
    </>
  );
}

export default App;
