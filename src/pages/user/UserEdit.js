import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useFormik, Form, FormikProvider } from 'formik';
import {
    Stack,
    TextField,
    Button
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import { permission_check } from 'src/_mock/permission_check';
// ----------------------------------------------------------------------

export default function RoleAdd(props) {
    const navigate = useNavigate();
    const [btnLoad, setbtnLoad] = useState(false);
    const [roleData, setRoleData] = useState([])
    const [stateData, setStateData] = useState([])

    useEffect(() => {
        if (!permission_check('user_edit')) {
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
        state_id: Yup.string().required('State is required'),
        password: Yup.string().required('Password is required'),
        mobile: Yup.string().required('Mobile is required'),
        status: Yup.string().required('Status is required'),
    });
    const formik = useFormik({
        initialValues: {
            id: props?.record?.id ? props.record.id : '',
            name: props?.record?.name ? props.record.name : '',
            email: props?.record?.email ? props.record.email : '',
            password: props?.record?.password ? props.record.password : '',
            mobile: props?.record?.mobile ? props.record.mobile : '',
            role: props?.record?.role ? props.record.role : '',
            state_id: props?.record?.state_id ? props.record.state_id : '',
            status: props?.record?.status ? (props.record.status === true ? '1' : '0') : '0',
        },
        enableReinitialize: true,
        validationSchema: LoginSchema,
        onSubmit: (initialValues, {setErrors}) => {
            setbtnLoad(true)
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${props.accessToken}`
                },
                body: JSON.stringify(initialValues),
            };
            fetch(`${process.env.REACT_APP_SITE_URL}user`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    setbtnLoad(false)
                    if ('error' in data) {
                        console.log("data: ", data.error)
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
                            navigate('/login', { replace: true });
                        }
                    }
                });
        }
    });
    const { values, errors, touched, handleSubmit, getFieldProps, setFieldValue } = formik;

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
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Select role</InputLabel>
                        <Select
                            value={values.role}
                            label="Select Status"
                            onChange={(e) => setFieldValue("role", e?.target?.value)}
                            error={Boolean(touched.role && errors.role)}
                           
                        >
                            {roleData?.map(item =>
                                <MenuItem value={item.id}>{item.name}</MenuItem>

                            )}
                        </Select>
                    </FormControl>
                </Stack>
                <Stack mt={2}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Select state</InputLabel>
                        <Select
                            value={values.state_id}
                            label="Select State"
                            onChange={(e) => setFieldValue("state_id", e?.target?.value)}
                            error={Boolean(touched.state_id && errors.state_id)}
                           
                        >
                            {stateData?.map(item =>
                                <MenuItem value={item.id}>{item.name}</MenuItem>

                            )}
                        </Select>
                    </FormControl>
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
