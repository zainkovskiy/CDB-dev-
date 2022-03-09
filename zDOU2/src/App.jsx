import React, { Component } from "react";
import moment from 'moment'

import './App.css';

import {Error} from './component/Error';
import Linear from "./component/Linear/Linear";
import {FirstStep} from "./component/FirstStep";
import {SecondStep} from "./component/SecondStep";
import {ThirdStep} from './component/ThirdStep';
import {FourthStep} from "./component/FourthStep";
import {Header} from "./component/Header";
import {Title} from "./component/Title";
import {Info} from "./component/Info";

export class App extends Component{
  constructor(props) {
    super(props);
    this.state = {
      obj: '',
      preloader: true,
    }
    this.phoneForSms = this.phoneForSms.bind(this)
  }
  sendAlterObject = (action, comment) => {
    const raw = {
      method: 'POST',
      body: JSON.stringify({action: action, data: this.state.obj, comment: comment})
    }
    fetch('https://hs-01.centralnoe.ru/Project-Selket-Main/Servers/Contract/Server.php', raw).then(res => {
              res.json().then(data => {
                console.log(data)
                if (+data.step === 4 || action === 'changeType') {
                  this.setState({obj: data})
                }
              })
    })
  }

  repeatSendSMS = (action, newNumberPhone, comment) => {
    this.phoneForSms(newNumberPhone).then(() => {
      this.sendAlterObject(action, comment);
    });
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
  async phoneForSms (phone) {
    const newSmsvalidation = Object.assign({}, this.state.obj.smsvalidation);
    newSmsvalidation.phone = phone;

    this.setState(prevState => ({
      obj: { ...prevState.obj, smsvalidation: newSmsvalidation}
    }))
  }

  handleInputs = (event) => {
    const elem = event.target;
    if (elem.name === 'step') {
      this.setState(prevState => ({
        obj: {...prevState.obj, [elem.name] : +elem.value}
      }), () => {
        this.sendAlterObject(elem.dataset.action);
      })
      return
    }
    this.setState(prevState => ({
      obj: {...prevState.obj, [elem.name] : elem.value}
    }))
  }

  setExpired = (event) => {
    if (event.target.value === 'Рекламный') {
      this.setState(prevState => ({
        obj: {...prevState.obj, docExpired: moment().add('days', 90).format('YYYY-MM-DD')}
      }))
    } else if (event.target.value === 'Эксклюзив') {
      this.setState(prevState => ({
        obj: {...prevState.obj, docExpired: moment().format('YYYY-MM-DD')}
      }))
    }
  }
  sendFiles = (files, source) => {
    let data = new FormData();
    data.append('photo[]', source);
    for (let item of files) {
      data.append('photo[]', item)
    }
    data.append('deal', this.state.obj.UID)
    data.append('loginId', loginID)
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

  setNewType = (event, newExpired) => {
    this.setState(prevState => ({
      obj: {...prevState.obj, docType : 'Эксклюзив', docExpired : newExpired},
    }), () => {
      this.handleInputs(event);
    })
  }

  render() {
    const {preloader, obj} = this.state;
    const step = {
      1: <FirstStep
        docType={this.state.obj.docType}
        docForm={this.state.obj.docForm}
        docExpired={this.state.obj.docExpired}
        handleInputs={this.handleInputs}
        setExpired={this.setExpired}
        rights={this.state.obj.rights}
      />,
      2: <SecondStep
        docType={this.state.obj.docType}
        docForm={this.state.obj.docForm}
        handleInputs={this.handleInputs}
        clients={this.state.obj.clients}
        setClientsChanges={this.setClientsChanges}
        phoneForSms={this.phoneForSms}
        currentPhone={this.state.obj.smsvalidation && this.state.obj.smsvalidation.phone ? this.state.obj.smsvalidation.phone : ''}
        clientsPhones={this.state.obj.phones}
      />,
      3: <ThirdStep
        documents={this.state.obj.documents}
        docType={this.state.obj.docType}
        docForm={this.state.obj.docForm}
        handleInputs={this.handleInputs}
        sendFiles={this.sendFiles}
        UID={this.state.obj.UID}
      />,
      4: <FourthStep
        documents={this.state.obj.documents}
        docType={this.state.obj.docType}
        docForm={this.state.obj.docForm}
        docExpired={this.state.obj.docExpired}
        docProlongation={this.state.obj.docProlongation}
        smsvalidation={this.state.obj.smsvalidation}
        moderation={this.state.obj.moderation}
        handleInputs={this.handleInputs}
        setNewType={this.setNewType}
        clientsPhones={this.state.obj.phones}
        repeatSendSMS={this.repeatSendSMS}
        isRepeat={this.state.obj.isRepeat}
      />,
    }
    const isGrid = +obj.step !== 4 ? 'container-grid' : '';

    return (
      <>
        {!preloader ?
          <>
            {
              obj === 'error' ?
                <Error/> :
                <>
                  <Header/>
                  <Title/>
                  <div className={isGrid}>
                    {
                      obj.rights ?
                        <>
                          {step[obj.step]}
                          {
                            +obj.step !== 4 &&
                            <Info
                              docType={this.state.obj.docType}
                              docForm={this.state.obj.docForm}
                              docExpired={this.state.obj.docExpired}
                              progress={this.state.obj.step}
                              prevStep={+this.state.obj.step - 1}
                              handleInputs={this.handleInputs}
                              accepted={this.state.obj.smsvalidation.status}
                              showBack={this.state.obj.showBack}
                            />
                          }
                        </>
                        : <span>Нет прав на просмотр</span>
                    }
                  </div>
                </>
            }
          </>
          : <Linear/>}
      </>
    )
  }

  componentDidMount() {
    const raw = {
      method: 'POST',
      body: JSON.stringify({action: 'get', dealId: deal})
    }
    fetch('https://hs-01.centralnoe.ru/Project-Selket-Main/Servers/Contract/Server.php', raw).then(res => {
      res.json().then(data => {
        this.setState({obj: data, preloader: false});
        console.log(data)
      }).catch(err => {
        this.setState({obj: 'error', preloader: false});
      })
    })
  }
}