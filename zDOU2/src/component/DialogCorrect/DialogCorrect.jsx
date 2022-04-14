import React, {useState} from 'react';
import moment from "moment";

import './DialogCorrect.css';

import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {DragAndDrop} from "../DragAndDrop";

export function DialogCorrect (props) {
  const { docType, sendFiles, DateErr, docExpired, docProlongation, setNewType, sendAlterObject, onClose } = props;

  const [ newDate, setNewDate ] = useState(moment(docExpired ? docExpired : docProlongation).format('YYYY-MM-DD'))
  const [ isErrorDate, setIsErrorDate ] = useState(false);
  const [ textErrorDate, setTextErrorDate ] = useState('');

  const isValid = (event) => {
    if (DateErr){
      if (new Date(newDate) < new Date() || newDate.length === 0){
        setIsErrorDate(true);
        setTextErrorDate('дата не может быть равна или меньше чем сегодня');
      } else {
        setIsErrorDate(false);
        setTextErrorDate('');
        setNewType(event, newDate, false);
        onClose();
      }
    } else {
      setNewType(event, newDate, false);
      onClose();
    }
  }

  return (<div className='correct'>
            <DialogTitle>
              Исправить
            </DialogTitle>
            {
              (DateErr && docType !== 'Рекламный') &&
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
            }
            <div className="upload">
              <DragAndDrop
                container={'contract'}
                title={`Загрузить ${docType === 'Рекламный' ? 'договор' : 'ДОУ (+ соглашение если СК)'}`}
                sendFiles={sendFiles}
              />
              {
                docType !== 'Рекламный' &&
                <>
                  <DragAndDrop
                    container={'other'}
                    title={`Прочее`}
                    sendFiles={sendFiles}
                  />
                  <DragAndDrop
                    container={'egrn'}
                    title={`Загрузите ЕГРН`}
                    sendFiles={sendFiles}
                  />
                </>
              }
            </div>
            <DialogActions>
              <Button
                variant="outlined"
                data-action='fix'
                onClick={(event) => isValid(event)}
              >
                сохранить
              </Button>
              <Button
                variant="contained"
                data-action='onModeration'
                onClick={(event) => isValid(event)}
              >
                отправить на модерацию
              </Button>
            </DialogActions>
          </div>)
}