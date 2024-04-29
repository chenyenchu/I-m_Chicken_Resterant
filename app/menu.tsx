'use client';
import { AppBar, Toolbar, Button } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import styles from './page.module.css'
import { AuthContext } from './account/AuthContext';
import { useContext, useState, useEffect } from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { getFirestore, collection, doc, getDocs, where, query } from 'firebase/firestore';
import app from "@/app/_firebase/Config";

export default function Menu() {
    const router = useRouter()
    const pathname = usePathname()
    const authContext = useContext(AuthContext);
    const getRole = authContext?.displayName || authContext?.role;
    const [userName, setUserName] = useState<string | null>(null);
    const db = getFirestore(app);

    useEffect(() => {
      const fetchUserName = async () => {
        if (authContext && authContext.email) {
          try {
            // 根據使用者的 email 查詢 Firestore 中的使用者資料
            const q = query(collection(db, 'users'), where('email', '==', authContext.email));
            const querySnapshot = await getDocs(q);
  
            if (!querySnapshot.empty) {
              // 如果有符合條件的文件，設置 userName 為該文件中的 name 欄位的值
              const userDocData = querySnapshot.docs[0].data();
              const name = userDocData.name || "";
              setUserName(name);
            }
          } catch (error) {
            console.error("Error getting user data from Firestore:", error);
          }
        }
      };
  
      fetchUserName();
      // cleanup 函數，用於清理上一個 useEffect 中的設置
        return () => {
          setUserName(null);
      };
    }, [authContext]);

  return (
    <div>
      <AppBar position="static">
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>我是Chicken</h1>
        <div>
          <Button color="inherit" variant={pathname === "/home" ? "outlined" : "text"} onClick={() => router.push("/home")}>首頁</Button>
          <Button color="inherit" variant={pathname === "/set" ? "outlined" : "text"} onClick={() => router.push("/set")}>套餐</Button>
          <Button color="inherit" variant={pathname === "/product" ? "outlined" : "text"} onClick={() => router.push("/product")}>單點</Button>
          <Button color="inherit" variant={pathname === "/soup" ? "outlined" : "text"} onClick={() => router.push("/soup")}>湯品</Button>
          <Button color="inherit" variant={pathname === "/dessert" ? "outlined" : "text"} onClick={() => router.push("/dessert")}>點心</Button>
          <Button color="inherit" variant={pathname === "/drink" ? "outlined" : "text"} onClick={() => router.push("/drink")}>飲料</Button>
          {/* （只有 admin 能看到） */}
          {authContext && getRole === "admin" &&(
          <>
            <Button color="inherit" variant={pathname === "/reserve" ? "outlined" : "text"} onClick={() => router.push("/reserve")}>訂位資訊</Button>
            <Button color="inherit" variant={pathname === "/foodorders" ? "outlined" : "text"} onClick={() => router.push("/foodorders")}>訂單</Button>
          </>
          )}
          {/* ( 只有 consumer 能看到） */}
          {authContext && getRole === "consumer" && (
          <>
            <Button color="inherit" variant={pathname === "/booking" ? "outlined" : "text"} onClick={() => router.push("/booking")}><CalendarMonthIcon/></Button>
            <Button color="inherit" variant={pathname === "/shoppingcart" ? "outlined" : "text"} onClick={() => router.push("/shoppingcart")}><ShoppingCartIcon /></Button>
          </>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
        {authContext && (
                <>
                    <div style={{ marginRight: '10px' }}>
                      {authContext.displayName}
                    </div>
                    <div style={{ marginRight: '10px' }}>
                      {"--"}
                    </div>
                    <div style={{ marginRight: '10px' }}>
                      {userName} 
                    </div>
                </>
            )}
        {/* {authContext && (
                        <div>
                            {authContext.displayName}
                        </div>
                    )}    
        {authContext && (
                        <div>
                            {"--"}
                        </div>
                    )}                          
        {userName && (
            <div>
              {userName} 
            </div>
          )}        */}
          <Button color="inherit" variant={pathname === "/account" ? "outlined" : "text"} onClick={() => router.push("/account")}>登入</Button>  
        </div>             
        </Toolbar>
      </AppBar>
    </div>
  );
}