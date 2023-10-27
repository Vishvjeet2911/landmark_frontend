import { useEffect, useState, useRef } from 'react'
import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingButton from '@mui/lab/LoadingButton';
import DownloadIcon from '@mui/icons-material/Download';
import * as XLSX from 'xlsx/xlsx.mjs';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import UploadIcon from '@mui/icons-material/Upload';
import AddIcon from '@mui/icons-material/Add';
import { permission_check } from 'src/_mock/permission_check';
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
  Pagination,
} from '@mui/material';
// components
import Popup from '../../components/Popup'
import AreaAdd from './AreaAdd'
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import AreaEdit from './AreaEdit';
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


export default function Area() {
  const dialogBox = useRef()
  const navigate = useNavigate()
  const token = localStorage.getItem('lm_token')
  const [open, setOpen] = useState(false);
  const [openEdit, setEditOpen] = useState(false);
  const [showData, setdataShow] = useState([])
  const [loader, setLoader] = useState(true)
  const [record, setRecord] = useState()
  const [importLoad, setImportLoad] = useState(false);
  const [openConfirmPending, setOpenConfirmPending] = useState(false);
  const [fileImport, setFileImport] = useState(null);
  const [page, setPage] = useState(0);
  const [size] = useState(20);
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
      fetch(`${process.env.REACT_APP_SITE_URL}area?page=${page}&size=${size}`, requestOptions)
        .then(response => response.json())
        .then(data => {
          setLoader(false)
          if (data?.dataItems && data?.dataItems.length > 0) {
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

  useEffect(() => {
    callApi()
    if (!permission_check('area_view')) {
      navigate('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const handlePagination = (e, p) => {
    setPage(p - 1);
  }

  const handleDelete = (id) => {
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    };
    fetch(`${process.env.REACT_APP_SITE_URL}area/${id}`, requestOptions)
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

  const handlePendingUpload = () => {
    setOpenConfirmPending(false)
    handleFile(fileImport)
  }
  const uploadPendingFile = (e) => {
    setFileImport(e)
    setOpenConfirmPending(true)
  }
  const handleFile = (e) => {
    setLoader(true)
    setImportLoad(true)
    e.preventDefault();
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = (e) => {
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: true });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      let workbook = XLSX.utils.book_new();
      const json = JSON.stringify(data);
      const blob = new Blob([json], {
        type: 'application/json'
      });
      const formdata = new FormData();
      formdata.append("document", blob);
      const requestOptions = {
        method: "POST",
        headers: {
          "Accept": "application/json ,text/plain, */*",
          'Authorization': 'Bearer ' + token
        },
        body: formdata
      };

      fetch(`${process.env.REACT_APP_SITE_URL}area/import`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          let data2 = []
          setLoader(false)
          setFileImport(null)
          if ('success' in data) {
            for (let i = 0; i < data.resultArr.length; i++) {
              data2.push(data.resultArr[i])
            }
            var ws1 = XLSX.utils.json_to_sheet(data2);
            XLSX.utils.book_append_sheet(workbook, ws1, "Results");
            XLSX.writeFile(workbook, 'result.xlsx', { type: 'file' });
            toast.info("File uploaded, Please upload in downloaded file.")
            window.location.reload()
          } else {
            toast.error(data?.message)
          }
        });
    };

    if (rABS) {
      reader.readAsBinaryString(e.target.files[0]);
    } else {
      reader.readAsArrayBuffer(e.target.files[0]);
    };
    setImportLoad(false)

  }

  const handlePropertySample = (e) => {
    let data1 = [{
      "state_name": "Punjab",
      "city_name": "Ludhiana",
      "area_name": "Ferozpur Road"
    }]
    var workbook = XLSX.utils.book_new();
    var ws1 = XLSX.utils.json_to_sheet(data1);
    XLSX.utils.book_append_sheet(workbook, ws1, "Sample");
    XLSX.writeFile(workbook, 'sample_area_file.xlsx', { type: 'file' });
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
        <title> Area </title>
      </Helmet>
      {loader ?
        <Grid sx={{ width: '100%', height: '100vh', textAlign: 'center' }} ><CircularProgress sx={{ color: '#c5c7cf', margin: '0 auto', marginTop: '40%' }} /></Grid> :
        <Container maxWidth="xl">
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Grid container>
              <Grid xs={12} sm={12} md={6} lg={6}>
                <Typography variant="h4" gutterBottom>
                  Area
                </Typography>
              </Grid>
              <Grid xs={12} sm={12} md={6} lg={6}>
                <Stack direction="row" justifyContent='flex-end' spacing={1}>
                  <Stack direction="column">
                    {permission_check('area_create') ? <Button onClick={() => setOpen(true)} sx={{ float: 'right', marginY: '10px' }} variant="contained" startIcon={<AddIcon />}>
                      New Area
                    </Button> : ''}
                  </Stack>
                  {permission_check('area_import') ? <Stack direction="column">
                    <LoadingButton variant="contained" component="label" startIcon={<UploadIcon />} loading={importLoad} sx={{ backgroundColor: '#ff6f00', marginY: '10px' }} >
                      Import Property
                      <input hidden type="file" onChange={e => uploadPendingFile(e)} />
                    </LoadingButton>
                    <Button variant="text" sx={{ textTransform: 'capitalize' }} onClick={handlePropertySample} >Sample File <DownloadIcon fontSize="small" /></Button>
                  </Stack> : ''}
                </Stack>
              </Grid>
            </Grid>
          </Stack>

          <Card>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>ID</StyledTableCell>
                      <StyledTableCell >Area Name</StyledTableCell>
                      <StyledTableCell >City Name</StyledTableCell>
                      <StyledTableCell >State Name</StyledTableCell>
                      <StyledTableCell >Action</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {showData.map((row) => (
                      <StyledTableRow key={row?.id}>
                        <StyledTableCell>{row?.id}</StyledTableCell>
                        <StyledTableCell >{row?.name}</StyledTableCell>
                        <StyledTableCell >{row?.cities?.name}</StyledTableCell>
                        <StyledTableCell >{row?.states?.name}</StyledTableCell>
                        <StyledTableCell >
                          {permission_check('area_edit') ? <IconButton onClick={() => handleEditClick(row)}>
                            <Iconify sx={{ color: 'blue' }} icon={'eva:edit-fill'} />
                          </IconButton> : ''}
                          {permission_check('area_delete') ? <IconButton onClick={() => handleDelete(row?.id)}>
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
          <Popup title="Add Area" openPopup={open} setOpenPopup={setOpenPopup}>
            <AreaAdd popup={open} popupChange={handleClickClose} accessToken={token} />
          </Popup>
          <Popup title="Edit Area" openPopup={openEdit} setOpenPopup={setEditOpenPopup}>
            <AreaEdit popup={openEdit} popupChange={setEditOpenPopup} accessToken={token} record={record} />
          </Popup>
        </Container>}
      <Dialog
        ref={dialogBox}
        open={openConfirmPending}
        onClose={() => { setOpenConfirmPending(false) }}
      >
        <DialogContent>
          <Typography variant="h6" component="div" sx={{ color: '#07090A', fontWeight: '500' }}>
            Are you sure to upload this file?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenConfirmPending(false); setFileImport(null) }} sx={{ color: '#DB0011' }}>Decline</Button>
          <Button onClick={handlePendingUpload} sx={{ color: '#1B5E20' }} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
