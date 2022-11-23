import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'
//material-ui
import { Stack, IconButton, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress } from '@mui/material';
//redux
import { setProduct } from '../../features/product/productSlice'
import { useSelector, useDispatch } from 'react-redux';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ProductTable({ fetchProducts }) {
  const products = useSelector((state) => state.product.products)
  const dispatch = useDispatch()
  const token = localStorage.getItem('user_token')

  const editProduct = async (id) => {
    console.log(id)
    if (id > 0) {
      products.map((row) => {
        if (row.id === id) {
          dispatch(setProduct(row))
        }
        return true
      });
    }
  }

  const deleteProduct = async (id) => {
    const isConfirm = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      return result.isConfirmed
    });

    if (!isConfirm) {
      return;
    }

    await axios.delete(`http://lara-react-crud.local/api/products/${id}`, { headers: { "Authorization": `Bearer ${token}` } }).then(({ data }) => {
      Swal.fire({
        icon: "success",
        text: data.message
      })
      fetchProducts()
    }).catch(({ response: { data } }) => {
      Swal.fire({
        text: data.message,
        icon: "error"
      })
    })
  }

  return (

    <Table sx={{ minWidth: 500 }}>
      <TableHead>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell align="right">Description</TableCell>
          <TableCell align="right">Image</TableCell>
          <TableCell align="right">Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {
          products.length > 0 && (
            products.map(
              (row, key) => (
                <TableRow
                  key={key}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.title}
                  </TableCell>
                  <TableCell align="right">{row.description}</TableCell>
                  <TableCell align="right">
                    <img width="50px" src={`http://lara-react-crud.local/storage/product/image/${row.image}`} alt="" />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row"
                      justifyContent="flex-end">
                      <IconButton color="primary" onClick={() => editProduct(row.id)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => deleteProduct(row.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              )
            )
          )
        }
        {!products &&
          <TableRow>
            <TableCell colSpan={4} align="center">
              <CircularProgress />
            </TableCell>
          </TableRow>
        }
        {products && !products.length &&
          <TableRow>
            <TableCell colSpan={4} align="center">
              No Products To Display
            </TableCell>
          </TableRow>
        }
      </TableBody>
    </Table >
  )
}