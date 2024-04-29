'use client'
import {Box, Button, Select, TextField, List, ListItemText, ListItem, MenuItem} from "@mui/material";
import * as React from 'react';
import { useState } from "react";
import ListItemButton from '@mui/material/ListItemButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import useGetBookings from "./useBooking";
import {Booking} from "../_settings/interfaces";
import styles from '../page.module.css'

export default function Booking() {
    const [Bookings, addBooking, deleteBooking, updateBooking, sendEmail] = useGetBookings();
    const [newProduct, setNewProduct] = useState<Booking>({ id: "", name: "", phone: "", people: 1, date: "", time: "" , state: ""});
    const [status, setStatus] = useState({ visible: false, success: false });

    const handleClick = function (e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.name === "people") {
            const newPeopleValue = parseInt(e.target.value);
            // 確保選擇的人數不小於1
            const validPeopleValue = Math.max(newPeopleValue, 1);
            setNewProduct({ ...newProduct, [e.target.name]: validPeopleValue })
        }
        else {
            setNewProduct({ ...newProduct, [e.target.name]: e.target.value })
        }
    }
    const show = () => {
      setStatus({ ...status, visible: true })
    }
    const hide = () => {
      setStatus({ ...status, visible: false })
    }

    const addOrUpdate = async () => {
    //   if (newProduct.id === "") {
    //       addBookings(newProduct);
    //   }
    //   else {
    //       updateBooking(newProduct);
    //   }
    //   setStatus({ ...status, visible: false })
        // 呼叫 addBooking，這裡假設 addBooking 是一個非同步操作
        await addBooking(newProduct);
        
        // 設定 success 狀態為 true
        setStatus({ ...status, success: true });
        
        // 過一段時間後，將 success 狀態重設為 false
        setTimeout(() => {
            setStatus({ ...status, success: false, visible: false });
        }, 3000); // 這裡設定 3000 毫秒（3 秒），你可以根據需要調整時間
       
        // 重置輸入框或其他狀態
        resetBooking();
        sendEmail("訂位成功", `
            <p><strong>訂位資訊</strong></p>
            <p><strong>訂位人姓名:</strong> ${newProduct.name}</p>
            <p><strong>訂位人電話:</strong> ${newProduct.phone}</p>
            <p><strong>訂位人數:</strong> ${newProduct.people}</p>
            <p><strong>訂位日期:</strong> ${newProduct.date}</p>
            <p><strong>訂位時間:</strong> ${newProduct.time}</p>
`       );
    }

    const resetBooking = () => {
        // 重置輸入框或其他狀態
        setNewProduct({ id: "", name: "", phone: "", people: 0, date: "", time: "" , state: ""});
    }

    return (
        <form className={styles.design}>
        <Box sx={{
          position: 'fixed',
            top: 100,
            left: 100,
            right: 100,
            bottom: 50,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            justifyContent: 'center',
            alignItems: 'center',
            overflowY: 'scroll', // 允许垂直滚动
            maxHeight: '100vh', // 限制最大高度
        }}>
            <div className={styles.bookingstyle1}>
                <TextField type="text" name="name"  value={newProduct.name} onChange={handleClick} 
                placeholder="姓名" label="姓名:" />
            </div>
            <div className={styles.bookingstyle2}>
                <TextField type="text" name="phone" value={newProduct.phone} onChange={handleClick}
                    placeholder="電話" label="電話:" autoComplete='username' />
            </div>
            <div className={styles.bookingstyle3}>
                <TextField type="number" name="people" value={newProduct.people} onChange={handleClick}
                    placeholder="人數" label="人數:" />
            </div>
            <div className={styles.bookingstyle4}>
                <TextField type="date" name="date" value={newProduct.date} onChange={handleClick}
                    placeholder="時間" />
            </div>
            <div className={styles.bookingstyle5}>
            {/* <TextField type="text" name="time" value={newProduct.time} onChange={handleClick}
                    placeholder="時段" /> */}
                <Select name="time" value={newProduct.time} onChange={handleClick} placeholder="時段" label="時段:">
                    <MenuItem value="11:00">11:00</MenuItem>
                    <MenuItem value="12:00">12:00</MenuItem>
                    <MenuItem value="18:00">18:00</MenuItem>
                    <MenuItem value="19:00">19:00</MenuItem>
                </Select>
            </div>
            <div className={styles.bookingstyle6}>
                <Button variant="contained" color="secondary" onClick={addOrUpdate}>訂位</Button>
            </div>
            {/* 訂位成功的提示 */}
            {status.success && (
                    <div style={{ color: 'black', marginTop: '400px', marginLeft: '50px' }}>訂位成功！</div>
                )}
          </Box>
          </form>
    )}