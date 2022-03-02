import React from "react";
import moment from "moment";
import Button from "@mui/material/Button";

import './FourthStep.css';

import {Notice} from "../Notice";
import {File} from "../File";

export function FourthStep (props) {
  const { docType, docForm, docExpired, documents, smsvalidation } = props;
  return (<div className='container-page'>
            <div className='about'>
              <div className='about__wrap'>
                <span>Тип: {docType}</span>
                { docType === 'Рекламный' && <Button variant="text">Сменить тип</Button> }
              </div>
              {
                docType === 'Рекламный' && <span>Вид: {docForm}</span>
              }
              <div className='about__wrap'>
                <span>Срок: {moment(docExpired).format('DD.MM.YYYY')}</span>
                { docType === 'Эксклюзив' && <Button variant="text">Продлить</Button> }
              </div>
              <span>Подтверденно модератором: Нет</span>
              {
                (docType === 'Рекламный' && docForm === 'СМС') &&
                  <div className='about__wrap'>
                    <span>Статус смс: {smsvalidation.status} ({smsvalidation.phone})</span>
                    <Button variant="text">Повторить отправку</Button>
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
          </div>)
}