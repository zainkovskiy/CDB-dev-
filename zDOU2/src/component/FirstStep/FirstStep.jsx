import React, {useState} from 'react';
import moment from 'moment'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import './FirstStep.css';

export function FirstStep(props){
  const { docType, docExpired, docForm, rights } = props;
  const { handleInputs, setExpiredWithPromo } = props;

  const [isErrorDate, setIsErrorDate] = useState(false);
  const [textErrorDate, setTextErrorDate] = useState('');
  const [errorTypeText, setErrorTypeText] = useState('');
  const [errorViewText, setErrorViewText] = useState('');

  const isValid = (event) => {
    const validLibrary = {
      docType: true,
      docForm: true,
      docExpired: true,
    }
    if (docType === 'Эксклюзив' && new Date(docExpired) < new Date() || docExpired.length === 0){
      setIsErrorDate(true);
      setTextErrorDate('дата не может быть равна или меньше чем сегодня');
      validLibrary.docExpired = false;
    } else {
      validLibrary.docExpired = true;
      setIsErrorDate(false);
      setTextErrorDate('');
    }

    if (!docType){
      setErrorTypeText('укажите тип договора');
      validLibrary.docType = false;
    } else {
      validLibrary.docType = true;
      setErrorTypeText('');
    }
    if (docType === 'Рекламный' && !docForm){
      setErrorViewText('укажите вид договора');
      validLibrary.docForm = false;
    } else {
      validLibrary.docForm = true;
      setErrorViewText('');
    }

    if (validLibrary.docType && validLibrary.docForm && validLibrary.docExpired) {
      handleInputs(event);
    }
  }

  return (<div className='container-page'>
              <div className='container-page__wrap'>
                <span className='subtitle'>Выберите тип договора</span>
                <div>
                <div className='toggle-btn'>
                  <div className='toggle-btn__item toggle-btn__item50'>
                    <input
                      id='ex'
                      name='docType'
                      type="radio"
                      checked={docType === 'Эксклюзив'}
                      value='Эксклюзив'
                      onChange={(event) => handleInputs(event)}
                    />
                    <label htmlFor='ex'>
                      Эксклюзив
                    </label>
                  </div>
                  <div className='toggle-btn__item toggle-btn__item50'>
                    <input
                      id='promo'
                      name='docType'
                      type="radio"
                      checked={docType === 'Рекламный'}
                      value='Рекламный'
                      onChange={(event) => {handleInputs(event); setExpiredWithPromo();}}
                    />
                    <label htmlFor='promo'>
                      Рекламный
                    </label>
                  </div>
                </div>
                  <span className='error-text'>{errorTypeText}</span>
                </div>
              </div>
              <div className={`container-page__wrap ${docType === 'Эксклюзив' && 'inVisible'}`}>
                <span className='subtitle'>Выберите вид договора</span>
                <div>
                <div className='toggle-btn'>
                  { rights !== 'sks' &&
                    <div className='toggle-btn__item'>
                      <input
                        id='paper'
                        name='docForm'
                        type="radio"
                        checked={docForm === 'Бумажный'}
                        value='Бумажный'
                        onChange={(event) => handleInputs(event)}
                      />
                      <label htmlFor='paper'>
                        Бумажный
                      </label>
                    </div>
                  }
                  <div className='toggle-btn__item'>
                    <input
                      id='sms'
                      name='docForm'
                      type="radio"
                      checked={docForm === 'СМС'}
                      value='СМС'
                      onChange={(event) => handleInputs(event)}
                    />
                    <label htmlFor='sms'>
                      СМС
                    </label>
                  </div>
                  { rights !== 'sks' &&
                    <div className='toggle-btn__item'>
                      <input
                        id='screen'
                        name='docForm'
                        type="radio"
                        checked={docForm === 'Скрин'}
                        value='Скрин'
                        onChange={(event) => handleInputs(event)}
                      />
                      <label htmlFor='screen'>
                        Скрин
                      </label>
                    </div>
                  }
                  { rights !== 'owner' &&
                    <div className='toggle-btn__item'>
                      <input
                        id='ring'
                        name='docForm'
                        type="radio"
                        checked={docForm === 'Звонок'}
                        value='Звонок'
                        onChange={(event) => handleInputs(event)}
                      />
                      <label htmlFor='ring'>
                        Звонок
                      </label>
                    </div>
                  }
                </div>
                  <span className='error-text'>{ errorViewText }</span>
                </div>
              </div>
              {docType === 'Эксклюзив' &&
                <div className='container-page__wrap'>
                  <span className='subtitle'>Срок действия договора</span>
                  <TextField
                    error={isErrorDate}
                    id="date"
                    label="Срок действия договора"
                    type="date"
                    name='docExpired'
                    disabled={docType === 'Рекламный'}
                    value={ `${docExpired ? docExpired.split(' ')[0] : moment().format('YYYY-MM-DD')}` }
                    onChange={(event) => handleInputs(event)}
                    helperText={docType === 'Рекламный' ? 'В соответствии с регламентом срок размещения РД 90 календарных дней' : textErrorDate}
                    size="small"
                  />
                </div>
              }
              <Button
                name='step'
                value="2"
                onClick={(event) => isValid(event)}
                variant="contained">
                Далее
              </Button>
            </div>)
}
