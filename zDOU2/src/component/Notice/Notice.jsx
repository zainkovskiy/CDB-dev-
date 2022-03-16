import React, { useState } from "react";
import Button from "@mui/material/Button";

import './Notice.css';

import { DialogMain } from '../DialogMain';
import { DialogCorrect } from '../DialogCorrect';

export function Notice(props){
  const { moderation, docType, sendFiles, docExpired, docProlongation, setNewType, sendAlterObject } = props;
  const [ openCorrect, setOpenCorrect ] = useState(false);

  const isOpenCorrect = () => {
    setOpenCorrect(!openCorrect);
  }

  return (<div className='notice'>
              <span className='notice__title'>Информация</span>
              <ol className='notice__list'>
                { moderation.reason.map(reason => <li key={reason.UID}>{reason.message}</li>) }
              </ol>
              {
                (moderation.DateErr || moderation.DocErr) &&
              <Button
                variant="contained"
                onClick={isOpenCorrect}
              >
                Исправить
              </Button>
              }
              {moderation.modComment &&
              <>
                <span className='notice__title'>Комментарий модератора</span>
                <span>{ moderation.modComment }</span>
              </>}
            <DialogMain
              open={openCorrect}
              onClose={isOpenCorrect}
              fullWidth={true}
              maxWidth={'md'}
            >
              <DialogCorrect
                docType={docType}
                sendFiles={sendFiles}
                DateErr={moderation.DateErr}
                docExpired={docExpired}
                docProlongation={docProlongation}
                setNewType={setNewType}
                sendAlterObject={sendAlterObject}
                onClose={isOpenCorrect}
              />
            </DialogMain>
            </div>)
}