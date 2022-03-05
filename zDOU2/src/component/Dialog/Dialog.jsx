import React from "react";

import Dialog from '@mui/material/Dialog';

export function Dialog(props) {
  const { onClose, open, children, fullWidth, maxWidth } = props;

  return (
    <Dialog
      onClose={onClose}
      open={open}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
    >
      {children}
    </Dialog>
  );
}