import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, orderBy, query, updateDoc } from "firebase/firestore";
import app from "@/app/_firebase/Config"
import { useEffect, useState } from "react";
import { foodorders } from "../_settings/interfaces";

function useGetFoodorders() {
    const db = getFirestore(app);
    const [Foodorders, setFoodorders] = useState<foodorders[]>([])
    const [updated, setUpdated] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            let data: foodorders[] = [];
            const productRef = collection(db, "foodorders")
            const productQuery = query(productRef, orderBy("price"));
            const querySnapshot = await getDocs(productQuery);
            querySnapshot.forEach((doc) => {
                data.push({ id: doc.id, desc: doc.data().desc, price: doc.data().price , unit: doc.data().unit, name:doc.data().name})
                console.log(`${doc.id} => ${doc.data()}`);
            });
            setFoodorders(() => [...data]);
            setIsLoading(false);
        }
        fetchData();
    }, [db, updated]);

    async function addFoodorders(Foodorders: { desc: string, price: number, unit: number, name:string }) {
        const db = getFirestore(app);
        const docRef = await addDoc(collection(db, "foodorders"),
            { desc: Foodorders.desc, price: Foodorders.price ,unit: Foodorders.unit,name:Foodorders.name });
        console.log("Document written with ID: ", docRef.id);
        setUpdated((currentValue) => currentValue + 1)
    }
    const deleteFoodorders = async (productId: string) => {
      try {
        const FoodordersCollection = collection(db, 'foodorders');
        const productDocRef = doc(FoodordersCollection, productId);
        await deleteDoc(productDocRef);
        alert('訂單刪除成功！');
        console.log('刪除成功！');
      } catch (error) {
        console.error('刪除失敗：', error);
      }
    };
    
    return [Foodorders, addFoodorders, deleteFoodorders, isLoading] as const;

}
export default useGetFoodorders;