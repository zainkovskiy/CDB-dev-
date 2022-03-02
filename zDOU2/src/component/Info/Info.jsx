import React from "react";
import moment from "moment";

import './Info.css';

export function Info (props){
  const { docType, docForm, docExpired, progress } = props;

  const progressPercent = {
    1: 0,
    2: 33,
    3: 66,
    4: 100
  }
  return (<div className='info'>
    <div className='progress'>
      <div className='progress__back'>
        <div style={ {width: `${progressPercent[progress]}%`} } className='progress__line'>
        </div>
      </div>
      <span>{progressPercent[progress]}%</span>
    </div>
    <p className='info__text'>Тип: <span>{docType}</span></p>
    {
      docType === 'Рекламный' && <p className={`info__text`}>Вид: <span>{docForm}</span></p>
    }
    <p className='info__text'>Срок: <span>{ docExpired && moment(docExpired).format('DD.MM.YYYY') }</span></p>
    { docType === 'Рекламный' &&
      <span className='info__text_promo'>
        Дата установлена автоматически
      </span>
    }
  </div>)
}