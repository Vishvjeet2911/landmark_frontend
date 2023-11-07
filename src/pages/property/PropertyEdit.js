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
import { useNavigate, useLocation } from 'react-router-dom';
import Dropzone, { useDropzone } from 'react-dropzone'
import DeleteIcon from '@mui/icons-material/Delete';
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// ----------------------------------------------------------------------

const editorConfiguration = {
    toolbar: ['bold', 'italic', 'heading', '|', 'outdent', 'indent', '|', 'bulletedList', 'numberedList', '|','typography',]
};
export default function LocationAdd() {
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('lm_token')
    const location = useLocation();
    const [btnLoad, setbtnLoad] = useState(false);
    const [stateData, setStateData] = useState([])
    const [cityData, setCityData] = useState([])
    const [areaData, setAreaData] = useState([])
    const [selectedFile, setSelectedFile] = useState(null)
    const [preview, setPreview] = useState('')
    const [selectedState, setSelectedState] = useState({})
    const [selectedCity, setSelectedCity] = useState({})
    const [selectedArea, setSelectedArea] = useState({})
    const [currentData] = useState(location?.state ? location.state : '');
    const [uploadedImages, setUploadedImages] = useState([]);
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

    useEffect(() => {
        let images = []
        currentData?.images?.filter(element => {
            images.push(element.image)
        });
        setSrc(currentData?.image)

        setUploadedImages(images)
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
        };
        fetch(`${process.env.REACT_APP_SITE_URL}property/state-city`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setStateData(data?.data?.states)
                let states = data?.data?.states.find(item => item.id === currentData?.state_id)
                setSelectedState(states)
                let citites = states?.cities?.find(item => item.id === currentData?.city_id)
                setSelectedCity(states?.cities?.find(item => item.id === currentData?.city_id))
                setCityData(states?.cities)

                setSelectedArea(citites?.areas?.find(item => item.id === currentData?.area_id))
                setAreaData(citites?.areas)
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

    const { getRootProps, getInputProps } = useDropzone({ onDrop })

    const LoginSchema = Yup.object().shape({
        state_id: Yup.string().required('State Name is required'),
        area_id: Yup.string().required('Area Name is required'),
        city_id: Yup.string().required('City Name is required'),
        owner_name: Yup.string().required('Owner Name is required'),
        owner_mobile: Yup.number().required('Owner mobile number is required'),
        owner_email: Yup.string().email('must be an email address').required('Owner mobile number is required'),
    });

    const formik = useFormik({
        initialValues: {
            id: currentData?.id ? currentData?.id : '',
            state_id: currentData?.state_id ? currentData?.state_id : '',
            area_id: currentData?.area_id ? currentData?.area_id : '',
            city_id: currentData?.city_id ? currentData?.city_id : '',
            property_name: currentData?.property_name ? currentData?.property_name : '',
            landmark: currentData?.landmark ? currentData?.landmark : '',
            image: currentData?.image ? currentData?.image : '',
            owner_id: currentData?.owner_id ? currentData?.owner_id : '',
            available_for: currentData?.available_for ? currentData?.available_for : '',
            nature_of_premises: currentData?.nature_of_premises ? currentData?.nature_of_premises : '',
            minimum_area: currentData?.minimum_area ? currentData?.minimum_area : '',
            maximum_area: currentData?.maximum_area ? currentData?.maximum_area : '',
            area_avaliable: currentData?.area_avaliable ? currentData?.area_avaliable : '',
            premises_condition: currentData?.premises_condition ? currentData?.premises_condition : '',
            per_sq_rate: currentData?.per_sq_rate ? currentData?.per_sq_rate : '',
            maintenance_charge: currentData?.maintenance_charge ? currentData?.maintenance_charge : '',
            signage_space: currentData?.signage_space ? currentData?.signage_space : '',
            earthing_space: currentData?.earthing_space ? currentData?.earthing_space : '',
            antenna_space: currentData?.antenna_space ? currentData?.antenna_space : '',
            ac_outdoor_unit_space: currentData?.ac_outdoor_unit_space ? currentData?.ac_outdoor_unit_space : '',
            dg_space: currentData?.dg_space ? currentData?.dg_space : '',
            rolling_shutter: currentData?.rolling_shutter ? currentData?.rolling_shutter : '',
            power_backup: currentData?.power_backup ? currentData?.power_backup : '',
            lift: currentData?.lift ? currentData?.lift : '',
            parking: currentData?.parking ? currentData?.parking : '',
            exist_tenants: currentData?.exist_tenants ? currentData?.exist_tenants : '',
            building_height: currentData?.building_height ? currentData?.building_height : '',
            ranking: currentData?.ranking ? currentData?.ranking : '',
            remarks: currentData?.remarks ? currentData?.remarks : '',
            other_remarks: currentData?.other_remarks ? currentData?.other_remarks : '',
            owner_name: currentData?.owner_name ? currentData?.owner_name : '',
            owner_mobile: currentData?.owner_mobile ? currentData?.owner_mobile : '',
            owner_email: currentData?.owner_email ? currentData?.owner_email : '',
            owner_remarks: currentData?.owner_remarks ? currentData?.owner_remarks : '',
            images: currentData?.images ? currentData?.images : [],
        },
        enableReinitialize: true,
        validationSchema: LoginSchema,
        onSubmit: (initialValues) => {
            setbtnLoad(true)
            // initialValues.image = selectedFile ? selectedFile : initialValues.image
            initialValues.image = croppedImageUrl ? croppedImageUrl : src
            initialValues.images = uploadedImages ? uploadedImages : []
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
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
                        // props.popupChange(false);
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
    const { errors, touched, values, handleSubmit, getFieldProps, setFieldValue } = formik;

    // const closePopup = () => {
    //     props.popupChange(false);
    // };
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
            const newCroppedBlobUrl = await getCroppedImg(
                imageRef.current,
                crop,
                "newFile.jpeg"
            );
            fetch(newCroppedBlobUrl)
                .then((response) => response.blob())
                .then((blob) => {
                    // Convert the fetched Blob to base64
                    const reader = new FileReader();

                    reader.onload = (e) => {
                        const base64CroppedImage = e.target.result;

                        // Now you have the base64 representation of the cropped image
                        setCroppedImageUrl(base64CroppedImage);
                    };

                    reader.readAsDataURL(blob);
                })
                .catch((error) => {
                    console.error("Error fetching Blob data:", error);
                });
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

    console.log(src, croppedImageUrl)
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
                                getOptionLabel={(option) => option.name || ''}
                                onChange={(event, newValue) => {
                                    setFieldValue("state_id", newValue?.id);
                                    setSelectedState(newValue)
                                    handleCity(newValue.id)
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

                                getOptionLabel={(option) => option.name || ''}
                                onChange={(event, newValue) => {
                                    setSelectedCity(newValue)
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
                                    setSelectedCity(newValue ? newValue : {})
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
                                type="tel"
                                variant="outlined"
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
                            <label>Area Avaliable</label>
                            <CKEditor
                                data={values.area_avaliable}
                                editor={ClassicEditor}
                                config={editorConfiguration}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setFieldValue("area_avaliable", data)
                                }}
                                onFocus={(event, editor) => {
                                    // console.log('Focus.', editor);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} >
                            <label>Premises Condition</label>
                            <CKEditor
                                data={values.premises_condition}
                                editor={ClassicEditor}
                                config={editorConfiguration}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setFieldValue("premises_condition", data)
                                }}
                                onFocus={(event, editor) => {
                                    // console.log('Focus.', editor);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} >
                            <label>Per sq.ft Rate</label>
                            <CKEditor
                                data={values.per_sq_rate}
                                editor={ClassicEditor}
                                config={editorConfiguration}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setFieldValue("per_sq_rate", data)
                                }}
                                onFocus={(event, editor) => {
                                    // console.log('Focus.', editor);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} >
                            <label>Maintainance Charges</label>
                            <CKEditor
                                data={values.maintenance_charge}
                                editor={ClassicEditor}
                                config={editorConfiguration}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setFieldValue("maintenance_charge", data)
                                }}
                                onFocus={(event, editor) => {
                                    // console.log('Focus.', editor);
                                }}
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
                                {/* <Grid item xs={12} sm={12} md={12} lg={12} mt={1}>
                                    {(selectedFile || values.image) && <img src={preview || values.image} style={{ width: '100px', height: '150px', }} alt="" />}
                                </Grid> */}
                                <Grid item xs={12} sm={12} md={10} lg={10} mt={1}>
                                    <Grid container>
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
                                                    style={{ maxWidth: "200px" }}
                                                />
                                            )}
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6} lg={6} mt={1}>
                                            {croppedImageUrl && (
                                                <img alt="Crop" style={{ maxWidth: "200px" }} src={croppedImageUrl} />
                                            )}
                                        </Grid>
                                    </Grid>
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
                            <Paper elevation={0} mt={3}>
                                <Grid container >
                                    {uploadedImages.map((imageData, index) => (
                                        <Grid item xs={12} sm={6} md={4} lg={3} m={2}>
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
                            <TextField
                                fullWidth
                                type="text"
                                variant="outlined"
                                label="Building Height"
                                {...getFieldProps('building_height')}
                                error={Boolean(touched.building_height && errors.building_height)}
                                helperText={touched.building_height && errors.building_height}
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