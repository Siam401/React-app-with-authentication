import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
//material-ui
import { Box, Container, Grid, Typography, TableContainer, Paper } from '@mui/material';
//redux
import { setProducts, reset } from '../../features/product/productSlice'
import { setAuthenticated } from '../../features/auth/userSlice'
import { useDispatch, useSelector } from 'react-redux';

import ProductForm from './form.component';
import ProductTable from './table.component';

export default function List() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const authenticated = localStorage.getItem('authenticated')
  const token = localStorage.getItem('user_token')
  useEffect(() => {
    dispatch(reset())
    fetchProducts()
  }, [])


  const fetchProducts = async () => {
    await axios.get(`http://lara-react-crud.local/api/products`, { headers: { "Authorization": `Bearer ${token}` } }).then(({ data }) => {
      dispatch(setProducts(data))
    })
  }

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  useEffect(() => {
    if (!authenticated) {
      navigate("/login");
    }
  }, [authenticated])
  if (!authenticated) {
    console.log('asd')
    navigate("/login");
  } else {
    return (
      <Container>
        <Box varient="flex" mt={3}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Item>

                <Typography variant="h5" component="div">
                  Create Product
                </Typography>

                <ProductForm fetchProducts={fetchProducts} />
              </Item>
            </Grid>

            <Grid item xs={6}>
              <Item>
                <TableContainer>
                  <ProductTable fetchProducts={fetchProducts} />
                </TableContainer>
              </Item>
            </Grid>
          </Grid>
        </Box>
      </Container>
    )

  }
}