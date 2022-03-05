import React, { Component } from "react";
import moment from "moment";
import Button from "@mui/material/Button";

import './FourthStep.css';

import {Notice} from "../Notice";
import {File} from "../File";
import {Dialog} from "../Dialog";
import {DialogType} from "../DialogType";
import {DialogSMS} from "../DialogSMS";

export class FourthStep extends Component{
  state = {
    openChangeType: false,
    openSendSMS: false,
    titleDialog: ''
  }

  setOpenChangeType = () => {
    this.setState({openChangeType: !this.state.openChangeType});
  }
  setOpenSendSMS = () => {
    this.setState({openSendSMS: !this.state.openSendSMS});
  }

  setTitleDialog = (title) => {
    this.setState({titleDialog: title})
  }

  render() {
    const { docType, docForm, docExpired, documents, smsvalidation, repeatSendSMS,
      moderation, handleInputs, setNewType, docProlongation, clientsPhones, isRepeat } = this.props;
    return (<div className='container-page'>
      <div className='about'>
        <div className='about__wrap'>
          <span>Тип: {docType}</span>
          { docType === 'Рекламный' &&
            <>
              { moderation.status !== 'Подтвержден' ?
                <Button
                  variant="text"
                  name='step'
                  data-action='changeTypeFull'
                  value='1'
                  onClick={(event) => handleInputs(event)}
                >
                  Сменить тип
                </Button>
                :
                <Button
                  variant="text"
                  onClick={() => {this.setOpenChangeType(); this.setTitleDialog('Сменить тип договора')}}
                >
                  Сменить тип
                </Button>
              }
            </>
           }
        </div>
        {
          docType === 'Рекламный' && <div className='about__wrap'>Вид: {docForm}</div>
        }
        <div className='about__wrap'>
          <span>Срок: {moment(docType === 'Эксклюзив' && moderation.status !== 'Подтвержден' ? docProlongation : docExpired).format('DD.MM.YYYY')}</span>
          { docType === 'Эксклюзив' &&
          <Button
            variant="text"
            onClick={() => {this.setOpenChangeType(); this.setTitleDialog('Продлить договор')}}
          >
            Продлить
          </Button> }
        </div>
        <div className='about__wrap'>Статус договора: {moderation.status} с {moderation.date && moment(moderation.data).format('DD.MM.YYYY')}</div>
        {
          (docType === 'Рекламный' && docForm === 'СМС') &&
          <div className='about__wrap'>
            <span>
              Статус смс: {smsvalidation.status} {smsvalidation.phone} {smsvalidation.date &&  moment(smsvalidation.date).format('DD.MM.YYYY')}
            </span>
            {
              !isRepeat &&
                <Button
                  variant="text"
                  onClick={this.setOpenSendSMS}
                >
                  Повторить отправку
                </Button>
            }
          </div>
        }
      </div>
      <Notice/>
      {documents.length > 0 &&
      <>
        <span className='subtitle'>Файлы</span>
        <div className='documents'>
          {
            documents.map(document => <File key={document.UID} document={document}/>)
          }
        </div>
      </>
      }
      <Dialog
        open={this.state.openChangeType}
        onClose={this.setOpenChangeType}
        fullWidth={true}
        maxWidth={'xs'}
      >
        <DialogType
          onClose={this.setOpenChangeType}
          setNewType={setNewType}
          title={this.state.titleDialog}
        />
      </Dialog>
      <Dialog
        open={this.state.openSendSMS}
        onClose={this.setOpenSendSMS}
        fullWidth={true}
        maxWidth={'xs'}
      >
        <DialogSMS
          onClose={this.setOpenSendSMS}
          clientsPhones={clientsPhones}
          repeatSendSMS={repeatSendSMS}
        />
      </Dialog>
    </div>)
  }
}