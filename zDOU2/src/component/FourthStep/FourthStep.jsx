import React, { Component } from "react";
import moment from "moment";
import Button from "@mui/material/Button";

import './FourthStep.css';

import { Notice } from "../Notice";
import { File } from "../File";
import { DialogMain } from "../DialogMain";
import { DialogType } from "../DialogType";
import { DialogSMS } from "../DialogSMS";

export class FourthStep extends Component {
  state = {
    openChangeType: false,
    openSendSMS: false,
    titleDialog: ''
  }

  setOpenChangeType = () => {
    this.setState({ openChangeType: !this.state.openChangeType });
  }
  setOpenSendSMS = () => {
    this.setState({ openSendSMS: !this.state.openSendSMS });
  }

  setTitleDialog = (title) => {
    this.setState({ titleDialog: title })
  }

  render() {
    const { docType, docForm, docExpired, documents, smsvalidation, repeatSendSMS, sendAlterObject, UID,
      moderation, handleInputs, setNewType, docProlongation, clientsPhones, isRepeat, sendFiles, isGod, showProlongation, showChange } = this.props;
    return (<div className='container-page'>
      <div className='about'>
        <div className='about__wrap'>
          <span>Тип: {docType}</span>
          {docType === 'Рекламный' &&
            <>
              {moderation.status === 'Подтверждено' || showChange ?
                <Button
                  variant="text"
                  onClick={() => { this.setOpenChangeType(); this.setTitleDialog('Сменить тип договора') }}
                >
                  Сменить тип
                </Button>
                :
                <Button
                  variant="text"
                  name='step'
                  data-action='changeTypeFull'
                  value='1'
                  onClick={(event) => handleInputs(event)}
                >
                  Продлить
                </Button>
              }
            </>
          }
        </div>
        {
          docType === 'Рекламный' && <div className='about__wrap'>Вид: {docForm}</div>
        }
        <div className='about__wrap'>
          <span>Срок: {moment(docType === 'Эксклюзив' && moderation.status !== 'Подтверждено' ? `${docProlongation ? docProlongation : docExpired}` : docExpired).format('DD.MM.YYYY')}</span>
          {((docType === 'Эксклюзив' && moderation.status === 'Подтверждено') || showProlongation) &&
            <Button
              variant="text"
              onClick={() => { this.setOpenChangeType(); this.setTitleDialog('Продлить договор') }}
            >
              Продлить
            </Button>}
        </div>
        <div className='about__wrap'>Статус договора: {moderation.status} с {moderation.date && moment(moderation.date).format('DD.MM.YYYY, HH:mm')}</div>
        {
          (docType === 'Рекламный' && docForm === 'СМС') &&
          <div className='about__wrap'>
            <span>
              Статус смс: {smsvalidation.status} {smsvalidation.phone} {smsvalidation.date && moment(smsvalidation.date).format('DD.MM.YYYY, HH:mm')}
            </span>
            {
              (!isRepeat || isGod) &&
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
      {moderation.status === 'Отклонено' &&
        <Notice
          moderation={moderation}
          docType={docType}
          sendFiles={sendFiles}
          docExpired={docExpired}
          docProlongation={docProlongation}
          sendAlterObject={sendAlterObject}
          setNewType={setNewType}
          UID={UID}
        />}
      {documents.length > 0 &&
        <>
          <span className='subtitle'>Файлы</span>
          <div className='documents'>
            {
              documents.map(document => <File key={document.UID} document={document} />)
            }
          </div>
        </>
      }
      <DialogMain
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
      </DialogMain>
      <DialogMain
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
      </DialogMain>
    </div>)
  }
}