import React from "react";
import moment from "moment";

import './FourthStep.css';

import {Notice} from "../Notice";
import {File} from "../File";

export function FourthStep (props) {
  const { docType, docForm, docExpired,documents } = props;
  return (<div className='container-page'>
            <div className='about'>
              <span>Тип: {docType}</span>
              {
                docType === 'Рекламный' && <span>Вид: {docForm}</span>
              }
              <span>Срок: {moment(docExpired).format('DD.MM.YYYY')}</span>
              <span>Подтверденно модератором: Нет</span>
            </div>
            <Notice/>
            <span className='subtitle'>Файлы</span>
            {documents.length > 0 && <div className='documents'>
              {
                documents.map(document => <File key={document.UID} document={document}/>)
              }
            </div>
            }
          </div>)
}