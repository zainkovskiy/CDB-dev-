import React, {useState} from 'react';
import Button from "@mui/material/Button";
import {Client} from '../Client';

import './SecondStep.css';

export function SecondStep(props) {
  const [error, setError] = useState('');
  const [isSend, setIsSend] = useState(false);

  const { clients, docType, docForm, handleInputs, setClientsChanges, phoneForSms, currentPhone } = props;

  const nextStep = (event) => {
    if (validPage()) {
      setError('')
      handleInputs(event);
    } else {
      setError('заполните все поля')
    }
  }

  const validPage = () => {
    let isFalse = true;
    const allInputs = document.querySelectorAll('INPUT');
    for (let input of allInputs) {
      if (input.value.length === 0){
        isFalse = false
      }
    }
    return isFalse;
  }

  return (
    <div className='container-page'>
      <span className='subtitle'>Клиент</span>
      {
        clients.length > 0 ?
        clients.map(client =>
          <Client
            key={client.UID}
            client={client}
            docType={docType}
            setClientsChanges={setClientsChanges}
            phoneForSms={phoneForSms}
            setIsSend={setIsSend}
            isSend={isSend}
            currentPhone={currentPhone}
          />)
        : <div>нет клиента</div>
      }
      {error && <span style={{color: 'red'}}> { error } </span>}
      <Button
        disabled={isSend}
        name='step'
        value={ docType === 'Рекламный' && (docForm === 'Звонок' || docForm === 'СМС') ? '4' : '3' }
        onClick={nextStep}
        variant="contained"
        data-action='nextStep'
      >
        { docType === 'Рекламный' && (docForm === 'Звонок' || docForm === 'СМС') ? 'Отправить на проверку' : 'Далее' }
      </Button>
    </div>
  )
}
