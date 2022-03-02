import React, {Component} from "react";
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from "@mui/material/Button";

export class Client extends Component {
  state = {
    lastName: this.props.client.lastName,
    firstName: this.props.client.firstName,
    secondName: this.props.client.secondName,
    dateBorn: this.props.client.dateBorn,
    phone: '',
    disabled: true
  }

  handleInput = (event) => {
    const elem = event.target;
    if (elem.name === 'phone') {
      this.props.phoneForSms(elem.value);
    }
    this.setState({ [elem.name]: elem.value })
  }

  saveClient = () => {
    this.setState({disabled: !this.state.disabled}, () => {
      if (this.state.disabled){
        this.props.setClientsChanges(this.props.client.UID, this.state);
      }
    })
  }

  render() {
    const { client, docType, setIsSend, isSend } = this.props;
    return (
      <>
        <Button
          variant="outlined"
          size="small"
          onClick={() => {this.saveClient(); setIsSend(!isSend)}}
        >
          { this.state.disabled ? 'Редактировать клиента' : 'Сохранить' }
        </Button>
        <TextField
          disabled={this.state.disabled}
          autoComplete='off'
          error={this.state.lastName.length === 0}
          label="Фамилия"
          type="text"
          name='lastName'
          value={this.state.lastName}
          size="small"
          onChange={(event) => this.handleInput(event)}
          helperText={`${this.state.lastName.length === 0 ? 'Укажите фамилию клиента' : ''}`}
        />
        <TextField
          disabled={this.state.disabled}
          autoComplete='off'
          error={this.state.firstName.length === 0}
          label="Имя"
          type="text"
          name='firstName'
          value={this.state.firstName}
          size="small"
          onChange={(event) => this.handleInput(event)}
          helperText={`${this.state.firstName.length === 0 ? 'Укажите имя клиента' : ''}`}
        />
        <TextField
          disabled={this.state.disabled}
          autoComplete='off'
          error={this.state.secondName.length === 0}
          label="Отчество"
          type="text"
          name='secondName'
          value={this.state.secondName}
          size="small"
          onChange={(event) => this.handleInput(event)}
          helperText={`${this.state.secondName.length === 0 ? 'Укажите отчество клиента' : ''}`}
        />
        <div className='field-wrap'>
          <TextField
            disabled={this.state.disabled}
            error={this.state.dateBorn.length === 0}
            type='date'
            name='dateBorn'
            value={this.state.dateBorn}
            size="small"
            onChange={(event) => this.handleInput(event)}
            helperText={`${this.state.dateBorn.length === 0 ? 'Не корректно указана дата рождения' : 'Дата рождения'}`}
            fullWidth
          />
          {
            docType !== 'Эксклюзив' &&
            <TextField
              disabled={this.state.disabled}
              error={this.state.phone.length === 0}
              id="outlined-select-currency"
              select
              label="Номер клиента"
              value={this.state.phone}
              name='phone'
              size="small"
              fullWidth
              onChange={(event) => this.handleInput(event)}
              helperText={`${this.state.phone.length === 0 ? 'Укажите номер телефона клиента' : ''}`}
            >
              {
                client.phone.length > 0 &&
                  client.phone.map((phone, idx) => <MenuItem key={idx} value={phone}>{phone}</MenuItem>)
              }
            </TextField>
          }
        </div>
        </>
        )
  }
}
