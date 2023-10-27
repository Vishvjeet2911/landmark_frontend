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

export default function RoleEdit(props) {
    const navigate = useNavigate();
    const [btnLoad, setbtnLoad] = useState(false);
    const [permissionData, setPermissionData] = useState([]);
    const [selectedPermission, setSelectedPermission] = useState([])

    useEffect(() => {
        if (!permission_check('role_edit')) {
            navigate('/')
        }
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${props.accessToken}`
            },
        };
        fetch(`${process.env.REACT_APP_SITE_URL}permission`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setPermissionData(data?.dataItems)
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const RoleSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        permissions: Yup.array().required('Permission is required').min(1, 'At least one permission is required.'),
    });
    const formik = useFormik({
        initialValues: {
            id: props?.record?.id ? props.record.id : '',
            name: props?.record?.name ? props.record.name : '',
            permissions: props?.record?.permissions ? props.record.permissions : [],
        },
        enableReinitialize: true,
        validationSchema: RoleSchema,
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
            fetch(`${process.env.REACT_APP_SITE_URL}/role`, requestOptions)
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
                        label="Role Name"
                        {...getFieldProps('name')}
                        error={Boolean(touched.name && errors.name)}
                        helperText={touched.name && errors.name}
                    />
                </Stack>
                <Stack mt={2}>
                    <Autocomplete
                        multiple
                        id="tags-standard"
                        options={permissionData}
                        getOptionLabel={(option) => option.name}
                        defaultValue={values.permissions}
                        onChange={(event, newValue) => {
                            setSelectedPermission(newValue)
                            const resp = newValue.map(item => item?.id)
                            setFieldValue("permissions", resp);
                        }}
                        // isOptionEqualToValue={isOptionEqualToValue}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Select roles"
                                placeholder="Roles"
                                error={Boolean(touched.permissions && errors.permissions)}
                                helperText={touched.permissions && errors.permissions}

                            />
                        )}
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