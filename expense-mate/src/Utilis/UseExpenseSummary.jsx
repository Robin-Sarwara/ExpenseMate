import { createContext, useContext, useEffect, useState } from "react";
import { useGlobalLoading } from "./LoadingProvider";
import { showErrorToast } from "./toastMessage";
import axiosInstance from "./axiosInstance";


const ExpenseSummaryContext = createContext();

export const useExpenseSummary = () => useContext(ExpenseSummaryContext);

export const ExpenseSummaryProvider = ({ children }) => {
    const [summary, setSummary] = useState({
        week: 0,
        month: 0,
        year: 0
    });
    const { setLoading } = useGlobalLoading();

    const getExpenseSummary = async () => {
        setLoading(true);
        try {
            const [weekRes, monthRes, yearRes] = await Promise.all([
                axiosInstance.get('/get/expense?period=week'),
                axiosInstance.get('/get/expense?period=month'),
                axiosInstance.get('/get/expense?period=year'),
            ]);
            console.log("Week Expenses:", weekRes.data.expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0),);
            console.log("Month Expenses:", monthRes.data.expenses); 
            console.log("Year Expenses:", yearRes.data.expenses);
            setSummary({
                week: weekRes.data.expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0),
                month: monthRes.data.expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0),
                year: yearRes.data.expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0)
            });
        } catch (error) {
            console.error("Error fetching expense summary:", error);
                } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getExpenseSummary();
    }, []);
    useEffect(()=>{
        console.log("Expense Summary Updated:", summary);
    },[summary]);

    return (
        <ExpenseSummaryContext.Provider value={{ summary, getExpenseSummary }}>
            {children}
        </ExpenseSummaryContext.Provider>
    );
};