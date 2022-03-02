import React, { Component } from "react";
import moment from 'moment'

import './App.css';

import Linear from "./component/Linear/Linear";
import {FirstStep} from "./component/FirstStep";
import {SecondStep} from "./component/SecondStep";
import {ThirdStep} from './component/ThirdStep';
import {FourthStep} from "./component/FourthStep";
import {Header} from "./component/Header";
import {Title} from "./component/Title";
import {Info} from "./component/Info";

export class App extends Component{
  state = {
    obj: '',
    preloader: true,
  }
  sendAlterObject = () => {
    fetch('https://hs-01.centralnoe.ru/Project-Selket-Main/Servers/Contract/Server.php',
      {
          action: 'set',
          obj: this.state.obj
          }
        ).then(res => {
              res.json().then(data => {
                console.log(data)
              })
    })
  }

  setClientsChanges = (uid, changes) => {
    const newClients = this.state.obj.clients.slice();
    const findClient = newClients.find(client => client.UID === uid);
    for (let key in findClient){
      if (key !== 'UID' && key !== 'phone') {
        findClient[key] = changes[key]
      }
    }
    this.setState(prevState => ({
      obj: { ...prevState.obj, clients:newClients }
    }))
  }
  phoneForSms = (phone) => {
    const newSmsvalidation = Object.assign({}, this.state.obj.smsvalidation);
    newSmsvalidation.phone = phone;

    this.setState(prevState => ({
      obj: { ...prevState.obj, smsvalidation: newSmsvalidation}
    }))
  }

  handleInputs = (event) => {
    const elem = event.target;
    this.setState(prevState => ({
      obj: {...prevState.obj, [elem.name]: elem.name === 'step' ? +elem.value : elem.value}
    }), () => {
      elem.name === 'step' && this.sendAlterObject();
    })
  }

  setExpiredWithPromo = () => {
    this.setState(prevState => ({
      obj: {...prevState.obj, docExpired: moment().add('days', 90).format('YYYY-MM-DD')}
    }))
  }
  sendFiles = (files, source) => {
    let data = new FormData();
    data.append('photo[]', source);
    for (let item of files) {
      data.append('photo[]', item)
    }
    data.append('reqNumber', this.state.obj.UID)
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://hs-01.centralnoe.ru/Project-Selket-Main/Servers/MediaExchange/UploaderDoc.php", true);
    xhr.responseType = 'json';
    xhr.send(data);
    xhr.onload = () => {
      this.addFiles(xhr.response)
    };
  }
  addFiles = (files) => {
    this.setState(prevState => ({
      obj: {...prevState.obj, documents: [...prevState.obj.documents, ...files]}
    }))
  }



  render() {
    const { preloader, obj } = this.state;
    const step = {
      1: <FirstStep
        docType={this.state.obj.docType}
        docForm={this.state.obj.docForm}
        docExpired={this.state.obj.docExpired}
        handleInputs={this.handleInputs}
        setExpiredWithPromo={this.setExpiredWithPromo}
        rights={this.state.obj.rights}
      />,
      2: <SecondStep
        docType={this.state.obj.docType}
        docForm={this.state.obj.docForm}
        handleInputs={this.handleInputs}
        clients={this.state.obj.clients}
        setClientsChanges={this.setClientsChanges}
        phoneForSms={this.phoneForSms}
        />,
      3: <ThirdStep
        documents={this.state.obj.documents}
        docType={this.state.obj.docType}
        docForm={this.state.obj.docForm}
        handleInputs={this.handleInputs}
        sendFiles={this.sendFiles}
      />,
      4: <FourthStep
          documents={this.state.obj.documents}
          docType={this.state.obj.docType}
          docForm={this.state.obj.docForm}
          docExpired={this.state.obj.docExpired}
        />,
    }
    return (
      <>
        { !preloader ?
          <>
            <Header/>
            <Title/>
            <div className='container-grid'>
              {step[obj.step]}
              <Info
                docType={this.state.obj.docType}
                docForm={this.state.obj.docForm}
                docExpired={this.state.obj.docExpired}
                progress={this.state.obj.step}
              />
            </div>
          </>
          : <Linear/>}
      </>
    )
  }

  componentDidMount() {
    fetch('https://hs-01.centralnoe.ru/Project-Selket-Main/Servers/Contract/Server.php', {action: 'get'}).then(res => {
      res.json().then(data => {
        this.setState({obj: data, preloader: false});
      })
    })
  }
}