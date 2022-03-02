import React, { Component } from "react";
import Button from "@mui/material/Button";

import './ThirdStep.css';

import {File} from "../File";
import {Notice} from "../Notice";

const UID = 57772000043;

export class ThirdStep  extends Component{
  state = {
    haveContract: false,
  }
  dragenter = (e) =>{
    e.stopPropagation();
    e.preventDefault();
    if (e.target.classList.contains('file')) {
      e.target.style.background = "#f1f8ff";
    }
  }
  dragover = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (e.target.classList.contains('file')) {
      e.target.style.background = "#f1f8ff";
    }
  }
  dragleave = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (e.target.classList.contains('file')) {
      e.target.style.background = "";
    }
  }
  drop = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.sendFiles(e.dataTransfer.files, e.target.dataset.container);
  }

  handlerInputFiles = (event) => {
    event.target.parentElement.style.background = "#f1f8ff";
    this.sendFiles(event.target.files, event.target.name);
  }

  sendFiles = (files, source) => {
    let data = new FormData();
    data.append('photo[]', source);
    for (let item of files) {
      data.append('photo[]', item)
    }
    data.append('reqNumber', UID)
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://hs-01.centralnoe.ru/Project-Selket-Main/Servers/MediaExchange/UploaderDoc.php", true);
    xhr.responseType = 'json';
    xhr.send(data);
    xhr.onload = () => {
      this.props.addFiles(xhr.response)
    };
  }

  isHaveContract = () => {
    for (let document of this.props.documents) {
      if (document.documentType === 'contract') {
        this.setState({haveContract: true})
      }
    }
  }
  getNamePromo(){
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

  render() {
    const { documents, docForm, docType, handleInputs } = this.props;
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
                  <Button variant="contained" >
                    Скачать
                  </Button>
                </div>
                <div className='downloads__item'>
                <span>Соглашение о продление ДОУ</span>
                <Button variant="contained">
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
              <div data-container="contract" className="file">
                <input
                  name="contract"
                  className="file__input"
                  id="file_contract"
                  type="file"
                  multiple
                  onChange={this.handlerInputFiles}
                />
                <label className="file__label" htmlFor="file_contract"></label>
                <span className="file__text">Загрузить {docType === 'Рекламный' ? namePromo : 'ДОУ (+ соглашение если СК)'}</span>
              </div>
              {
                docType !== 'Рекламный' &&
                <>
                  <div data-container="other" className="file">
                    <input
                      name="other"
                      className="file__input"
                      id="file_other"
                      type="file"
                      multiple
                      onChange={this.handlerInputFiles}
                    />
                    <label className="file__label" htmlFor="file_other"></label>
                    <span className="file__text">Прочее</span>
                  </div>
                  <div data-container="egrn" className="file">
                  <input
                  name="egrn"
                  className="file__input"
                  id="file_egrn"
                  type="file"
                  multiple
                  onChange={this.handlerInputFiles}
                  />
                  <label className="file__label" htmlFor="file_egrn"></label>
                  <span className="file__text">Загрузите ЕГРН</span>
                  </div>
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
            variant="contained">
            Отправить на проверку
          </Button>
      </div>
    );
  }

  componentDidMount() {
    const inputsFile = document.querySelectorAll('.file');
    inputsFile.forEach(el => {
      el.addEventListener("dragenter", this.dragenter, false);
    })
    inputsFile.forEach(el => {
      el.addEventListener("dragover", this.dragover, false);
    })
    inputsFile.forEach(el => {
      el.addEventListener("dragleave", this.dragleave, false);
    })
    inputsFile.forEach(el => {
      el.addEventListener("drop", this.drop, false);
    })
    this.isHaveContract();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.documents !== prevProps.documents) {
      this.isHaveContract();
    }
  }
  componentWillUnmount() {
    const inputsFile = document.querySelectorAll('.file');
    inputsFile.forEach(el => {
      el.removeEventListener("dragenter", this.dragenter, false);
    })
    inputsFile.forEach(el => {
      el.removeEventListener("dragover", this.dragover, false);
    })
    inputsFile.forEach(el => {
      el.removeEventListener("dragleave", this.dragleave, false);
    })
    inputsFile.forEach(el => {
      el.removeEventListener("drop", this.drop, false);
    })
  }
}

const template = `<div className="upload">
              <div data-container="contract" className="file">
                <input
                  name="contract"
                  className="file__input"
                  id="file_contract"
                  type="file"
                  multiple
                  onChange={this.handlerInputFiles}
                />
                <label className="file__label" htmlFor="file_contract"></label>
                <span className="file__text">Загрузить {docType === 'Рекламный' ? namePromo : 'ДОУ (+ соглашение если СК)'}</span>
              </div>
              {
                docType !== 'Рекламный' &&
                <>
                  <div data-container="other" className="file">
                    <input
                      name="other"
                      className="file__input"
                      id="file_other"
                      type="file"
                      multiple
                      onChange={this.handlerInputFiles}
                    />
                    <label className="file__label" htmlFor="file_other"></label>
                    <span className="file__text">Прочее</span>
                  </div>
                  <div data-container="egrn" className="file">
                  <input
                  name="egrn"
                  className="file__input"
                  id="file_egrn"
                  type="file"
                  multiple
                  onChange={this.handlerInputFiles}
                  />
                  <label className="file__label" htmlFor="file_egrn"></label>
                  <span className="file__text">Загрузите ЕГРН</span>
                  </div>
                </>
              }
            </div>`