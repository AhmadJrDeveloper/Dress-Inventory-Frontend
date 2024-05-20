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
import { useUser } from './UserContext'; // Import the useUser hook
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';






const validationSchema = Yup.object().shape({
  amount: Yup.string().required('الرجاء إدخال إسم الموظف'),
  customer_id: Yup.string().required('الرجاء إدخال اسم العميل'),
  date: Yup.string().required('الرجاء إختيار وظيفة الموظف'),
  dresses:Yup.string().required('الرجاء اختيار الفتسان '),

});

export default function Sell() {
  
    const [open, setOpen] = useState(false)
    const [sellData, setsellData] = useState([])
    const [refreshPage, setRefreshPage] = useState(false);
    const [accessory, setAccessory] = useState([]); // New state for users
    const [selectedAccessories, setSelectedAccessories] = useState([]); // New state for selected accessories
    const [dresses, setDresses] = useState([]); // New state for users
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [deletingsellId, setDeletingsellId] = useState(null);
    const [updatingsellId, setUpdatingsellId] = useState(null);
    const [customerSellId, setCustomerSellId] = useState(null);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [customerData, setCustomerData] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const PAGE_SIZE = 9;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [amount, setAmount] = useState(0); // Add this line to define setAmount
    const { userr } = useUser();
    const { branchId, username, id } = userr;
    console.log("hello values ",branchId, username,id)

    useEffect(() => {
      const fetchDresses = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/dresses/branchId/${userr.branchId}`);
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
 
  const handleAddsell = () => {
    setOpen(true);
    console.log('Adselles');
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
          `http://localhost:4000/sells/branchId/${userr.branchId}`
        );
  
        console.log("Response:", response.data);
  
        const totalItems = response.data.length;
        const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
  
        const paginatedData = response.data.slice(startIndex, endIndex);
  
        setsellData(paginatedData);
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


    //posting sell
   
  
    const addsell = async (values) => {
      try {
        console.log('Formik Values:', values);
    
        console.log('All Accessories:', accessory);

    // Extract accessory prices from selectedAccessories using accessory state
    const accessoryPrices = selectedAccessories.map((accessoryId) => {
      const selectedAccessory = accessory.find((item) => item.id === accessoryId);
      return selectedAccessory ? selectedAccessory.price : 0;
    });
    
    const amount = Number(values.amount); // Convert amount to a number
    const total = amount + accessoryPrices.reduce((acc, price) => acc + price, 0);
    setTotalAmount(total);

    console.log('Accessory Prices:', accessoryPrices);

    
        const response = await axios.post('http://localhost:4000/sells', {
          amount: totalAmount,
          customer_id: values.customer_id,
          date: values.date,
          user_id: userr.id,
          dress_id: values.dresses,
          branch_id: userr.branchId,
          sell_accessories: selectedAccessories.map(accessory_id => ({
            accessory_id,
            dress_id: values.dresses,
          })),
        });
    
        console.log('Server Response:', response);
    
        if (response.status === 200) {
          setsellData((prevData) => [...prevData, response.data]);
          handleCloseForm();
          setRefreshPage((prev) => !prev);
          axios.put(`http://localhost:4000/dresses/${values.dresses}`, {
            dress_status: 'تم البيع',
          });
        } else {
          console.error(
            'Error adding sell. Server responded with:',
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error('Error adding sell:', error);
      }
    };
    
  
        
  //posting sell

  //Delete Function

  const handleOpenDeleteConfirmation = (sellId) => {
    setDeletingsellId(sellId);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmed = () => {
    handleDeletesell(deletingsellId);
    setDeleteConfirmationOpen(false);
  };
  
  
  const handleDeletesell = async (sellId) => {
    try {
      const response = await axios.delete(`http://localhost:4000/sells/${sellId}`);
  
      if (response.status === 200) {
        setsellData((prevData) => prevData.filter((sell) => sell.id !== sellId));
        setRefreshPage((prev) => !prev);
      } else {
        console.error(
          'Error deleting sell. Server responded with:',
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error('Error deleting sell:', error);
    }
  };
//Delete Function  

//Update Function
const handleOpenUpdateDialog = (sellId,customerSellID) => {
  setUpdatingsellId(sellId);
  setCustomerSellId(customerSellID);
  setUpdateDialogOpen(true);
};

const updatesell = async (values) => {
  try {
    console.log('Formik Values:', values);

    const response = await axios.put(
      `http://localhost:4000/sells/${updatingsellId}`,
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
      setsellData((prevData) =>
        prevData.map((sell) =>
          sell.id === updatingsellId ? response.data : sell
        )
      );
      setUpdateDialogOpen(false); 
      setRefreshPage((prev) => !prev);
    } else {
      console.error(
        'Error updating sell. Server responded with:',
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error('Error updating sell:', error);
  }
};

//Update Function


  return (
     <div style={{ direction: "rtl " }}>

      <h1>المبيعات</h1>
      <Button 
        startIcon={<AddIcon />}
        variant="contained"
        onClick={handleAddsell}
      >
        إضافة عملية بيع
      </Button>

      <TableContainer>
        <Table>
          <TableHead>
            <TableCell>المبلغ</TableCell>
            <TableCell>اسم العميل</TableCell>
            <TableCell>تاريخ عملية البيع</TableCell>
            <TableCell>البائع</TableCell>
            <TableCell>رمز الفستان</TableCell>
            <TableCell>الفرع</TableCell>


            <TableCell>حذف أو تعديل </TableCell>
          </TableHead>
          <TableBody>
      {sellData.map((sell) => (
        sell ? (
          <TableRow key={sell.id}>
            <TableCell>{sell.amount}</TableCell>
            <TableCell>{`${sell.customer?.first_name} ${sell.customer?.last_name}`}</TableCell>
            <TableCell>{sell.date}</TableCell>
            <TableCell>{sell.user?.username}</TableCell>
            <TableCell>{sell.dress?.code}</TableCell> 
            <TableCell>{sell.branch && sell.branch.name}</TableCell>
            <TableCell>
            <IconButton onClick={() => handleOpenUpdateDialog(sell.id,sell.customer.id)}>
              <EditIcon sx={{ color: Colors.primary }} />
            </IconButton>
            <IconButton onClick={() => handleOpenDeleteConfirmation(sell.id)}>
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
        <DialogTitle>{"إضافة عملية بيع"}</DialogTitle>

          <Formik
    validationSchema={validationSchema}
    onSubmit={addsell}
    initialValues={{
      amount: '',     // Initial value for the 'name' field
      customer_id: '', // Initial value for the 'customer_name' field
      date: '',     // Initial value for the 'type' field
      dresses: '', // Initial value for the '
      accessories: [],

    }}
  >
    {({ dirty, isValid, values, errors, handleChange }) => (
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
  onChange={(e) => {
    handleAmountChange(e);
    handleChange(e);
  }}
/>
              {errors.amount && (
                <Typography color="red">{errors.amount}</Typography>
              )}
            </Grid>
            <Grid item xs={12}>
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
    <Typography>هل أنت متأكد أنك تريد حذف عملية البيع؟</Typography>
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
  <DialogTitle>تحديث عملية البيع</DialogTitle>

  <Formik
  validationSchema={validationSchema}
  onSubmit={updatesell}
  initialValues={{
  amount:'',
  customer_id: '',
  date:'',
  dresses:'',
  accessories: [], // Assuming accessories is an array of accessory IDs
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
  onChange={(e) => {
    handleAmountChange(e);
    handleChange(e);
  }}
/>
              {errors.amount && (
                <Typography color="red">{errors.amount}</Typography>
              )}
            </Grid>
            <Grid item xs={12}>
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
