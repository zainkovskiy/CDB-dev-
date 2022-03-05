import React from 'react';
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import GetAppIcon from "@mui/icons-material/GetApp";

import './FileWindow.css';

export function FileWindow(props) {
  const { document, url } = props;

  return(
    <>
      <div className="paper">
        <img
          src={url}
          className='paper__img'
        />
      <DialogActions>
        <Button
          endIcon={<GetAppIcon/>}
          href={document.URI}
          target="_blank"
          download
          variant="text"
        >
          Скачать
        </Button>
      </DialogActions>
      </div>
    </>
  )
}