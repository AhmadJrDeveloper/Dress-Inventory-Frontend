// ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { useUser } from './components/UserContext';

const ProtectedRoute = ({ element, type, usernameProp, branchIdProp,idProp ,userTypeProp}) => {
  const { setUser } = useUser();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const setUserTypeFromToken = async () => {
      try {
        // Use the username and branchId props if available
        const authToken = Cookies.get('token');
        console.log('Token from cookie:', authToken);
        setAuthenticated(true);

        if (!authToken) {
          setAuthenticated(false);
          return;
        }

        const decodedToken = jwtDecode(authToken);
        const userType = decodedToken.type || userTypeProp;
        const branchId = decodedToken.branch || branchIdProp; // Use prop if available
        const username = decodedToken.username || usernameProp; // Use prop if available
        const id = decodedToken.id || idProp; // Use prop if available
        setAuthenticated(true);

        setUser({ username, branchId, id , userType});

        console.log('User Type:', userType);
        console.log('Branch ID:', branchId);
        console.log('Username:', username);
        console.log('ID:', id);
      } catch (e) {
        console.error(e);
        setAuthenticated(false);
      }
    };

    // Call the asynchronous function
    setUserTypeFromToken();
  }, [usernameProp, branchIdProp, setUser, userTypeProp]); // Include setUser in the dependency array

  if (!authenticated) {
    return <Navigate to="/signIN" replace />;
  }

  return element;
};

export default ProtectedRoute;
