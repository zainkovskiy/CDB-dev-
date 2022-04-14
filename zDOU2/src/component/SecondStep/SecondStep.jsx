import React, {Component} from 'react';
import moment from 'moment'

import './SecondStep.css';
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import {Client} from '../Client';

export class SecondStep extends Component{
  state = {
    error: '',
    isSend: false,
    phone: this.props.currentPhone  ? this.props.currentPhone : '',
  }

  nextStep = (event) => {
    if (this.validPage()) {
      this.setState({error: ''}, () => {
        this.props.handleInputs(event);
      })
    } else {
      this.setState({error: 'заполните все поля'});
    }
  }

  setIsSend = () => {
    this.setState({isSend: !this.state.isSend})
  }

  handleInputPhone = (phone) => {
    if (phone){
      this.setState({phone: phone}, () => {
        this.props.phoneForSms(phone);
      });
    }
  }

  validPage = () => {
    let isFalse = true;
    const allInputs = document.querySelectorAll('INPUT');
    for (let input of allInputs) {
      if (input.value.length === 0){
        isFalse = false
      } else if (input.name === 'dateBorn') {
        if (moment(input.value) > moment()) {
          isFalse = false;
        }
      }
    }
    return isFalse;
  }
  render(){
    const { clients, docType, docForm, setClientsChanges, clientsPhones } = this.props;
    return (
      <div className='container-page'>
        <span className='subtitle'>Клиент</span>
        {
          clients.length > 0 ?
            clients.map(client =>
              <Client
                key={client.UID}
                setClientsChanges={setClientsChanges}
                setIsSend={this.setIsSend}
                isSend={this.state.isSend}
                client={client}
              />)
            : <div>нет клиента</div>
        }
        {
          docType === 'Рекламный' && (docForm === 'Звонок' || docForm === 'СМС') &&
          <>
            {
              clientsPhones && clientsPhones.length > 0 ?
                <TextField
                  error={this.state.phone.length === 0}
                  id="outlined-select-currency"
                  select
                  label="Номер клиента"
                  value={this.state.phone ? this.state.phone : ''}
                  name='phone'
                  size="small"
                  fullWidth
                  onChange={(event) => this.handleInputPhone(event.target.value)}
                  helperText={`${this.state.phone.length === 0 ? 'Укажите номер телефона клиента' : ''}`}
                >
                  {
                    clientsPhones.map((phoneNumber, idx) => <MenuItem key={idx} value={phoneNumber.phone}>{phoneNumber.phone} {phoneNumber.name}</MenuItem>)
                  }
                </TextField>
                : `${docType === 'Эксклюзив' ? '' : "У клиента нет номеров"}`
            }
          </>
        }
        {this.state.error && <span style={{color: 'red'}}> { this.state.error } </span>}
        <Button
          disabled={this.state.isSend}
          name='step'
          value={ docType === 'Рекламный' && (docForm === 'Звонок' || docForm === 'СМС') ? '4' : '3' }
          onClick={this.nextStep}
          variant="contained"
          data-action='nextStep'
        >
          { docType === 'Рекламный' && (docForm === 'Звонок' || docForm === 'СМС') ? 'Отправить на проверку' : 'Далее' }
        </Button>
      </div>
    )
  }
}
