import React from 'react';
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Grid, Button } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import Autocomplete from '@mui/material/Autocomplete';
import account from 'src/_mock/account';
import { permission_check } from 'src/_mock/permission_check';
// import Moment from 'moment';
// import DateRangePicker from 'react-bootstrap-daterangepicker';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap-daterangepicker/daterangepicker.css';

export default function Filter(props) {
    const { setFilters, onFilter,  } = props;

    const [values, setValues] = useState({
        task_name: '',
        assigned_by: '',
        assigned_to: '',
    });
    // const [btnLoad, setbtnLoad] = React.useState(false);
    const changeValue = (e, parm) => {
        setValues(prevState => ({ ...prevState, [parm]: e.target.value }))
    }
    
    const filterdata = () => {
        setFilters(values);
        onFilter(true);
        setValues(values)
    }
    const handleResetClick = () => {
        setValues({
            task_name: '',
            assigned_by: '',
            assigned_to: '',
        });
        setFilters({
            task_name: '',
            assigned_by: '',
            assigned_to: '',
        });
        onFilter(true);
    }

  
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={6} >
                <TextField
                    fullWidth
                    autoComplete="Task Name"
                    size="small"
                    type="text"
                    variant="outlined"
                    label="Task Name"
                    onChange={(e) => changeValue(e, 'task_name')}

                />
            </Grid>
            <Grid item xs={12} md={6} lg={6} >
                <TextField
                    fullWidth
                    type="text"
                    variant="outlined"
                    size="small"
                    label="Assigned By"
                    onChange={(e) => changeValue(e, 'assigned_by')}

                />
            </Grid>
            <Grid item xs={12} md={6} lg={6} >
                <TextField
                    fullWidth
                    type="text"
                    variant="outlined"
                    size="small"
                    label="Assigned to"
                    onChange={(e) => changeValue(e, 'assigned_to')}

                />
            </Grid>


            <Grid item xs={12} md={12} style={{ textAlign: 'right' }}>
                <Button
                    variant="text"
                    sx={{ color: '#1B5E28' }}
                    onClick={filterdata}
                >
                    Search
                </Button>
                <Button
                    variant="text"
                    sx={{ color: '#DB0011' }}
                    onClick={handleResetClick}
                >
                    Reset
                </Button>
            </Grid>
        </Grid >
    );
}
