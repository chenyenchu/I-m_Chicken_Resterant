'use client'
import React, { useState } from 'react';
import { Box, Button, TextField, MenuItem } from '@mui/material';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import app from "@/app/_firebase/Config";
import { FirebaseError } from 'firebase/app';
import styles from '../page.module.css';
import { AuthContext } from '../account/AuthContext';
import { useContext } from 'react';
import { Account } from "../_settings/interfaces";
import useGetAccounts from "./useAccount";


export default function Account() {
    // 假設您在這裡使用了 useState，確保這裡有設置 setUserName
    const [userName, setUserName] = useState<string | null>(null);
    const auth = getAuth(app);
    const authContext = useContext(AuthContext);
    const [Accounts, addAccount, deleteAccount] = useGetAccounts();
    // const [newProduct, setNewProduct] = useState<Account>({ id: "", name: "", email: "", role: "" });
    const [account, setAccount] = useState({ id: "", email: "", password: "", name: "", role: "" });
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("註冊");
    const handleChange = function (e: React.ChangeEvent<HTMLInputElement>) {
        setAccount({ ...account, [e.target.name]: e.target.value })
    }
    const changeStatus = function (e: React.MouseEvent<HTMLElement>) {
        if (status === "註冊") {
            setStatus("登入");
        }
        else {
            setStatus("註冊");
        }
    }
    const logout = function (e: React.MouseEvent<HTMLElement>) {
        // 在登出前手動設置 userName
        setUserName(null);
        auth.signOut();
        setMessage("登出成功");
    }

    const resetAccount = () => {
        // 重置輸入框或其他狀態
        setAccount({ id: "", email: "", password: "", name: "", role: "" });
    }

    const handleSubmit = async function (e: React.MouseEvent<HTMLElement>) {
        try {
            if (status === "註冊") {
                const res = await createUserWithEmailAndPassword(auth, account.email, account.password);
                addAccount(account);
                resetAccount();
                // deleteAccount(account);
                setMessage(`註冊成功，歡迎 ${res.user?.email}`);
                // console.log(res)
            }
            else {
                const res = await signInWithEmailAndPassword(auth, account.email, account.password);
                setMessage(`登入成功，歡迎 ${res.user?.email}`);
            }
        }
        catch (e) {
            if (e instanceof FirebaseError) {
                let message = "";
                switch (e.code) {
                    case "auth/email-already-in-use":
                        message = "電子信箱已註冊";
                        break;
                    case "auth/weak-password":
                        message = "密碼強度不足";
                        break;
                    case "auth/invalid-email":
                        message = "電子郵件格式錯誤";
                        break;
                    case "auth/user-not-found":
                        message = "電子郵件信箱不存在";
                        break;
                    case "auth/wrong-password":
                        message = "密碼錯誤";
                        break;
                    case "auth/too-many-requests":
                        message = "登入失敗次數過多，請稍後再試";
                        break;
                    default:
                        message = "系統錯誤:" + e.code;
                }
                setMessage(message);
            }
            else {
                if (e instanceof Error) {
                    setMessage(e.message);
                }
                else {
                    setMessage("系統錯誤");
                }
            }
        }

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


                {authContext ? (
                <>

                <div className={styles.logout}>
                    <h1>已登入帳號</h1>
                    <Button variant="contained" color="secondary" onClick={logout}>登出</Button>
                </div>

                </>
                ) : (
                <>

                <div className={styles.loginstyle1}>
                    {status === '註冊' && <TextField type="text" name="name" value={account.name}
                        placeholder="姓名" label="姓名:" onChange={handleChange} />
                    }
                </div>
                <div className={styles.loginstyle2}>
                    <TextField type="email" name="email" value={account.email}
                        placeholder="電子郵件信箱" label="電子郵件信箱:" onChange={handleChange} autoComplete='username' />
                </div>
                <div className={styles.loginstyle3}>
                    <TextField type="password" name="password" value={account.password}
                        placeholder="密碼" label="密碼:" onChange={handleChange} autoComplete='current-password' />
                </div>
                <div className={styles.loginstyle4}>
                    {status === '註冊' &&
                        <TextField
                            select
                            name="role"
                            value={account.role}
                            onChange={handleChange}
                            placeholder="身分"
                            label="身分:"
                            autoComplete='current-role'
                            style={{ width: 225 }}
                        >
                            <MenuItem value="admin">管理員</MenuItem>
                            <MenuItem value="consumer">消費者</MenuItem>
                        </TextField>
                    }
                </div>
                <div className={styles.loginstyle5}>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>{status}</Button>
                </div>
                <div className={styles.loginstyle6}>
                    <Button variant="contained" color="secondary" onClick={changeStatus}>
                        {status === '註冊' ? "已經註冊，我要登入" : "尚未註冊，我要註冊"}</Button>
                </div>
                <div className={styles.loginstyle7}>{message}</div>

                </>
                )}
            </Box>
        </form>
    )
}