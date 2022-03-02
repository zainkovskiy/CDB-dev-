import React from "react";
import Button from '@mui/material/Button';

import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

import './Header.css';

export function Header () {
  return (<div className='header'>
            <img className='header__logo' src="https://crm.centralnoe.ru/dealincom/assets/logo_can.jpg" alt="logo"/>
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" underline="hover" href="/">
                Объект
              </Link>
              <Typography color="textPrimary">ДОУ</Typography>
              <Link color="inherit" underline="hover" href="/">
                Фото
              </Link>
              <Link color="inherit" underline="hover" href="/">
                Реклама
              </Link>
              <Link color="inherit" underline="hover" href="/">
                ПДКП/ДКП
              </Link>
            </Breadcrumbs>
          </div>)
}
