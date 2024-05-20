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
  name: Yup.string().required('الرجاء إدخال إسم الفرع'),

});

export default function Branches() {
  
    const [open, setOpen] = useState(false)
    const [branchData, setbranchData] = useState([])
    const [refreshPage, setRefreshPage] = useState(false);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [deletingbranchId, setDeletingbranchId] = useState(null);
    const [updatingbranchId, setUpdatingbranchId] = useState(null);
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
              `http://localhost:4000/branches`
            );
          
    
          console.log("Response:", response.data);
    
          const totalItems = response.data.length;
          const totalPages = Math.ceil(totalItems / PAGE_SIZE);
    
          const startIndex = (currentPage - 1) * PAGE_SIZE;
          const endIndex = startIndex + PAGE_SIZE;
    
          const paginatedData = response.data.slice(startIndex, endIndex);
    
          setbranchData(paginatedData);
          setTotalPages(totalPages); // Add this line to set the total pages
        } catch (error) {
          console.log(error);
        }
      };
    
      fetchData();
    }, [refreshPage, , currentPage]);


  const handleAddbranch = () => {
    setOpen(true);
    console.log('branches');
  };
  
  const handleCloseForm = () => {
    setOpen(false);
  }

  


  // //fetching data
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(
  //         'http://localhost:4000/branches/');
  //       setbranchData(response.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchData();
  // }, [refreshPage]);
  //   //fetching data


    //posting branch
   
  
    const addbranch = async (values) => {
      try {
        console.log('Formik Values:', values); // Log the values here
    
        const response = await axios.post('http://localhost:4000/branches/',{
          name:values.name,
          price:values.price,
          
        });
    
        console.log('Server Response:', response);
    
        if (response.status === 200) {
          setbranchData((prevData) => [...prevData, response.data]);
          handleCloseForm();
          setRefreshPage((prev) => !prev);
        } else {
          console.error(
            'Error adding branch. Server responded with:',
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error('Error adding branch:', error);
      }
    };
    
  
        
  //posting branch

  //Delete Function

  const handleOpenDeleteConfirmation = (branchId) => {
    setDeletingbranchId(branchId);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmed = () => {
    handleDeletebranch(deletingbranchId);
    setDeleteConfirmationOpen(false);
  };
  
  
  const handleDeletebranch = async (branchId) => {
    try {
      const response = await axios.delete(`http://localhost:4000/branches/${branchId}`);
  
      if (response.status === 200) {
        setbranchData((prevData) => prevData.filter((branch) => branch.id !== branchId));
        setRefreshPage((prev) => !prev);
      } else {
        console.error(
          'Error deleting branch. Server responded with:',
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error('Error deleting branch:', error);
    }
  };
//Delete Function  

//Update Function
const handleOpenUpdateDialog = (branchId) => {
  setUpdatingbranchId(branchId);
  setUpdateDialogOpen(true);
};

const updatebranch = async (values) => {
  try {
    console.log('Formik Values:', values);

    const response = await axios.put(
      `http://localhost:4000/branches/${updatingbranchId}`,
      {
        name: values.name,
        price: values.price,
      }
    );

    console.log('Server Response:', response);

    if (response.status === 200) {
      setbranchData((prevData) =>
        prevData.map((branch) =>
          branch.id === updatingbranchId ? response.data : branch
        )
      );
      setUpdateDialogOpen(false); // Close the dialog after successful update
      setRefreshPage((prev) => !prev);
    } else {
      console.error(
        'Error updating branch. Server responded with:',
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error('Error updating branch:', error);
  }
};

//Update Function


  return (
    <div style={{ direction: "rtl " }}>

      <h1>الفروع</h1>
      <Button 
        startIcon={<AddIcon />}
        variant="contained"
        onClick={handleAddbranch}
      >
        إضافة فرع
      </Button>

      <TableContainer>
        <Table>
          <TableHead>
            <TableCell>الإسم</TableCell>
            <TableCell>حذف أو تعديل </TableCell>
          </TableHead>
          <TableBody>
      {branchData.map((branch) => (
        branch ? (
          <TableRow key={branch.id}>
            <TableCell>{branch.name}</TableCell>
            <TableCell>
            <IconButton onClick={() => handleOpenUpdateDialog(branch.id)}>
              <EditIcon sx={{ color: Colors.primary }} />
            </IconButton>
            <IconButton onClick={() => handleOpenDeleteConfirmation(branch.id)}>
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
        <DialogTitle>{"إضافة فرع"}</DialogTitle>

        <Formik
  validationSchema={validationSchema}
  onSubmit={addbranch}
  initialValues={{
    name: '', // Initial value for the 'name' field
  }}
>
  {({ dirty, isValid, values, handleSubmit, handleChange, errors }) => (
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
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!isValid || !dirty}
        >
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
    <Typography>هل أنت متأكد أنك تريد حذف هذا الفرع</Typography>
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
  <DialogTitle>تحديث الفرع</DialogTitle>

  <Formik
  validationSchema={validationSchema}
  onSubmit={updatebranch}
  initialValues={{
    name: '',     // Initial value for the 'name' field
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
              name="name"
              value={values.name}
              onChange={handleChange}
              />
            {errors.name && (
              <Typography color="red">{errors.name}</Typography>
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
