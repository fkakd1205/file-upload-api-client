import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';

const Dialog = (open) => {
    return(
        <>
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Modal title
                </DialogTitle>
            </Dialog>
        </>
    );
}

export default Dialog;