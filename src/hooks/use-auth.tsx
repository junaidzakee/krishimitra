"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, onSnapshot, DocumentData } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface UserProfile extends DocumentData {
  krishiCoins?: number;
}

interface AuthContextType {
  user: User | null;
  userData: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const unsubscribeFirestore = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          setUserData(doc.data() as UserProfile);
        } else {
          setUserData(null);
        }
        setLoading(false);
      });
      return () => unsubscribeFirestore();
    }
  }, [user]);


  const signOut = async () => {
    await firebaseSignOut(auth);
    router.push('/sign-in');
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
