import React, { Component } from "react";
import Button from "@mui/material/Button";
import {File} from "../File";
import {Notice} from "../Notice";
import {DragAndDrop} from "../DragAndDrop";


import './ThirdStep.css';

export class ThirdStep  extends Component{
  state = {
    haveContract: false,
  }

  isHaveContract = () => {
    for (let document of this.props.documents) {
      if (document.documentType === 'contract') {
        this.setState({haveContract: true})
      }
    }
  }
  getNamePromo = () => {
    if (this.props.docType === 'Рекламный') {
      if (this.props.isSms === 'Скрин') {
        return 'скрин'
      } else {
        return 'РД'
      }
    } else {
      return 'сканы'
    }
  }
  getDocument = (req) => {
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify(req)
    }
    fetch('https://crm.centralnoe.ru/dealincom/templates/sk.php', requestOptions)
      .then(data => {
        location.href = `https://crm.centralnoe.ru${data.result.document.downloadUrl}`
    })
  }
  render() {
    const { documents, docForm, docType, handleInputs, UID } = this.props;
    const namePromo = this.getNamePromo();

    return (
        <div className='container-page'>
          <Notice/>
          {
            docType === 'Рекламный' && docForm === 'Скрин' ? '' :
            <span className='subtitle'>Скачать форму</span>
          }
          {
           docType === 'Рекламный' && docForm === 'Скрин' ? '' :
          <div className='downloads'>
            {
              docType === 'Рекламный' ?
              <div className='downloads__item'>
                <span>Рекламный договор</span>
                <Button variant="contained" >
                  Скачать
                </Button>
              </div>
                :
              <>
                <div className='downloads__item'>
                  <span>ДОУ (+ соглашение если СК)</span>
                  <Button
                    variant="contained"
                    onClick={() => this.getDocument({packUID: UID})}
                  >
                    Скачать
                  </Button>
                </div>
                <div className='downloads__item'>
                <span>Соглашение о продление ДОУ</span>
                <Button
                  variant="contained"
                  onClick={() => this.getDocument({packUID: UID, Ext: 1})}
                >
                Скачать
                </Button>
                </div>
              </>
            }
          </div>
          }
          <span className='subtitle'>Загрузить {namePromo}</span>
          <div>
            <div className="upload">
              <DragAndDrop
                container={'contract'}
                title={`Загрузить ${docType === 'Рекламный' ? namePromo : 'ДОУ (+ соглашение если СК)'}`}
                sendFiles={this.props.sendFiles}
              />
              {
                docType !== 'Рекламный' &&
                <>
                  <DragAndDrop
                    container={'other'}
                    title={`Прочее`}
                    sendFiles={this.props.sendFiles}
                  />
                  <DragAndDrop
                    container={'egrn'}
                    title={`Загрузите ЕГРН`}
                    sendFiles={this.props.sendFiles}
                  />
                </>
              }
            </div>
          </div>
          { documents.length > 0 &&
          <>
            <span className='subtitle'>Файлы</span>
            <div className='documents'>
              {
                documents.map(document => <File key={document.UID} document={document}/>)
              }
            </div>
          </>
          }
          <Button
            disabled={!this.state.haveContract}
            name='step'
            value='4'
            onClick={(event) => handleInputs(event)}
            variant="contained"
            data-action='nextStep'
          >
            Отправить на проверку
          </Button>
      </div>
    );
  }

  componentDidMount() {
    this.isHaveContract();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.documents !== prevProps.documents) {
      this.isHaveContract();
    }
  }
}
