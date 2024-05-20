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
import { useFormik } from 'formik';
import { useUser } from './UserContext';





const validationSchema = Yup.object().shape({
  name: Yup.string().required('الرجاء إدخال إسم الفستان'),
  type: Yup.string().required('الرجاء إدخال نوع الفستان'),
  size: Yup.string().required('الرجاء إدخال مقاس الفستان'),
  price:Yup.number().required('الرجاء إدخال سعر الفستان').positive('الرجاء إدخال سعر فوق 0'),
  notes:Yup.string().required('الرجاء إدخال ملاحظات الفستان'),
});

export default function Dresses() {
  
    const [open, setOpen] = useState(false)
    const [dressData, setDressData] = useState([])
    const [refreshPage, setRefreshPage] = useState(false);
    const [branches, setBranches] = useState([]); // New state for branches
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [deletingDressId, setDeletingDressId] = useState(null);
    const [updatingDressId, setUpdatingDressId] = useState(null);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState('');
    const PAGE_SIZE = 9;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const {userr} = useUser()



    const handlePageChange = (event, value) => {
      setCurrentPage(value);
    };


    // useEffect(() => {
    //   const fetchData = async () => {
    //     try {
    //       console.log("Selected Branch inside useEffect:", selectedBranch);
    
    //       let response;
    
    //       // Reset currentPage to 1 when the selected branch changes
    //       if (selectedBranch) {
    //         setCurrentPage(1);
    //         response = await axios.get(
    //           `http://localhost:4000/dresses/branchId/${selectedBranch}`
    //         );
    //       } else {
    //         response = await axios.get(
    //           `http://localhost:4000/dresses`
    //         );
    //       }
    
    //       console.log("Response:", response.data);
    
    //       const totalItems = response.data.length;
    //       const totalPages = Math.ceil(totalItems / PAGE_SIZE);
    
    //       const startIndex = (currentPage - 1) * PAGE_SIZE;
    //       const endIndex = startIndex + PAGE_SIZE;
    
    //       const paginatedData = response.data.slice(startIndex, endIndex);
    
    //       setDressData(paginatedData);
    //       setTotalPages(totalPages); // Add this line to set the total pages
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   };
    
    //   fetchData();
    // }, [refreshPage, selectedBranch, currentPage]);


    useEffect(() => {
      const fetchData = async () => {
        try {
          console.log("Selected Branch inside useEffect:", selectedBranch);
    
          let response;
    
          
            response = await axios.get(
              `http://localhost:4000/dresses/branchId/${userr.branchId}`
            );
          
    
          console.log("Response:", response.data);
    
          const totalItems = response.data.length;
          const totalPages = Math.ceil(totalItems / PAGE_SIZE);
    
          const startIndex = (currentPage - 1) * PAGE_SIZE;
          const endIndex = startIndex + PAGE_SIZE;
    
          const paginatedData = response.data.slice(startIndex, endIndex);
    
          setDressData(paginatedData);
          setTotalPages(totalPages); // Add this line to set the total pages
        } catch (error) {
          console.log(error);
        }
      };
    
      fetchData();
    }, [refreshPage, selectedBranch, currentPage]);
    
    
    
    


 
    useEffect(() => {
      const fetchBranches = async () => {
        try {
          const response = await axios.get('http://localhost:4000/branches');
          setBranches(response.data);
        } catch (error) {
          console.error('Error fetching branches:', error);
        }
      };
  
      fetchBranches();
    }, []); 

  const handleAddDress = () => {
    setOpen(true);
    console.log('Addresses');
  };
  
  const handleCloseForm = () => {
    setOpen(false);
  }

  


  //fetching data

    //fetching data


    //posting dress
   
  
    const addDress = async (values) => {
      try {
        console.log('Formik Values:', values); // Log the values here
    
        const response = await axios.post('http://localhost:4000/dresses',{
          name:values.name,
          type:values.type,
          size:values.size,
          price:values.price,
          notes:values.notes,
          branch_id:userr.branchId
        });
    
        console.log('Server Response:', response);
    
        if (response.status === 200) {
          setDressData((prevData) => [...prevData, response.data]);
          handleCloseForm();
          setRefreshPage((prev) => !prev);
        } else {
          console.error(
            'Error adding dress. Server responded with:',
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error('Error adding dress:', error);
      }
    };
    
  
        
  //posting dress

  //Delete Function

  const handleOpenDeleteConfirmation = (dressId) => {
    setDeletingDressId(dressId);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmed = () => {
    handleDeleteDress(deletingDressId);
    setDeleteConfirmationOpen(false);
  };
  
  
  const handleDeleteDress = async (dressId) => {
    try {
      const response = await axios.delete(`http://localhost:4000/dresses/${dressId}`);
  
      if (response.status === 200) {
        setDressData((prevData) => prevData.filter((dress) => dress.id !== dressId));
        setRefreshPage((prev) => !prev);
      } else {
        console.error(
          'Error deleting dress. Server responded with:',
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error('Error deleting dress:', error);
    }
  };
//Delete Function  

//Update Function
const handleOpenUpdateDialog = (dressId) => {
  setUpdatingDressId(dressId);
  setUpdateDialogOpen(true);
};

const updateDress = async (values) => {
  try {
    console.log('Formik Values:', values);

    const response = await axios.put(
      `http://localhost:4000/dresses/${updatingDressId}`,
      {
        name: values.name,
        type: values.type,
        size: values.size,
        price: values.price,
        notes: values.notes,
        branch_id: userr.branchId,
      }
    );

    console.log('Server Response:', response);

    if (response.status === 200) {
      setDressData((prevData) =>
        prevData.map((dress) =>
          dress.id === updatingDressId ? response.data : dress
        )
      );
      setUpdateDialogOpen(false); // Close the dialog after successful update
      setRefreshPage((prev) => !prev);
    } else {
      console.error(
        'Error updating dress. Server responded with:',
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error('Error updating dress:', error);
  }
};

//Update Function


const handleBranchChange = (event) => {
  setSelectedBranch(event.target.value);
  console.log('Selected Branch:', event.target.value);
};

  return (
   <div style={{ direction: "rtl " }}>

      <h1>فساتين</h1>
      {/* <Select
        label="الفرع"
        value={selectedBranch}
        onChange={handleBranchChange}
        style={{ marginLeft: '10px' }}
      >
        <MenuItem value="">كل الفروع</MenuItem>
        {branches.map((branch) => (
          <MenuItem key={branch.id} value={branch.id}>
            {branch.name}
          </MenuItem>
        ))}
      </Select> */}
      <Button 
        startIcon={<AddIcon />}
        variant="contained"
        onClick={handleAddDress}
      >
        إضافة فستان
      </Button>

      <TableContainer>
        <Table>
          <TableHead>
            <TableCell>الرمز</TableCell>
            <TableCell>الإسم</TableCell>
            <TableCell>النوع</TableCell>
            <TableCell>المقاس</TableCell>
            <TableCell>سعر الشراء</TableCell>
            <TableCell>الملاحظات</TableCell>
            <TableCell>الحالة</TableCell>
            <TableCell>عداد الأجار</TableCell>
            <TableCell>الفرع</TableCell>
            <TableCell>حذف أو تعديل </TableCell>
          </TableHead>
          <TableBody>
      {dressData.map((dress) => (
        dress ? (
          console.log(dress),
          <TableRow key={dress.id}>
            <TableCell>{dress.code}</TableCell>
            <TableCell>{dress.name}</TableCell>
            <TableCell>{dress.type}</TableCell>
            <TableCell>{dress.size}</TableCell>
            <TableCell>{dress.price}</TableCell>
            <TableCell>{dress.notes}</TableCell>
            <TableCell>{dress.dress_status}</TableCell>
            <TableCell>{dress.rent_counter}</TableCell>
            <TableCell>{dress.branch && dress.branch.name}</TableCell>
            <TableCell>
        {dress.dress_status !== 'تم البيع' && dress.dress_status !== 'مأجر' && dress.dress_status !== 'في المغسلة' && (
          <>
            <IconButton onClick={() => handleOpenUpdateDialog(dress.id)}>
              <EditIcon sx={{ color: Colors.primary }} />
            </IconButton>
            <IconButton onClick={() => handleOpenDeleteConfirmation(dress.id)}>
              <DeleteForeverIcon sx={{ color: Colors.danger }} />
            </IconButton>
          </>
        )}
      </TableCell>
          </TableRow>
        ) : null
      ))}
    </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} fullWidth maxWidth="lg">
        <DialogTitle>{"إضافة فستان"}</DialogTitle>

        <Formik
  validationSchema={validationSchema}
  onSubmit={addDress}
  initialValues={{
    name: '',     // Initial value for the 'name' field
    type: '',     // Initial value for the 'type' field
    size: '',     // Initial value for the 'size' field
    price: '',    // Initial value for the 'price' field
    notes: '',    // Initial value for the 'notes' field
  }}
>
  {({ dirty, isValid, values, errors, handleChange,touched }) => (
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
            {errors.name && touched.name && (
              <Typography color="red">{errors.name}</Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <Select
              name="type"
              required
              fullWidth
              label="النوع"
              value={values.type}
              onChange={handleChange}
              displayEmpty
            >
              <MenuItem value="" disabled>
                اختر النوع
              </MenuItem>
              <MenuItem value="سهرة">سهرة</MenuItem>
              <MenuItem value="زفاف">زفاف</MenuItem>
            </Select>
            {errors.type && (
              <Typography color="red">{errors.type}</Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <Select
              name="size"
              required
              fullWidth
              label="المقاس"
              value={values.size}
              onChange={handleChange}
              displayEmpty
            >
              <MenuItem value="" disabled>
                اختر المقاس
              </MenuItem>
              <MenuItem value="Small">Small</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Large">Large</MenuItem>
              <MenuItem value="XLarge">XLarge</MenuItem>
            </Select>
            {errors.size && (
              <Typography color="red">{errors.size}</Typography>
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
          <Grid item xs={12}>
            <TextField
              label="الملاحظات"
              required
              fullWidth
              name="notes"
              value={values.notes}
              onChange={handleChange}
            />
            {errors.notes && (
              <Typography color="red">{errors.notes}</Typography>
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
    <Typography>هل أنت متأكد أنك تريد حذف هذا الفستان؟</Typography>
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
  <DialogTitle>تحديث الفستان</DialogTitle>

  <Formik
  validationSchema={validationSchema}
  onSubmit={updateDress}
  initialValues={{
    name: dressData.find(dress => dress.id === updatingDressId)?.name || '',
 
    type: dressData.find(dress => dress.id === updatingDressId)?.type || '',
    size: dressData.find(dress => dress.id === updatingDressId)?.size || '',
    price: dressData.find(dress => dress.id === updatingDressId)?.price || '',
    notes: dressData.find(dress => dress.id === updatingDressId)?.notes || '',
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
            <Select
              name="type"
              required
              fullWidth
              label="النوع"
              value={values.type}
              onChange={handleChange}
              displayEmpty
            >
              <MenuItem value="" disabled>
                اختر النوع
              </MenuItem>
              <MenuItem value="سهرة">سهرة</MenuItem>
              <MenuItem value="زفاف">زفاف</MenuItem>
            </Select>
            {errors.type && (
              <Typography color="red">{errors.type}</Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <Select
              name="size"
              required
              fullWidth
              label="المقاس"
              value={values.size}
              onChange={handleChange}
              displayEmpty
            >
              <MenuItem value="" disabled>
                اختر المقاس
              </MenuItem>
              <MenuItem value="Small">Small</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Large">Large</MenuItem>
              <MenuItem value="XLarge">XLarge</MenuItem>
            </Select>
            {errors.size && (
              <Typography color="red">{errors.size}</Typography>
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
          <Grid item xs={12}>
            <TextField
              label="الملاحظات"
              required
              fullWidth
              name="notes"
              value={values.notes}
              onChange={handleChange}
            />
            {errors.notes && (
              <Typography color="red">{errors.notes}</Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button type="submit" variant="contained" color="primary" disabled = {!isValid || !dirty}>
          تحديث
        </Button>
        <Button autoFocus onClick={() => setUpdateDialogOpen(false)}>
          إلغاء
        </Button>
      </DialogActions>
    </Form>
  )}
</Formik>

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
