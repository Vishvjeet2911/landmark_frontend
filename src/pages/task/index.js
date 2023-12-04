import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
// import { Box, Checkbox, TableRow, TableCell, TableHead, TableSortLabel } from '@mui/material';
// @mui
import {
  Card,
  Table,
  Grid,
  CircularProgress,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableHead,
  TableContainer,
  TablePagination,
  Pagination
} from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterPopup from './filter';
// components
import Moment from 'moment';
import Popup from '../../components/Popup'
import TaskAdd from './TaskAdd'
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import TaskEdit from './TaskEdit';
import { permission_check } from 'src/_mock/permission_check';


const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));


export default function Task() {
  const navigate = useNavigate();
  const token = localStorage.getItem('lm_token')
  const [open, setOpen] = useState(false);
  const [openEdit, setEditOpen] = useState(false);
  const [showData, setdataShow] = useState([])
  const [loader, setLoader] = useState(true)
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [allUsers, setUsersData] = useState([])
  const [editData, setEditData] = useState()
  const [page, setPage] = useState(0);
  const [size] = useState(15);
  const [totalItems, setTotalItems] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filters, setFilters] = useState({
    task_name: '',
    assigned_by: '',
    assigned_to: '',
  });
  const [onFilter, setOnFilters] = useState(false);
  const setOpenPopup = () => {
    setOpen((add) => !add);
  };
  const handleClickClose = () => {
    setOpen((add) => !add);
  }
  const setEditOpenPopup = () => {
    setEditOpen((add) => !add);
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handlePagination = (e, p) => {
    setPage(p - 1);
  }
  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

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
      fetch(`${process.env.REACT_APP_SITE_URL}task?&task_name=${filters?.task_name}&assigned_by=${filters?.assigned_by}&assigned_to=${filters?.assigned_to}`, requestOptions)
        .then(response => response.json())
        .then(data => {
          setLoader(false)
          if (data?.dataItems) {
            setdataShow(data?.dataItems)
            setTotalItems(data?.totalItems % size ? (Math.floor(data?.totalItems / size) + 1) : Math.floor(data?.totalItems / size));
            setTotalRecords(data?.totalItems);
          } else {
            if (data?.message === 'Please login first') {
              navigate('/logout')
            }
          }
        }).catch(error => {
          setLoader(false)
          toast.error(error?.message)
          if (error?.message === 'Please login first') {
            navigate('/logout')
          }
        });
    } else {
      setLoader(false)
      navigate('/logout')
    }
  }
  const handleDelete = (id) => {
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    };
    fetch(`${process.env.REACT_APP_SITE_URL}task/${id}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        toast.success('Delete Successfully')
        callApi()
        getAllUsers()
      }).catch(error => {
        toast.error(error?.message)
      });
  }
  const getAllUsers = () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    };
    fetch(`${process.env.REACT_APP_SITE_URL}user`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data?.dataItems) {
          setUsersData(data?.dataItems)
        }
      });
  }

  useEffect(() => {
    if (!permission_check('task_view')) {
      navigate('/')
    }
    callApi()
    getAllUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])
  if (onFilter === true) {
    callApi();
    setOnFilters(false);
  }

  const handleEditClick = (row) => {
    setEditData(row)
    setEditOpen(true)
  }

  const colorCoding = (status) => {
    switch (status) {
      case 'Pending':
        return '#ffb300'
      case 'In Progress':
        return '#5578eb';
      case 'Completed':
        return '#8bc34a'
      default:
        return '#ffb300'
    }
  }
  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Stack mb={3}>
        <Accordion sx={{ border: '1px solid #37474f' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h6">Filter</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FilterPopup setFilters={setFilters} onFilter={setOnFilters} />
          </AccordionDetails>
        </Accordion>
      </Stack>
      {permission_check('task_view') ? loader ?
        <Grid sx={{ width: '100%', height: '100vh', textAlign: 'center' }} ><CircularProgress sx={{ color: '#c5c7cf', margin: '0 auto', marginTop: '40%' }} /></Grid> :
        <Container maxWidth="xl">
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Task
            </Typography>
            {permission_check('task_create') ? <Button onClick={() => setOpen(true)} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              New Task
            </Button> : ''}
          </Stack>

          <Card>

            <Scrollbar>

              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Task Name</StyledTableCell>
                      <StyledTableCell >Task Description</StyledTableCell>
                      <StyledTableCell >Assigned by</StyledTableCell>
                      <StyledTableCell >Assigned to</StyledTableCell>
                      <StyledTableCell >Comments</StyledTableCell>
                      <StyledTableCell >Status</StyledTableCell>
                      <StyledTableCell >Last Updated</StyledTableCell>
                      <StyledTableCell >Action</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {showData.map((row) => (
                      <StyledTableRow key={row?.id}>
                        <StyledTableCell>{row?.task_name}</StyledTableCell>
                        <StyledTableCell >{row?.task_description}</StyledTableCell>
                        <StyledTableCell >{row?.assignedByUser?.email}</StyledTableCell>
                        <StyledTableCell >{row?.assignedToUser?.email}</StyledTableCell>
                        <StyledTableCell > {row?.comments?.split('||').map((element, index) => (
                          <Typography key={index} variant="body2" sx={{ marginLeft: '10px', flexWrap: 'wrap', wordWrap: 'break-word' }} >  {element}</Typography>))}</StyledTableCell>
                        <StyledTableCell sx={{ color: colorCoding(row?.status) }}>{row?.status}</StyledTableCell>
                        <StyledTableCell >{new Moment(new Date(row.updatedAt)).format('DD-MM-yyyy')}</StyledTableCell>
                        <StyledTableCell >
                          {permission_check('task_edit') ? <IconButton onClick={() => handleEditClick(row)}>
                            <Iconify sx={{ color: 'blue' }} icon={'eva:edit-fill'} />
                          </IconButton> : ''}
                          {permission_check('task_delete') ? <IconButton onClick={() => handleDelete(row?.id)}>
                            <Iconify sx={{ color: '#db0011' }} icon={'eva:trash-2-outline'} />
                          </IconButton> : ''}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
            <Grid container >
              <Grid item xs={12} sm={12} md={4} lg={4}></Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {(showData && showData.length > 0) ?
                  <Pagination count={totalItems} page={page + 1} variant="outlined" sx={{ paddingY: '20px' }} onChange={(e, page) => handlePagination(e, page)} />
                  : <Typography p={2}>No Data Found</Typography>}
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ paddingTop: '20px', paddingRight: '10px', fontWeight: '600' }}>Total Items: {totalRecords}</Typography>
              </Grid>
            </Grid>
          </Card>
          <Popup title="Add Task" openPopup={open} setOpenPopup={setOpenPopup}>
            <TaskAdd popup={open} popupChange={handleClickClose} accessToken={token} allUsers={allUsers} />
          </Popup>
          <Popup title="Edit Task" openPopup={openEdit} setOpenPopup={setEditOpenPopup}>
            <TaskEdit popup={openEdit} popupChange={setEditOpenPopup} accessToken={token} allUsers={allUsers} record={editData} />
          </Popup>
        </Container> : ''}
    </>
  );
}
