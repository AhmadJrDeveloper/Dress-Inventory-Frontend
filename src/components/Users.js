import React, { useState,useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Typography } from '@mui/material';
import { Colors } from '../styles/theme';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useUser } from './UserContext';





const validationSchema = Yup.object().shape({
  username: Yup.string().required('الرجاء إدخال إسم الموظف'),
  password: Yup.string().required('الرجاء إدخال كلمة المرور'),
  user_type: Yup.string().required('الرجاء إختيار وظيفة الموظف'),
  branch:Yup.string().required('الرجاء إدخال فرع الموظف'),

});

export default function Users() {
  
    const [open, setOpen] = useState(false)
    const [userData, setuserData] = useState([])
    const [refreshPage, setRefreshPage] = useState(false);
    const [branches, setBranches] = useState([]); // New state for branches
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [deletinguserId, setDeletinguserId] = useState(null);
    const [updatinguserId, setUpdatinguserId] = useState(null);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const PAGE_SIZE = 9;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const {userr} = useUser();
    const { branchId, username, id } = userr;
    console.log("hello values ",branchId, username,id)
    

  const handleAdduser = () => {
    setOpen(true);
    console.log('Aduseres');
  };
  
  const handleCloseForm = () => {
    setOpen(false);
  }

  


  //fetching data
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the API
        const response = await axios.get(`http://localhost:4000/users`);
  
        const totalItems = response.data.length;
        const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
  
        // Paginate the data
        const paginatedData = response.data.slice(startIndex, endIndex);
  
        // Update state only if the request is successful
        setuserData(paginatedData);
        setTotalPages(totalPages);
      } catch (error) {
        console.log(error);
        // Handle errors if needed
      }
    };
  
    // Call the fetchData function
    fetchData();
  
  }, [refreshPage, currentPage]);
  
    //fetching data


    //posting user
   
  
    const addUser = async (values) => {
      try {
        console.log('Formik Values:', values.username,values.password,
        values.user_type,values.branch); // Log the values here
    
        const response = await axios.post('http://localhost:4000/users',{
            username: values.username,
            password: values.password,
            user_type: values.user_type,
            branch_id: values.branch,
        });
    
        console.log('Server Response:', response);
    
        if (response.status === 200) {
          setuserData((prevData) => [...prevData, response.data]);
          handleCloseForm();
          setRefreshPage((prev) => !prev);
        } else {
          console.error(
            'Error adding user. Server responded with:',
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error('Error adding user:', error);
      }
    };
    
  
        
  //posting user

  //Delete Function

  const handleOpenDeleteConfirmation = (userId) => {
    setDeletinguserId(userId);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmed = () => {
    handleDeleteuser(deletinguserId);
    setDeleteConfirmationOpen(false);
  };
  
  
  const handleDeleteuser = async (userId) => {
    try {
      const response = await axios.delete(`http://localhost:4000/users/${userId}`);
  
      if (response.status === 200) {
        setuserData((prevData) => prevData.filter((user) => user.id !== userId));
        setRefreshPage((prev) => !prev);
      } else {
        console.error(
          'Error deleting user. Server responded with:',
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
//Delete Function  

//Update Function
const handleOpenUpdateDialog = (userId) => {
  setUpdatinguserId(userId);
  setUpdateDialogOpen(true);
};

const updateUser = async (values) => {
  try {
    console.log('Formik Values:', values);

    const response = await axios.put(
      `http://localhost:4000/users/${updatinguserId}`,
      {
        username: values.username,
        password: values.password,
        user_type: values.user_type,
        branch_id: values.branch,
      }
    );

    console.log('Server Response:', response);

    if (response.status === 200) {
      setuserData((prevData) =>
        prevData.map((user) =>
          user.id === updatinguserId ? response.data : user
        )
      );
      setUpdateDialogOpen(false); // Close the dialog after successful update
      setRefreshPage((prev) => !prev);
    } else {
      console.error(
        'Error updating user. Server responded with:',
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

//Update Function


  return (
    <div style={{ direction: "rtl " }}>
      <h1>الموظفين</h1>
      <Button 
        startIcon={<AddIcon />}
        variant="contained"
        onClick={handleAdduser}
      >
        إضافة موظف
      </Button>

      <TableContainer>
        <Table>
          <TableHead>
            <TableCell>الإسم</TableCell>
            <TableCell>الوظيفة</TableCell>
            <TableCell>الفرع</TableCell>
            <TableCell>حذف أو تعديل </TableCell>
          </TableHead>
          <TableBody>
      {userData.map((user) => (
        user ? (
          console.log(user),
          <TableRow key={user.id}>
            <TableCell>{user.username}</TableCell>
            <TableCell>{user.user_type}</TableCell>
            <TableCell>{user.branch && user.branch.name}</TableCell>
            <TableCell>
            <IconButton onClick={() => handleOpenUpdateDialog(user.id)}>
              <EditIcon sx={{ color: Colors.primary }} />
            </IconButton>
            <IconButton onClick={() => handleOpenDeleteConfirmation(user.id)}>
              <DeleteForeverIcon sx={{ color: Colors.danger }} />
            </IconButton>
            </TableCell>
          </TableRow>
        ) : null
      ))}
    </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} fullWidth maxWidth="lg">
        <DialogTitle>{"إضافة موظف"}</DialogTitle>

        <Formik
  validationSchema={validationSchema}
  onSubmit={addUser}
  initialValues={{
    username: '',     // Initial value for the 'name' field
    password: '', // Initial value for the 'password' field
    user_type: '',     // Initial value for the 'type' field
    branch: '',   // Initial value for the 'branch' field
  }}
>
  {({ dirty, isValid, values, errors, handleChange }) => (
    <Form>
      <DialogContent>
      <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="الإسم"
              required
              fullWidth
              name="username"
              value={values.username}
              onChange={handleChange}
              />
            {errors.username && (
              <Typography color="red">{errors.username}</Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="كلمة المرور"
              required
              fullWidth
              name="password"
              value={values.password}
              onChange={handleChange}
              />
            {errors.password && (
              <Typography color="red">{errors.password}</Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <Select
              name="user_type"
              required
              fullWidth
              label="الوظيفة"
              value={values.user_type}
              onChange={handleChange}
              displayEmpty
            >
              <MenuItem value="" disabled>
                اختر الوظيفة
              </MenuItem>
              <MenuItem value="بائع">بائع</MenuItem>
              <MenuItem value="مسؤول">مسؤول</MenuItem>
            </Select>
            {errors.user_type && (
              <Typography color="red">{errors.user_type}</Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <Select
              name="branch"
              required
              fullWidth
              label="الفرع"
              value={values.branch}
              onChange={handleChange}
              displayEmpty
            >
              <MenuItem value="" disabled>
                اختر الفرع
              </MenuItem>
              {branches.map((branch) => (
                <MenuItem key={branch.id} value={branch.id}>
                  {branch.name}
                </MenuItem>
              ))}
            </Select>
            {errors.branch && (
              <Typography color="red">{errors.branch}</Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button type="submit" variant="contained" color="primary" disabled={!isValid || !dirty}>
        أضف
      </Button>
        <Button autoFocus onClick={handleCloseForm}>
          إلغاء
        </Button>
      </DialogActions>
    </Form>
  )}
</Formik>;
      </Dialog>
      <Dialog open={deleteConfirmationOpen} onClose={() => setDeleteConfirmationOpen(false)}>
  <DialogTitle>تأكيد الحذف</DialogTitle>
  <DialogContent>
    <Typography>هل أنت متأكد أنك تريد حذف هذا الموظف؟</Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setDeleteConfirmationOpen(false)} color="primary">
      إلغاء
    </Button>
    <Button onClick={handleDeleteConfirmed} color="primary">
      حذف
    </Button>
  </DialogActions>
</Dialog> 
<Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)}>
  <DialogTitle>تحديث الموظف</DialogTitle>

  <Formik
  validationSchema={validationSchema}
  onSubmit={updateUser}
  initialValues={{
    username: userData.find(user => user.id === updatinguserId)?.username || '',
    user_type: userData.find(user => user.id === updatinguserId)?.user_type || '',
    branch: userData.find(user => user.id === updatinguserId)?.branch_id || '',

  }}
>
  {({ dirty, isValid, values, handleSubmit, handleChange,errors }) => (
    <Form>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="الإسم"
              required
              fullWidth
              name="username"
              value={values.username}
              onChange={handleChange}
              />
            {errors.username && (
              <Typography color="red">{errors.username}</Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <Select
              name="user_type"
              required
              fullWidth
              label="الوظيفة"
              value={values.user_type}
              onChange={handleChange}
              displayEmpty
            >
              
              <MenuItem value="بائع">بائع</MenuItem>
              <MenuItem value="مسؤول">مسؤول</MenuItem>
            </Select>
            {errors.user_type && (
              <Typography color="red">{errors.user_type}</Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <Select
              name="branch"
              required
              fullWidth
              label="الفرع"
              value={values.branch}
              onChange={handleChange}
              displayEmpty
            >
              <MenuItem value="" disabled>
                اختر الفرع
              </MenuItem>
              {branches.map((branch) => (
                <MenuItem key={branch.id} value={branch.id}>
                  {branch.name}
                </MenuItem>
              ))}
            </Select>
            {errors.branch && (
              <Typography color="red">{errors.branch}</Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button type="submit" variant="contained" color="primary" disabled={!isValid || !dirty}>
        أضف
      </Button>
        <Button autoFocus onClick={() => {setUpdateDialogOpen(false)}}>
          إلغاء
        </Button>
      </DialogActions>
    </Form>
  )}
</Formik>;

</Dialog>
<Pagination
  count={totalPages}  // Update this line to use totalPages
  page={currentPage}
  onChange={handlePageChange}
  color="primary"
  style={{ marginTop: '10px' }}
/>

    </div>
  );
}
