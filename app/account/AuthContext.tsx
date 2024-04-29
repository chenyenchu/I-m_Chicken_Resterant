'use client'
import { getAuth, onAuthStateChanged,User } from "firebase/auth";
import { createContext, use, useEffect, useState, useContext, } from "react";
import app from "@/app/_firebase/Config";
import { getFirestore, collection, doc, getDocs, where, query } from 'firebase/firestore';

type CustomUser = User & { role?: string; name?: string };
export const AuthContext = createContext<CustomUser | null>(null);
export const AuthContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const auth = getAuth(app);
    const db = getFirestore(app);
    const [user, setUser] = useState<User | null>(null);
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (authUser) => {
          if (authUser) {
            try {
              const q = query(collection(db, 'users'), where('email', '==', authUser.email));
              const querySnapshot = await getDocs(q);
          
              if (!querySnapshot.empty) {
                const userDocData = querySnapshot.docs[0].data();
                const role = userDocData.role || "";
                const name = userDocData.name || "";
                console.log("Setting user with role:", role);
          
                // 设置具有检索到的名称的用户
                setUser({ ...authUser, displayName: role, name: name } as CustomUser);
              } else {
                setUser({ ...authUser, displayName: "", name: "" } as CustomUser);
              }
          
              setEmail(authUser.email || "");
              console.log(authUser);
            } catch (error) {
              console.error("Error getting user data from Firestore:", error);
            }
          } else {
            setUser(null);
            setEmail("");
          }
        });
    
        return () => {
          unsub();
        };
      }, [auth, db]);
    
      return (
        <AuthContext.Provider value={user}>
          {children}
        </AuthContext.Provider>
      );
    };