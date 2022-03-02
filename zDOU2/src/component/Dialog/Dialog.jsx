import React from "react";

import Dialog from '@mui/material/Dialog';

export function Dialog(props) {
  const { onClose, open, children } = props;

  return (
    <Dialog onClose={onClose} open={open}>
      {children}
    </Dialog>
  );
}