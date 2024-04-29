import { addDoc, collection, getDocs, getFirestore, orderBy, query, deleteDoc, updateDoc, doc } from "firebase/firestore";
import app from "@/app/_firebase/Config"
import { useEffect, useState } from "react";
import { Booking } from "../_settings/interfaces";
import axios from "axios";
import { userAgentFromString } from "next/server";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Function to get the currently authenticated user
const getCurrentUser = () => {
  const auth = getAuth();
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (users) => {
      if (users) {
        resolve(users);
      } else {
        reject(new Error('No authenticated user'));
      }
    });
  });
};

function useGetBookings() {
    const db = getFirestore(app);
    const [Bookings, setBookings] = useState<Booking[]>([]);
    const [updated, setUpdated] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            let data: Booking[] = [];
            const productRef = collection(db, "booking")
            // const productQuery = query(productRef, orderBy("price"));
            // const querySnapshot = await getDocs(productQuery);
            // querySnapshot.forEach((doc) => {
            //     data.push({ id: doc.id, desc: doc.data().desc, price: doc.data().price })
            //     console.log(`${doc.id} => ${doc.data()}`);
            // });
            setBookings(() => [...data]);
            setIsLoading(false);
        }
        fetchData();
    }, [db, updated]);

    async function addBooking(booking: { name: string, phone: string, people: number, date: string, time: string, state: string }) {
        const db = getFirestore(app);
        const stateValue = booking.state || "已訂位";
        const docRef = await addDoc(collection(db, "booking"),
            { name: booking.name, phone: booking.phone, people: booking.people, date: booking.date, time: booking.time, state: stateValue});
        console.log("Document written with ID: ", docRef.id);
        setUpdated((currentValue) => currentValue + 1)
    }

    async function deleteBooking(id: string) {
        try {
          const db = getFirestore(app);
          await deleteDoc(doc(db, "booking", id));
          setUpdated((currentValue) => currentValue + 1)
        }
        catch (error) {
          console.error(error);
        }
    
      }
    
    // async function updateBooking(booking: Booking) {
    //     try {
    //       const db = getFirestore(app);
    //       await updateDoc(doc(db, "booking", booking.id),
    //         // { desc: drink.desc, price: drink.price });
    //         { name: booking.name, phone: booking.phone, number: booking.number, date: booking.date, time: booking.time });
    //       setUpdated((currentValue) => currentValue + 1)
    //     }
    //     catch (error) {
    //       console.error(error);
    //     }
    // }
    async function sendEmail(subject: string, html: string) {
      const users = await getCurrentUser();
     
      try {
        const response = await axios({
          method: 'post',
          url: '/email',
          data: {
            email: users.email,
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
    return [Bookings, addBooking, deleteBooking, isLoading, sendEmail] as const;

}
export default useGetBookings;