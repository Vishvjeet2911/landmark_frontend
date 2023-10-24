import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Card,
  Grid,
  Paper, Box,
  Container,
  Typography,
  IconButton,
} from '@mui/material';
import Iconify from '../components/iconify';
// sections
import Popup from '../components/Popup'
import TaskEdit from './task/updateTask';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const token = localStorage.getItem('lm_token')
  const [open, setOpen] = useState(false);
  const [showData, setdataShow] = useState([])
  const [loader, setLoader] = useState(true)
  const [openEdit, setEditOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [allUsers, setUsersData] = useState([])
  const [editData, setEditData] = useState()

  const callApi = () => {
    if (token) {
      setLoader(true)
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      };
      fetch(`${process.env.REACT_APP_SITE_URL}task/list`, requestOptions)
        .then(response => response.json())
        .then(data => {
          setLoader(false)
          console.log('hey', data)
          if (data && data?.length > 0) {
            setdataShow(data)
          } else {
            if (data?.message === 'Please login first') {
              navigate('/logout')
            }
          }
        }).catch(error => {
          setLoader(false)
          if (error?.message === 'Please login first') {
            navigate('/logout')
          }
        });
    } else {
      setLoader(false)
      navigate('/logout')
    }
  }
  useEffect(() => {
    callApi()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const colorBg = (status) => {
    switch (status) {
      case 'In progress':
        return '#5578eb';
      case 'Completed':
        return '#8bc34a';
      case 'Declined':
        return '#e53935';
      case 'Pending':
        return '#ffb300';
      default:
        return '#ffb300';
    }
  };
  const setEditOpenPopup = () => {
    setEditOpen((add) => !add);
  };


  const handleEditClick = (row) => {
    setEditData(row)
    setEditOpen(true)
  }
  return (
    <>
      <Helmet>
        <title> Dashboard </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Tasks
        </Typography>
        <Grid container spacing={3}>
          {showData.map((row) => (
            <Grid item xs={12} md={6} lg={6}>
              <Card sx={{ p: 1, background: colorBg(row.status) }}>
                <Paper
                  key={row?.id}
                  sx={{
                    p: 1,
                    width: 1,
                    bgcolor: 'background.neutral'
                  }}
                >
                   <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>

                  <Typography variant="h6" gutterBottom sx={{
                    flexWrap: 'wrap',
                    wordWrap: 'break-word'
                  }} >
                    {row?.task_name}
                  </Typography>
                  <Typography variant="h6" gutterBottom sx={{
                    flexWrap: 'wrap',
                    wordWrap: 'break-word'
                  }} >
                    {row?.task_date}
                  </Typography>
                    </Box>
                  <Typography variant="body2" gutterBottom sx={{
                    flexWrap: 'wrap',
                    wordWrap: 'break-word',
                  }} >
                    {row?.task_description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" gutterBottom sx={{
                      flexWrap: 'wrap',
                      wordWrap: 'break-word'
                    }} >
                      Status : <span style={{ color: colorBg(row?.status) }}>{row?.status}</span>
                    </Typography>
                    <IconButton onClick={() => handleEditClick(row)}>
                      <Iconify sx={{ color: 'blue' }} icon={'eva:edit-fill'} />
                    </IconButton>
                  </Box>
                  <Box>
                    <Typography variant="p" sx={{ flexWrap: 'wrap', wordWrap: 'break-word' }} >Comments :</Typography>
                      {row?.comments?.split('||').map((element, index) => (
                           <Typography key={index} variant="body2" sx={{marginLeft:'10px', flexWrap: 'wrap', wordWrap: 'break-word' }} >  {element}</Typography>
                  ))}
                  </Box>
                </Paper>
              </Card>
            </Grid>
          ))}

        </Grid>
        <Popup title="Edit Task" openPopup={openEdit} setOpenPopup={setEditOpenPopup}>
          <TaskEdit popup={openEdit} popupChange={setEditOpenPopup} accessToken={token} allUsers={allUsers} record={editData} />
        </Popup>
      </Container>
    </>
  );
}
