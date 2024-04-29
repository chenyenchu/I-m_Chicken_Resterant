import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, orderBy, query, updateDoc } from "firebase/firestore";
import app from "@/app/_firebase/Config"
import { useEffect, useState } from "react";
import { Set } from "../_settings/interfaces";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { AuthContext } from '../account/AuthContext';
import { useContext } from 'react';

function useGetSets() {
    const db = getFirestore(app);
    const [Sets, setSets] = useState<{ desc: string, price: number }[]>([])
    const [updated, setUpdated] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [newProduct, setNewProduct] = useState<Set[]>([]);
    const authContext = useContext(AuthContext);
    useEffect(() => {
        async function fetchData() {
        //let data: { desc: string, price: number }[] = [];
        let data: Set[] = [];
            const querySnapshot = await getDocs(query(collection(db, "set"), orderBy("price")));
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, desc: doc.data().desc, content: doc.data().content, price: doc.data().price, photo: doc.data().photo })
            console.log(`${doc.id} => ${doc.data()}`);
        });
        setSets(() => [...data]);
        setIsLoading(false);
        }
        fetchData();
    }, [db, updated]);

    async function addSet(set: { desc: string, content: string, price: number, photo: string }) {
        const db = getFirestore(app);
        const docRef = await addDoc(collection(db, "set"),
            { desc: set.desc, content: set.content, price: set.price, photo: set.photo });
        console.log("Document written with ID: ", docRef.id);
        setUpdated((currentValue) => currentValue + 1)
    }

    async function deleteSet(id: string, photo: string) {
        try {
            const storage = getStorage();
            const desertRef = ref(storage, photo);
            deleteObject(desertRef);
          const db = getFirestore(app);
          await deleteDoc(doc(db, "set", id));
          setUpdated((currentValue) => currentValue + 1)
        }
        catch (error) {
          console.error(error);
        }
    
      }

      //async function updateSet(set: { id: string, desc: string, price: number }) {
      async function updateSet(set: Set) {  
        try {
          const db = getFirestore(app);
          await updateDoc(doc(db, "set", set.id),
              { desc: set.desc, content: set.content, price: set.price, photo: set.photo });
          setUpdated((currentValue) => currentValue + 1)
        }
        catch (error) {
          console.error(error);
        }
    
      }

      async function addShoppingcart(set: { desc: string, flavor: string, price: number, unit: number, name: string }) {
        const db = getFirestore(app);
        const docRef = await addDoc(collection(db, "shoppingcart"), {
          desc: set.desc,
          price: set.price,
          flavor: set.flavor,
          unit: set.unit,
          name: authContext?.name || "未知用户"
        });
      
        console.log("Document written with ID: ", docRef.id);
        setUpdated((currentValue) => currentValue + 1);
      }

    return [Sets, addSet, deleteSet, updateSet, isLoading, addShoppingcart] as const;

}
export default useGetSets;