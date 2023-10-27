import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useFormik, Form, FormikProvider } from 'formik';
import Autocomplete from '@mui/material/Autocomplete';
import {
    Stack,
    TextField,
    Button, Box
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { permission_check } from 'src/_mock/permission_check';
// ----------------------------------------------------------------------

export default function OwnerAdd(props) {
    const navigate = useNavigate();
    const [btnLoad, setbtnLoad] = useState(false);
    const [cityData, setCityData] = useState([]);
    const [stateData, setStateData] = useState([]);
    useEffect(() => {
        if (!permission_check('city_create')) {
            navigate('/')
        }
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${props.accessToken}`
            },
        };
        fetch(`${process.env.REACT_APP_SITE_URL}city/states`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setStateData(data.data)
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const AreaSchema = Yup.object().shape({
        state_id: Yup.string().required('Please choose a state.'),
        name: Yup.string().required('City name is required')
    });
    const formik = useFormik({
        initialValues: {
            state_id: '',
            name: '',
        },
        enableReinitialize: true,
        validationSchema: AreaSchema,
        onSubmit: (initialValues, { setErrors }) => {
            setbtnLoad(true)
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${props.accessToken}`
                },
                body: JSON.stringify(initialValues),
            };
            fetch(`${process.env.REACT_APP_SITE_URL}city`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    setbtnLoad(false)
                    if ('error' in data) {
                        if (Object.keys(data.errors).length > 0) {
                            setErrors(data.errors)
                        } else {
                            toast.error(data.message);
                        }
                    } else if ('success' in data) {
                        setbtnLoad(false)
                        window.location.reload()
                        props.popupChange(false);
                        toast.success('Saved Sucessfully');
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
    const { errors, touched, handleSubmit, getFieldProps, setErrors, setFieldValue } = formik;

    const closePopup = () => {
        props.popupChange(false);
    };
    const handleCity = (id) => {
        const citites = stateData.find(item => item.id === id);
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
                        getOptionLabel={(option) => option?.name || ''}
                        onChange={(event, newValue) => {
                            setFieldValue("state_id", newValue?.id);
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