import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'
import { useSelector, useDispatch } from 'react-redux';
import { setProduct, reset } from '../../features/product/productSlice'
import { TextField, Button, Box, Grid } from '@mui/material';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import SaveIcon from '@mui/icons-material/Save';

export default function ProductForm({ fetchProducts }) {
  const dispatch = useDispatch();
  const product = useSelector((state) => state.product.product)
  const products = useSelector((state) => state.product.products)
  const token = localStorage.getItem('user_token')

  const [validationError, setValidationError] = useState({})
  const [isCreateForm, setIsCreateForm] = useState(true)

  const createProduct = async (values) => {
    // e.preventDefault();
    const formData = new FormData()
    formData.append('title', values.title)
    formData.append('description', values.description)

    if (values.id === 0) {
      formData.append('image', values.image[0])

      await axios.post(`http://lara-react-crud.local/api/products`, formData, { headers: { "Authorization": `Bearer ${token}` } }).then(({ data }) => {
        Swal.fire({
          icon: "success",
          text: data.message
        })
        fetchProducts()
        // dispatch(reset())
      }).catch(({ response }) => {
        if (response.status === 422) {
          setValidationError(response.data.errors)
        } else {
          Swal.fire({
            text: response.data.message,
            icon: "error"
          })
        }
      })
    } else {
      formData.append('_method', 'PATCH');
      if (values.image !== null) {
        formData.append('image', values.image[0])
      }

      await axios.post(`http://lara-react-crud.local/api/products/${values.id}`, formData, { headers: { "Authorization": `Bearer ${token}` } }).then(({ data }) => {
        Swal.fire({
          icon: "success",
          text: data.message
        })
        fetchProducts()
        dispatch(reset())
      }).catch(({ response }) => {
        if (response.status === 422) {
          setValidationError(response.data.errors)
        } else {
          Swal.fire({
            text: response.data.message,
            icon: "error"
          })
        }
      })
    }
  }

  const validate = Yup.object({
    title: Yup.string()
      .required('title field is required'),
    description: Yup.string()
      .required('description field is required'),
  }).shape({
    image: Yup.mixed().when("isCreateForm", {
      is: true,
      then: Yup.mixed().required('File is required')
    }),
  })

  const handleReset = (resetForm) => {
    resetForm();
  };

  const formik = useFormik({
    initialValues: {
      id: 0,
      title: '',
      description: '',
      image: null
    },
    validationSchema: validate,
    onSubmit: (values, { resetForm }) => {
      createProduct(values)
        .then(() => {
          resetForm()
        })
    },
  });

  useEffect(() => {
    setIsCreateForm(false)
    if (product.id > 0) {
      products.map((row) => {
        if (row.id === product.id) {
          const fields = ['id', 'title', 'description'];
          fields.forEach(field =>
            formik.setFieldValue(field, row[field], false)
          );

        }
        return true
      });
    }
  }, [product])

  useEffect(() => {
    console.log(isCreateForm)
  }, [])

  return (
    <Box sx={{ mt: 3 }}>
      {/* {console.log(formik)} */}

      <form onSubmit={formik.handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="title"
              fullWidth
              label="Title"
              type="text"
              required
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              fullWidth
              required
              id="description"
              label="Description"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="image"
              fullWidth
              id="image"
              hiddenLabel
              required
              type="file"
              // onChange={changeHandler}
              onChange={(event) => { formik.setFieldValue("image", [event.target.files[0]]) }}
              error={formik.touched.image && Boolean(formik.errors.image)}
              helperText={formik.touched.image && formik.errors.image}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" endIcon={<SaveIcon />}>
              Save
            </Button>
            <Button variant="contained" color="error" endIcon={<SaveIcon />} onClick={handleReset.bind(null, formik.resetForm)}>
              reset
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>

    // <Box component="form" noValidate onSubmit={createProduct} sx={{ mt: 3 }}>

    // </Box>
  )
}