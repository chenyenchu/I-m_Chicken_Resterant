'use client'
import {Box, Button, List, ListItem, ListItemText, TextField, IconButton, Dialog,DialogTitle,DialogContent,DialogActions, Fab} from "@mui/material";
import * as React from 'react';
import { useState } from "react";
import ListItemButton from '@mui/material/ListItemButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import useGetReserves from "./useReserves";
import { Booking } from "../_settings/interfaces";
import MenuItem from '@mui/material/MenuItem';

export default function ReserveList() {
    const [Reserves, addReserves, deleteReserve, updateReserve, isLoading] = useGetReserves();
    const [newProduct, setNewProduct] = useState<Booking>({ id: "", date: "",  name: "", people: 1, phone: "", time: "", state: ""});
    const [status, setStatus] = useState({ visible: false });
    const handleClick = function (e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.name === "people") {
            const newPeopleValue = parseInt(e.target.value);
            // 確保選擇的人數不小於1
            const validPeopleValue = Math.max(newPeopleValue, 1);
            setNewProduct({ ...newProduct, [e.target.name]: validPeopleValue });
        }else {
            setNewProduct({ ...newProduct, [e.target.name]: e.target.value })
        }
    }
    const show = () => {
        setStatus({ ...status, visible: true })
    }
    const hide = () => {
        setStatus({ ...status, visible: false })
        resetReserve();
    }
    
    // function update() {
    //     setSoups(() => [...Soups, newProduct]);
    //     setNewProduct({ ...newProduct, visible: false })
    //     console.log(Soups);
    // }

    function addOrUpdate() {
      if (newProduct.id === "") {
          addReserves(newProduct);
      }
      else {
          updateReserve(newProduct);
      }
      setStatus({ ...status, visible: false })
      resetReserve();
  }

    // const [selectedIndex, setSelectedIndex] = React.useState(1);
    // const handleListItemClick = (
    //     event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    //     index: number,
    // ) => {
    //     setSelectedIndex(index);
    // };
    // const handleDelete = (index:number) => {
    //     const updatedProducts = [...Soups];
    //     updatedProducts.splice(index,1);
    //     setSoups(updatedProducts);
    // };
    // const [editingIndex, setEditingIndex] = React.useState(-1);
    // const [isEditing, setIsEditing] = React.useState(false);;
    // const handleEditProduct = (indexToEdit:number) => {
    //   const productToEdit = Soups[indexToEdit];
    //     setNewProduct({
    //       ...productToEdit,
    //       visible: true,
    //     });
    //     setIsEditing(true);
    //     setEditingIndex(indexToEdit);
    // };
    // const handleSaveEdit = () => {
    //   const updatedProducts = [...Soups];
    //   updatedProducts[editingIndex] = newProduct;
    //   setSoups(updatedProducts);
    //   setNewProduct({ ...newProduct, visible: false });
    //   setIsEditing(false)
    // };

    function setUpdateProduct(product: Booking) {
      setNewProduct({ ...product })
      setStatus({ visible: true })
  }
  const resetReserve = () => {
      setNewProduct({ id: "", date: "",  name: "", people: 1, phone: "", time: "", state: ""})
  }

  return (
    // <Box sx={{width: '80vw', height: '100vh', backgroundColor: 'background.paper', color: 'black', textAlign: 'left'}}>
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
        <Fab color="primary" aria-label="Add" sx={{position: 'fixed',bottom: '16px',right: '16px',}}onClick={show}>
            <AddIcon />
        </Fab>
            <Dialog open={status.visible} onClose={hide} aria-labelledby={newProduct.id === "" ? "新增訂位" : "更新訂位"}>
            <DialogTitle>{newProduct.id === "" ? "新增訂位" : "更新訂位"}</DialogTitle>
            <DialogContent>
                <TextField label="訂位姓名" variant="outlined" type="type" name="name" value={newProduct.name} onChange={handleClick} /><p />
                <TextField type="number" label="訂位人數" variant="outlined" name="people" value={newProduct.people} onChange={handleClick} /><p />
                <TextField type="text" label="訂位電話" variant="outlined" name="phone" value={newProduct.phone} onChange={handleClick} /><p />
                <TextField type="date" label="" variant="outlined" name="date" value={newProduct.date} onChange={handleClick} /><p />
                <TextField 
                            select
                            label="訂位時段" 
                            variant="outlined" 
                            name="time"
                            value={newProduct.time} 
                            onChange={handleClick} 
                        >
                            <MenuItem value="11:00">11:00</MenuItem>
                            <MenuItem value="12:00">12:00</MenuItem>
                            <MenuItem value="18:00">18:00</MenuItem>
                            <MenuItem value="19:00">19:00</MenuItem>
                </TextField>  
                <div></div>          
                <TextField
                            select
                            label="訂位狀態"
                            variant="outlined"
                            name="state"
                            value={newProduct.state}
                            onChange={handleClick}
                        >
                            <MenuItem value="已訂位">已訂位</MenuItem>
                            <MenuItem value="已報到">已報到</MenuItem>
                            <MenuItem value="取消訂位">取消訂位</MenuItem>
                </TextField>
            </DialogContent>
            <DialogActions>
                <IconButton aria-label="close" onClick={hide}sx={{position: 'absolute',right: 8,top: 8,}}>
                    <CloseIcon />
                </IconButton>
                <Button variant="contained" color="primary" onClick={addOrUpdate}>{newProduct.id === "" ? "新增訂位" : "更新訂位"}</Button>
            </DialogActions>
        </Dialog>
            
        <div>
            {/* <button onClick={show}>新增訂位</button> */}
            <List subheader="" aria-label="reserve list">
                {Reserves.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((reserve, index) =>
                <ListItem divider key={reserve.people}>
                    <ListItemText primary={reserve.name} 
                                    secondary={`${new Date(reserve.date).toLocaleDateString()}  ${reserve.time}   -   ${reserve.people}人 -   電話:${reserve.phone} -    ${reserve.state}`}></ListItemText>
                    <IconButton edge="end" aria-label="edit" onClick={() => setUpdateProduct(reserve)}>
                        <EditIcon />
                    </IconButton> 
                    <IconButton edge="end" aria-label="delete" onClick={() => deleteReserve(reserve.id)}>
                        <DeleteIcon />
                    </IconButton>
                </ListItem>)}
            </List>
        </div>      
    </Box>
    )}