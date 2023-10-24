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

export default function PermissionAdd(props) {
    const navigate = useNavigate();
    const [btnLoad, setbtnLoad] = useState(false);
    const [value, setValue] = useState('');

    // useEffect(() => {
    //     if (!permission_check('permission')) {
    //         navigate('/')
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);
    const LoginSchema = Yup.object().shape({
        name: Yup.string().required('Permission name is required'),
    });
    const formik = useFormik({
        initialValues: {
            name: '',
        },
        enableReinitialize: true,
        validationSchema: LoginSchema,
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
            fetch(`${process.env.REACT_APP_SITE_URL}permission`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    setbtnLoad(false)
                    if ('success' in data) {
                        setbtnLoad(false)
                        if (data?.message === 'Permission Added') {
                            props.setdataShow([data?.data, ...props.prevState]);
                        }
                        // window.location.reload()
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
                        label="Permission Name"
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
