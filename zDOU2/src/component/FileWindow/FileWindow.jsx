import React from 'react';
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import GetAppIcon from "@mui/icons-material/GetApp";


export function FileWindow(props) {
  const { document, url, docTypeRus } = props;

  return(
    <>
      <DialogTitle>
        { docTypeRus[document.documentType] }
      </DialogTitle>
      <DialogContent>
        <img
          src={url}
          style={ {width: '100%'} }
        />
      </DialogContent>
      <DialogActions>
        <Button
          endIcon={<GetAppIcon/>}
          href={document.URI}
          target="_blank"
          download
          variant="outlined"
        >
          Скачать
        </Button>
      </DialogActions>
    </>
  )
}