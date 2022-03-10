import React, { useState } from 'react';
import moment from "moment";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export function DialogType (props) {
  const [ newDate, setNewDate ] = useState(moment().format('YYYY-MM-DD'))
  const [ isErrorDate, setIsErrorDate ] = useState(false);
  const [ textErrorDate, setTextErrorDate ] = useState('');

  const isValid = (event) => {
    if (new Date(newDate) < new Date() || newDate.length === 0){
      setIsErrorDate(true);
      setTextErrorDate('дата не может быть равна или меньше чем сегодня');
    } else {
      setIsErrorDate(false);
      setTextErrorDate('');
      onClose();
      setNewType(event, newDate, true)
    }
  }

  const { onClose, setNewType, title } = props;
  return (
    <>
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Тип договора: Эксклюзив
        </DialogContentText>
        <TextField
          error={isErrorDate}
          id="date"
          label="Срок действия договора"
          type="date"
          name='docExpired'
          value={ newDate }
          size="small"
          fullWidth={true}
          sx={{ mt: 2}}
          onChange={(event) => setNewDate(moment(event.target.value).format('YYYY-MM-DD'))}
          helperText={textErrorDate}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="error"
          onClick={onClose}
        >
          Отменить
        </Button>
        <Button
          name='step'
          value='3'
          data-action='changeType'
          variant="contained"
          onClick={(event) => isValid(event)}
        >
          Сохранить
        </Button>
      </DialogActions>
    </>)
}