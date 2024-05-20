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
import Pagination from '@mui/material/Pagination';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('الرجاء إدخال إسم الإكسسوار'),
  price:Yup.number().required('الرجاء إدخال سعر الإكسسوار').positive('الرجاء إدخال سعر فوق 0'),

});

export default function Accessory() {
  
    const [open, setOpen] = useState(false)
    const [accessoryData, setAccessoryData] = useState([])
    const [refreshPage, setRefreshPage] = useState(false);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [deletingAccessoryId, setDeletingAccessoryId] = useState(null);
    const [updatingAccessoryId, setUpdatingAccessoryId] = useState(null);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const PAGE_SIZE = 9;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const handlePageChange = (event, value) => {
      setCurrentPage(value);
    };
    useEffect(() => {
      const fetchData = async () => {
        try {
    
          let response;
    
          // Reset currentPage to 1 when the selected branch changes
            setCurrentPage(1);
            response = await axios.get(
              `http://localhost:4000/accessories`
            );
          
    
          console.log("Response:", response.data);
    
          const totalItems = response.data.length;
          const totalPages = Math.ceil(totalItems / PAGE_SIZE);
    
          const startIndex = (currentPage - 1) * PAGE_SIZE;
          const endIndex = startIndex + PAGE_SIZE;
    
          const paginatedData = response.data.slice(startIndex, endIndex);
    
          setAccessoryData(paginatedData);
          setTotalPages(totalPages); // Add this line to set the total pages
        } catch (error) {
          console.log(error);
        }
      };
    
      fetchData();
    }, [refreshPage, , currentPage]);


  const handleAddAccessory = () => {
    setOpen(true);
    console.log('Accessories');
  };
  
  const handleCloseForm = () => {
    setOpen(false);
  }

  


  //fetching data
  
    //fetching data


    //posting accessory
   
  
    const addAccessory = async (values) => {
      try {
        console.log('Formik Values:', values); // Log the values here
    
        const response = await axios.post('http://localhost:4000/accessories',{
          name:values.name,
          price:values.price,
          
        });
    
        console.log('Server Response:', response);
    
        if (response.status === 200) {
          setAccessoryData((prevData) => [...prevData, response.data]);
          handleCloseForm();
          setRefreshPage((prev) => !prev);
        } else {
          console.error(
            'Error adding Accessory. Server responded with:',
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error('Error adding accessory:', error);
      }
    };
    
  
        
  //posting Accessory

  //Delete Function

  const handleOpenDeleteConfirmation = (accessoryId) => {
    setDeletingAccessoryId(accessoryId);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmed = () => {
    handleDeleteAccessory(deletingAccessoryId);
    setDeleteConfirmationOpen(false);
  };
  
  
  const handleDeleteAccessory = async (accessoryId) => {
    try {
      const response = await axios.delete(`http://localhost:4000/accessories/${accessoryId}`);
  
      if (response.status === 200) {
        setAccessoryData((prevData) => prevData.filter((accessory) => accessory.id !== accessoryId));
        setRefreshPage((prev) => !prev);
      } else {
        console.error(
          'Error deleting Accessory. Server responded with:',
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error('Error deleting Accessory:', error);
    }
  };
//Delete Function  

//Update Function
const handleOpenUpdateDialog = (accessoryId) => {
  setUpdatingAccessoryId(accessoryId);
  setUpdateDialogOpen(true);
};

const updateAccessory = async (values) => {
  try {
    console.log('Formik Values:', values);

    const response = await axios.put(
      `http://localhost:4000/accessories/${updatingAccessoryId}`,
      {
        name: values.name,
        price: values.price,
      }
    );

    console.log('Server Response:', response);

    if (response.status === 200) {
      setAccessoryData((prevData) =>
        prevData.map((accessory) =>
          accessory.id === updatingAccessoryId ? response.data : accessory
        )
      );
      setUpdateDialogOpen(false); // Close the dialog after successful update
      setRefreshPage((prev) => !prev);
    } else {
      console.error(
        'Error updating Accessory. Server responded with:',
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error('Error updating accessory:', error);
  }
};

//Update Function


  return (
    
    <div style={{ direction: "rtl " }}>
    
      <h1>الإكسسوارات</h1>
      <Button 
        startIcon={<AddIcon />}
        variant="contained"
        onClick={handleAddAccessory}
      >
        إضافة إكسسوار
      </Button>

      <TableContainer>
        <Table>
          <TableHead>
            <TableCell>الإسم</TableCell>
            <TableCell>السعر</TableCell>
            <TableCell>حذف أو تعديل </TableCell>
          </TableHead>
          <TableBody>
      {accessoryData.map((accessory) => (
        accessory ? (
          console.log(accessory),
          <TableRow key={accessory.id}>
            <TableCell>{accessory.name}</TableCell>
            <TableCell>{accessory.price}</TableCell>
            <TableCell>
            <IconButton onClick={() => handleOpenUpdateDialog(accessory.id)}>
              <EditIcon sx={{ color: Colors.primary }} />
            </IconButton>
            <IconButton onClick={() => handleOpenDeleteConfirmation(accessory.id)}>
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
        <DialogTitle>{"إضافة إكسسوار"}</DialogTitle>

        <Formik
  validationSchema={validationSchema}
  onSubmit={addAccessory}
  initialValues={{
    name: '',     // Initial value for the 'name' field
    price: '',    // Initial value for the 'price' field
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
              name="name"
              value={values.name}
              onChange={handleChange}
              />
            {errors.name && (
              <Typography color="red">{errors.name}</Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="السعر"
              required
              fullWidth
              name="price"
              value={values.price}
              onChange={handleChange}
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
              }}
            />
            {errors.price && (
              <Typography color="red">{errors.price}</Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button type="submit" variant="contained" color="primary" disabled = {!isValid || !dirty}>
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
    <Typography>هل أنت متأكد أنك تريد حذف هذا الإكسسوار</Typography>
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
  <DialogTitle>تحديث الإكسسوار</DialogTitle>

  <Formik
  validationSchema={validationSchema}
  onSubmit={updateAccessory}
  initialValues={{
    name: accessoryData.find(accessory => accessory.id === updatingAccessoryId)?.name || '',
    price: accessoryData.find(accessory => accessory.id === updatingAccessoryId)?.price || '',
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
              name="name"
              value={values.name}
              onChange={handleChange}
              />
            {errors.name && (
              <Typography color="red">{errors.name}</Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="السعر"
              required
              fullWidth
              name="price"
              value={values.price}
              onChange={handleChange}
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
              }}
            />
            {errors.price && (
              <Typography color="red">{errors.price}</Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button type="submit" variant="contained" color="primary" disabled = {!isValid || !dirty}>
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
