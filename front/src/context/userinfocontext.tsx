import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import {User} from '../services/userservice'

interface Userinfo {
    id?:number;
  interests: string;
  skills: string;
  userid:number;
}

interface UserinfoContextType {
  userinfo: Userinfo | null;
  hasPreferences: boolean;
  setUserinfo: (data: Userinfo) => void;
  clearUserinfo: () => void;
}

const UserinfoContext = createContext<UserinfoContextType | null>(null);

export const UserinfoProvider = ({ children }: { children: ReactNode }) => {
  const [userinfo, setUserinfoState] = useState<Userinfo | null>(null);
  const [hasPreferences, setHasPreferences] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('userinfo');
    if (storedData) {
      const parsed = JSON.parse(storedData);
      setUserinfoState(parsed);
      setHasPreferences(true);
    }
  }, []);

  const setUserinfo = (data: Userinfo) => {
    localStorage.setItem('userinfo', JSON.stringify(data));
    setUserinfoState(data);
    setHasPreferences(true);
  };

  const clearUserinfo = () => {
    localStorage.removeItem('userinfo');
    setUserinfoState(null);
    setHasPreferences(false);
  };

  return (
    <UserinfoContext.Provider value={{ userinfo, hasPreferences, setUserinfo, clearUserinfo }}>
      {children}
    </UserinfoContext.Provider>
  );
};

export const useUserinfo = () => {
  const context = useContext(UserinfoContext);
  if (!context) {
    throw new Error('useUserinfo must be used within a UserinfoProvider');
  }
  return context;
};
