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
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';







const validationSchema = Yup.object().shape({
  amount: Yup.string().required('الرجاء إدخال المبلغ '),
  amount_payed: Yup.string().required('الرجاء إدخال المبلغ المدفوع'),
  customer_id: Yup.string().required('الرجاء إختيار العميل'),
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
  dresses:Yup.string().required('الرجاء إختيار رمز الفستان '),

});

export default function Rent() {
  const [selectedAccessories, setSelectedAccessories] = useState([]); // New state for selected accessories
  const [amount, setAmount] = useState(0); // Add this line to define setAmount
  const [totalAmount, setTotalAmount] = useState(0);

    const [open, setOpen] = useState(false)
    const [rentData, setRentData] = useState([])
    const [refreshPage, setRefreshPage] = useState(false);
    const [accessory, setAccessory] = useState([]); // New state for users
    const PAGE_SIZE = 9;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [branches, setBranches] = useState([]); // New state for users
    const [dresses, setDresses] = useState([]); // New state for users
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [deletingrentId, setDeletingrentId] = useState(null);
    const [updatingrentId, setUpdatingrentId] = useState(null);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [selectedStartDate, setSelectedStartDate] = useState('');
    const [customerData, setCustomerData] = useState([])
    const { userr } = useUser();
    const { branchId, username, id } = userr;
    console.log("hello values ",branchId, username,id)


    useEffect(() => {
      const fetchDresses = async () => {
        try {
          const response = await axios.get('http://localhost:4000/dresses');
          console.log(response.data);
    
          // Exclude dresses with dress_status "مأجر", "تم البيع", or "في المغسلة"
          const excludedStatuses = ['مأجر', 'تم البيع', 'في المغسلة'];
          const filteredDresses = response.data.filter(
            dress => !excludedStatuses.includes(dress.dress_status)
          );
    
          setDresses(filteredDresses);
          setRefreshPage((prev) => !prev);

        } catch (error) {
          console.error('Error fetching dresses:', error);
        }
        setRefreshPage(false);
      };
    
      fetchDresses();
    }, [refreshPage]);



    useEffect (()=>{
      const fetchAccessories = async () => {
        try {
          const response = await axios.get('http://localhost:4000/accessories');
          console.log("accessory", response.data);
          setAccessory(response.data);
        } catch (error) {
          console.error('Error fetching accessories:', error);
        }
      };
      fetchAccessories();
    },[]);
    const handleCheckboxChange = (accessoryId) => {
      setSelectedAccessories((prevSelected) =>
        prevSelected.includes(accessoryId)
          ? prevSelected.filter((id) => id !== accessoryId)
          : [...prevSelected, accessoryId]
      );
    };
    useEffect(() => {
      const accessoryPrices = selectedAccessories.map((accessoryId) => {
        const selectedAccessory = accessory.find((item) => item.id === accessoryId);
        return selectedAccessory ? selectedAccessory.price : 0;
      });
    
      const total = amount + accessoryPrices.reduce((acc, price) => acc + price, 0);
      setTotalAmount(total);
    }, [selectedAccessories, amount]);
  
    const handleAmountChange = (event) => {
      const newAmount = Number(event.target.value);
      setAmount(newAmount);
    };



    


  const handleAddrent = () => {
    setOpen(true);
    console.log('Adrentes');
  };
  
  const handleCloseForm = () => {
    setOpen(false);
  }

  


  //fetching data
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
  
        response = await axios.get(
          `http://localhost:4000/rents`
        );
  
        console.log("Response:", response.data);
  
        const totalItems = response.data.length;
        const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
  
        const paginatedData = response.data.slice(startIndex, endIndex);
  
        setRentData(paginatedData);
        setTotalPages(totalPages); // Add this line to set the total pages
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchData();
  }, [refreshPage, currentPage]);
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
    //fetching data


    useEffect(() =>{
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:4000/customers/branch/${userr.branchId}`);
          console.log("customers: ",response.data);
          setCustomerData(response.data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    },[])


    //posting rent
   
  
    const addrent = async (values) => {
      try {
          console.log('Formik Values:', values);
          const accessoryPrices = selectedAccessories.map((accessoryId) => {
            const selectedAccessory = accessory.find((item) => item.id === accessoryId);
            return selectedAccessory ? selectedAccessory.price : 0;
          });
          
          const amount = Number(values.amount); // Convert amount to a number
          const total = amount + accessoryPrices.reduce((acc, price) => acc + price, 0);
          setTotalAmount(total);
      
          console.log('Accessory Prices:', accessoryPrices);
  
          // Fetch the current dress data
          const dressResponse = await axios.get(`http://localhost:4000/dresses/id/${values.dresses}`);
          console.log(`values dresses: ${values.dresses}`);
          const currentDress = dressResponse.data;
          console.log(`current counter : ${currentDress.rent_counter}`);
  
          console.log('Current Dress:', currentDress);
  
          // Check if rent_counter is a valid number
          if (typeof currentDress.rent_counter !== 'number' || isNaN(currentDress.rent_counter)) {
              console.error('Invalid rent_counter value:', currentDress.rent_counter);
              return;
          }
  
          // Calculate the new rent_counter value
          const newRentCounter = currentDress.rent_counter + 1;
          console.log(`New rent_counter: ${newRentCounter}`);
  
          // Update the rent_counter and dress_status
          const updateDressResponse = await axios.put(`http://localhost:4000/dresses/${values.dresses}`, {
              dress_status: 'مأجر',
              rent_counter: newRentCounter,
          });
  
          // Check if the dress update was successful
          if (updateDressResponse.status !== 200) {
              console.error('Error updating dress status:', updateDressResponse.status, updateDressResponse.statusText);
              return;
          }
  
          // Add the rent
          const addRentResponse = await axios.post('http://localhost:4000/rents', {
              amount: totalAmount,
              amount_payed: values.amount_payed,
              amount_returning: values.amount_payed - totalAmount,
              customer_id: values.customer_id,
              start_date: values.start_date,
              end_date: values.end_date,
              user_id: userr.id,
              dress_id: values.dresses,
              branch_id: userr.branchId,
              sell_accessories: selectedAccessories.map(accessory_id => ({
                accessory_id,
                dress_id: values.dresses,
              })),
          });
          
  
          // Check if the rent addition was successful
          if (addRentResponse.status === 200) {
              setRentData((prevData) => [...prevData, addRentResponse.data]);
              handleCloseForm();
              setRefreshPage((prev) => !prev);
          } else {
              console.error('Error adding rent. Server responded with:', addRentResponse.status, addRentResponse.statusText);
          }
      } catch (error) {
          console.error('Error adding rent:', error);
      }
  };
  
    
    
  
        
  //posting rent

  //Delete Function

  const handleOpenDeleteConfirmation = (rentId) => {
    console.log(rentId);
    setDeletingrentId(rentId);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmed = () => {
    console.log(deletingrentId);
    handleDeleterent(deletingrentId);
    setDeleteConfirmationOpen(false);
  };
  
  
  const handleDeleterent = async (rentId) => {
    try {
      // Get the rent details before deletion
      const rentToDelete = rentData.find(rent => rent.id === rentId);
  
      // Delete the rent
      const response = await axios.delete(`http://localhost:4000/rents/${rentId}`);
  
      if (response.status === 200) {
        // Update the state to remove the deleted rent
        setRentData((prevData) => prevData.filter((rent) => rent.id !== rentId));
        setRefreshPage((prev) => !prev);
  
        // Update the dress status to 'متاح'
        const updateDressResponse = await axios.put(`http://localhost:4000/dresses/${rentToDelete.dress.id}`, {
          dress_status: 'متاح',
        });
  
        if (updateDressResponse.status !== 200) {
          console.error('Error updating dress status:', updateDressResponse.status, updateDressResponse.statusText);
          return;
        }
      } else {
        console.error(
          'Error deleting rent. Server responded with:',
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error('Error deleting rent:', error);
    }
  };
  
//Delete Function  

//Update Function
const handleOpenUpdateDialog = (rentId) => {
  setUpdatingrentId(rentId);
  setUpdateDialogOpen(true);
};

const updaterent = async (values) => {
  try {
    console.log('Formik Values:', values);

    const response = await axios.put(
      `http://localhost:4000/rents/${updatingrentId}`,
      {
        amount: values.amount,
            customer_name: values.customer_name,
            date: values.date,
            user_id: values.username,
            dress_id: values.dresses,
            branch_id: values.branch,
      }
    );

    console.log('Server Response:', response);

    if (response.status === 200) {
      setRentData((prevData) =>
        prevData.map((rent) =>
          rent.id === updatingrentId ? response.data : rent
        )
      );
      setUpdateDialogOpen(false); 
      setRefreshPage((prev) => !prev);
    } else {
      console.error(
        'Error updating rent. Server responded with:',
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error('Error updating rent:', error);
  }
};

//Update Function


  return (
    <div style={{ direction: "rtl " }}>

      <h1>التأجير</h1>
      <Button 
        startIcon={<AddIcon />}
        variant="contained"
        onClick={handleAddrent}
      >
        إضافة عملية تأجير
      </Button>

      <TableContainer>
        <Table>
          <TableHead>
            <TableCell>المبلغ</TableCell>
            <TableCell>المبلغ المدفوع</TableCell>
            <TableCell>المبلغ المرتجع</TableCell>
            <TableCell>اسم العميل</TableCell>
            <TableCell>تاريخ بدأ الأجار </TableCell>
            <TableCell>تاريخ إنتهاء الأجار </TableCell>
            <TableCell>البائع</TableCell>
            <TableCell>رمز الفستان</TableCell>
            <TableCell>الفرع</TableCell>


            <TableCell>حذف أو تعديل </TableCell>
          </TableHead>
          <TableBody>
      {rentData.map((rent) => (
        rent ? (
          <TableRow key={rent.id}>
            <TableCell>{rent.amount}</TableCell>
            <TableCell>{rent.amount_payed}</TableCell>
            <TableCell>{rent.amount_returning}</TableCell>
            <TableCell>{`${rent.customer?.first_name} ${rent.customer?.last_name}`}</TableCell>
            <TableCell>{rent.start_date}</TableCell>
            <TableCell>{rent.end_date}</TableCell>
            <TableCell>{rent.user?.username}</TableCell>
            <TableCell>{rent.dress?.code}</TableCell> 
            <TableCell>{rent.branch && rent.branch.name}</TableCell>
            <TableCell>
            <IconButton onClick={() => handleOpenUpdateDialog(rent.id)}>
              <EditIcon sx={{ color: Colors.primary }} />
            </IconButton>
            <IconButton onClick={() => {
  handleOpenDeleteConfirmation(rent.id);
  console.log(rent.id);
}}>
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
        <DialogTitle>{"إضافة عملية تأجير"}</DialogTitle>

        <Formik
    validationSchema={validationSchema}
    onSubmit={addrent}
    initialValues={{
      amount: '',     // Initial value for the 'name' field
      amount_payed: '',     // Initial value for the 'name' field
      customer_id: '', // Initial value for the 'customer_name' field
      start_date: '',     // Initial value for the 'type' field
      end_date: '',     // Initial value for the 'type' field
      dresses: '', 
      accessories: [],

    }}
  >
    {({ dirty, isValid, values, errors, setFieldError, handleChange }) => (
      <Form>
        <DialogContent>
        <Grid container spacing={2}>
            <Grid xs={12}>
            <TextField
              label="المبلغ"
              required
              fullWidth
              name="amount"
              value={values.amount}
              onChange={(e) => {
                handleAmountChange(e);
                handleChange(e);
              }}
            />
              {errors.amount && (
                <Typography color="red">{errors.amount}</Typography>
              )}
            </Grid>
            <Grid xs={12}>
              <TextField
                label="المبلغ المدفوع"
                required
                fullWidth
                name="amount_payed"
                value={values.amount_payed}
                onChange={handleChange}
                />
              {errors.amount_payed && (
                <Typography color="red">{errors.amount_payed}</Typography>
              )}
            </Grid>
            <Grid  xs={12}>
              <Select
                name="customer_id"
                required
                fullWidth
                label="العميل"
                value={values.customer_id}
                onChange={handleChange}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  اختر العميل
                </MenuItem>
                {customerData.map((users) => (
                  <MenuItem key={users.id} value={users.id}>
                    {users.first_name} {users.last_name}
                  </MenuItem>
                ))}
              </Select>
              {errors.customer_id && (
                <Typography color="red">{errors.customer_id}</Typography>
              )}
            </Grid>
            <Grid xs={12}>
          <TextField
          required
            label="تاريخ بدأ الأجار"
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
    label="تاريخ إنتهاء الأجار"
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
            <Grid  xs={12}>
              <Select
                name="dresses"
                required
                fullWidth
                label="الفستان"
                value={values.dresses}
                onChange={handleChange}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  اختر الفستان
                </MenuItem>
                {dresses.map((dress) => (
                  <MenuItem key={dress.id} value={dress.id}>
                    {dress.code}
                  </MenuItem>
                ))}
              </Select>
              {errors.dresses && (
                <Typography color="red">{errors.dresses}</Typography>
              )}
            </Grid>
            <Grid item xs={12}>
          <Typography variant="h6">الاكسسوارات</Typography>
          {accessory.map((acc) => (
            <FormControlLabel
              key={acc.id}
              control={
                <Checkbox
                  checked={selectedAccessories.includes(acc.id)}
                  onChange={() => handleCheckboxChange(acc.id)}
                />
              }
              label={acc.name}
            />
          ))}
        </Grid>
        {/* Display the calculated total amount */}
        <Grid item xs={12}>
          <TextField
            label="المبلغ الإجمالي"
            fullWidth
            value={totalAmount}
            InputProps={{ readOnly: true }}
          />
        </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button type="submit" variant="contained" color="primary" disabled = {!dirty || !isValid}>
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
    <Typography>هل أنت متأكد أنك تريد حذف هذا التأجير؟</Typography>
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
  <DialogTitle>تحديث عملية التأجير</DialogTitle>

  <Formik
  validationSchema={validationSchema}
  onSubmit={updaterent}
  initialValues={{
    amount: rentData.find(rent => rent.id === updatingrentId)?.amount || '',
    customer_name: rentData.find(rent => rent.id === updatingrentId)?.customer_name || '',
    date: rentData.find(rent => rent.id === updatingrentId)?.date || '',
    username: rentData.find((rent) => rent.id === updatingrentId)?.user?.id || '', 
    dresses: rentData.find((rent) => rent.id === updatingrentId)?.dress?.id || 'tedt', 
    branch: rentData.find(rent => rent.id === updatingrentId)?.branch_id || '',

  }}
>
  {({ dirty, isValid, values,  handleChange,errors }) => (
    <Form>
    <DialogContent>
    <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="المبلغ"
            required
            fullWidth
            name="amount"
            value={values.amount}
            onChange={handleChange}
            />
          {errors.amount && (
            <Typography color="red">{errors.amount}</Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="اسم العميل"
            required
            fullWidth
            name="customer_name"
            value={values.customer_name}
            onChange={handleChange}
            />
          {errors.customer_name && (
            <Typography color="red">{errors.customer_name}</Typography>
          )}
        </Grid>
        <Grid item xs={12}>
        <TextField
          label="تاريخ"
          type="date"
          fullWidth
          name="date"
          value={values.date}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        {errors.date && (
          <Typography color="red">{errors.date}</Typography>
        )}
      </Grid>
          
        <Grid item xs={12}>
          <Select
            name="dresses"
            required
            fullWidth
            label="الفستان"
            value={values.dresses}
            onChange={handleChange}
            displayEmpty
          >
            <MenuItem value="" disabled>
              اختر الفستان
            </MenuItem>
            {dresses.map((dress) => (
              <MenuItem key={dress.id} value={dress.id}>
                {dress.code}
              </MenuItem>
            ))}
          </Select>
          {errors.branch && (
            <Typography color="red">{errors.branch}</Typography>
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
      <Button type="submit" variant="contained" color="primary" disabled = {!dirty || !isValid}>
      أضف
    </Button>
          <Button autoFocus onClick={() => setUpdateDialogOpen(false)}>
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
