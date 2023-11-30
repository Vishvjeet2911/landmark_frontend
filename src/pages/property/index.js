import { useEffect, useState, useRef } from 'react'
import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import locationData from '../locationData.json';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterPopup from './filter';
import LoadingButton from '@mui/lab/LoadingButton';
import DownloadIcon from '@mui/icons-material/Download';
import * as XLSX from 'xlsx/xlsx.mjs';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import UploadIcon from '@mui/icons-material/Upload';
import AddIcon from '@mui/icons-material/Add';
import account from 'src/_mock/account';
import { permission_check } from 'src/_mock/permission_check';
import ExcelJS from 'exceljs';

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
  Pagination,
} from '@mui/material';
// components
import Popup from '../../components/Popup'
import PropertyAdd from './PropertyAdd'
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import PropertyEdit from './PropertyEdit';
import View from './view';


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


export default function Property() {
  const navigate = useNavigate();
  const dialogBox = useRef()
  const token = localStorage.getItem('lm_token')
  const [open, setOpen] = useState(false);
  const [openEdit, setEditOpen] = useState(false);
  const [openView, setViewOpen] = useState(false);
  const [showData, setdataShow] = useState([])
  const [stateData, setStateData] = useState([])
  const [areaData, setAreaData] = useState([])
  const [loader, setLoader] = useState(true)
  const [currentData, setCurrentData] = useState({});
  const [exportLoad, setExportLoad] = useState(false);
  const [importLoad, setImportLoad] = useState(false);
  const [openConfirmPending, setOpenConfirmPending] = useState(false);
  const [fileImport, setFileImport] = useState(null);
  const [page, setPage] = useState(0);
  const [size] = useState(15);
  const [totalItems, setTotalItems] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filters, setFilters] = useState({
    state_id: '',
    city_id: '',
    area_name: '',
    available_for: '',
    nature_of_premises: '',
    minimum_area: '',
    maximum_area: ''
  });
  const [onFilter, setOnFilters] = useState(false);
  const setOpenPopup = () => {
    setOpen((add) => !add);
  };
  const setEditOpenPopup = () => {
    setEditOpen((add) => !add);
  };
  const setViewOpenPopup = () => {
    setViewOpen((add) => !add);
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
      fetch(`${process.env.REACT_APP_SITE_URL}property?page=${page}&size=${size}&state_id=${filters?.state_id}&city_id=${filters?.city_id}&area_name=${filters?.area_name}&available_for=${filters?.available_for}&nature_of_premises=${filters?.nature_of_premises}&minimum_area=${filters?.minimum_area}&maximum_area=${filters?.maximum_area}`, requestOptions)
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
  if (onFilter === true) {
    callApi();
    setOnFilters(false);
  }
  const handlePagination = (e, p) => {
    setPage(p - 1);
  }

  const otherData = async () => {
    setLoader(true)
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    };
    await fetch(`${process.env.REACT_APP_SITE_URL}property/state-city`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data?.data)
        setStateData(data?.data?.states)
      });
      setLoader(false)
  }
  useEffect(() => {
    otherData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    callApi()
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
    fetch(`${process.env.REACT_APP_SITE_URL}property/${id}`, requestOptions)
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
    navigate('/property-edit', { state: row })
    // setEditOpen(true)
    // setCurrentData(row)
  }

  const handleViewClick = (row) => {
    setViewOpen(true)
    setCurrentData(row)
  }
  const handleDownloadClick = () => {
    setExportLoad(true)
    if (token != null) {
      // setAccessToken(bundle);
    } else {
      navigate('/logout', { replace: true });
    }
    const requestOptions = {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      },
    };

    fetch(`${process.env.REACT_APP_SITE_URL}property/export?state_id=${filters?.state_id}&city_id=${filters?.city_id}&area_name=${filters?.area_name}&available_for=${filters?.available_for}&nature_of_premises=${filters?.nature_of_premises}&minimum_area=${filters?.minimum_area}&maximum_area=${filters?.maximum_area}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setExportLoad(false)
        try {
          const workbook = new ExcelJS.Workbook();
          const sheet = workbook.addWorksheet("Data");
          sheet.properties.defaultRowHeight = 120;
          sheet.columns = [
            { header: "Image", key: "image", width: "30" },
            { header: "Property Name", key: "property_name" },
            { header: "State", key: 'states' },
            { header: "City", key: 'cities' },
            { header: "Areas", key: 'areas' },
            { header: "Landmark", key: 'landmark' },
            { header: "Owner Name", key: 'owner_name' },
            { header: "Owner Mobile", key: 'owner_mobile' },
            { header: "Owner Email", key: 'owner_email' },
            { header: "Owner Remarks", key: 'owner_remarks' },
            { header: "Available For", key: 'available_for' },
            { header: "Nature of Premises", key: 'nature_of_premises' },
            { header: "Minimum area", key: 'minimum_area' },
            { header: "Maximum area ", key: 'maximum_area' },
            { header: "Area available", key: 'area_avaliable' },
            { header: "Premises condition", key: 'premises_condition' },
            { header: "Per sq. rate", key: 'per_sq_rate' },
            { header: "Maintenance charge", key: 'maintenance_charge' },
            { header: "Signage space", key: 'signage_space' },
            { header: "Earthing space", key: 'earthing_space' },
            { header: "Antenna space", key: 'antenna_space' },
            { header: "AC outdoor unit space", key: 'ac_outdoor_unit_space' },
            { header: "DG space", key: 'dg_space' },
            { header: "Rolling shutter", key: 'rolling_shutter' },
            { header: "Power backup", key: 'power_backup' },
            { header: "Lift", key: 'lift' },
            { header: "Parking", key: 'parking' },
            { header: "Exist tenants", key: 'exist_tenants' },
            { header: "Ranking", key: 'ranking' },
            { header: "Reamrks", key: 'remarks' },
            { header: "Other reamrks", key: 'other_remarks' },
            { header: "User Name", key: 'user_name' },
            { header: "Status", key: 'status' },
            { header: "UpdatedAT", key: 'updatedAt' },
          ];
          const promise = Promise.all(
            data?.map(async (element, index) => {
              const rowNumber = index + 1;
              sheet.addRow({
                property_name: element?.property_name,
                states: element?.states?.name,
                cities: element?.cities?.name,
                areas: element?.areas?.name,
                landmark: element?.landmark,
                owner_name: element?.owner_name,
                owner_mobile: element?.owner_mobile,
                owner_email: element?.owner_email,
                owner_remarks: element?.owner_remarks,
                available_for: element?.available_for,
                nature_of_premises: element?.nature_of_premises,
                minimum_area: element?.minimum_area,
                maximum_area: element?.maximum_area,
                area_avaliable: element?.area_avaliable,
                premises_condition: element?.premises_condition,
                per_sq_rate: element?.per_sq_rate,
                maintenance_charge: element?.maintenance_charge,
                signage_space: element?.signage_space,
                earthing_space: element?.earthing_space,
                antenna_space: element?.antenna_space,
                ac_outdoor_unit_space: element?.ac_outdoor_unit_space,
                dg_space: element?.dg_space,
                rolling_shutter: element?.rolling_shutter,
                power_backup: element?.power_backup,
                lift: element?.lift,
                parking: element?.parking,
                exist_tenants: element?.exist_tenants,
                ranking: element?.ranking,
                remarks: element?.remarks,
                other_remarks: element?.other_remarks,
                user_name: element?.user?.name,
                status: element?.status,
                updatedAt: new Date(element?.updatedAt).toLocaleDateString(),
              });
              const type = element?.image.split(';')[0].split('/')[1];
              const imageId2 = workbook.addImage({
                base64: element?.image,
                extension: type,
              });

              sheet.addImage(imageId2, {
                tl: { col: 0, row: rowNumber },
                ext: { width: 200, height: 200 },
              });
            })
          );

          promise.then(() => {
            workbook.xlsx.writeBuffer().then(function (data) {
              const blob = new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              });
              const url = window.URL.createObjectURL(blob);
              const anchor = document.createElement("a");
              anchor.href = url;
              anchor.download = "export.xlsx";
              anchor.click();
              window.URL.revokeObjectURL(url);
            });
          });
        } catch (error) {

        }
      }).catch(error => {
        setExportLoad(false)
        toast.error(error?.message)
      });


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

      fetch(`${process.env.REACT_APP_SITE_URL}property/import`, requestOptions)
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
      "area_name": "Ferozpur Road",
      "property_name": "SCO 12",
      "landmark": "Nearby TATA Capital Office",
      "owner_name": "abc",
      "owner_mobile": 9999999999,
      "owner_email": "xyz@gmail.com",
      "owner_remarks": "like care taker /  manager contact details, etc.",
      "available_for": "Lease",
      "nature_of_premises": "Residential",
      "minimum_area": 250,
      "maximum_area": 5000,
      "area_avaliable": "1200 sq. foot",
      "premises_condition": "Furnished (vacated by Reliance Life)",
      "per_sq_rate": "40 rs",
      "maintenance_charge": 5000,
      "signage_space": "Available",
      "earthing_space": "Available",
      "antenna_space": "Not Available",
      "ac_outdoor_unit_space": "Not Available",
      "dg_space": " Space Available back",
      "rolling_shutter": "To be provided by the Owner ",
      "power_backup": "Not Available",
      "lift": "Available",
      "parking": "In front of the building",
      "exist_tenants": "Yes",
      "ranking": "A",
      "remarks": "abc",
      "other_remarks": "abc",
    }]
    var workbook = XLSX.utils.book_new();
    var ws1 = XLSX.utils.json_to_sheet(data1);
    XLSX.utils.book_append_sheet(workbook, ws1, "Sample");
    XLSX.writeFile(workbook, 'sample_property_file.xlsx', { type: 'file' });
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
        <title> Property </title>
      </Helmet>
     
        <Container maxWidth="xl">
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
                <FilterPopup setFilters={setFilters} onFilter={setOnFilters} states={stateData} />
              </AccordionDetails>
            </Accordion>
          </Stack>
          {loader ?
        <Grid sx={{ width: '100%', height: '100vh', textAlign: 'center' }} ><CircularProgress sx={{ color: '#c5c7cf', margin: '0 auto', marginTop: '40%' }} /></Grid> :
        <>
        <Stack direction="row" justifyContent="space-between" >
            <Grid container>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <Typography variant="h4" gutterBottom>
                  Property
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} alignItems="right" >
                <Stack direction="row" spacing={1}>
                  <Stack direction="column">
                    {permission_check('property_create') ? <Button onClick={() => navigate('/property-add')} sx={{ float: 'right', marginY: '10px' }} variant="contained" startIcon={<AddIcon />}>
                      New Property
                    </Button> : ''}
                  </Stack>
                  {permission_check('property_import') ? <Stack direction="column">
                    <LoadingButton variant="contained" component="label" startIcon={<UploadIcon />} loading={importLoad} sx={{ backgroundColor: '#ff6f00', marginY: '10px', textAlign: 'justify' }} >
                      Import Property
                      <input hidden type="file" onChange={e => uploadPendingFile(e)} />
                    </LoadingButton>
                    <Button variant="text" sx={{ textTransform: 'capitalize' }} onClick={handlePropertySample} >Sample File <DownloadIcon fontSize="small" /></Button>
                  </Stack> : ''}
                  {permission_check('property_export') ? <Stack direction="column">
                    <LoadingButton variant="contained" startIcon={<DownloadIcon />} loading={exportLoad} sx={{ backgroundColor: '#1a237e', marginY: '10px', marginRight: '10px' }} onClick={handleDownloadClick}>Export</LoadingButton>
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
                      <StyledTableCell>Property name</StyledTableCell>
                      <StyledTableCell >Image </StyledTableCell>
                      <StyledTableCell >Owner Name</StyledTableCell>
                      <StyledTableCell >Area </StyledTableCell>
                      <StyledTableCell >City</StyledTableCell>
                      {/* <StyledTableCell >Status</StyledTableCell> */}
                      <StyledTableCell >Action</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {showData.map((row) => (
                      <StyledTableRow key={row?.id}>
                        <StyledTableCell>{row?.property_name}</StyledTableCell>
                        <StyledTableCell>{row?.image ? <img src={row?.image} style={{ width: '50px', }} /> : 'No image'}</StyledTableCell>
                        <StyledTableCell >{row?.owner_name}</StyledTableCell>
                        <StyledTableCell >{row?.areas?.name}</StyledTableCell>
                        <StyledTableCell >{row?.cities?.name}</StyledTableCell>
                        {/* <StyledTableCell >{row?.status}</StyledTableCell> */}
                        <StyledTableCell >
                          {permission_check('property_view') ? <IconButton onClick={() => handleViewClick(row)}>
                            <Iconify sx={{ color: '#e418d6' }} icon={'eva:eye-fill'} />
                          </IconButton> : ''}
                          {permission_check('property_edit') ? <IconButton onClick={() => handleEditClick(row)}>
                            <Iconify sx={{ color: 'blue' }} icon={'eva:edit-fill'} />
                          </IconButton> : ''}
                          {permission_check('property_delete') ? <IconButton onClick={() => handleDelete(row?.id)}>
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
          </>}

          <Popup title="Add Property" openPopup={open} setOpenPopup={setOpenPopup}>
            <PropertyAdd popup={open} popupChange={setOpenPopup} locationData={locationData} accessToken={token} />
          </Popup>
          <Popup title="Edit Property" openPopup={openEdit} setOpenPopup={setEditOpenPopup}>
            <PropertyEdit popup={openEdit} popupChange={setEditOpenPopup} accessToken={token} currentData={currentData} />
          </Popup>
          <Popup title="Property Details" openPopup={openView} setOpenPopup={setViewOpenPopup} width="lg">
            <View popup={openView} popupChange={setViewOpenPopup} accessToken={token} currentData={currentData} />
          </Popup>
        </Container>
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
