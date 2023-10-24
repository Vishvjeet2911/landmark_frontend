import React, { useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';


export default function Popup(props) {
    const dialogBox = useRef()
    const { title, children, openPopup, setOpenPopup } = props;

    return (
        <Dialog 
            ref={dialogBox}
            open={openPopup}
            fullWidth
            maxWidth={props?.width ? props?.width : 'sm'}
            onClose={()=>{setOpenPopup(false)}} 
        >
            <DialogTitle>
                <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
                    {title}
                </Typography>
            </DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
        </Dialog>
    )
}