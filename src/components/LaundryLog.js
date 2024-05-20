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

import { Colors } from '../styles/theme';
import LoopIcon from '@mui/icons-material/Loop';
import Pagination from '@mui/material/Pagination';
import { useUser } from './UserContext';



export default function LaundryLog() {
  
    const [open, setOpen] = useState(false)
    const [accessoryData, setAccessoryData] = useState([])
    const [refreshPage, setRefreshPage] = useState(false);
    const [laundriesData, setLaundriesData] = useState([]);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [deletingAccessoryId, setDeletingAccessoryId] = useState(null);
    const [updatingAccessoryId, setUpdatingAccessoryId] = useState(null);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const PAGE_SIZE = 9;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { userr } = useUser();


    const handlePageChange = (event, value) => {
      setCurrentPage(value);
    };
    
    useEffect(() => {
      const fetchDresses = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/laundries/branch/${userr.branchId}`)

          setLaundriesData(response.data);
          console.log("",response.data);
          setRefreshPage((prev) => !prev);

        } catch (error) {
          console.error('Error fetching dresses:', error);
        }
        setRefreshPage(false);

      };
    
      fetchDresses();
    }, [refreshPage]);


  const handleAddAccessory = () => {
    setOpen(true);
    console.log('Accessories');
  };
  
  const handleCloseForm = () => {
    setOpen(false);
  }


  return (
    
    <div style={{ direction: "rtl " }}>
    
      <h1>لائحة الغسيل</h1>

      <TableContainer>
        <Table>
          <TableHead>
            <TableCell>إسم المغسلة</TableCell>
            <TableCell>رمز الفستان</TableCell>
            <TableCell>تاريخ التسليم</TableCell>
            <TableCell>تاريخ الإستلام</TableCell>
            <TableCell>التكلفة</TableCell>
            <TableCell>الفرع</TableCell>
            <TableCell>استلام الفستان </TableCell>
          </TableHead>
          <TableBody>
      {laundriesData.map((laundry) => (
        laundry ? (
          console.log(laundry),
          <TableRow key={laundry.id}>
            <TableCell>{laundry.land.name}</TableCell>
            <TableCell>{laundry.dress.code}</TableCell>
            <TableCell>{laundry.start_date}</TableCell>
            <TableCell>{laundry.end_date}</TableCell>
            <TableCell>{laundry.cost}</TableCell>
            <TableCell>{laundry.branch.name}</TableCell>
            <TableCell>
          <>
            {/* <IconButton onClick={() => handleReciveDress(dress.rent.dress.id,dress.id)}>
              <LoopIcon sx={{ color: Colors.primary }} />
            </IconButton> */}
            {/* <IconButton onClick={() => handleOpenUpdateDialog(dress.id)}>
              <DryCleaningIcon sx={{ color: Colors.primary }} />
            </IconButton> */}
            
          </>
      </TableCell>
          </TableRow>
        ) : null
      ))}
    </TableBody>
        </Table>
      </TableContainer>

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
