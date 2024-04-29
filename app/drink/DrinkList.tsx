'use client'
import {Box, Button, List, ListItem, ListItemText, TextField, IconButton, Dialog,DialogTitle,DialogContent,DialogActions, Fab} from "@mui/material";
import * as React from 'react';
import { useState } from "react";
import ListItemButton from '@mui/material/ListItemButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import useGetDrinks from "./useDrinks";
import { Drink } from "../_settings/interfaces";
import { AuthContext } from '../account/AuthContext';
import { useContext } from 'react';
import { doc, getDocs, getDoc, getFirestore, collection ,query, where} from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import app from "@/app/_firebase/Config";
import Image from 'next/image';
import { shoppingcart } from "../_settings/interfaces";

export default function DrinkList() {
    const authContext = useContext(AuthContext);
    const getRole = authContext?.displayName || authContext?.role;
    const db = getFirestore(app);
    const storage = getStorage(app);
    const [Drinks, addDrinks, deleteDrink, updateDrink, sendEmail, isLoading , addShoppingcart] = useGetDrinks();
    const [newProduct, setNewProduct] = useState<Drink>({ id: "", desc: "", price: 0, photo: "" });
    const [status, setStatus] = useState({ visible: false });
    const [file, setFile] = useState<File>();

    const handleClick = function (e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.name === "price") {
            setNewProduct({ ...newProduct, [e.target.name]: parseInt(e.target.value) })
        } else if (e.target.files !== null) {
            const selectedFile = e.target.files[0].name;
            setNewProduct({ ...newProduct, photo: selectedFile });
            setFile(e.target.files[0]);
        } else {
            setNewProduct({ ...newProduct, [e.target.name]: e.target.value })
        }
    }
    const show = () => {
      setStatus({ ...status, visible: true })
    }
    const hide = () => {
      setStatus({ ...status, visible: false })
      resetDrink();
    }
    
    async function addOrUpdate() {
      if (newProduct.id === "") {
          addDrinks(newProduct);
          sendEmail("新增產品", `新增產品 ${newProduct.desc} 成功`);
          if (file) {
              const imageRef = ref(storage, file.name);
              await uploadBytes(imageRef, file);
          }
      }
      else {
          updateDrink(newProduct);
          sendEmail("更新產品", `更新產品 ${newProduct.desc} 成功`);
      }
      setStatus({ ...status, visible: false })
      resetDrink();
    }

    function setUpdateDrink(drink: Drink) {
      setNewProduct({ ...drink })
      setStatus({ visible: true })
    }
    
    //購物車
    const [shoppingCart, setShoppingCart] = useState<shoppingcart[]>([]);
    const [dialogDescFromDatabase, setDialogDescFromDatabase] = useState("");
    const [dialogPriceFromDatabase, setDialogPriceFromDatabase] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [newProductDialogOpen, setNewProductDialogOpen] = useState(false);

    const openNewProductDialog = () => {
        setNewProductDialogOpen(true);
    };

    const closeNewProductDialog = () => {
        setNewProductDialogOpen(false);
        resetDrink();
    };
    const addToShoppingCart = async (product: shoppingcart) => {
        const existingItemIndex = shoppingCart.findIndex((item) => item.id === product.id);
          if (existingItemIndex !== -1) {
          setShoppingCart((prev) => {
            const updatedCart = [...prev];
            updatedCart[existingItemIndex] = {
              ...updatedCart[existingItemIndex],
              unit: quantity,
            };
            return updatedCart;
          });
        } else {
          setShoppingCart((prev) => [...prev, { ...product, unit: quantity }]);
          await addShoppingcart({ ...product, unit: quantity });
        }
      };
      const resetDrink = () => {
        setNewProduct({ id: "", desc: "", price: 0, photo: "" })
    }
    const handleAddButtonClick = async (clickedDrink: Drink) => {
      try {
        setDialogDescFromDatabase(clickedDrink.desc);
        setDialogPriceFromDatabase(clickedDrink.price);
        openNewProductDialog();
      } catch (error) {
        console.error("錯誤：", error);
      }
    };
    const addOrUpdates = async () => {
      if (newProduct.id === "") {
        const productForShoppingCart = {
          id: newProduct.id,
          desc: dialogDescFromDatabase,
          price: dialogPriceFromDatabase,
          flavor: "",
          unit: quantity,
          name: authContext?.name || "未知用户",
        };
    
        const shoppingCartId = await addToShoppingCart(productForShoppingCart);
    
        console.log("購物車 ID:", shoppingCartId);
      } else {
        updateDrink(newProduct);
      }
      setNewProductDialogOpen(false);
      resetDrink();
    };

    //圖片處理
    const [photo, setPhoto] = useState("");
    const loadProductProfile = async (desc:String) => {
        try {
            const productCollection = collection(db, 'drink');
            const q = query(productCollection, where('desc', '==', desc));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach(async (doc) => {
                const photo = doc.data().photo;
                console.log('Raw photo data:', photo)
                const starsRef = ref(storage, photo);
                const photoURL = await getDownloadURL(starsRef);   
                console.log('Processed photo URL:', photoURL)
                setPhoto(photoURL);
            });
        } catch (error) {
            console.error("發生錯誤：", error);
        }
    };
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const handleClickToShowDialog = (x:String) => {
        setPhoto("");
        setIsDialogOpen(true);
        loadProductProfile(x);
    };
    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

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
            overflowY: 'scroll', // 允许垂直滚动
            maxHeight: '100vh', // 限制最大高度
        }}>
        {authContext && getRole === "admin" &&(
          <> 
            <Fab color="primary"aria-label="Add" sx={{ position: 'fixed', bottom: '16px', right: '16px',}} onClick={show}>
              <AddIcon />
            </Fab>
            <Dialog open={status.visible} onClose={hide} aria-labelledby={newProduct.id === "" ? "新增產品" : "更新產品"}>
              <DialogTitle>{newProduct.id === "" ? "新增產品" : "更新產品"}</DialogTitle>
              <DialogContent>
               <TextField label="產品描述" variant="outlined" name="desc" value={newProduct.desc} onChange={handleClick} /><p />
               <TextField type="number" label="產品價格" variant="outlined" name="price" value={newProduct.price} onChange={handleClick} /><p />
               <div>
                    <TextField type="file" inputProps={{ accept: 'image/x-png,image/jpeg' }}name="file" onChange={handleClick} />
                </div>
             </DialogContent>
             <DialogActions>
              <IconButton aria-label="close" onClick={hide} sx={{ position: 'absolute', right: 8, top: 8,}}>
                <CloseIcon />
              </IconButton>
              <Button variant="contained" color="primary" onClick={addOrUpdate}>{newProduct.id === "" ? "新增產品" : "更新產品"}</Button>
             </DialogActions>
            </Dialog>
          </>
        )}
              <div>
                {/* <button onClick={show}>新增產品</button> */}
                <List subheader="" aria-label="product list">
                  {Drinks.map((drink, index) =>
                    <ListItem divider key={drink.desc}>
                      <ListItemText primary={drink.desc} secondary={`$${drink.price}`} onClick={() => handleClickToShowDialog(drink.desc)}>
                      </ListItemText>
                      {authContext && getRole === "consumer" &&(
                        <> 
                          <IconButton edge="end" aria-label="add" onClick={() => handleAddButtonClick(drink)}>
                            <AddIcon />
                          </IconButton> 
                        
                    </>
                      )}  
                      {authContext && getRole === "admin" &&(
                          <> 
                          <IconButton edge="end" aria-label="edit" onClick={() =>setUpdateDrink(drink)}>
                            <EditIcon />
                          </IconButton> 
                              <IconButton edge="end" aria-label="delete" onClick={() => deleteDrink(drink.id, drink.photo)}>
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                    </ListItem>)}
                </List>
                <Dialog open={newProductDialogOpen} onClose={closeNewProductDialog} aria-labelledby="新增產品">
                        <DialogTitle>加入購物車</DialogTitle>
                            <DialogContent>
                            <TextField
                                label="產品描述"
                                variant="outlined"
                                name="desc"
                                value={dialogDescFromDatabase}
                                disabled
                            />
                            <p />
                            <TextField
                                type="number"
                                label="產品價格"
                                variant="outlined"
                                name="price"
                                value={dialogPriceFromDatabase}
                                disabled
                             />
                            <p />
                            <TextField
                                type="number"
                                label="數量"
                                variant="outlined"
                                name="quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                            />
                            </DialogContent>
                        <DialogActions>
                            <Button variant="contained" color="primary" onClick={addOrUpdates}>
                                確認
                            </Button>
                            <Button onClick={closeNewProductDialog}>取消</Button>
                        </DialogActions>
                    </Dialog>
                <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
                    <DialogContent>
                        <Image src={photo} alt="食物照片" priority={true} height={300} width={300} />
                    </DialogContent>
                    <DialogActions>
                        <button onClick={handleCloseDialog}>關閉</button>
                    </DialogActions>
                </Dialog>
              </div>
          </Box>
    )
  }