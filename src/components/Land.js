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
  name: Yup.string().required('الرجاء إدخال إسم المغسلة'),
  branch: Yup.string().required('الرجاء إختيار فرع المغسلة'),


});

export default function Land() {
  
    const [open, setOpen] = useState(false)
    const [landData, setLandData] = useState([])
    const [branches, setBranchData] = useState([])
    const [refreshPage, setRefreshPage] = useState(false);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [deletinglandId, setDeletinglandId] = useState(null);
    const [updatinglandId, setUpdatinglandId] = useState(null);
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
    
          // Reset currentPage to 1 when the selected land changes
            setCurrentPage(1);
            response = await axios.get(
              `http://localhost:4000/Lands`
            );
          
    
          console.log("Response:", response.data);
    
          const totalItems = response.data.length;
          const totalPages = Math.ceil(totalItems / PAGE_SIZE);
    
          const startIndex = (currentPage - 1) * PAGE_SIZE;
          const endIndex = startIndex + PAGE_SIZE;
    
          const paginatedData = response.data.slice(startIndex, endIndex);
    
          setLandData(paginatedData);
          setTotalPages(totalPages); // Add this line to set the total pages
        } catch (error) {
          console.log(error);
        }
      };
    
      fetchData();
    }, [refreshPage, , currentPage]);


  const handleAddland = () => {
    setOpen(true);
    console.log('landes');
  };
  
  const handleCloseForm = () => {
    setOpen(false);
  }

  


  //fetching data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://localhost:4000/branches');
        setBranchData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [refreshPage]);
    //fetching data


    //posting land
   
  
    const addLand = async (values) => {
      try {
        console.log('Formik Values:', values); // Log the values here
    
        const response = await axios.post('http://localhost:4000/lands',{
          name:values.name,
          branch_id:values.branch,
          
        });
    
        console.log('Server Response:', response);
    
        if (response.status === 200) {
            setLandData((prevData) => [...prevData, response.data]);
          handleCloseForm();
          setRefreshPage((prev) => !prev);
        } else {
          console.error(
            'Error adding land. Server responded with:',
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error('Error adding land:', error);
      }
    };
    
  
        
  //posting land

  //Delete Function

  const handleOpenDeleteConfirmation = (landId) => {
    setDeletinglandId(landId);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmed = () => {
    handleDeleteland(deletinglandId);
    setDeleteConfirmationOpen(false);
  };
  
  
  const handleDeleteland = async (landId) => {
    try {
      const response = await axios.delete(`http://localhost:4000/lands/${landId}`);
  
      if (response.status === 200) {
        setLandData((prevData) => prevData.filter((land) => land.id !== landId));
        setRefreshPage((prev) => !prev);
      } else {
        console.error(
          'Error deleting land. Server responded with:',
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error('Error deleting land:', error);
    }
  };
//Delete Function  

//Update Function
const handleOpenUpdateDialog = (landId) => {
  setUpdatinglandId(landId);
  setUpdateDialogOpen(true);
};

const updateland = async (values) => {
  try {
    console.log('Formik Values:', values);

    const response = await axios.put(
      `http://localhost:4000/lands/${updatinglandId}`,
      {
        name: values.name,
        branch_id: values.branch,
      }
    );

    console.log('Server Response:', response);

    if (response.status === 200) {
        setLandData((prevData) =>
        prevData.map((land) =>
          land.id === updatinglandId ? response.data : land
        )
      );
      setUpdateDialogOpen(false); // Close the dialog after successful update
      setRefreshPage((prev) => !prev);
    } else {
      console.error(
        'Error updating land. Server responded with:',
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error('Error updating land:', error);
  }
};

//Update Function


  return (
    <div style={{ direction: "rtl " }}>

      <h1>المغاسل</h1>
      <Button 
        startIcon={<AddIcon />}
        variant="contained"
        onClick={handleAddland}
      >
        إضافة مغسلة
      </Button>

      <TableContainer>
        <Table>
          <TableHead>
            <TableCell>الإسم</TableCell>
            <TableCell>الفرع</TableCell>
            <TableCell>حذف أو تعديل </TableCell>
          </TableHead>
          <TableBody>
      {landData.map((land) => (
        land ? (
          <TableRow key={land.id}>
            <TableCell>{land.name}</TableCell>
            <TableCell>{land.branch.name}</TableCell>
            <TableCell>
            <IconButton onClick={() => handleOpenUpdateDialog(land.id)}>
              <EditIcon sx={{ color: Colors.primary }} />
            </IconButton>
            <IconButton onClick={() => handleOpenDeleteConfirmation(land.id)}>
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
        <DialogTitle>{"إضافة مغسلة"}</DialogTitle>

        <Formik
  validationSchema={validationSchema}
  onSubmit={addLand}
  initialValues={{
    name: '', // Initial value for the 'name' field
    branch: '', // Branch
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
  onSubmit={updateland}
  initialValues={{
    name: '',     // Initial value for the 'name' field
    branch: '', //
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
