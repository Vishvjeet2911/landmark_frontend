import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useFormik, Form, FormikProvider } from 'formik';
import Autocomplete from '@mui/material/Autocomplete';
import {
    Stack,
    TextField,
    Button, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { permission_check } from 'src/_mock/permission_check';
// ----------------------------------------------------------------------

export default function RoleAdd(props) {
    const navigate = useNavigate();
    const [btnLoad, setbtnLoad] = useState(false);
    const [roleData, setRoleData] = useState([])
    const [stateData, setStateData] = useState([])
    const [selectedPeople, setSelectedPeople] = useState([])
    const [selectedState, setSelectedState] = useState([])

    useEffect(() => {
        if (!permission_check('user_create')) {
            navigate('/')
        }
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${props.accessToken}`
            },
        };
        fetch(`${process.env.REACT_APP_SITE_URL}user/states-roles`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setRoleData(data?.data?.roles)
                setStateData(data?.data?.states)
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const LoginSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().required('Email is required'),
        password: Yup.string().required('Password is required'),
        mobile: Yup.string().required('Mobile is required'),
        // state_id: Yup.string().required('State is required'),
        status: Yup.string().required('Status is required'),
    });
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            state_id: [],
            password: '',
            mobile: '',
            role: '',
            status: ''
        },
        enableReinitialize: true,
        validationSchema: LoginSchema,
        onSubmit: (initialValues, {setErrors}) => {
            // setbtnLoad(true)
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${props.accessToken}`
                },
                body: JSON.stringify(initialValues),
            };
            // console.log(initialValues.state_id)
            fetch(`${process.env.REACT_APP_SITE_URL}user`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    setbtnLoad(false)
                    if ('error' in data) {
                        if(Object.keys(data.errors).length > 0){
                            setErrors(data.errors)
                        } else {
                            toast.error(data.message);
                        }
                    }else if ('success' in data) {
                        setbtnLoad(false)
                        window.location.reload()
                        props.popupChange(false);
                        toast.success('Saved Sucessfully');
                    } else {
                        setbtnLoad(false)
                        toast.error(data.message);
                        if (data?.message === 'Please authenticate') {
                            // logout()
                            navigate('/logout', { replace: true });
                        }
                    }
                });
        }
    });
    const { errors, touched, handleSubmit, getFieldProps, setFieldValue } = formik;

    const closePopup = () => {
        props.popupChange(false);
    };

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>

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
                <Stack mt={2}>
                    <TextField
                        fullWidth
                        autoComplete="email"
                        type="text"
                        variant="outlined"
                        label="Email"
                        {...getFieldProps('email')}
                        error={Boolean(touched.email && errors.email)}
                        helperText={touched.email && errors.email}
                    />
                </Stack>
                <Stack mt={2}>
                    <TextField
                        fullWidth
                        autoComplete="password"
                        type="text"
                        variant="outlined"
                        label="Password"
                        {...getFieldProps('password')}
                        error={Boolean(touched.password && errors.password)}
                        helperText={touched.password && errors.password}
                    />
                </Stack>
                <Stack mt={2}>
                    <TextField
                        fullWidth
                        autoComplete="mobile"
                        type="text"
                        variant="outlined"
                        label="Mobile Number"
                        {...getFieldProps('mobile')}
                        error={Boolean(touched.mobile && errors.mobile)}
                        helperText={touched.mobile && errors.mobile}
                    />
                </Stack>
                <Stack mt={2}>
                    <Autocomplete
                        // multiple
                        id="tags-standard"
                        options={roleData}
                        getOptionLabel={(option) => option?.name || ''}
                        onChange={(event, newValue) => {
                            setSelectedPeople(newValue)
                            // const resp = newValue.map(item => item?.id)
                            setFieldValue("role", newValue?.id);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Select role"
                                placeholder="Roles"
                                error={Boolean(touched.role && errors.role)}
                                helperText={touched.role && errors.role}
                            />
                        )}
                    />
                </Stack>
                <Stack mt={2}>
                    <Autocomplete
                        multiple
                        id="tags-standard2"
                        options={stateData}
                        getOptionLabel={(option) => option?.name || ''}
                        onChange={(event, newValue) => {
                            setSelectedState(newValue)
                            const resp = newValue.map(item => item?.id)
                            setFieldValue("state_id", resp);
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
                </Stack>
              
                <Stack mt={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="demo-simple-select-label">Select Status</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Select Status"
                            {...getFieldProps('status')}
                            error={Boolean(touched.status && errors.status)}
                            helperText={touched.status && errors.status}
                        >
                            <MenuItem value="1">Active</MenuItem>
                            <MenuItem value="0">Inactive</MenuItem>
                        </Select>
                    </FormControl>
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