import { addDoc, collection, getDocs, getFirestore, orderBy, query, deleteDoc, updateDoc, doc } from "firebase/firestore";
import app from "@/app/_firebase/Config"
import { useEffect, useState } from "react";
import { Account } from "../_settings/interfaces";

function useGetAccounts() {
    const db = getFirestore(app);
    const [Accounts, setAccounts] = useState<Account[]>([]);
    const [updated, setUpdated] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            let data: Account[] = [];
            const productRef = collection(db, "users")
            // const productQuery = query(productRef, orderBy("price"));
            // const querySnapshot = await getDocs(productQuery);
            // querySnapshot.forEach((doc) => {
            //     data.push({ id: doc.id, desc: doc.data().desc, price: doc.data().price })
            //     console.log(`${doc.id} => ${doc.data()}`);
            // });
            setAccounts(() => [...data]);
            setIsLoading(false);
        }
        fetchData();
    }, [db, updated]);

    async function addAccount(users: { name: string, email: string, password: string, role: string }) {
        const db = getFirestore(app);
        const docRef = await addDoc(collection(db, "users"),
            { name: users.name, email: users.email, password: users.password, role: users.role });
        console.log("Document written with ID: ", docRef.id);
        setUpdated((currentValue) => currentValue + 1)
    }

    async function deleteAccount(id: string, password: string) {
        try {
          const db = getFirestore(app);
          await deleteDoc(doc(db, "users", id, password));
          setUpdated((currentValue) => currentValue + 1)
        }
        catch (error) {
          console.error(error);
        }
    }
    
    // async function updateAccount(users: Account) {
    //     try {
    //       const db = getFirestore(app);
    //       await updateDoc(doc(db, "users", users.id),
    //         // { desc: drink.desc, price: drink.price });
    //         { name: users.name, phone: users.phone, number: users.number, date: users.date, time: users.time });
    //       setUpdated((currentValue) => currentValue + 1)
    //     }
    //     catch (error) {
    //       console.error(error);
    //     }
    // }

    return [Accounts, addAccount,deleteAccount, isLoading] as const;

}
export default useGetAccounts;