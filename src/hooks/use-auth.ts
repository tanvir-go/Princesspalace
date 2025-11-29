
'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  type User as AuthUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, getFirestore } from 'firebase/firestore';

import hardcodedUsers from '@/lib/users.json';
import { useFirebaseApp } from '@/firebase/provider';

type UserRole = "waiter" | "accounts" | "admin" | "customer";

export type AppUser = {
  uid: string;
  email: string;
  role: UserRole;
  displayName: string;
};

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const app = useFirebaseApp();
  const auth = getAuth(app);
  const db = getFirestore(app);

  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // It's a Firebase user (customer)
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data() as Omit<AppUser, 'uid'>;
          const appUser: AppUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'Customer',
            role: userData.role as UserRole,
          };
          setUser(appUser);
          localStorage.setItem('user', JSON.stringify(appUser));
        }
      } else {
        // Could be a hardcoded user, check localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser: AppUser = JSON.parse(storedUser);
            // Check if it's one of the hardcoded roles
            if (['admin', 'waiter', 'accounts'].includes(parsedUser.role)) {
              setUser(parsedUser);
            } else {
              // It's a customer who has logged out
              localStorage.removeItem('user');
              setUser(null);
            }
          } catch {
            localStorage.removeItem('user');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db]);


  const redirectUser = (role: string | null) => {
    const targetUrl = redirectUrl || (
      role === 'admin' ? '/admin' :
      role === 'accounts' ? '/finance' :
      role === 'waiter' ? '/waiter' :
      '/dashboard'
    );
    router.push(targetUrl);
  };
  
  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    // Check hardcoded users first
    const hardcodedUser = hardcodedUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (hardcodedUser) {
      const appUser: AppUser = {
        uid: `hardcoded-${hardcodedUser.email}`,
        email: hardcodedUser.email,
        role: hardcodedUser.role as UserRole,
        displayName: hardcodedUser.displayName
      };
      localStorage.setItem('user', JSON.stringify(appUser));
      setUser(appUser);
      setLoading(false);
      redirectUser(appUser.role);
      return;
    }

    // If not a hardcoded user, try Firebase auth for customers
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Auth state change will be handled by onAuthStateChanged listener
      redirectUser('customer');
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
      throw e;
    }
  };

  const registerWithEmail = async (displayName: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        await updateProfile(firebaseUser, { displayName });

        const userData: Omit<AppUser, 'uid'> = {
            displayName,
            email,
            role: 'customer',
        };

        const userDocRef = doc(db, "users", firebaseUser.uid);
        setDoc(userDocRef, userData).catch(e => {
            console.error("Error adding document: ", e);
            // Optionally, handle the Firestore write error
        });

        // Don't set user directly, onAuthStateChanged will handle it
        return "Account created successfully! You can now log in.";
    } catch (e: any) {
        setError(e.message);
        throw e;
    } finally {
        setLoading(false);
    }
  };

  const signOut = async () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        try {
            const parsedUser = JSON.parse(storedUser);
            if (['admin', 'waiter', 'accounts'].includes(parsedUser.role)) {
                // It's a hardcoded user, just clear local storage
                localStorage.removeItem('user');
                setUser(null);
                router.push('/login');
                return;
            }
        } catch (e) {
            console.error("Error parsing user from localStorage", e)
        }
    }
    // It's a firebase user or parsing failed
    await firebaseSignOut(auth);
    localStorage.removeItem('user');
    setUser(null); // Ensure local state is cleared
    router.push('/login');
  };

  return {
    user,
    loading,
    error,
    signInWithEmail,
    registerWithEmail,
    signOut,
  };
}
