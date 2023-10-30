import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useFormik, Form, FormikProvider } from 'formik';
import Autocomplete from '@mui/material/Autocomplete';
import {
    Stack,
    TextField,
    Button
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { permission_check } from 'src/_mock/permission_check';
// ----------------------------------------------------------------------

export default function AreaEdit(props) {
    const navigate = useNavigate();
    const [btnLoad, setbtnLoad] = useState(false);
    const [cityData, setCityData] = useState([]);
    const [stateData, setStateData] = useState([]);
    const [city, setCity] = useState({});
    const [state, setState] = useState({});
    useEffect(() => {
        if (!permission_check('area_edit')) {
            navigate('/')
        }
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${props.accessToken}`
            },
        };
        fetch(`${process.env.REACT_APP_SITE_URL}area/state-city`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setStateData(data.data)
                let states = data?.data?.find(item => item.id === props?.record?.state_id)
                setState(states)
                setCity(states?.cities?.find(item => item.id === props?.record?.city_id))
                setCityData(states?.cities)
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const OwnerSchema = Yup.object().shape({
        id: Yup.number().required('ID is required'),
        state_id: Yup.string().required('Please choose a state.'),
        city_id: Yup.string().required('Please choose a city'),
        name: Yup.string().required('Area name is required')
    });
    const formik = useFormik({
        initialValues: {
            id: props?.record?.id ? props.record.id : '',
            name: props?.record?.name ? props.record.name : '',
            city_id: props?.record?.city_id ? props.record.city_id : '',
            state_id: props?.record?.state_id ? props.record.state_id : '',
        },
        enableReinitialize: true,
        validationSchema: OwnerSchema,
        onSubmit: (initialValues) => {
            setbtnLoad(true)
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${props.accessToken}`
                },
                body: JSON.stringify(initialValues),
            };
            fetch(`${process.env.REACT_APP_SITE_URL}area`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    setbtnLoad(false)
                    if ('error' in data) {
                        toast.error(data.message);
                    } else if ('success' in data) {
                        setbtnLoad(false)
                        props.popupChange(false);
                        toast.success('Saved Sucessfully');
                        window.location.reload()
                    } else {
                        setbtnLoad(false)
                        toast.error(data.message);
                        if (data?.message === 'Please authenticate') {
                            // logout()
                            navigate('/login', { replace: true });
                        }
                    }
                });
        }
    });
    const {values, errors, touched, handleSubmit, getFieldProps,setFieldValue } = formik;

    const closePopup = () => {
        props.popupChange(false);
    };
    const handleCity = (id) => {
        const citites = stateData.find(item => item.id === id);
        setCity({})
        setCityData(citites ? citites.cities : []);
    }
    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>

                <Stack mt={2}>
                    <Autocomplete
                        // multiple
                        id="tags-standard"
                        options={stateData}
                        value={state}
                        getOptionLabel={(option) => option?.name || ''}
                        onChange={(event, newValue) => {
                            setState(newValue)
                            setFieldValue("state_id", newValue?.id);
                            handleCity(newValue.id)
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Select state"
                                placeholder="States"
                                error={Boolean(touched.state_id && errors.state_id)}
                                helperText={touched.state_id && errors.state_id}
                            />
                        )}
                    />
                </Stack>
                <Stack mt={2}>
                    <Autocomplete
                        // multiple
                        id="tags-standard2"
                        options={cityData}
                        value={city}
                        getOptionLabel={(option) => option?.name || ''}
                        onChange={(event, newValue) => {
                            setCity(newValue)
                            // const resp = newValue.map(item => item?.id)
                            setFieldValue("city_id", newValue?.id);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Select city"
                                placeholder="Cities"
                                error={Boolean(touched.city_id && errors.city_id)}
                                helperText={touched.city_id && errors.city_id}
                            />
                        )}
                    />
                </Stack>


                <Stack mt={2}>
                    <TextField
                        fullWidth
                        autoComplete="name"
                        type="text"
                        variant="outlined"
                        label="Name"
                        {...getFieldProps('name')}
                        error={Boolean(touched.name && errors.name)}
                        helperText={touched.name && errors.name}
                    />
                </Stack>
                <Stack direction="row" sx={{ float: 'right', marginTop: '15px' }}>
                    <Button
                        type="button"
                        variant="text"
                        color="error"
                        onClick={closePopup}
                    >
                        Cancel
                    </Button>
                    <LoadingButton
                        type="submit"
                        variant="text"
                        loading={btnLoad}
                    >
                        Save
                    </LoadingButton>
                </Stack>

            </Form>
        </FormikProvider>
    );
}