import { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "../db/config";
import { doc, getDoc } from "firebase/firestore";

interface UserData {
  uid: string;
  email: string;
  role: string;
  name?: string;
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => useContext(AuthContext)!;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);

    // Fetch user role from Firestore after login
    const userDoc = await getDoc(doc(db, "users", result.user.uid));
    if (!userDoc.exists()) {
      throw new Error("User data not found");
    }

    const role = userDoc.data().role || "normal";

    const fullData: UserData = {
      uid: result.user.uid,
      email: result.user.email || "",
      role,
      name: userDoc.data().name || "",
    };

    localStorage.setItem("userData", JSON.stringify(fullData));

    setCurrentUser(result.user);
    setUserData(fullData);
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("userData");
    setCurrentUser(null);
    setUserData(null);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const cached = localStorage.getItem("userData");
        if (cached) {
          setUserData(JSON.parse(cached));
          setCurrentUser(user);
        } else {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const fullData: UserData = {
              uid: user.uid,
              email: user.email || "",
              role: userDoc.data().role || "normal",
              name: userDoc.data().name || "",
            };
            setUserData(fullData);
            localStorage.setItem("userData", JSON.stringify(fullData));
          }
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
        setUserData(null);
        localStorage.removeItem("userData");
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider
      value={{ currentUser, userData, login, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
