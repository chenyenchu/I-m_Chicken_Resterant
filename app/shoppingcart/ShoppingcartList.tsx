'use client'
import {Box, Button, List, ListItem, ListItemText, TextField, IconButton, Dialog,DialogTitle,DialogContent,DialogActions, Fab} from "@mui/material";
import * as React from 'react';
import { useState, useContext } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import useGetShoppingcart from "./useShoppingcart";
import { shoppingcart } from "../_settings/interfaces";
import { AuthContext } from '../account/AuthContext';

export default function ShoppingcartList() {
    const user = useContext(AuthContext);
    const [Shoppingcart, addShoppingcart, deleteShoppingcart, isLoading,handleCheckout] = useGetShoppingcart();
    const [newProduct, setNewProduct] = useState<shoppingcart>({ id: "", desc: "",flavor: "", price: 0, unit:0, name:"" });
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
            top: 100,
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
                <List subheader="" aria-label="product list">
                  {Shoppingcart.map((product, index) =>
                    <ListItem key={product.desc}>
                      {user?.name === product.name && (

                      <>
                        <ListItemText 
                        primary={product.desc} 
                        secondary={`${product.flavor} 數量: ${product.unit}, 總價格: ${product.price * product.unit} 元`}>  
                        </ListItemText>
                        <IconButton edge="end" aria-label="delete" onClick={() => deleteShoppingcart(String(product.id))}>
                          <DeleteIcon />
                        </IconButton>
                      </>
                      
                      )}
                    </ListItem>
                    )}
                    <Button variant="contained" color="primary" onClick={handleCheckout}>結帳</Button>
                </List>
            </div>
          </Box>
    )}