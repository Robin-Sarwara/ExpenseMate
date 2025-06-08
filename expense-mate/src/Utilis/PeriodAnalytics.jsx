import { createContext, useContext, useEffect, useState } from "react";
import { useGlobalLoading } from "./LoadingProvider";
import axiosInstance from "./axiosInstance";

const periodAnalytics = createContext();
export const usePeriodAnalytics = () => {
    const context = useContext(periodAnalytics);
    if (!context) {
        throw new Error("usePeriodAnalytics must be used within PeriodAnalyticsProvider");
    }
    return context;
};

export const PeriodAnalyticsProvider = ({ children }) => {
    const [analytics, setAnalytics] = useState({
        month: { current: 0, previous: 0, percentChange: 0 },
        year: { current: 0, previous: 0, percentChange: 0 },
        week: { current: 0, previous: 0, percentChange: 0 },
    });
    const { setLoading } = useGlobalLoading();
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const getPeriodAnalytics = async () => {
        setLoading(true);
        try {
            const [
                monthRes,
                lastMonthRes,
                yearRes,
                lastYearRes,
                weekRes,
                lastWeekRes
            ] = await Promise.all([
                axiosInstance.get(`/get/expense?period=month&tz=${encodeURIComponent(tz)}`),
                axiosInstance.get(`/get/expense?period=lastMonth&tz=${encodeURIComponent(tz)}`),
                axiosInstance.get(`/get/expense?period=year&tz=${encodeURIComponent(tz)}`),
                axiosInstance.get(`/get/expense?period=lastYear&tz=${encodeURIComponent(tz)}`),
                axiosInstance.get(`/get/expense?period=week&tz=${encodeURIComponent(tz)}`),
                axiosInstance.get(`/get/expense?period=lastWeek&tz=${encodeURIComponent(tz)}`)
            ]);

            // Helper to handle 404 or failed responses gracefully
            const safeGetTotal = res => {
                if (!res || !res.data || !Array.isArray(res.data.expenses)) return 0;
                return res.data.expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
            };
            const currentMonth = safeGetTotal(monthRes);
            const previousMonth = safeGetTotal(lastMonthRes);
            const currentYear = safeGetTotal(yearRes);
            const previousYear = safeGetTotal(lastYearRes);
            const currentWeek = safeGetTotal(weekRes);
            const previousWeek = safeGetTotal(lastWeekRes);

            setAnalytics({
                month: {
                    current: currentMonth,
                    previous: previousMonth,
                    percentChange: previousMonth && previousMonth !== 0 ? (((currentMonth - previousMonth) / previousMonth) * 100).toFixed(2) : 0
                },
                year: {
                    current: currentYear,
                    previous: previousYear,
                    percentChange: previousYear && previousYear !== 0 ? (((currentYear - previousYear) / previousYear) * 100).toFixed(2) : 0
                },
                week: {
                    current: currentWeek,
                    previous: previousWeek,
                    percentChange: previousWeek && previousWeek !== 0 ? (((currentWeek - previousWeek) / previousWeek) * 100).toFixed(2) : 0
                }
            });
        } catch (error) {
            console.error("Error fetching period analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getPeriodAnalytics();
    }, []);

    return (
        <periodAnalytics.Provider value={{ analytics, getPeriodAnalytics }}>
            {children}
        </periodAnalytics.Provider>
    );
};