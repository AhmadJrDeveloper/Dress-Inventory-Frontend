import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { DrawerWidth, Colors } from '../styles/theme';
import AppBar from './AppBar';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import EarbudsIcon from '@mui/icons-material/Earbuds';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DomainIcon from '@mui/icons-material/Domain';
import SellIcon from '@mui/icons-material/Sell';
import PeopleIcon from '@mui/icons-material/People';
import DataArrayIcon from '@mui/icons-material/DataArray';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import Typography from '@mui/material/Typography';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DryCleaningIcon from '@mui/icons-material/DryCleaning';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { useUser } from './UserContext';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const MyListItemButton = ({ selected, icon, text, handleNavbarItemClicked }) => (
  <ListItemButton
    onClick={() => handleNavbarItemClicked(text)}
    sx={{
      ...(selected && {
        background: Colors.white,
        borderRadius: 2,
        fontWeight: 'bold',
        color: Colors.black,
      }),
    }}
  >
    <ListItemIcon sx={{ color: selected && Colors.primary }}>
      {icon}
    </ListItemIcon>
    <ListItemText primary={text} />
  </ListItemButton>
);

export default function NavDrawer({ open, setOpen }) {
  const { userr } = useUser();
  const { branchId, username, id, userType } = userr;
  console.log("hello values ", branchId, username, id);

  const theme = useTheme();
  const [selectedItem, setSelectedItem] = React.useState('');
  const navigate = useNavigate();
  const cookies = new Cookies();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleNavbarItemClicked = (item) => {
    setSelectedItem(item);
    navigate(item);
  };

  const handleLogout = () => {
    cookies.remove('token');
    navigate('/signIN');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar open={open} handleDrawerOpen={() => setOpen(true)} />

      <Drawer
        sx={{
          width: DrawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DrawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          {open && (
            <Typography
              color={Colors.black}
              fontWeight={'bold'}
              variant="h6"
              noWrap
              component="div"
            >
              Dress Store
            </Typography>
          )}

          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {(userType === 'مسؤول' ? [
            { text: 'فساتين', icon: <CheckroomIcon /> },
            { text: 'الإكسسوارات', icon: <EarbudsIcon /> },
            { text: 'المبيعات', icon: <SellIcon /> },
            { text: 'التأجير', icon: <SyncAltIcon /> },
            { text: 'الموظفين', icon: <PeopleIcon /> },
            { text: 'العملاء', icon: <PeopleIcon /> },
            { text: 'الفروع', icon: <DomainIcon /> },
            { text: 'المغاسل', icon: <LocalLaundryServiceIcon /> },
            { text: 'لائحة التأجير', icon: <DataArrayIcon /> },
            { text: 'لائحة الغسيل', icon: <DryCleaningIcon /> },
            { text: 'حسابات العملاء', icon: <AttachMoneyIcon /> },
            { text: 'حسابات الفروع', icon: <AttachMoneyIcon /> },
            { text: 'الخروج', icon: <ExitToAppIcon />, onClick: handleLogout },
          ] : [
            { text: 'فساتين', icon: <CheckroomIcon /> },
            { text: 'الإكسسوارات', icon: <EarbudsIcon /> },
            { text: 'المبيعات', icon: <SellIcon /> },
            { text: 'التأجير', icon: <SyncAltIcon /> },
            { text: 'العملاء', icon: <PeopleIcon /> },
            { text: 'لائحة التأجير', icon: <DataArrayIcon /> },
            { text: 'لائحة الغسيل', icon: <DryCleaningIcon /> },
            { text: 'الخروج', icon: <ExitToAppIcon />, onClick: handleLogout },
          ]).map(({ text, icon, onClick }) => (
            <ListItem disablePadding key={text}>
              <MyListItemButton
                text={text}
                icon={icon}
                handleNavbarItemClicked={onClick ? () => onClick() : handleNavbarItemClicked} 
                selected={selectedItem.localeCompare(text, 'ar', { sensitivity: 'base' }) === 0}
              />
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
    </Box>
  );
}
