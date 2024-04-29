import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, orderBy, query, updateDoc } from "firebase/firestore";
import app from "@/app/_firebase/Config"
import { useEffect, useState } from "react";
import { Dessert } from "../_settings/interfaces";
import { shoppingcart } from "../_settings/interfaces";
import { AuthContext } from '../account/AuthContext';
import { useContext } from 'react';
import { getStorage, ref, deleteObject } from "firebase/storage";

function useGetDessert() {
    const db = getFirestore(app);
    const [Dessert, setDessert] = useState<Dessert[]>([])
    const [updated, setUpdated] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const authContext = useContext(AuthContext);
    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            let data: Dessert[] = [];
            const productRef = collection(db, "dessert")
            const productQuery = query(productRef, orderBy("price"));
            const querySnapshot = await getDocs(productQuery);
            querySnapshot.forEach((doc) => {
                data.push({ id: doc.id, desc: doc.data().desc, price: doc.data().price, photo: doc.data().photo })
                console.log(`${doc.id} => ${doc.data()}`);
            });
            setDessert(() => [...data]);
            setIsLoading(false);
        }
        fetchData();
    }, [db, updated]);

    async function addDessert(dessert: { desc: string, price: number, photo: string }) {
        const db = getFirestore(app);
        const docRef = await addDoc(collection(db, "dessert"),
            { desc: dessert.desc, price: dessert.price, photo: dessert.photo });
        console.log("Document written with ID: ", docRef.id);
        setUpdated((currentValue) => currentValue + 1)
    }
    async function deleteDessert(id: string, photo: string) {
        try {
            const storage = getStorage();
            const desertRef = ref(storage, photo);
            deleteObject(desertRef);
          const db = getFirestore(app);
          await deleteDoc(doc(db, "dessert", id));
          setUpdated((currentValue) => currentValue + 1)
        }
        catch (error) {
          console.error(error);
        }
    
      }
      async function updateDessert(product:Dessert) {
        try {
          const db = getFirestore(app);
          await updateDoc(doc(db, "dessert", product.id),
              { desc: product.desc, price: product.price, photo: product.photo });
          setUpdated((currentValue) => currentValue + 1)
        }
        catch (error) {
          console.error(error);
        }
    
      }

      async function addShoppingcart(dessert: { desc: string, price: number, unit: number, name: string }) {
        const db = getFirestore(app);
        const docRef = await addDoc(collection(db, "shoppingcart"), {
          desc: dessert.desc,
          price: dessert.price,
          unit: dessert.unit,
          flavor:"",
          name: authContext?.name || "未知用户"
        });
      
        console.log("Document written with ID: ", docRef.id);
        setUpdated((currentValue) => currentValue + 1);
      }

    return [Dessert, addDessert, deleteDessert, updateDessert, isLoading, addShoppingcart] as const;

}
export default useGetDessert;