import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { Box, Checkbox, TableRow, TableCell, TableHead, TableSortLabel } from '@mui/material';
// @mui
import {
  Card,
  Grid,
  CircularProgress,
  Table,
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
import PermissionAdd from './PermissionAdd'
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import { useNavigate } from 'react-router-dom';


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


export default function Permission() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [showData, setdataShow] = useState([])
  const [loader, setLoader] = useState(true)

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const setOpenPopup = () => {
    setOpen((add) => !add);
  };
  const handleClickClose = () => {
    setOpen((add) => !add);
  }

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
      fetch(`${process.env.REACT_APP_SITE_URL}permission`, requestOptions)
        .then(response => response.json())
        .then(data => {
          setLoader(false)
          if (data?.dataItems && data?.dataItems.length > 0) {
            setdataShow(data?.dataItems)
          }else{
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

  useEffect(() => {
    callApi()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const handleDelete = (id) => {
    console.log(id)
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    };
    fetch(`${process.env.REACT_APP_SITE_URL}permission/${id}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        toast.success('Delete Successfully')
        const newArray = showData.filter((item) => (
          item._id !== id
        ));
        setdataShow(newArray);
      }).catch(error => {
        console.log(error)
      });
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
        <title> Permission </title>
      </Helmet>
      {loader ?
        <Grid sx={{ width: '100%', height: '100vh', textAlign: 'center' }} ><CircularProgress sx={{ color: '#c5c7cf', margin: '0 auto', marginTop: '40%' }} /></Grid> :
        <Container maxWidth="xl">
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Permission
            </Typography>
            <Button onClick={() => setOpen(true)} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              New Permission
            </Button>
          </Stack>

          <Card>

            <Scrollbar>

              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>ID</StyledTableCell>
                      <StyledTableCell >Permission</StyledTableCell>
                      <StyledTableCell >Action</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {showData.map((row) => (
                      <StyledTableRow key={row?.id}>
                        <StyledTableCell>{row?.id}</StyledTableCell>
                        <StyledTableCell >{row?.name}</StyledTableCell>
                        <StyledTableCell >
                          <IconButton onClick={() => handleDelete(row?.id)}>
                            <Iconify sx={{ color: '#db0011' }} icon={'eva:trash-2-outline'} />
                          </IconButton>
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
          <Popup title="Add Permission" openPopup={open} setOpenPopup={setOpenPopup}>
            <PermissionAdd popup={open} popupChange={handleClickClose} accessToken={token} prevState={showData} setdataShow={setdataShow} />
          </Popup>
        </Container>
      }
    </>
  );
}
