import React, {useState} from 'react';
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";

export function DialogSMS(props){
  const [numberPhone, setNumberPhone] = useState('');
  const [comment, setComment] = useState('');

  const { onClose, clientsPhones, repeatSendSMS } = props;

  const isValidField = () => {
    if (numberPhone.length > 0 && comment.length > 0) {
      repeatSendSMS('repeatSend', numberPhone, comment);
      onClose();
    }
  }

  return (
    <>
      <DialogTitle>
        Повторить отправку СМС
      </DialogTitle>
      <DialogContent>
        <TextField
          error={numberPhone.length === 0}
          id="outlined-select-currency"
          select
          label="Номер клиента"
          value={numberPhone}
          name='phone'
          size="small"
          fullWidth
          onChange={(event) => setNumberPhone(event.target.value)}
          sx={{ mt: 2}}
          helperText={numberPhone.length === 0 ? 'Укажите номер телефона' : ''}
        >
          {
            clientsPhones.map((phoneNumber, idx) => <MenuItem key={idx} value={phoneNumber.phone}>{phoneNumber.phone} {phoneNumber.name}</MenuItem>)
          }
        </TextField>
        <TextField
          error={comment.length === 0}
          label="Причина отправки"
          type='text'
          fullWidth
          size="small"
          sx={{ mt: 2}}
          value={comment}
          onChange={(event => setComment(event.target.value))}
          helperText={comment.length === 0 ? 'Укажите причину' : ''}
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
          variant="contained"
          onClick={isValidField}
        >
          Сохранить
        </Button>
      </DialogActions>
    </>)
}