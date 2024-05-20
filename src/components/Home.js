import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:4000/signIN');
        setMessage('Login successful');
        setUsername(response.data.username);
        setAuth(true);
      } catch (error) {
        if (error.response) {
          setMessage(`Login failed: ${error.response.data.message}`);
          setAuth(false);
        } else if (error.request) {
          setMessage('Network error. Please try again.');
          setAuth(false);
        } else {
          setMessage('An unexpected error occurred. Please try again later.');
          setAuth(false);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  const handleLogout = () => {
    axios.get('http://localhost:4000/logout')
      .then(res => {
        window.location.reload(true);
      })
      .catch(err => console.log(err));
  }
  

  return (
    <div>
      {loading ? (
        <h3>Loading...</h3>
      ) : auth ? (
        <div>
          <h3>You are Authorized --- {username}</h3>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h3>{message}</h3>
          <h3>Login Now</h3>
        </div>
      )}
    </div>
  );
}

export default Home;
