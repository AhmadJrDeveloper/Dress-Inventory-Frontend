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
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Typography } from '@mui/material';
import DryCleaningIcon from '@mui/icons-material/DryCleaning';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Unstable_Grid2';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Colors } from '../styles/theme';
import LoopIcon from '@mui/icons-material/Loop';
import Pagination from '@mui/material/Pagination';
import { useUser } from './UserContext';

const validationSchema = Yup.object().shape({
  laundries: Yup.string().required('الرجاء إختيار المغسلة '),
  start_date: Yup.string().required('الرجاء إدخال تاريخ بدأ الأجار'),
  end_date: Yup.string()
  .required('الرجاء إدخال تاريخ إنتهاء الأجار')
  .test('checkEndDate', 'تاريخ الانتهاء يجب أن يكون بعد تاريخ البداية', function (value) {
    const startDate = this.parent.start_date; // Access start_date from form values
    const endDate = value ? new Date(value) : null;

    if (startDate && endDate && endDate < new Date(startDate)) {
      return false; // Validation fails
    }

    return true; // Validation passes
  }),
  cost:  Yup.string().required('الرجاء إدخال التكلفة '),

});

export default function RentLog() {
  
    const [open, setOpen] = useState(false)
    const [accessoryData, setAccessoryData] = useState([])
    const [refreshPage, setRefreshPage] = useState(false);
    const [dresses, setDresses] = useState([]);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [deletingAccessoryId, setDeletingAccessoryId] = useState(null);
    const [updatingAccessoryId, setUpdatingAccessoryId] = useState(null);
    const [sendToLaundryDialogOpen, setSendToLaundryDialogOpen] = useState(false);
    const [sendingToLaundryId, setSendingToLaundryId] = useState(null);
    const [removeDress, setRemoveDress] = useState(null);
    const [laundry, setLaundry] = useState([]);
        const PAGE_SIZE = 9;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { userr } = useUser();


    useEffect(() =>{
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:4000/lands/branchId/${userr.branchId}`);
          console.log("landssssssssss: ",response.data);
          setLaundry(response.data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    },[])




    const handleOpenSendToLaundryDialog = (dressId,dressdelete) => {
      setSendToLaundryDialogOpen(true);
      setRemoveDress(dressdelete)
      setSendingToLaundryId(dressId);
      console.log("Dress ID:", dressId);
      console.log("Dress delete:", dressdelete);

    };
    
    
    
    const handlePageChange = (event, value) => {
      setCurrentPage(value);
    };
    
    useEffect(() => {
      const fetchData = async () => {
        try {
    
          const response = await axios.get(`http://localhost:4000/rentLogs/branchId/${userr.branchId}`)

          console.log("Response:", response.data);
    
          const totalItems = response.data.length;
          const totalPages = Math.ceil(totalItems / PAGE_SIZE);
    
          const startIndex = (currentPage - 1) * PAGE_SIZE;
          const endIndex = startIndex + PAGE_SIZE;
    
          const paginatedData = response.data.slice(startIndex, endIndex);
    
          setDresses(paginatedData);
          setTotalPages(totalPages); // Add this line to set the total pages
        } catch (error) {
          console.log(error);
        }
      };
    
      fetchData();
    }, [refreshPage, currentPage]);

  const handleAddAccessory = () => {
    setOpen(true);
    console.log('Accessories');
  };
  


  const handleReciveDress = async (dressId, deleteId) => {
    try {
      const apiUrl = `http://localhost:4000/dresses/${dressId}`;
      const apiUrlRemoveFromRentLog = `http://localhost:4000/rentlogs/${deleteId}`;

      // Make a PUT request to update dress_status to "متاح"
      const updateStatusResponse = await axios.put(apiUrl, { dress_status: 'متاح' });

      // Check the response status for updating dress status
      if (updateStatusResponse.status === 200) {
        console.log(`Dress with ID ${dressId} status updated successfully.`);

        // Make a DELETE request to remove dress from the rent log
        const removeFromRentLogResponse = await axios.delete(apiUrlRemoveFromRentLog);

        // Check the response status for removing dress from rent log
        if (removeFromRentLogResponse.status === 200) {
          console.log(`Dress with ID ${dressId} removed from rent log successfully.`);

          // Refresh the component after both update and delete operations
          setDresses((prevData) => prevData.filter((dress) => dress.id !== dressId));
          setRefreshPage((prev) => !prev);        } else {
          console.log(`Failed to remove dress from rent log. Status code: ${removeFromRentLogResponse.status}`);
        }
      } else {
        console.log(`Failed to update dress status. Status code: ${updateStatusResponse.status}`);
      }
    } catch (error) {
      console.error('Error handling dress:', error.message);
    }
  };



  const sendLaundry = async (values) => {
    try {
      console.log('Formik Values:', values); // Log the values here
      console.log(userr.branchId)
  
      const response = await axios.post('http://localhost:4000/laundries',{
        land_id:values.laundries,
        dress_id:sendingToLaundryId,
        branch_id:userr.branchId,
        cost:values.cost,
        start_date: values.start_date,
        end_date: values.end_date,        
      });
  
      console.log('Server Response:', response);
  
      if (response.status === 200) {
        const response = axios.delete(`http://localhost:4000/rentLogs/${removeDress}`)
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

  const handleCloseForm = () => {
    setSendToLaundryDialogOpen(false);
  }
  



  return (
    
    <div style={{ direction: "rtl " }}>
    
      <h1>لائحة التأجير</h1>

      <TableContainer>
        <Table>
          <TableHead>
          <TableRow>
            <TableCell>رمز الفستان</TableCell>
            <TableCell>إسم العميل</TableCell>
            <TableCell>إسم البائع</TableCell>
            <TableCell>المقاس</TableCell>
            <TableCell>المبلغ الكامل</TableCell>
            <TableCell>المبلغ المدفوع</TableCell>
            <TableCell>المبلغ المتبقي</TableCell>
            <TableCell>تاريخ التسليم</TableCell>
            <TableCell>تاريخ الإستلام</TableCell>
            <TableCell>الفرع</TableCell>
            <TableCell>استلام الفستان </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
      {dresses.map((dress) => (
        dress ? (
          console.log(dress),
          <TableRow key={dress.id}>
            <TableCell>{dress.rent.dress.code}</TableCell>
            <TableCell>{dress.rent.customer.first_name} {dress.rent.customer.last_name}</TableCell>
            <TableCell>{dress.rent.user.username}</TableCell>
            <TableCell>{dress.rent.dress.size}</TableCell>
            <TableCell>{dress.rent.amount}</TableCell>
            <TableCell>{dress.rent.amount_payed}</TableCell>
            <TableCell>{dress.rent.amount_returning}</TableCell>
            <TableCell>{dress.rent.start_date}</TableCell>
            <TableCell>{dress.rent.end_date}</TableCell>
            <TableCell>{dress.branch && dress.branch.name}</TableCell>
            <TableCell>
          <>
            <IconButton onClick={() => handleReciveDress(dress.rent.dress.id,dress.id)}>
              <LoopIcon sx={{ color: Colors.primary }} />
            </IconButton>
            <IconButton onClick={() => handleOpenSendToLaundryDialog(dress.rent.dress.id,dress.id)}>
      <DryCleaningIcon sx={{ color: Colors.primary }} />
    </IconButton>

            
          </>
      </TableCell>
          </TableRow>
        ) : null
      ))}
    </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={sendToLaundryDialogOpen} fullWidth maxWidth="lg">
        <DialogTitle>{"إرسال إلى المغسلة"}</DialogTitle>

        <Formik
  validationSchema={validationSchema}
  onSubmit={sendLaundry}
  initialValues={{
    laundries: '',     // Initial value for the 'name' field
    start_date: '', // Initial value for the 'password' field
    end_date: '',     // Initial value for the 'type' field
  }}
>
  {({ dirty, isValid, values, errors, handleChange }) => (
    <Form>
      <DialogContent>
      <Grid container spacing={2}>
      <Grid  xs={12}>
              <Select
                name="laundries"
                required
                fullWidth
                label="المغسلة"
                value={values.laundries}
                onChange={handleChange}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  اختر المغسلة
                </MenuItem>
                {laundry.map((laundryy) => (
                  <MenuItem key={laundryy.id} value={laundryy.id}>
                    {laundryy.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.laundries && (
                <Typography color="red">{errors.laundries}</Typography>
              )}
            </Grid>
            <Grid xs={12}>
              <TextField
                label="التكلفة"
                required
                fullWidth
                name="cost"
                value={values.cost}
                onChange={handleChange}
                />
              {errors.cost && (
                <Typography color="red">{errors.cost}</Typography>
              )}
            </Grid>
          <Grid xs={12}>
          <TextField
          required
            label="تاريخ التسليم"
            type="date"
            fullWidth
            name="start_date"
            value={values.start_date}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          {errors.start_date && (
            <Typography color="red">{errors.start_date}</Typography>
          )}
        </Grid>
        <Grid xs={12}>
  <TextField
  required
    label="تاريخ الإستلام"
    type="date"
    fullWidth
    name="end_date"
    value={values.end_date}
    onChange={handleChange}
    InputLabelProps={{
      shrink: true,
    }}
  />
  {errors.end_date && (
    <Typography color="red">{errors.end_date}</Typography>
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
    {/* <Button onClick={handleDeleteConfirmed} color="primary">
      حذف
    </Button> */}
  </DialogActions>
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
