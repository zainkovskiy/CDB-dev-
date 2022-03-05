import React, {useState} from "react";
import {Dialog} from "../Dialog";

import './File.css';

import {FileWindow} from "../FileWindow";

export function File (props) {
  const [open, setOpen] = useState(false);

  const docTypeRus = {
    contract: 'ДОУ',
    egrn: 'ЕГРН',
    other: 'Прочее',
    grp: 'Прочее',
  }
  const getURL = () => {
    const regExpJPG = new RegExp('jpg', 'i');
    const regExpJPEG = new RegExp('jpeg', 'i');
    const regExpPNG = new RegExp('png', 'i');
    const regExpPDF = new RegExp('pdf', 'i');
    if (regExpJPG.test(props.document.URI) || regExpJPEG.test(props.document.URI) || regExpPNG.test(props.document.URI)) {
      return props.document.URI;
    } else if (regExpPDF.test(props.document.URI)){
      return 'https://crm.centralnoe.ru/dealincom/assets/pdf.png';
    } else {
      return 'https://crm.centralnoe.ru/dealincom/assets/Document.png';
    }
  }

  const { document } = props;
  return (<div className='document'>
            <img
              onClick={ () => setOpen(!open) }
              className='document__img'
              src={ getURL() }
              alt={ document.name }
            />
            <span>{ docTypeRus[document.documentType] }</span>
            <Dialog
              open={open}
              onClose={ () => setOpen(!open) }
              fullWidth={false}
              maxWidth={''}
            >
              <FileWindow document={document} url={getURL()} docTypeRus={docTypeRus}/>
            </Dialog>
          </div>)
}
