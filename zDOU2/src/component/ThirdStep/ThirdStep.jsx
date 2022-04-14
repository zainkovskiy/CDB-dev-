import React, { Component } from "react";
import Button from "@mui/material/Button";
import {File} from "../File";
import {DragAndDrop} from "../DragAndDrop";
import { LoadingButton } from "@mui/lab";



import './ThirdStep.css';

export class ThirdStep  extends Component{
  state = {
    haveContract: false,
    loading: false,
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
    this.setState({loading: true});
    fetch('https://crm.centralnoe.ru/dealincom/templates/sk.php', requestOptions)
      .then(res => {
        res.text().then(url => {
          this.setState({loading: false});
          if (url !== 'false'){
            location.href = url;
          }
        })
    })
  }
  render() {
    const { documents, docForm, docType, handleInputs, UID } = this.props;
    const namePromo = this.getNamePromo();

    return (
        <div className='container-page'>
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
                {/*<Button*/}
                {/*  variant="contained"*/}
                {/*  onClick={() => this.getDocument({packUID: UID})}*/}
                {/*>*/}
                {/*  Скачать*/}
                {/*</Button>                */}
                <LoadingButton
                  variant="contained"
                  onClick={() => this.getDocument({packUID: UID})}
                  loading={this.state.loading}
                  loadingIndicator="Loading..."
                >
                  Скачать
                </LoadingButton>
              </div>
                :
              <>
                <div className='downloads__item'>
                  <span>ДОУ (+ соглашение если СК)</span>
                  <LoadingButton
                    variant="contained"
                    onClick={() => this.getDocument({packUID: UID})}
                    loading={this.state.loading}
                  >
                    Скачать
                  </LoadingButton>
                </div>
                <div className='downloads__item'>
                <span>Соглашение о продление ДОУ</span>
                <LoadingButton
                  variant="contained"
                  onClick={() => this.getDocument({packUID: UID, Ext: 1})}
                  loading={this.state.loading}
                >
                Скачать
                </LoadingButton>
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
