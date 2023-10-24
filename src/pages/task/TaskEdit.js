import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useFormik, Form, FormikProvider } from 'formik';
import Autocomplete from '@mui/material/Autocomplete';
import {
    Stack,
    TextField,
    Button, FormControl, InputLabel, MenuItem, Select
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { permission_check } from 'src/_mock/permission_check';
// ----------------------------------------------------------------------

export default function TaskAdd(props) {
    const navigate = useNavigate();
    const [btnLoad, setbtnLoad] = useState(false);
    const [selectedPeople, setSelectedPeople] = useState([])
    const currentDate = new Date();
    const minDate = currentDate.toISOString().split('T')[0]; 
    const LoginSchema = Yup.object().shape({
        task_name: Yup.string().required('Task Name is required'),
        assigned_to: Yup.string().required('Assignee is required'),
        task_description: Yup.string().required('Task description is required'),
        task_date: Yup.string().required('Task Date is required'),
        status: Yup.string().required('Status is required')
    });

    useEffect(() => {
        if (!permission_check('task_edit')) {
            navigate('/')
        }
        setSelectedPeople(props?.allUsers.find(item => item.id === props?.record?.assigned_to))
    }, [])

    const formik = useFormik({
        initialValues: {
            id: props?.record?.id ? props.record.id : '',
            task_name: props?.record?.task_name ? props.record.task_name : '',
            task_description: props?.record?.task_description ? props?.record?.task_description : '',
            task_date: props?.record?.task_date ? props?.record?.task_date : '',
            assigned_to: props?.record?.assigned_to ? props?.record?.assigned_to : [],
            comments: props?.record?.comments ? props?.record?.comments : '',
            status: props?.record?.status ? props?.record?.status : '',
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
                    <TextField
                        multiline
                        rows={4}
                        fullWidth
                        autoComplete="comments"
                        type="text"
                        variant="outlined"
                        label="Comments"
                        {...getFieldProps('comments')}
                        error={Boolean(touched.comments && errors.comments)}
                        helperText={touched.comments && errors.comments}
                    />
                </Stack>
                <Stack mt={2}>
                    <Autocomplete
                        // multiple
                        id="tags-standard"
                        options={props?.allUsers}
                        value={selectedPeople}
                        getOptionLabel={(option) => option?.email || ''}
                        defaultValue={props?.allUsers.find((option) => option?.id === values?.assigned_to) || null}
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
                <Stack mt={2}>
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