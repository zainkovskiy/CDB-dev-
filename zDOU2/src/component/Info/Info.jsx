import React from "react";
import moment from "moment";

import './Info.css';
import Button from "@mui/material/Button";

export function Info (props){
  const { docType, docForm, docExpired, progress, prevStep, handleInputs, accepted, showBack, docProlongation } = props;

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
    { docType === 'Рекламный' && accepted === 'Подтвержденно' ||  docType === 'Эксклюзив' ?
      <>
        <p className='info__text'>Срок: <span>{ moment(docProlongation ? docProlongation : docExpired).format('DD.MM.YYYY') }</span></p>
        {docType === 'Рекламный' &&
          <span className='info__text_promo'>
            Дата установлена автоматически
          </span>
        }
      </> : ''
    }
    { (prevStep > 0 && prevStep < 3 && showBack) &&
      <Button
        name='step'
        value={prevStep}
        variant="contained"
        data-action='backStep'
        onClick={() => handleInputs(event)}
      >
      назад
      </Button>
    }
  </div>)
}