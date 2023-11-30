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

export default function Filter(props) {
    const { setFilters, onFilter, states } = props;

    const [values, setValues] = useState({
        state_id: '',
        city_id: '',
        area_name: '',
        available_for: '',
        nature_of_premises: '',
        minimum_area: '',
        maximum_area: ''
    });
    const [stateData, setStateData] = useState([])
    const [cityData, setCityData] = useState([])
    const [areaData, setAreaData] = useState([])
    const [selectedState, setSelectedState] = useState({})
    const [selectedCity, setSelectedCity] = useState({})
    const [selectedArea, setSelectedArea] = useState({})
    // const [btnLoad, setbtnLoad] = React.useState(false);
    const changeValue = (e, parm) => {
        setValues(prevState => ({ ...prevState, [parm]: e.target.value }))
    }
    const changeSelectValue = (value, parm) => {
        setValues(prevState => ({ ...prevState, [parm]: value }))
    }
    const filterdata = () => {
        setFilters(values);
        onFilter(true);
        setValues(values)
    }
    const handleResetClick = () => {
        setValues({
            state_id: '',
            city_id: '',
            area_name: '',
            available_for: '',
            nature_of_premises: '',
            minimum_area: '',
            maximum_area: ''
        });
        setFilters({
            state_id: '',
            city_id: '',
            area_name: '',
            available_for: '',
            nature_of_premises: '',
            minimum_area: '',
            maximum_area: ''
        });
        onFilter(true);
    }
    useEffect(() => {
        if (!permission_check('admin')) {
            let state_ids = account?.state_id.split(',').map(Number)
            const filteredStates = states.filter(state => state_ids.includes(state?.id));
            setStateData(filteredStates)
        } else {
            setStateData(states)
        }
    }, [account?.state_id])


    const handleCity = (id) => {
        const citites = states.find(item => item.id === id);
        setSelectedCity({})
        setCityData(citites ? citites.cities : []);
    }
    const handleArea = (id) => {
        const areas = cityData.find(item => item.id === id);
        setSelectedArea({})
        setAreaData(areas ? areas.areas : []);
    }
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={6} >
                <Autocomplete
                    id="state"
                    options={stateData}
                    value={selectedState}
                    size="small"
                    getOptionLabel={(option) => option?.name || ''}
                    onChange={(event, newValue) => {
                        setSelectedState(newValue ? newValue : {})
                        changeSelectValue(newValue ? newValue.id : '', 'state_id')
                        handleCity(newValue ? newValue.id : 0)
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            label="Select State"
                            placeholder="States"
                        />
                    )}
                />
            </Grid>

            <Grid item xs={12} md={6} lg={6} >
                <Autocomplete
                    id="city"
                    options={cityData}
                    value={selectedCity}
                    size="small"
                    getOptionLabel={(option) => option?.name || ''}
                    onChange={(event, newValue) => {
                        setSelectedCity(newValue ? newValue : {})
                        changeSelectValue(newValue ? newValue.id : '', 'city_id')
                        handleArea(newValue ? newValue.id : 0)
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            label="Select City"
                            placeholder="City"

                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} md={6} lg={6} >
                <Autocomplete
                    id="area"
                    options={areaData}
                    value={selectedArea}
                    size="small"
                    getOptionLabel={(option) => option?.name || ''}
                    onChange={(event, newValue) => {
                        setSelectedArea(newValue ? newValue : {})
                        changeSelectValue(newValue ? newValue.id : '', 'area_id')

                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            label="Select Area"
                            placeholder="Areas"
                        />
                    )}
                />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
                <FormControl fullWidth size="small">
                    <InputLabel id="available_for">Property Available For</InputLabel>
                    <Select
                        labelId="available_for"
                        id="demo-simple-select"
                        label="Property Available For"
                        onChange={(e) => changeValue(e, 'available_for')}
                    >
                        <MenuItem value="" disabled>Select Option</MenuItem>
                        <MenuItem value="Lease">Lease</MenuItem>
                        <MenuItem value="Sale">Sale</MenuItem>
                        <MenuItem value="Both">Both</MenuItem>
                        <MenuItem value="Fully Occupied">Fully Occupied</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
                <FormControl fullWidth size="small">
                    <InputLabel id="">Nature of Premises</InputLabel>
                    <Select
                        labelId=""
                        id="demo-simple-select"
                        label="Nature of Premises"

                        onChange={(e) => changeValue(e, 'nature_of_premises')}
                    >
                        <MenuItem value="" disabled>Select Option</MenuItem>
                        <MenuItem value="Commercial">Commercial</MenuItem>
                        <MenuItem value="Non Commercial">Non Commercial</MenuItem>
                        <MenuItem value="Residential">Residential</MenuItem>
                    </Select>
                </FormControl>
            </Grid >
            <Grid item xs={12} md={6} lg={6} >
                <TextField
                    fullWidth
                    autoComplete="name"
                    size="small"
                    type="number"
                    variant="outlined"
                    label="Minimum Area Available"
                    onChange={(e) => changeValue(e, 'minimum_area')}

                />
            </Grid>
            <Grid item xs={12} md={6} lg={6} >
                <TextField
                    fullWidth
                    type="number"
                    variant="outlined"
                    size="small"
                    label="Maximum Area Available"
                    onChange={(e) => changeValue(e, 'maximum_area')}

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
