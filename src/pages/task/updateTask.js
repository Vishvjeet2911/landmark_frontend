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
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);  
    const minDate = currentDate.toISOString().split('T')[0]; 
    const LoginSchema = Yup.object().shape({
        comments: Yup.string().required('comments is required'),
        status: Yup.string().required('Status is required')
    });
    useEffect(() => {
        if (!permission_check('task_update')) {
            navigate('/')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const formik = useFormik({
        initialValues: {
            id: props?.record?.id ? props.record.id : '',
            comments: '',
            followup_date :props?.record?.followup_date ? props?.record?.followup_date : '',
            status: props?.record?.status ? props?.record?.status : '',
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
            fetch(`${process.env.REACT_APP_SITE_URL}task/update-task`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    setbtnLoad(false)
                    console.log(data)
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
                        inputProps={{ min: minDate }}
                        type="date"
                        variant="outlined"
                        label="Followup Date"
                        {...getFieldProps('followup_date')}
                        InputLabelProps={{ shrink: true }}
                        error={Boolean(touched.followup_date && errors.followup_date)}
                        helperText={touched.followup_date && errors.followup_date}
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
                            {/* <MenuItem value="Pending">Pending</MenuItem> */}
                            <MenuItem value="In progress">In Progress</MenuItem>
                            {/* <MenuItem value="Declined">Declined</MenuItem> */}
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