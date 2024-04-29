import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, orderBy, query, updateDoc } from "firebase/firestore";
import app from "@/app/_firebase/Config"
import { useEffect, useState } from "react";
import { shoppingcart } from "../_settings/interfaces";

function useGetShoppingcart() {
    const db = getFirestore(app);
    const [Shoppingcart, setShoppingcart] = useState<shoppingcart[]>([])
    const [updated, setUpdated] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            let data: shoppingcart[] = [];
            const productRef = collection(db, "shoppingcart")
            const productQuery = query(productRef, orderBy("price"));
            const querySnapshot = await getDocs(productQuery);
            querySnapshot.forEach((doc) => {
                data.push({ id: doc.id, desc: doc.data().desc, flavor: doc.data().flavor, price: doc.data().price , unit: doc.data().unit, name:doc.data().name})
                console.log(`${doc.id} => ${doc.data()}`);
            });
            setShoppingcart(() => [...data]);
            setIsLoading(false);
        }
        fetchData();
    }, [db, updated]);

    async function addShoppingcart(shoppingcart: { desc: string, flavor: string, price: number, unit: number, name:string }) {
        const db = getFirestore(app);
        const docRef = await addDoc(collection(db, "shoppingcart"),
            { desc: shoppingcart.desc,flavor: shoppingcart.flavor, price: shoppingcart.price ,unit: shoppingcart.unit,name:shoppingcart.name });
        console.log("Document written with ID: ", docRef.id);
        setUpdated((currentValue) => currentValue + 1)
    }
    const deleteShoppingcart = async (productId: string) => {
      try {
        const shoppingcartCollection = collection(db, 'shoppingcart');
        const productDocRef = doc(shoppingcartCollection, productId);
        await deleteDoc(productDocRef);
        console.log('刪除成功！');
      } catch (error) {
        console.error('刪除失敗：', error);
      }
    };
    const handleCheckout = async () => {
      try {
        Shoppingcart.forEach(async product => {
          const orderDocRef = await addDoc(collection(db, 'foodorders'), {
            desc: product.desc,
            name: product.name,
            flavor: product.flavor,
            price: product.price,
            unit: product.unit,
          });
          deleteShoppingcart(product.id);
        });
        alert('結帳成功！');
      } catch (error) {
        console.error("結帳過程中發生錯誤：", error);
      }
    };
    return [Shoppingcart, addShoppingcart, deleteShoppingcart, isLoading, handleCheckout] as const;

}
export default useGetShoppingcart;