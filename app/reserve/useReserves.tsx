import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, orderBy, query, updateDoc } from "firebase/firestore";
import app from "@/app/_firebase/Config"
import { useEffect, useState } from "react";
import { Booking } from "../_settings/interfaces";

function useGetReserves() {
    const db = getFirestore(app);
    const [Reserves, setReserves] = useState<{ id: "", date: "",  name: "", people: 1, phone: "", time: "", state: ""}[]>([])
    const [updated, setUpdated] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            let data: Booking[] = [];
            const productRef = collection(db, "booking")
            const productQuery = query(productRef, orderBy("date", "asc"));
            const querySnapshot = await getDocs(productQuery);
            querySnapshot.forEach((doc) => {
                data.push({ id: doc.id, date: doc.data().date, name: doc.data().name, people: doc.data().people, phone: doc.data().phone, time: doc.data().time, state: doc.data().state})
                console.log(`${doc.id} => ${doc.data()}`);
            });
            setReserves(() => [...data]);
            setIsLoading(false);
        }
        fetchData();
    }, [db, updated]);

    async function addReserves(booking: { date: string, name: string, people: number, phone: string, time: string, state: string}) {
        const db = getFirestore(app);
        const stateValue = booking.state || "已訂位";
        const docRef = await addDoc(collection(db, "booking"),
            { date: booking.date, name: booking.name, people: booking.people, phone: booking.phone, time: booking.time, state: booking.state});
        console.log("Document written with ID: ", docRef.id);
        setUpdated((currentValue) => currentValue + 1)
    }

    async function deleteReserve(id: string) {
        try {
            const db = getFirestore(app);
            await deleteDoc(doc(db, "booking", id));
            setUpdated((currentValue) => currentValue + 1)
        }
        catch (error) {
            console.error(error);
        }

    }
    async function updateReserve(product: Booking) {
        try {
            const db = getFirestore(app);
            await updateDoc(doc(db, "booking", product.id),
                { date: product.date, name: product.name, people: product.people, phone: product.phone, time: product.time , state: product.state});
            setUpdated((currentValue) => currentValue + 1)
        }
        catch (error) {
            console.error(error);
        }
    }

    return [Reserves, addReserves, deleteReserve, updateReserve, isLoading] as const;

}
export default useGetReserves;