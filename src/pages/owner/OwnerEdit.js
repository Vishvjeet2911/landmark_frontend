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

export default function RoleEdit(props) {
    const navigate = useNavigate();
    const [btnLoad, setbtnLoad] = useState(false);
    const [value, setValue] = useState('');
    const [userData, setUserData] = useState([]);


    const mobileRegExp = /^[6-9][0-9]{3}[0-9]{3}[0-9]{3}$/;
    const OwnerSchema = Yup.object().shape({
        id: Yup.number().required('ID is required'),
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('must be an email').required('Email is required'),
        mobile: Yup.string().required('Mobile is required').matches(mobileRegExp, 'Mobile number is not valid'),
        remarks: Yup.string().required('Remarks is required'),
    });
    const formik = useFormik({
        initialValues: {
            id: props?.record?.id ? props.record.id : '',
            name: props?.record?.name ? props.record.name : '',
            email: props?.record?.email ? props.record.email : '',
            mobile: props?.record?.mobile ? props.record.mobile : '',
            remarks: props?.record?.remarks ? props.record.remarks : '',
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
            fetch(`${process.env.REACT_APP_SITE_URL}owner`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    setbtnLoad(false)
                    if (Object.prototype.hasOwnProperty.call(data, "success")) {
                        setbtnLoad(false)
                        // props.setdataShow([...props.prevState, data]);
                        // props.setTotalData([...props.prevState, data]);
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
    const { errors, touched, handleSubmit, getFieldProps } = formik;

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
                    <TextField
                        fullWidth
                        autoComplete="remarks"
                        type="text"
                        variant="outlined"
                        label="Remarks"
                        {...getFieldProps('remarks')}
                        error={Boolean(touched.remarks && errors.remarks)}
                        helperText={touched.remarks && errors.remarks}
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