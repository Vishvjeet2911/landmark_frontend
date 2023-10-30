import { useState, useEffect } from 'react';
import { Stack, Button, Grid, Typography } from '@mui/material';

export default function LocationAdd({ currentData, popupChange }) {
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <Grid container spacing={3}>

            <Grid item xs={12}>
                <Typography variant="body1" color="blue" >Task Date : {currentData?.task_date}</Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography sx={{ fontSize: '0.875rem' }}><span style={{ fontWeight: '600' }}>Task Name:</span><br /> {currentData?.task_name}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography sx={{ fontSize: '0.875rem' }}><span style={{ fontWeight: '600' }}>Task Description:</span><br /> {currentData?.task_description}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography sx={{ fontSize: '0.875rem' }}><span style={{ fontWeight: '600' }}>Area:</span><br /> {currentData?.area_name}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography sx={{ fontSize: '0.875rem' }}><span style={{ fontWeight: '600' }}>Building Name:</span><br /> {currentData?.property_name}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography sx={{ fontSize: '0.875rem' }}><span style={{ fontWeight: '600' }}>Landmark:</span><br /> {currentData?.landmark}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="body1" color="blue" >Owner's Details</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography sx={{ fontSize: '0.875rem' }}><span style={{ fontWeight: '600' }}>Name of Owner:</span><br /> {currentData?.owner_name}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography sx={{ fontSize: '0.875rem' }}><span style={{ fontWeight: '600' }}>Contact Number:</span><br /> {currentData?.owner_mobile}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography sx={{ fontSize: '0.875rem' }}><span style={{ fontWeight: '600' }}>Email ID:</span><br /> {currentData?.owner_email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography sx={{ fontSize: '0.875rem' }}><span style={{ fontWeight: '600' }}>Remarks:</span><br /> {currentData?.owner_remarks}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="body1" color="blue" >Property Details</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography sx={{ fontSize: '0.875rem' }}><span style={{ fontWeight: '600' }}>Property Available For:</span><br /> {currentData?.available_for}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography sx={{ fontSize: '0.875rem' }}><span style={{ fontWeight: '600' }}>Nature of Premises:</span><br /> {currentData?.nature_of_premises}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography sx={{ fontSize: '0.875rem' }}><span style={{ fontWeight: '600' }}>Minimum Area Available:</span><br /> {currentData?.minimum_area}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography sx={{ fontSize: '0.875rem' }}><span style={{ fontWeight: '600' }}>Maximum Area Available:</span><br /> {currentData?.maximum_area}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography sx={{ fontSize: '0.875rem' }}><span style={{ fontWeight: '600' }}>Area Available:</span><br /> {currentData?.area_avaliable}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography sx={{ fontSize: '0.875rem' }}><span style={{ fontWeight: '600' }}>Premises Condition:</span><br /> {currentData?.premises_condition}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography sx={{ fontSize: '0.875rem' }}><span style={{ fontWeight: '600' }}>Per sq.ft Rate:</span><br /> {currentData?.per_sq_rate}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography sx={{ fontSize: '0.875rem' }}><span style={{ fontWeight: '600' }}>Maintenance Charges:</span><br /> {currentData?.maintenance_charge}</Typography>
            </Grid>
                      <Grid item xs={12} md={12} lg={12} mt={2}>
                <Stack direction="row" sx={{ float: 'right', marginTop: '15px' }}>
                    <Button variant="contained" onClick={() => popupChange(false)}>
                        Close
                    </Button>
                </Stack>
            </Grid>
        </Grid>
    );
}