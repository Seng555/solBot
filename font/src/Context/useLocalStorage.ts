import { useState, useEffect, Dispatch, SetStateAction } from "react";

const localStorage_Prefix = "SOYO-";

function getStorageValue<T>(key: string, defaultValue: T): T {
  // getting stored value
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(key);
    const initial = saved !== null ? JSON.parse(saved) : defaultValue;
    return initial;
  }
  return defaultValue;
}

export const useLocalStorage = <T>(
  key: string,
  defaultValue: T
): [T, Dispatch<SetStateAction<T>>] => {
  const prefixedKey = localStorage_Prefix + key;

  const [value, setValue] = useState<T>(() => {
    return getStorageValue(prefixedKey, defaultValue);
  });

  useEffect(() => {
    // storing input name
    localStorage.setItem(prefixedKey, JSON.stringify(value));
  }, [prefixedKey, value]);

  return [value, setValue];
};