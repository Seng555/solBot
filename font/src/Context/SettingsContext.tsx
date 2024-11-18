import React, { createContext, useContext, ReactNode } from "react";
import { useLocalStorage } from "./useLocalStorage"; // Assuming useLocalStorage is in a separate file

// Define Settings interface
export interface Settings {
    private_key: string;
    usepremium: boolean;
    bamount: number;
    bslippage: number;
    autosell: boolean;
    tp: number;
    sl: number;
    sslippage: number;
    maxdevhold: number;
    minipool: number;
    maxpool: number;
    freezable: boolean;
    immutable: boolean;
    lpBurned: boolean;
}

// Default initial settings
const init: Settings = {
    private_key: "",
    usepremium: false,
    bamount: 0.01,
    bslippage: 20,
    autosell: true,
    tp: 20,
    sl: 20,
    sslippage: 20,
    maxdevhold: 20,
    minipool: 5,
    maxpool: 1000,
    freezable: false,
    immutable: false,
    lpBurned: false,
};

// Create context
interface SettingsContextType {
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Create a provider component
export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Use the custom hook to get and set settings from localStorage
    const [settings, setSettings] = useLocalStorage<Settings>("settings", init);

    return (
        <SettingsContext.Provider value={{ settings, setSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

// Custom hook to use settings context
export const useSettings = (): SettingsContextType => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
};
