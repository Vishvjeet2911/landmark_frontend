import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useFormik, Form, FormikProvider } from 'formik';
import Autocomplete from '@mui/material/Autocomplete';
import {
    Stack,
    TextField,
    Button, Box, FormControl, InputLabel, MenuItem, Select
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { permission_check } from 'src/_mock/permission_check';
// ----------------------------------------------------------------------

export default function TaskAdd(props) {
    const navigate = useNavigate();
    const [btnLoad, setbtnLoad] = useState(false);
    const [value, setValue] = useState('');
    const [permissionData, setPermissionData] = useState([]);
    const [selectedPeople, setSelectedPeople] = useState([])
    const currentDate = new Date();
    const minDate = currentDate.toISOString().split('T')[0]; 
    
    useEffect(() => {
        if (!permission_check('task_create')) {
            navigate('/')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const LoginSchema = Yup.object().shape({
        task_name: Yup.string().required('Task Name is required'),
        assigned_to: Yup.string().required('Assignee is required'),
        task_description: Yup.string().required('Task description is required'),
        // status: Yup.string().required('Status is required')
    });
    const formik = useFormik({
        initialValues: {
            task_name: '',
            task_description: '',
            task_date: '',
            assigned_to: '',
            // status: ''
        },
        enableReinitialize: true,
        validationSchema: LoginSchema,
        onSubmit: (initialValues) => {
            console.log(initialValues)
            setbtnLoad(true)
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${props.accessToken}`
                },
                body: JSON.stringify(initialValues),
            };
            fetch(`${process.env.REACT_APP_SITE_URL}task`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    setbtnLoad(false)
                    if ('success' in data) {
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
                        autoComplete="task_name"
                        type="text"
                        variant="outlined"
                        label="Task Name"
                        {...getFieldProps('task_name')}
                        error={Boolean(touched.task_name && errors.task_name)}
                        helperText={touched.task_name && errors.task_name}
                    />
                </Stack>
                <Stack mt={2}>
                    <TextField
                        multiline
                        rows={4}
                        fullWidth
                        autoComplete="task_description"
                        type="text"
                        variant="outlined"
                        label="Task Description"
                        {...getFieldProps('task_description')}
                        error={Boolean(touched.task_description && errors.task_description)}
                        helperText={touched.task_description && errors.task_description}
                    />
                </Stack>
                <Stack mt={2}>
                    <TextField
                        fullWidth
                        inputProps={{ min: minDate }}
                        type="date"
                        variant="outlined"
                        label="Task Date"
                        {...getFieldProps('task_date')}
                        InputLabelProps={{ shrink: true }}
                        error={Boolean(touched.task_date && errors.task_date)}
                        helperText={touched.task_date && errors.task_date}
                    />
                </Stack>
                <Stack mt={2}>
                    <Autocomplete
                        // multiple
                        id="tags-standard"
                        options={props.allUsers}
                        getOptionLabel={(option) => option?.email || ''}
                        onChange={(event, newValue) => {
                            setSelectedPeople(newValue)
                            // const resp = newValue.map(item => item?.id)
                            setFieldValue("assigned_to", newValue?.id);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Select users"
                                placeholder="Users"
                            />
                        )}
                    />
                </Stack>
                {/* <Stack mt={2}>
                    <FormControl fullWidth>
                        <InputLabel id="available_for">Status</InputLabel>
                        <Select
                            labelId="available_for"
                            id="demo-simple-select"
                            label="Status"
                            {...getFieldProps('status')}
                            error={Boolean(touched.status && errors.status)}
                            helpertext={touched.status && errors.status}
                        >
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="In Progress">In Progress</MenuItem>
                            <MenuItem value="Completed">Completed</MenuItem>
                        </Select>
                    </FormControl>
                </Stack> */}
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
const top100Films = [
    { name: 'User Add', id: 1 },
    { name: 'User Edit', id: 2 },
    { name: 'User Delete', id: 3 },
    { name: 'Read', id: 4 },
    { name: 'All', id: 5 },
];