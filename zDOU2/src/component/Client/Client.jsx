import React, {Component} from "react";
import moment from 'moment'

import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";

export class Client extends Component {
  state = {
    lastName: this.props.client.lastName ? this.props.client.lastName : '',
    firstName: this.props.client.firstName  ? this.props.client.firstName : '',
    secondName: this.props.client.secondName  ? this.props.client.secondName : '',
    dateBorn: this.props.client.dateBorn  ? this.props.client.dateBorn : '',
    disabled: true,
    dateBornError: false,
  }

  handleInput = (event) => {
    const elem = event.target;
    this.setState({ [elem.name]: elem.value })
  }

  saveClient = () => {
    this.setState({disabled: !this.state.disabled}, () => {
      if (this.state.disabled){
        this.props.setClientsChanges(this.props.client.UID, this.state);
      }
    })
  }
  checkDateBornError = (event) => {
    if (moment(event.target.value) > moment()){
      this.setState({dateBornError: true});
    } else {
      this.setState({dateBornError: false});
    }
  }
  render() {
    const { setIsSend, isSend } = this.props;
    return (
      <>
        <Button
          variant="contained"
          size="small"
          onClick={() => {this.saveClient(); setIsSend(!isSend)}}
          color="success"
        >
          { this.state.disabled ? 'Редактировать клиента' : 'Сохранить клиента' }
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
        <TextField
          disabled={this.state.disabled}
          error={this.state.dateBorn.length === 0 || this.state.dateBornError}
          type='date'
          name='dateBorn'
          value={this.state.dateBorn && this.state.dateBorn.split(' ')[0]}
          size="small"
          onChange={(event) => this.handleInput(event)}
          onBlur={(event) => this.checkDateBornError(event)}
          helperText={`${this.state.dateBorn.length === 0 || this.state.dateBornError ? 'Не корректно указана дата рождения' : 'Дата рождения'}`}
          fullWidth
        />
      </>
      )
  }
}
