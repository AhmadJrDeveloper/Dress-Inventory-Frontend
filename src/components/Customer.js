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
import { useUser } from './UserContext'; // Import the useUser hook






const validationSchema = Yup.object().shape({
  first_name: Yup.string().required('الرجاء إدخال الإسم الأول للعميل'),
  last_name: Yup.string().required('الرجاء إدخال الإسم الثاني للعميل'),
  phone_number: Yup.string().required('الرجاء إدخال رقم هاتف العميل'),
  address: Yup.string().required('الرجاء إدخال عنوان العميل'),

});

export default function Customer() {
  
    const [open, setOpen] = useState(false)
    const [customerData, setcustomerData] = useState([])
    const [refreshPage, setRefreshPage] = useState(false);
    const [branches, setBranches] = useState([]); // New state for branches
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [deletingcustomerId, setDeletingcustomerId] = useState(null);
    const [updatingcustomerId, setUpdatingcustomerId] = useState(null);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const PAGE_SIZE = 9;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { userr } = useUser();
    const { branchId, username, id } = userr;
    console.log("hello values ",branchId, username,id)


 
    useEffect(() => {
      const fetchBranches = async () => {
        try {
          const response = await axios.get('http://localhost:4000/api/branches/branch');
          console.log(response.data);
          setBranches(response.data);
        } catch (error) {
          console.error('Error fetching branches:', error);
        }
      };
  
      fetchBranches();
    }, []); 

  const handleAddcustomer = () => {
    setOpen(true);
    console.log('Adcustomeres');
  };
  
  const handleCloseForm = () => {
    setOpen(false);
  }

  

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  //fetching data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the API
        const response = await axios.get(`http://localhost:4000/customers/branch/${userr.branchId}`);
  
        const totalItems = response.data.length;
        const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
  
        // Paginate the data
        const paginatedData = response.data.slice(startIndex, endIndex);
  
        // Update state only if the request is successful
        setcustomerData(paginatedData);
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


    //posting customer
   
  
    const addcustomer = async (values) => {
      try {
        console.log('Formik Values:', values.first_name,values.last_name,
        values.phone_number,values.address); // Log the values here
    
        const response = await axios.post('http://localhost:4000/customers',{
            first_name: values.first_name,
            last_name: values.last_name,
            phone_number: values.phone_number,
            address: values.address,
            branch_id: userr.branchId,
        });
    
        console.log('Server Response:', response);
    
        if (response.status === 200) {
          setcustomerData((prevData) => [...prevData, response.data]);
          handleCloseForm();
          setRefreshPage((prev) => !prev);
        } else {
          console.error(
            'Error adding customer. Server responded with:',
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error('Error adding customer:', error);
      }
    };
    
  
        
  //posting customer

  //Delete Function

  const handleOpenDeleteConfirmation = (customerId) => {
    setDeletingcustomerId(customerId);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmed = () => {
    handleDeletecustomer(deletingcustomerId);
    setDeleteConfirmationOpen(false);
  };
  
  
  const handleDeletecustomer = async (customerId) => {
    try {
      const response = await axios.delete(`http://localhost:4000/customers/${customerId}`);
  
      if (response.status === 200) {
        setcustomerData((prevData) => prevData.filter((customer) => customer.id !== customerId));
        setRefreshPage((prev) => !prev);
      } else {
        console.error(
          'Error deleting customer. Server responded with:',
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };
//Delete Function  

//Update Function
const handleOpenUpdateDialog = (customerId) => {
  setUpdatingcustomerId(customerId);
  setUpdateDialogOpen(true);
};

const updatecustomer = async (values) => {
  try {
    console.log('Formik Values:', values);

    const response = await axios.put(
      `http://localhost:4000/customers/${updatingcustomerId}`,
      {
            first_name: values.first_name,
            last_name: values.last_name,
            phone_number: values.phone_number,
            address: values.address,
      }
    );

    console.log('Server Response:', response);

    if (response.status === 200) {
      setcustomerData((prevData) =>
        prevData.map((customer) =>
          customer.id === updatingcustomerId ? response.data : customer
        )
      );
      setUpdateDialogOpen(false); // Close the dialog after successful update
      setRefreshPage((prev) => !prev);
    } else {
      console.error(
        'Error updating customer. Server responded with:',
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error('Error updating customer:', error);
  }
};

//Update Function


  return (
    <div style={{ direction: "rtl " }}>

      <h1>العملاء</h1>
      <Button 
        startIcon={<AddIcon />}
        variant="contained"
        onClick={handleAddcustomer}
      >
        إضافة عميل
      </Button>

      <TableContainer>
        <Table>
          <TableHead>
            <TableCell>الإسم الأول</TableCell>
            <TableCell>الإسم الأخير</TableCell>
            <TableCell>رقم العاتف</TableCell>
            <TableCell>العنوان</TableCell>
            <TableCell>الفرع</TableCell>
            <TableCell>حذف أو تعديل</TableCell>
          </TableHead>
          <TableBody>
      {customerData.map((customer) => (
        customer ? (
          console.log(customer),
          <TableRow key={customer.id}>
            <TableCell>{customer.first_name}</TableCell>
            <TableCell>{customer.last_name}</TableCell>
            <TableCell>{customer.phone_number}</TableCell>
            <TableCell>{customer.address}</TableCell>
            <TableCell>{customer.branch && customer.branch.name}</TableCell>
            <TableCell>
            <IconButton onClick={() => handleOpenUpdateDialog(customer.id)}>
              <EditIcon sx={{ color: Colors.primary }} />
            </IconButton>
            <IconButton onClick={() => handleOpenDeleteConfirmation(customer.id)}>
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
        <DialogTitle>{"إضافة عميل"}</DialogTitle>

        <Formik
  validationSchema={validationSchema}
  onSubmit={addcustomer}
  initialValues={{
    first_name: '',     // Initial value for the 'name' field
    last_name: '', // Initial value for the 'password' field
    phone_number: '',     // Initial value for the 'type' field
    address: '',   // Initial value for the 'branch' field
  }}
>
  {({ dirty, isValid, values, errors, handleChange }) => (
    <Form>
      <DialogContent>
      <Grid container spacing={2}>
          <Grid  xs={12}>
            <TextField
              label="الإسم الأول"
              required
              fullWidth
              name="first_name"
              value={values.first_name}
              onChange={handleChange}
              />
            {errors.first_name && (
              <Typography color="red">{errors.first_name}</Typography>
            )}
          </Grid>
          <Grid  xs={12}>
            <TextField
              label=" الإسم الأخير"
              required
              fullWidth
              name="last_name"
              value={values.last_name}
              onChange={handleChange}
              />
            {errors.last_name && (
              <Typography color="red">{errors.last_name}</Typography>
            )}
          </Grid>
          <Grid  xs={12}>
            <TextField
              label="رقم الهاتف"
              required
              fullWidth
              name="phone_number"
              value={values.phone_number}
              onChange={handleChange}
              />
            {errors.phone_number && (
              <Typography color="red">{errors.phone_number}</Typography>
            )}
          </Grid>
          <Grid  xs={12}>
            <TextField
              label=" العنوان"
              required
              fullWidth
              name="address"
              value={values.address}
              onChange={handleChange}
              />
            {errors.address && (
              <Typography color="red">{errors.address}</Typography>
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
    <Typography>هل أنت متأكد أنك تريد حذف هذا العميل</Typography>
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
  <DialogTitle>تحديث العميل</DialogTitle>

  <Formik
  validationSchema={validationSchema}
  onSubmit={updatecustomer}
  initialValues={{
    first_name: customerData.find(customer => customer.id === updatingcustomerId)?.first_name || '',
    last_name: customerData.find(customer => customer.id === updatingcustomerId)?.last_name || '',
    phone_number: customerData.find(customer => customer.id === updatingcustomerId)?.phone_number || '',
    address: customerData.find(customer => customer.id === updatingcustomerId)?.address || '',


  }}
>
  {({ dirty, isValid, values, handleSubmit, handleChange,errors }) => (
    <Form>
      <DialogContent>
      <Grid container spacing={2}>
          <Grid  xs={12}>
            <TextField
              label="الإسم الأول"
              required
              fullWidth
              name="first_name"
              value={values.first_name}
              onChange={handleChange}
              />
            {errors.first_name && (
              <Typography color="red">{errors.first_name}</Typography>
            )}
          </Grid>
          <Grid  xs={12}>
            <TextField
              label=" الإسم الأخير"
              required
              fullWidth
              name="last_name"
              value={values.last_name}
              onChange={handleChange}
              />
            {errors.last_name && (
              <Typography color="red">{errors.last_name}</Typography>
            )}
          </Grid>
          <Grid  xs={12}>
            <TextField
              label="رقم الهاتف"
              required
              fullWidth
              name="phone_number"
              value={values.phone_number}
              onChange={handleChange}
              />
            {errors.phone_number && (
              <Typography color="red">{errors.phone_number}</Typography>
            )}
          </Grid>
          <Grid  xs={12}>
            <TextField
              label=" العنوان"
              required
              fullWidth
              name="address"
              value={values.address}
              onChange={handleChange}
              />
            {errors.address && (
              <Typography color="red">{errors.address}</Typography>
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
