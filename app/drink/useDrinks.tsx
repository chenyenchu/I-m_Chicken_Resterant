import { addDoc, collection, getDocs, getFirestore, orderBy, query, deleteDoc, updateDoc, doc } from "firebase/firestore";
import app from "@/app/_firebase/Config"
import { useEffect, useState } from "react";
import { Drink } from "../_settings/interfaces";
import axios from "axios";
import { AuthContext } from '../account/AuthContext';
import { useContext } from 'react';
import { getStorage, ref, deleteObject } from "firebase/storage";

function useGetDrinks() {
    const db = getFirestore(app);
    const [Drinks, setDrinks] = useState<Drink[]>([]);
    const [updated, setUpdated] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const authContext = useContext(AuthContext);
    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            let data: Drink[] = [];
            const productRef = collection(db, "drink")
            const productQuery = query(productRef, orderBy("price"));
            const querySnapshot = await getDocs(productQuery);
            querySnapshot.forEach((doc) => {
                data.push({ id: doc.id, desc: doc.data().desc, price: doc.data().price, photo: doc.data().photo });
                console.log(`${doc.id} => ${doc.data()}`);
            });
            setDrinks(() => [...data]);
            setIsLoading(false);
        }
        fetchData();
    }, [db, updated]);

    async function addDrink(drink: { desc: string, price: number, photo: string }) {
        const db = getFirestore(app);
        const docRef = await addDoc(collection(db, "drink"),
            { desc: drink.desc, price: drink.price, photo: drink.photo });
        console.log("Document written with ID: ", docRef.id);
        setUpdated((currentValue) => currentValue + 1)
    }

    async function deleteDrink(id: string, photo: string) {
        try {
            const storage = getStorage();
            const desertRef = ref(storage, photo);
            deleteObject(desertRef);
          const db = getFirestore(app);
          await deleteDoc(doc(db, "drink", id));
          setUpdated((currentValue) => currentValue + 1)
        }
        catch (error) {
          console.error(error);
        }
      }
    
    async function updateDrink(drink: Drink) {
        try {
          const db = getFirestore(app);
          await updateDoc(doc(db, "drink", drink.id),
              { desc: drink.desc, price: drink.price, photo: drink.photo });
          setUpdated((currentValue) => currentValue + 1)
        }
        catch (error) {
          console.error(error);
        }
    
    }

    async function addShoppingcart(drink: { desc: string,flavor: string, price: number, unit: number, name: string }) {
      const db = getFirestore(app);
      const docRef = await addDoc(collection(db, "shoppingcart"), {
        desc: drink.desc,
        price: drink.price,
        flavor: "",
        unit: drink.unit,
        name: authContext?.name || "未知用户"
      });
    
      console.log("Document written with ID: ", docRef.id);
      setUpdated((currentValue) => currentValue + 1);
    }

    async function sendEmail(subject: string, html: string) {
      try {
        const response = await axios({
          method: 'post',
          url: '/email',
          data: {
            email: "yen920617@gmail.com",
            subject: subject,
            html: html
          },
        });
        console.log(response.data.message);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(error.message);
        } else {
          console.error("錯誤");
        }
  
      }
    }

    return [Drinks, addDrink, deleteDrink, updateDrink, sendEmail, isLoading, addShoppingcart] as const;

}
export default useGetDrinks;