import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  Pagination
} from '@mui/material';
// components
import Popup from '../../components/Popup'
import RoleAdd from './RoleAdd'
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import RoleEdit from './RoleEdit';
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


export default function Role() {
  const navigate = useNavigate()
  const token = localStorage.getItem('lm_token')
  const [open, setOpen] = useState(false);
  const [openEdit, setEditOpen] = useState(false);
  const [showData, setdataShow] = useState([])
  const [loader, setLoader] = useState(true)
  const [record, setRecord] = useState()
  const [page, setPage] = useState(0);
  const [size] = useState(15);
  const [totalItems, setTotalItems] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const setOpenPopup = () => {
    setOpen((add) => !add);
  };
  const handleClickClose = () => {
    setOpen((add) => !add);
  }
  const setEditOpenPopup = () => {
    setEditOpen((add) => !add);
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
      fetch(`${process.env.REACT_APP_SITE_URL}role?page=${page}&size=${size}`, requestOptions)
        .then(response => response.json())
        .then(data => {
          setLoader(false)
          if (data?.dataItems && data?.dataItems.length > 0) {

            const rolesWithPermissions = data?.dataItems.map(role => {
              const permissionNames = role.permissions.map(permission => permission.name);
              return { ...role, new_permission: permissionNames.join(', ') };
            });
            setdataShow(rolesWithPermissions)
            setTotalItems(data?.totalItems % size ? (Math.floor(data?.totalItems / size) + 1) : Math.floor(data?.totalItems / size));
            setTotalRecords(data?.totalItems);
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
          toast.error(error?.message)
        });
    } else {
      setLoader(false)
      navigate('/logout')

    }
  }
  const handlePagination = (e, p) => {
    setPage(p - 1);
  }

  useEffect(() => {
    callApi()
    if (!permission_check('role_view')) {
      navigate('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])
  
  const handleDelete = (id) => {
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    };
    fetch(`${process.env.REACT_APP_SITE_URL}role/${id}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        toast.success('Delete Successfully')
        const newArray = showData.filter((item) => (
          item._id !== id
        ));
        setdataShow(newArray);
      }).catch(error => {
        toast.error(error?.message)
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
        <title> Role </title>
      </Helmet>
      {loader ?
        <Grid sx={{ width: '100%', height: '100vh', textAlign: 'center' }} ><CircularProgress sx={{ color: '#c5c7cf', margin: '0 auto', marginTop: '40%' }} /></Grid> :
        <Container maxWidth="xl">
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Role
            </Typography>
            {permission_check('role_create') ? <Button onClick={() => setOpen(true)} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              New Role
            </Button> : ''}
          </Stack>

          <Card>

            <Scrollbar>

              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>ID</StyledTableCell>
                      <StyledTableCell >Role</StyledTableCell>
                      <StyledTableCell >Permissions</StyledTableCell>
                      <StyledTableCell >Action</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {showData.map((row) => (
                      <StyledTableRow key={row?.id}>
                        <StyledTableCell>{row?.id}</StyledTableCell>
                        <StyledTableCell >{row?.name}</StyledTableCell>
                        <StyledTableCell >{row?.new_permission}</StyledTableCell>
                        <StyledTableCell >
                          {permission_check('role_edit') ? <IconButton onClick={() => handleEditClick(row)}>
                            <Iconify sx={{ color: 'blue' }} icon={'eva:edit-fill'} />
                          </IconButton> : ''}
                          {permission_check('role_delete') ? <IconButton onClick={() => handleDelete(row?.id)}>
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
          <Popup title="Add Role" openPopup={open} setOpenPopup={setOpenPopup}>
            <RoleAdd popup={open} popupChange={handleClickClose} accessToken={token} />
          </Popup>
          <Popup title="Edit Role" openPopup={openEdit} setOpenPopup={setEditOpenPopup}>
            <RoleEdit popup={openEdit} popupChange={setEditOpenPopup} accessToken={token} record={record} />
          </Popup>
        </Container>}
    </>
  );
}
