import { createContext, useContext, useState } from "react";

const LoadingContext = createContext();

export const useGlobalLoading =()=>{
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useGlobalLoading must be used within LoadingProvider");
    }
    return context;
}

const LoadingProvider = ({children})=>{
    const [loading, setLoading] = useState(false);
    const value = {
        loading,
        setLoading
    };
    return (
        <LoadingContext.Provider value={value}>
            {children}
        </LoadingContext.Provider>
    );
}

export default LoadingProvider;