import * as Yup from 'yup';
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { useFormik, Form, FormikProvider } from 'formik';
import Autocomplete from '@mui/material/Autocomplete';
import {
    Stack,
    TextField,
    Button, Grid, Typography, Container, FormControl, InputLabel, Select, MenuItem,
    IconButton,
    Paper,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import Dropzone, { useDropzone } from 'react-dropzone'
import DeleteIcon from '@mui/icons-material/Delete';
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

// ----------------------------------------------------------------------

export default function PropertyAdd() {
    const navigate = useNavigate();
    const token = localStorage.getItem('lm_token')
    const [btnLoad, setbtnLoad] = useState(false);
    const [src, setSrc] = useState(null);
    const [crop, setCrop] = useState({
        unit: "%",
        x: 0,
        y: 0,
        width: 50,
        height: 50
    });
    const [croppedImageUrl, setCroppedImageUrl] = useState(null);
    const imageRef = useRef(null);
    const [stateData, setStateData] = useState([])
    const [cityData, setCityData] = useState([])
    const [areaData, setAreaData] = useState([])
    const [selectedState, setSelectedState] = useState({})
    const [selectedCity, setSelectedCity] = useState({})
    const [selectedArea, setSelectedArea] = useState({})
    const [selectedFile, setSelectedFile] = useState(null)
    const [preview, setPreview] = useState('')
    // const [age, setAge] = useState('');

    const [uploadedImages, setUploadedImages] = useState([]);


    useEffect(() => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        };
        fetch(`${process.env.REACT_APP_SITE_URL}property/state-city`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setStateData(data?.data?.states)
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onDrop = useCallback(async (acceptedFiles) => {
        try {
            const uploaded = await Promise.all(
                acceptedFiles.map(async (file) => {
                    const reader = new FileReader();
                    const imagePromise = new Promise((resolve) => {
                        reader.onload = () => {
                            setUploadedImages((prevImages) => [...prevImages, reader.result]);
                        };
                    });
                    reader.readAsDataURL(file);
                    return imagePromise;
                })
            );

        } catch (error) {
            console.error('Error uploading image:', error);
        }
    }, []);
    const onDeleteImage = (index) => {
        setUploadedImages((prevImages) => {
            const updatedImages = [...prevImages];
            updatedImages.splice(index, 1); // Remove one element at the specified index
            return updatedImages;
        });
    };



    const LoginSchema = Yup.object().shape({
        state_id: Yup.number().required('State Name is required'),
        area_id: Yup.number().required('Area Name is required'),
        city_id: Yup.number().required('City Name is required'),
        property_name: Yup.string().required('Property Name is required'),
        owner_name: Yup.string().required('Owner Name is required'),
        owner_mobile: Yup.number().required('Owner mobile number is required'),
        owner_email: Yup.string().email('must be an email address').required('Owner mobile number is required'),
    });

    const formik = useFormik({
        initialValues: {
            state_id: '',
            area_id: '',
            city_id: '',
            property_name: '',
            landmark: '',
            image: '',
            available_for: '',
            nature_of_premises: '',
            minimum_area: '',
            maximum_area: '',
            area_avaliable: '',
            premises_condition: '',
            per_sq_rate: '',
            maintenance_charge: '',
            signage_space: '',
            earthing_space: '',
            antenna_space: '',
            ac_outdoor_unit_space: '',
            dg_space: '',
            rolling_shutter: '',
            power_backup: '',
            lift: '',
            parking: '',
            exist_tenants: '',
            ranking: '',
            owner_name: '',
            owner_mobile: '',
            owner_email: '',
            owner_remarks: '',
            remarks: '',
            other_remarks: '',
            images: []
        },
        enableReinitialize: true,
        validationSchema: LoginSchema,
        onSubmit: (initialValues) => {
            setbtnLoad(true)
            initialValues.image = croppedImageUrl ? croppedImageUrl : ''
            initialValues.images = uploadedImages ? uploadedImages : []
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(initialValues),
            };
            fetch(`${process.env.REACT_APP_SITE_URL}property`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    setbtnLoad(false)
                    if ('success' in data) {
                        setbtnLoad(false)
                        navigate('/property')
                        toast.success('Saved Sucessfully');
                    } else {
                        setbtnLoad(false)
                        toast.error(data?.message);
                        if (data?.message === 'Please authenticate') {
                            // logout()
                            navigate('/login', { replace: true });
                        }
                    }
                });
        }
    });
    const { values, errors, touched, handleSubmit, getFieldProps, setFieldValue } = formik;


    // useEffect(() => {
    //     if (selectedState !== '') {
    //         let city = locationData[selectedState]
    //         setCityData(city)
    //         setFieldValue("city_name", '');
    //     }
    // }, [selectedState])

    const handleCity = (id) => {
        const citites = stateData.find(item => item.id === id);
        setSelectedCity({})
        setCityData(citites ? citites.cities : []);
    }
    const handleArea = (id) => {
        const areas = cityData.find(item => item.id === id);
        setSelectedArea({})
        setAreaData(areas ? areas.areas : []);
    }
    const onSelectFile = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile('');
            return
        }
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedFile(e.target.result);
            };
            reader.readAsDataURL(file);
        }
        const objectUrl = URL.createObjectURL(e.target.files[0])
        setPreview(objectUrl)
    }
    const { getRootProps, getInputProps } = useDropzone({ onDrop })

    const onSelectFile1 = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener("load", () => setSrc(reader.result));
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const onImageLoaded = useCallback(image => {
        imageRef.current = image;
        return false; // Return false when setting ref via callback
    }, []);

    const onCropComplete = useCallback(crop => {
        makeClientCrop(crop);
    }, []);

    const onCropChange = (crop, percentCrop) => {
        setCrop(crop);
    };

    const makeClientCrop = async (crop) => {
        if (imageRef.current && crop.width && crop.height) {
            const newCroppedImageUrl = await getCroppedImg(
                imageRef.current,
                crop,
                "newFile.jpeg"
            );
            setCroppedImageUrl(newCroppedImageUrl);
        }
    };

    const getCroppedImg = (image, crop, fileName) => {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                if (!blob) {
                    console.error("Canvas is empty");
                    return;
                }
                blob.name = fileName;
                const fileUrl = window.URL.createObjectURL(blob);
                resolve(fileUrl);
            }, "image/jpeg");
        });
    };

    return (
        <Container>
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Typography variant="h4">Add Property Details</Typography>
                    <Typography mt={3} variant="h5">Location Details</Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={6} mt={2}>
                            <Autocomplete
                                id="state"
                                options={stateData}
                                value={selectedState}
                                getOptionLabel={(option) => option?.name || ''}
                                onChange={(event, newValue) => {
                                    setSelectedState(newValue ? newValue : {})
                                    setFieldValue("state_id", newValue?.id);
                                    handleCity(newValue ? newValue.id : 0)
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="Select State"
                                        placeholder="States"
                                        error={Boolean(touched.state_id && errors.state_id)}
                                        helperText={touched.state_id && errors.state_id}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} mt={2}>
                            <Autocomplete
                                id="city"
                                options={cityData}
                                value={selectedCity}
                                getOptionLabel={(option) => option?.name || ''}
                                onChange={(event, newValue) => {
                                    setSelectedCity(newValue ? newValue : {})
                                    setFieldValue("city_id", newValue?.id);
                                    handleArea(newValue ? newValue.id : 0)
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="Select City"
                                        placeholder="City"
                                        error={Boolean(touched.city_id && errors.city_id)}
                                        helperText={touched.city_id && errors.city_id}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} >
                            <Autocomplete
                                id="area"
                                options={areaData}
                                value={selectedArea}
                                getOptionLabel={(option) => option?.name || ''}
                                onChange={(event, newValue) => {
                                    setSelectedArea(newValue ? newValue : {})
                                    setFieldValue("area_id", newValue?.id);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="Select Area"
                                        placeholder="Area"
                                        error={Boolean(touched.area_id && errors.area_id)}
                                        helperText={touched.area_id && errors.area_id}
                                    />
                                )}
                            />

                        </Grid>
                        <Grid item xs={12} md={6} lg={6} >
                            <TextField
                                fullWidth
                                autoComplete="name"
                                type="text"
                                variant="outlined"
                                label="Plot No. / SCO No. / Building's Name"
                                {...getFieldProps('property_name')}
                                error={Boolean(touched.property_name && errors.property_name)}
                                helperText={touched.property_name && errors.property_name}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} >
                            <TextField
                                fullWidth
                                autoComplete="name"
                                type="text"
                                variant="outlined"
                                label="Landmark"
                                {...getFieldProps('landmark')}
                                error={Boolean(touched.landmark && errors.landmark)}
                                helperText={touched.landmark && errors.landmark}
                            />
                        </Grid>

                    </Grid>
                    <Typography mt={3} variant="h5">Owner Details</Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={6} mt={2}>
                            <TextField
                                fullWidth
                                autoComplete="owner_name"
                                type="text"
                                variant="outlined"
                                value={values?.owner_name}
                                label="Owner Name"
                                {...getFieldProps('owner_name')}
                                error={Boolean(touched.owner_name && errors.owner_name)}
                                helperText={touched.owner_name && errors.owner_name}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} mt={2}>
                            <TextField
                                fullWidth
                                autoComplete="owner_mobile"
                                type="text"
                                variant="outlined"
                                inputMode='tel'
                                value={values?.owner_mobile}

                                label="Owner Mobile"
                                {...getFieldProps('owner_mobile')}
                                error={Boolean(touched.owner_mobile && errors.owner_mobile)}
                                helperText={touched.owner_mobile && errors.owner_mobile}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} mt={2}>
                            <TextField
                                fullWidth
                                autoComplete="owner_email"
                                type="text"
                                variant="outlined"
                                label="Owner Email"
                                inputMode='email'
                                value={values?.owner_email}
                                {...getFieldProps('owner_email')}
                                error={Boolean(touched.owner_email && errors.owner_email)}
                                helperText={touched.owner_email && errors.owner_email}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} mt={2}>
                            <TextField
                                fullWidth
                                autoComplete="owner_remarks"
                                type="text"
                                variant="outlined"
                                value={values?.owner_remarks}
                                label="Owner Remarks"
                                {...getFieldProps('owner_remarks')}
                                error={Boolean(touched.owner_remarks && errors.owner_remarks)}
                                helperText={touched.owner_remarks && errors.owner_remarks}
                            />
                        </Grid>
                    </Grid>
                    <Typography mt={3} variant="h5">Property Details</Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={6} mt={2}>
                            <FormControl fullWidth>
                                <InputLabel id="available_for">Property Available For</InputLabel>
                                <Select
                                    labelId="available_for"
                                    id="demo-simple-select"
                                    label="Property Available For"
                                    {...getFieldProps('available_for')}
                                    error={Boolean(touched.available_for && errors.available_for)}
                                    helpertext={touched.available_for && errors.available_for}
                                >
                                    <MenuItem value="Lease">Lease</MenuItem>
                                    <MenuItem value="Sale">Sale</MenuItem>
                                    <MenuItem value="Both">Both</MenuItem>
                                    <MenuItem value="Fully Occupied">Fully Occupied</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} mt={2}>
                            <FormControl fullWidth>
                                <InputLabel id="">Nature of Premises</InputLabel>
                                <Select
                                    labelId=""
                                    id="demo-simple-select"
                                    label="Nature of Premises"
                                    {...getFieldProps('nature_of_premises')}
                                    error={Boolean(touched.nature_of_premises && errors.nature_of_premises)}
                                    helpertext={touched.nature_of_premises && errors.nature_of_premises}
                                >
                                    <MenuItem value="Commercial">Commercial</MenuItem>
                                    <MenuItem value="Non Commercial">Non Commercial</MenuItem>
                                    <MenuItem value="Residential">Residential</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} >
                            <TextField
                                fullWidth
                                autoComplete="name"
                                type="text"
                                variant="outlined"
                                label="Minimum Area Available"
                                {...getFieldProps('minimum_area')}
                                error={Boolean(touched.minimum_area && errors.minimum_area)}
                                helperText={touched.minimum_area && errors.minimum_area}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} >
                            <TextField
                                fullWidth
                                type="text"
                                variant="outlined"
                                label="Maximum Area Available"
                                {...getFieldProps('maximum_area')}
                                error={Boolean(touched.maximum_area && errors.maximum_area)}
                                helperText={touched.maximum_area && errors.maximum_area}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} >
                            <TextField
                                fullWidth
                                multiline
                                type="text"
                                variant="outlined"
                                label="Area Avaliable"
                                {...getFieldProps('area_avaliable')}
                                error={Boolean(touched.area_avaliable && errors.area_avaliable)}
                                helperText={touched.area_avaliable && errors.area_avaliable}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} >
                            <TextField
                                fullWidth
                                type="text"
                                multiline
                                variant="outlined"
                                label="Premises Condition"
                                {...getFieldProps('premises_condition')}
                                error={Boolean(touched.premises_condition && errors.premises_condition)}
                                helperText={touched.premises_condition && errors.premises_condition}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} >
                            <TextField
                                fullWidth
                                type="text"
                                multiline
                                variant="outlined"
                                label="Per sq.ft Rate"
                                {...getFieldProps('per_sq_rate')}
                                error={Boolean(touched.per_sq_rate && errors.per_sq_rate)}
                                helperText={touched.per_sq_rate && errors.per_sq_rate}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} >
                            <TextField
                                fullWidth
                                type="text"
                                multiline
                                variant="outlined"
                                label="Maintainance Charges"
                                {...getFieldProps('maintenance_charge')}
                                error={Boolean(touched.maintenance_charge && errors.maintenance_charge)}
                                helperText={touched.maintenance_charge && errors.maintenance_charge}
                            />
                        </Grid>

                    </Grid>
                    <Typography mt={3} variant="h5"> Property Image</Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={12} lg={12} mt={2}>
                            <Grid container>
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <label>Main Image</label>
                                    <Button variant="contained" type="button" style={{ width: '100%' }} size="large" component="label">
                                        Image Upload
                                        <input hidden type="file" accept="image/*" onChange={onSelectFile1} />
                                        {/* <input hidden accept="image/*" type="file" onChange={(e) => onSelectFile(e)} /> */}
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} mt={1}>
                                    {/* {(selectedFile) && <img src={preview} style={{ width: '100px', height: '150px', }} alt="" />} */}
                                    {src && (
                                        <ReactCrop
                                            src={src}
                                            crop={crop}
                                            ruleOfThirds
                                            onImageLoaded={onImageLoaded}
                                            onComplete={onCropComplete}
                                            onChange={onCropChange}
                                        />
                                    )}
                                    {croppedImageUrl && (
                                        <img alt="Crop" style={{ maxWidth: "100%" }} src={croppedImageUrl} />
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12} mt={2} >
                            <div {...getRootProps()} style={{ marginBottom: '15px' }}>
                                <input {...getInputProps()} />
                                <Button variant="contained" type="button" style={{ width: '100%' }} size="large" component="label">
                                    Upload Images
                                </Button>
                            </div>
                            <Paper elevation={0} mt={3} >
                                <Grid container >
                                    {uploadedImages.map((imageData, index) => (
                                        <Grid item xs={12} sm={6} md={4} lg={3} mt={2}>
                                            <Grid container>
                                                <Grid item xs={4} md={4} lg={4} >
                                                    <img style={{ width: '100px' }} alt={`Image ${index}`} src={imageData} />
                                                </Grid>
                                                <Grid item xs={2} md={2} lg={2} >
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => onDeleteImage(index)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Typography mt={3} variant="h5">Additional Details</Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={6} mt={2}>
                            <FormControl fullWidth>
                                <InputLabel id="available_for">Space for Signage</InputLabel>
                                <Select
                                    labelId="available_for"
                                    id="demo-simple-select"
                                    label="Space for Signage"
                                    {...getFieldProps('signage_space')}
                                    error={Boolean(touched.signage_space && errors.signage_space)}
                                    helpertext={touched.signage_space && errors.signage_space}
                                >
                                    <MenuItem value="Available">Available</MenuItem>
                                    <MenuItem value="Not Available">Not Available</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} mt={2}>
                            <FormControl fullWidth>
                                <InputLabel id="available_for">Space for Earthing</InputLabel>
                                <Select
                                    labelId="available_for"
                                    id="demo-simple-select"
                                    label="Space for Earthing"
                                    {...getFieldProps('earthing_space')}
                                    error={Boolean(touched.earthing_space && errors.earthing_space)}
                                    helpertext={touched.earthing_space && errors.earthing_space}
                                >
                                    <MenuItem value="Available">Available</MenuItem>
                                    <MenuItem value="Not Available">Not Available</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} >
                            <FormControl fullWidth>
                                <InputLabel id="">Space for RF / V-SAT Antennas</InputLabel>
                                <Select
                                    labelId=""
                                    id="demo-simple-select"
                                    label="Space for RF / V-SAT Antennas"
                                    {...getFieldProps('antenna_space')}
                                    error={Boolean(touched.antenna_space && errors.antenna_space)}
                                    helpertext={touched.antenna_space && errors.antenna_space}
                                >
                                    <MenuItem value="Available">Available</MenuItem>
                                    <MenuItem value="Not Available">Not Available</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} >
                            <FormControl fullWidth>
                                <InputLabel id="">Space for AC Outdoor Units</InputLabel>
                                <Select
                                    labelId=""
                                    id="demo-simple-select"
                                    label="Space for AC Outdoor Units"
                                    {...getFieldProps('ac_outdoor_unit_space')}
                                    error={Boolean(touched.ac_outdoor_unit_space && errors.ac_outdoor_unit_space)}
                                    helpertext={touched.ac_outdoor_unit_space && errors.ac_outdoor_unit_space}
                                >
                                    <MenuItem value="Available">Available</MenuItem>
                                    <MenuItem value="Not Available">Not Available</MenuItem>
                                    <MenuItem value="Centralized AC to be provided by the Owner">Centralized AC to be provided by the Owner</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} >
                            <FormControl fullWidth>
                                <InputLabel id="">Space for DG</InputLabel>
                                <Select
                                    labelId=""
                                    id="demo-simple-select"
                                    label="Space for DG"
                                    {...getFieldProps('dg_space')}
                                    error={Boolean(touched.dg_space && errors.dg_space)}
                                    helpertext={touched.dg_space && errors.dg_space}
                                >
                                    <MenuItem value="Space Available on Terrace">Space Available on Terrace</MenuItem>
                                    <MenuItem value="Space Available on the Ground Floor">Space Available on the Ground Floor</MenuItem>
                                    <MenuItem value="Space Available back">Space Available back</MenuItem>
                                    <MenuItem value="Front side of the premises">Front side of the premises</MenuItem>
                                    <MenuItem value="Space Not Available">Space Not Available</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} >
                            <FormControl fullWidth>
                                <InputLabel id="">Rolling Shutter</InputLabel>
                                <Select
                                    labelId=""
                                    id="demo-simple-select"
                                    label="Rolling Shutter"
                                    {...getFieldProps('rolling_shutter')}
                                    error={Boolean(touched.rolling_shutter && errors.rolling_shutter)}
                                    helpertext={touched.rolling_shutter && errors.rolling_shutter}
                                >
                                    <MenuItem value="To be provided by the Owner">To be provided by the Owner</MenuItem>
                                    <MenuItem value="Not Allowed in the premises">Not Allowed in the premises</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} >
                            <FormControl fullWidth>
                                <InputLabel id="">Power Back up</InputLabel>
                                <Select
                                    labelId=""
                                    id="demo-simple-select"
                                    label="Power Back up"
                                    {...getFieldProps('power_backup')}
                                    error={Boolean(touched.power_backup && errors.power_backup)}
                                    helpertext={touched.power_backup && errors.power_backup}
                                >
                                    <MenuItem value="Available">Available</MenuItem>
                                    <MenuItem value="Not Available">Not Available</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} >
                            <FormControl fullWidth>
                                <InputLabel id="">Availability of Lift</InputLabel>
                                <Select
                                    labelId=""
                                    id="demo-simple-select"
                                    label="Availability of Lift"
                                    {...getFieldProps('lift')}
                                    error={Boolean(touched.lift && errors.lift)}
                                    helpertext={touched.lift && errors.lift}
                                >
                                    <MenuItem value="Available">Available</MenuItem>
                                    <MenuItem value="Not Available">Not Available</MenuItem>
                                    <MenuItem value="With Lift Provision">With Lift Provision</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} >
                            <FormControl fullWidth>
                                <InputLabel id="">Parking</InputLabel>
                                <Select
                                    labelId=""
                                    id="demo-simple-select"
                                    label="Parking"
                                    {...getFieldProps('parking')}
                                    error={Boolean(touched.parking && errors.parking)}
                                    helpertext={touched.parking && errors.parking}
                                >
                                    <MenuItem value="Basement">Basement</MenuItem>
                                    <MenuItem value="In front of the building">In front of the building</MenuItem>
                                    <MenuItem value="Around the building">Around the building</MenuItem>
                                    <MenuItem value="Not Available">Not Available</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} >
                            <TextField
                                fullWidth
                                type="text"
                                variant="outlined"
                                label="Existing Tenants"
                                {...getFieldProps('exist_tenants')}
                                error={Boolean(touched.exist_tenants && errors.exist_tenants)}
                                helperText={touched.exist_tenants && errors.exist_tenants}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} >
                            <FormControl fullWidth>
                                <InputLabel id="">Owner / Premises Ranking</InputLabel>
                                <Select
                                    labelId=""
                                    id="demo-simple-select"
                                    label="Owner / Premises Ranking"
                                    {...getFieldProps('ranking')}
                                    error={Boolean(touched.ranking && errors.ranking)}
                                    helpertext={touched.ranking && errors.ranking}
                                >
                                    <MenuItem value="A">A</MenuItem>
                                    <MenuItem value="B">B</MenuItem>
                                    <MenuItem value="C">C</MenuItem>
                                    <MenuItem value="D">D</MenuItem>
                                </Select>
                            </FormControl>
                            {/* <TextField
                                fullWidth
                                type="text"
                                variant="outlined"
                                label="Owner / Premises Ranking"
                                {...getFieldProps('ranking')}
                                error={Boolean(touched.ranking && errors.ranking)}
                                helperText={touched.ranking && errors.ranking}
                            /> */}
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} >
                            <TextField
                                fullWidth
                                type="text"
                                variant="outlined"
                                label="Remarks : Owner's Scope of Work - Floor wise"
                                {...getFieldProps('remarks')}
                                error={Boolean(touched.remarks && errors.remarks)}
                                helperText={touched.remarks && errors.remarks}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} >
                            <TextField
                                fullWidth
                                type="text"
                                variant="outlined"
                                label="Other Remarks"
                                {...getFieldProps('other_remarks')}
                                error={Boolean(touched.other_remarks && errors.other_remarks)}
                                helperText={touched.other_remarks && errors.other_remarks}
                            />
                        </Grid>

                    </Grid>
                    <Grid item xs={12} md={12} lg={12} mt={2}>
                        <Stack direction="row" sx={{ float: 'right', marginTop: '15px' }}>
                            <LoadingButton
                                type="submit"
                                variant="contained"
                                sx={{ fontSize: '1.2rem' }}
                                loading={btnLoad}
                            >
                                Save
                            </LoadingButton>
                        </Stack>
                    </Grid>
                </Form>
            </FormikProvider>
        </Container>
    );
}