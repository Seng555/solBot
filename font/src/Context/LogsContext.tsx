import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the context shape
interface LogsContextType {
    logs: string[];
    addLog: (newLog: string) => void;
    clearLogs: () => void;
}

// Create the context with default values
const LogsContext = createContext<LogsContextType | undefined>(undefined);

// Create a provider component
export const LogsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (newLog: string) => {
        setLogs((prevLogs) => [newLog, ...prevLogs]); // Add log at the top of the array
    };

    const clearLogs = () => {
        setLogs([]); // Clears all logs
    };

    return (
        <LogsContext.Provider value={{ logs, addLog, clearLogs }}>
            {children}
        </LogsContext.Provider>
    );
};

// Create a custom hook to use the context
export const useLogs = (): LogsContextType => {
    const context = useContext(LogsContext);
    if (!context) {
        throw new Error('useLogs must be used within a LogsProvider');
    }
    return context;
};
