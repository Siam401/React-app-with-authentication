import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Box, Grid } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setToken, setAuthenticated } from '../../../features/auth/userSlice'
import { useFormik } from 'formik';
import * as Yup from 'yup';


export default function Login() {
  const authenticated = localStorage.getItem('authenticated')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [validationError, setValidationError] = useState({})

  const login = async (values) => {
    const formData = new FormData()
    formData.append('email', values.email)
    formData.append('password', values.password)

    await axios.post(`http://lara-react-crud.local/api/auth/login`, formData).then(({ data }) => {
      localStorage.setItem('user_token', data.token)
      localStorage.setItem('authenticated', true)
      dispatch(setToken(data.token))
      dispatch(setAuthenticated(true))
      Swal.fire({
        icon: "success",
        text: data.message
      })
      navigate("/");
    }).catch(({ response }) => {
      console.log(response)
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

  const validate = Yup.object({
    email: Yup.string()
      .required('email field is required'),
    password: Yup.string()
      .required('password field is required'),
  })


  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: validate,
    onSubmit: (values, { resetForm }) => {
      login(values)
        .then(() => {
          resetForm()
        })
    },
  });

  if (authenticated) {
    navigate("/");
  } else {
    return (


      <Container>
        <Box varient="flex" mt={3}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ mt: 3 }}>
                {/* {console.log(formik)} */}

                <form onSubmit={formik.handleSubmit} noValidate>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        name="email"
                        type="email"
                        fullWidth
                        required
                        id="email"
                        label="Email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="password"
                        type="password"
                        fullWidth
                        required
                        id="password"
                        label="Password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button type="submit" variant="contained">
                        Login
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>


      // <Box component="form" noValidate onSubmit={createProduct} sx={{ mt: 3 }}>

      // </Box>
    )

  }
}