import * as React from "react";
import { useEffect } from 'react';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import "bootstrap/dist/css/bootstrap.css";
import { useDispatch, useSelector } from 'react-redux';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";

import ProductList from "./components/product-material-ui/list.component";
import Login from "./components/product-material-ui/auth/login.component";
import Registration from "./components/product-material-ui/auth/registration.component";
import { setAuthenticated, setToken } from "./features/auth/userSlice";

function App() {
  const dispatch = useDispatch()
  // const navigate = useNavigate()

  let authenticated = useSelector((state) => state.user.authenticated)

  const logout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('authenticated');
    dispatch(setAuthenticated(false))
    dispatch(setToken(''))
  };

  useEffect(() => {
    if (localStorage.getItem('authenticated')) {
      dispatch(setAuthenticated(true))
      dispatch(setToken(localStorage.getItem('user_token')))
    } else {
      dispatch(setAuthenticated(false))
    }
  }, [])


  return (
    <Router>

      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              React App
            </Typography>
            {authenticated &&
              <Link to={"/"} className="navbar-brand text-white">
                <Button color="inherit">Product</Button>
              </Link>
            }
            {authenticated &&
              <Button color="inherit" onClickCapture={logout}>Logout</Button>
            }
            {!authenticated &&
              <Link to={"/login"} className="navbar-brand text-white">
                <Button color="inherit">Login</Button>
              </Link>
            }
            {!authenticated &&
              <Link to={"/registration"} className="navbar-brand text-white">
                <Button color="inherit">Registration</Button>
              </Link>
            }



          </Toolbar>
        </AppBar>

        <Container>
          <Routes>
            <Route exact path='/' element={<ProductList />} />
            <Route exact path='/login' element={<Login />} />
            <Route exact path='/registration' element={<Registration />} />
          </Routes>
        </Container>
      </Box>
    </Router >
  );
}

export default App;