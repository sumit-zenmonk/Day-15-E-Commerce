"use client"

import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks.ts';
import { RootState } from '@/redux/store';
import { RoleEnum } from '@/enums/role.enum';
import styles from './home.module.css';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAppSelector((state: RootState) => state.authReducer);

  return (
    <Box className={styles.container}>
      <Box className={styles.heroSection}>
        <Typography variant="h2" className={styles.title} fontWeight="bold">
          Welcome to <span className={styles.brandText}>Ecommerce</span>
        </Typography>

        <Typography variant="h5" className={styles.description} color="text.secondary">
          Discovser premium produscts, curated just for you. Become a seller or user,
          explore worldwide products, and make life easy.
        </Typography>

        <Box className={styles.buttonContainer}>

          {
            user?.role !== RoleEnum.ADMIN
            &&
            < Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={() => {
                if (user?.role === RoleEnum.USER) {
                  router.push('/user/products');
                } else {
                  router.push('/seller/product/products');
                }
              }}
            >
              Explore Now
            </Button>
          }
          {
            user?.role == RoleEnum.ADMIN
            &&
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={() => {
                router.push('/admin-dashboard');
              }}
            >
              Dashbaord
            </Button>
          }
        </Box>
      </Box>
    </Box >
  );
}
