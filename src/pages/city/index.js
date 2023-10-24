import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
} from '@mui/material';
// components
import Popup from '../../components/Popup'
import AreaAdd from './CityAdd'
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import AreaEdit from './CityEdit';
import { useNavigate } from 'react-router-dom';
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


export default function Area() {
  const navigate = useNavigate()
  const token = localStorage.getItem('lm_token')
  const [open, setOpen] = useState(false);
  const [openEdit, setEditOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [showData, setdataShow] = useState([])
  const [loader, setLoader] = useState(true)
  const [record, setRecord] = useState()
  const [rowsPerPage, setRowsPerPage] = useState(5);
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
      fetch(`${process.env.REACT_APP_SITE_URL}city`, requestOptions)
        .then(response => response.json())
        .then(data => {
          setLoader(false)
          if (data?.dataItems && data?.dataItems.length > 0) {
            setdataShow(data?.dataItems)
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
          console.log(error)
        });
    } else {
      setLoader(false)
      navigate('/logout')

      console.log('here')
    }
  }

  useEffect(() => {
    callApi()
    if (!permission_check('city_view')) {
      navigate('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const handleDelete = (id) => {
    console.log('delete')
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    };
    fetch(`${process.env.REACT_APP_SITE_URL}city/${id}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        toast.success('Delete Successfully')
        const newArray = showData.filter((item) => (
          item._id !== id
        ));
        setdataShow(newArray);
      }).catch(error => {
        console.log(error)
      });
  }

  const handleEditClick = (row) => {
    setRecord(row)
    setEditOpen(true)
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
      <Helmet>
        <title> City </title>
      </Helmet>
      {loader ?
        <Grid sx={{ width: '100%', height: '100vh', textAlign: 'center' }} ><CircularProgress sx={{ color: '#c5c7cf', margin: '0 auto', marginTop: '40%' }} /></Grid> :
        <Container maxWidth="xl">
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              City
            </Typography>
            {permission_check('city_create') ? <Button onClick={() => setOpen(true)} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              New City
            </Button> : ''}
          </Stack>

          <Card>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>ID</StyledTableCell>
                      <StyledTableCell >City Name</StyledTableCell>
                      <StyledTableCell >State Name</StyledTableCell>
                      <StyledTableCell >Action</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {showData.map((row) => (
                      <StyledTableRow key={row?.id}>
                        <StyledTableCell >{row?.id}</StyledTableCell>
                        <StyledTableCell >{row?.name}</StyledTableCell>
                        <StyledTableCell >{row?.states?.name}</StyledTableCell>
                        <StyledTableCell >
                          {permission_check('city_edit') ? <IconButton onClick={() => handleEditClick(row)}>
                            <Iconify sx={{ color: 'blue' }} icon={'eva:edit-fill'} />
                          </IconButton> : ''}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            {(showData && showData.length > 0) ? <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={showData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            /> : <Typography p={2}>No Data Found</Typography>}
          </Card>
          <Popup title="Add Area" openPopup={open} setOpenPopup={setOpenPopup}>
            <AreaAdd popup={open} popupChange={handleClickClose} accessToken={token} />
          </Popup>
          <Popup title="Edit Area" openPopup={openEdit} setOpenPopup={setEditOpenPopup}>
            <AreaEdit popup={openEdit} popupChange={setEditOpenPopup} accessToken={token} record={record} />
          </Popup>
        </Container>}
    </>
  );
}
