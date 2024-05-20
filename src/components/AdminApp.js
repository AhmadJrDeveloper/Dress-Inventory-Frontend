import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Box } from '@mui/material';
import { Colors, DrawerWidth } from '../styles/theme';
import { styled } from '@mui/material/styles';
import NavDrawer from './NavDrawer';
import SignIn from '../pages/SignIn';
import Dresses from './Dresses';
import Accessory from './Accessory';
import Users from './Users';
import Branches from './Branches';
import Sell from './Sell';
import Rent from './Rent';
import RentLog from './RentLog';
import Customer from './Customer';
import Land from './Land';
import LaundryLog from './LaundryLog';
import CustomerAccounting from './CustomerAccounting'
import ProtectedRoute from '../ProtectedRoute';
import { UserProvider } from './UserContext';
import { useLocation } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
 

// Styled main component
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${DrawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

function Layout({ open, setOpen }) {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/signIN' && location.pathname !=="/" && <NavDrawer open={open} setOpen={setOpen} />}
      <Main open={open}>
        <Routes>
          <Route path="/signIN" element={<SignIn />} />
          <Route path="/" element={<SignIn />} />
          <Route path="/فساتين" element={<ProtectedRoute element={<Dresses />} />} />
          <Route path="/الإكسسوارات" element={<ProtectedRoute element={<Accessory />} />} />
          <Route path="/الموظفين" element={<ProtectedRoute element={<Users />} />} />
          <Route path="/الفروع" element={<Branches />} />
          <Route path="/المبيعات" element={<ProtectedRoute element={<Sell />} />} />
          <Route path="/التأجير" element={<ProtectedRoute element={<Rent />} />} />
          <Route path="/العملاء" element={<ProtectedRoute element={<Customer />} />} />
          <Route path="/المغاسل" element={<ProtectedRoute element={<Land />} />} />
          <Route path="/لائحة التأجير" element={<ProtectedRoute element={<RentLog />} />} />
          <Route path="/لائحة التأجير" element={<ProtectedRoute element={<RentLog />} />} />
          <Route path="/حسابات العملاء" element={<ProtectedRoute element={<CustomerAccounting />} />} />
          <Route path="/لائحة الغسيل" element={<ProtectedRoute element={<LaundryLog />} />} />
        </Routes>
      </Main>
    </>
  );
}

function AdminApp() {
  const [open, setOpen] = useState(true);

  return (
    <Router>
      <UserProvider>
        <Box sx={{ display: 'flex', background: Colors.background, height: '100vh' }}>
          <Layout open={open} setOpen={setOpen} />
        </Box>
      </UserProvider>
    </Router>
  );
}

export default AdminApp;