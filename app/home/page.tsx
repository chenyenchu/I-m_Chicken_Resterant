'use client'
import {Box} from "@mui/material";
import * as React from 'react';
import { useState } from "react";
import ListItemButton from '@mui/material/ListItemButton';
import { Soup } from "../_settings/interfaces";
import { AuthContext } from '../account/AuthContext';
import { useContext } from 'react';
import { doc, getDocs, getDoc, getFirestore, collection,query, where} from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import app from "@/app/_firebase/Config";
import Image from 'next/image';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './homeStyle.css';
  
export default function HomePage() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 50,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        adaptiveHeight: true,
      };

    return (
        <Slider {...settings}>
            <div className="slide">
                <img src="./new.png" alt="new" className="full-width-image" />
            </div>
            <div className="slide">
                <img src="./xmas.png" alt="xmas" className="full-width-image" />
            </div>
        </Slider>
    );
}