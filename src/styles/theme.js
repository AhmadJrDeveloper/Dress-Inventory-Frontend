import {createTheme} from '@mui/material/styles';


export const DrawerWidth = 250;

//colors
export const Colors = {
    primary: "#0166AD",
    secondary: "#ba68c8",
    success: "#4CAF50",
    info: "#00a2ff",
    danger: "#FF5722",
    warning: "#FFC107",
    dark: "#0e1b20",
    light: "#aaa",
    muted: "#abafb3",
    border: "#DDDFE1",
    inverse: "#2F3D4A",
    shaft: "#333",
    transparent: "#00000000",

    /////////////////
    //Grays
    /////////////////
    background: '#F5F5F5',
    dim_grey: "#696969",
    dove_gray: "#d5d5d5",
    body_bg: "#f3f6f9",
    light_gray: "rgb(230,230,230)",

    ////////////////
    //Solid colors
    ////////////////
    white: "#fff",
    black: "#000",

};

//css utils
export const cssUtils = {
    boxShadow: 'rgba(149,157,165,0.2) 0px 8px 24px'
}
//css utils


//create theme

const theme = createTheme({
    palette: {
        primary: {
            main: Colors.primary
        },
        secondary:{
            main: Colors.secondary,
        },
    },

    components: {
        MuiAppBar: {
            styleOverrides: {
                root: { background: Colors.transparent },
            },
        },
        MuiButton: {
            defaultProps: {
                disableRipple: true,
                disableElevation:true,
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    width: DrawerWidth,
                    background: Colors.transparent,
                    color: Colors.light,
                },
            },
        },
       
    },
});

export default theme;