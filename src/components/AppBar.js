import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';
import { Colors } from '../styles/theme';
import { DrawerWidth } from '../styles/theme';

function AppBar({ open, handleDrawerOpen }) {
  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${DrawerWidth}px)`,
      marginLeft: 0, // Change marginLeft to 0
      marginRight: `${DrawerWidth}px`, // Add marginRight for RTL layout
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
    direction: 'ltr', // Add direction: 'rtl' for RTL layout
  }));

  return (
    <AppBar position="fixed" elevation={0} open={open}>
      <Toolbar>
        <IconButton
          color={open ? 'default' : Colors.black} // Adjust the color based on your theme
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{ ml: 2, ...(open && { display: 'none' }) }} // Change mr to ml for RTL layout
        >
          <MenuIcon />
        </IconButton>
        {!open && (
          <Typography
            color={Colors.primary} // Adjust the color based on your theme
            fontWeight={'bold'}
            variant="h6"
            noWrap
            component="div"
          >
            Dress
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default AppBar;
