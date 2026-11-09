/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
createContext,
useCallback,
useContext,
useEffect,
useState,
type ReactNode,
} from "react";

import { User } from "@/types/user";
import { authStorage } from "@/lib/auth";

interface AuthContextType {
user: User | null;
token: string | null;
loading: boolean;
isAuthenticated: boolean;

login: (token: string, user: User) => void;
logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
undefined
);

interface AuthProviderProps {
children: ReactNode;
}

export function AuthProvider({
children,
}: AuthProviderProps) {
const [user, setUser] = useState<User | null>(null);
const [token, setToken] = useState<string | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
const storedToken = authStorage.getToken();
const storedUser = authStorage.getUser();

if (storedToken && storedUser) {
  setToken(storedToken);
  setUser(storedUser);
}

setLoading(false);

}, []);

const login = useCallback(
(newToken: string, newUser: User) => {
authStorage.saveSession(newToken, newUser);

  setToken(newToken);
  setUser(newUser);
},
[]


);

const logout = useCallback(() => {
authStorage.removeSession();

setToken(null);
setUser(null);

}, []);

return (
<AuthContext.Provider
value={{
user,
token,
loading,
isAuthenticated: !!user && !!token,
login,
logout,
}}
>
{children}
</AuthContext.Provider>
);
}

export function useAuth() {
const context = useContext(AuthContext);

if (!context) {
throw new Error(
"useAuth doit être utilisé à l'intérieur d'un AuthProvider."
);
}

return context;
}
