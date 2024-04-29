'use client'
import {Box, Button, List, ListItem, ListItemText, TextField, IconButton, Dialog,DialogTitle,DialogContent,DialogActions, Fab} from "@mui/material";
import * as React from 'react';
import { useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import useGetFoodorders from "./useFoodorders";
import { foodorders } from "../_settings/interfaces";

export default function FoodordersList() {
    const [Foodorders, addFoodorders, deleteFoodorders, isLoading] = useGetFoodorders();
    const [newProduct, setNewProduct] = useState<foodorders>({ id: "", desc: "", price: 0, unit:0, name:"" });
    const [status, setStatus] = useState({ visible: false });
    const handleClick = function (e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.name === "price") {
            setNewProduct({ ...newProduct, [e.target.name]: parseInt(e.target.value) })
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


    return (
        <Box sx={{
          position: 'fixed',
            top: 150,
            left: 100,
            right: 100,
            bottom: 50,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            justifyContent: 'center',
            alignItems: 'center',
            overflowY: 'scroll', 
            maxHeight: '100vh', 
        }}>
        <Fab
          color="primary"
          aria-label="Add"
          sx={{
            position: 'fixed',
            bottom: '16px',
            right: '16px',
          }}
          onClick={show}
        >
        <AddIcon />
        </Fab>
              <div>
                {/* <button onClick={show}>新增產品</button> */}
                <List subheader="訂單" aria-label="product list">
                  {Foodorders.map((product, index) =>
                    <ListItem divider key={product.desc}>
                    <ListItemText
                       primary={`訂購者: ${product.name}`}
                       secondary={`商品: ${product.desc},  數量: ${product.unit}, 總價格: ${product.price * product.unit} 元`}
                    />
                <IconButton edge="end" aria-label="delete" onClick={() => deleteFoodorders(String(product.id))}>
                <DeleteIcon />
                </IconButton>
                  </ListItem>
                )}
                </List>
              </div>
            
          </Box>
    )}