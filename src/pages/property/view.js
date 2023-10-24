import { useState, useEffect, useCallback } from 'react';
import { Stack, Button, Grid, Typography } from '@mui/material';

export default function LocationAdd({ currentData, popupChange }) {
    const [uploadedImages, setUploadedImages] = useState([]);
    useEffect(() => {
        let images = []
        currentData?.images?.filter(element => {
            images.push(element.image)
        });
        setUploadedImages(images)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <Grid container spacing={3}>
     
            <Grid item xs={12}>
                <Typography variant="body1" color="blue" >Location Details</Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography sx={{ fontSize: '0.875rem' }}><span style={{ fontWeight: '600' }}>State:</span><br /> {currentData?.states?.name}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography sx={{ fontSize: '0.875rem' }}><span style={{ fontWeight: '600' }}>City:</span><br /> {currentData?.cities?.name}</Typography>
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
            <Grid item xs={12}>
                <Typography variant="body1" color="blue" >Additional Details</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography sx={{ fontSize: '0.875rem' }}><span style={{ fontWeight: '600' }}>Space for Signage:</span><br /> {currentData?.signage_space}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography sx={{ fontSize: '0.875rem' }}><span style={{ fontWeight: '600' }}>Space for Earthing:</span><br /> {currentData?.earthing_space}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography sx={{ fontSize: '0.875rem' }}><span style={{ fontWeight: '600' }}>Space for RF / V-SAT Antennas:</span><br /> {currentData?.antenna_space}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography sx={{ fontSize: '0.875rem' }}><span style={{ fontWeight: '600' }}>Space for AC Outdoor Units:</span><br /> {currentData?.ac_outdoor_unit_space}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography sx={{ fontSize: '0.875rem' }}><span style={{ fontWeight: '600' }}>Space for DG:</span><br /> {currentData?.dg_space}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography sx={{ fontSize: '0.875rem' }}><span style={{ fontWeight: '600' }}>Rolling Shutter:</span><br /> {currentData?.rolling_shutter}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography sx={{ fontSize: '0.875rem' }}><span style={{ fontWeight: '600' }}>Power Back up:</span><br /> {currentData?.power_backup}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography sx={{ fontSize: '0.875rem' }}><span style={{ fontWeight: '600' }}>Availability of Lift:</span><br /> {currentData?.lift}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography sx={{ fontSize: '0.875rem' }}><span style={{ fontWeight: '600' }}>Parking:</span><br /> {currentData?.parking}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography sx={{ fontSize: '0.875rem' }}><span style={{ fontWeight: '600' }}>Existing Tenants:</span><br /> {currentData?.exist_tenants}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography sx={{ fontSize: '0.875rem' }}><span style={{ fontWeight: '600' }}>Owner / Premises Ranking:</span><br /> {currentData?.ranking}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography sx={{ fontSize: '0.875rem' }}><span style={{ fontWeight: '600' }}>Remarks : Owner's Scope of Work - Floor wise:</span><br /> {currentData?.remarks}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography sx={{ fontSize: '0.875rem' }}><span style={{ fontWeight: '600' }}>Other Remarks:</span><br /> {currentData?.other_remarks}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography sx={{ fontSize: '0.875rem' }}><span style={{ fontWeight: '600' }}>Updated By:</span><br /> {currentData?.user?.name}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
                <Typography sx={{ fontSize: '0.875rem' }}><span style={{ fontWeight: '600' }}>Last Updated:</span><br /> {new Date(currentData?.updatedAt).toLocaleDateString('en-GB')}</Typography>
            </Grid>
            <Grid item xs={12} >
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        {currentData?.image ? <img src={currentData?.image} alt="image" style={{ width: '100%' }} /> : 'No image'}
                    </Grid>
                    {uploadedImages.map((imageData, index) => (
                        <Grid item xs={12} sm={6} md={6} lg={6} >
                            <img style={{ width: '100%' }} alt={`Image ${index}`} src={imageData} />
                        </Grid>
                    ))}
                </Grid>
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