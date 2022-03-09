class Leads {
  constructor() {
    this.leads = [];
    this.container = document.querySelector('.page');
  }
  init(){
    this.container.insertAdjacentHTML('beforeend', new Layout().init(this.leads.length));
    new Lead(this.leads).layout();
    new Handler(this.container).init();
  }
}

class Layout {
  init(countLeads){
    return `<header class="header">
              <span class="header__logo"></span>  
              <span class="header__count">Количество лидов ${countLeads}</span>
              <div class="select"> 
                <input class="select__input" type="text" readonly value="Не квалифицирован" name="filter">
                <div class="select__field isVisible filter"> 
                  <span class="select__option" data-option="Не квалифицирован" data-filter="noQualify">Не квалифицирован</span>
                  <span class="select__option" data-option="Квалифицирован" data-filter="qualify">Квалифицирован</span>
                </div>
              </div> 
            </header> 
            <div class="leads"></div>`
  }
}

class Lead {
  constructor(leads) {
    this.leads = leads;
    this.container = document.querySelector('.leads');
  }
  layout(){
    this.container.innerHTML = '';
    for (let lead of this.leads){
      this.container.insertAdjacentHTML('beforeend',
        `<div class="lead"> 
                <div class="info"> 
                  <span data-name="lead" data-id="${lead.ID}" class="info__name">${lead.name}</span>
                  <span class="info__time">Создан ${lead.time && lead.time.split('T')[0].split('-').reverse().join('.')}</span>
                </div>
                <div class="buttons"> 
                  ${(lead.telNumber &&lead.telNumber.length > 0) ?
                   `<a href="tel:${lead.telNumber[0].VALUE}" class="buttons__item buttons__phone"></a>`
                  : ''
                  }
                  <span class="buttons__item buttons__message isVisible"></span>
                  <span class="buttons__item buttons__chat isVisible"></span>
                </div> 
              </div>`)
    }
  }
}

class Handler {
  constructor(container) {
    this.container = container
    this.currentSelect = '';
    this.currentOptions = '';
  }
  init(){
    this.container.addEventListener('click', event => {
      if (event.target.classList.contains('header__logo')){
        // this.openMainPage();
      } else if (event.target.dataset.name === 'lead'){
        this.setLoader();
        getData({
          action: 'getOne',
          UID: event.target.dataset.id,
        }).then(lead => {
          console.log(lead)
          this.openLead(lead);
          this.removeLoader();
        })
      } else if (event.target.dataset.name === 'contract'){
        this.openContract(event.target.dataset.id, event.target.dataset.phone);
      } else if (event.target.tagName === 'INPUT' && event.target.type === 'text') {
          if (this.currentSelect && this.currentSelect === event.target) {
            this.closeSelectField();
          } else {
            this.openSelectField(event.target)
          }
      } else if (event.target.dataset.filter){
        this.currentSelect.value = event.target.dataset.option;
        this.setLoader();
        getData({
          action: 'getList',
          type: event.target.dataset.filter,
          userId: loginID,
        }).then(data => {
          this.removeLoader();
          new Lead(data).layout();
          document.querySelector('.header__count').innerHTML = `Количество лидов ${data.length}`
          this.closeSelectField();
        })
      } else if (event.target.dataset.type === 'category') {
        this.currentSelect.value = event.target.dataset.option;
        this.closeSelectField();
      }
    })
  }
  closeSelectField() {
    if (this.currentOptions){
      this.currentOptions.classList.add('isVisible');
      this.currentOptions = '';
      this.currentSelect = '';
    }
  }
  openSelectField(input) {
    const findBlock = document.querySelector(`.${input.name}`);
    if (findBlock){
      this.closeSelectField();
      this.currentOptions = findBlock;
      this.currentOptions.classList.remove('isVisible');
      this.currentSelect = input;
    }
  }
  sendSelectQualify(inputs, id, phone){
    const qualify = {
      phone: phone,
      action: 'setWin',
      UID: id,
      userId: loginID
    }
    inputs.forEach(input => {
      qualify[input.name] = input.value;
    })
    getData(qualify).then(() => {
      location.href = 'index.php';
    })
  }
  setLoader(){
    const currentY = window.pageYOffset;
    const loader = `<div style="top: ${currentY}px" class="loader"><div class="loader__img"></div><div>`;
    document.body.insertAdjacentHTML('beforeend', loader);
    document.body.setAttribute('style', 'overflow: hidden;');
  }
  removeLoader(){
    document.body.removeAttribute('style');
    document.querySelector('.loader').remove();
  }
  getCall(timeline){
    let timeLineStory = '';
    for(let item of timeline){
      if (item.PROVIDER_TYPE_ID === "CALL") {
        timeLineStory += `<div class="call"> 
                            <p class="call__title">${+item.DIRECTION === 1 ? `Входящий` : 'Исходящий' } звонок ${this.getTypeCall(item)}</p>
                            ${item.SUBJECT ? `<span class="call__title">${item.SUBJECT}</span>` : ''}
                            ${item.DESCRIPTION ? `<span class="call__subtitle">${item.DESCRIPTION}</span>` : ''}
                            ${item.FILES && item.FILES.length > 0 ?
                              `<audio class="card__audio" src="${item.FILES[0].url}" controls></audio>` 
                              : ''
                            }
                          </div>`
      } else if (item.PROVIDER_TYPE_ID === "EMAIL") {
        timeLineStory += `<div class="call">
                            <span class="call__title">Входящее письмо</span>
                            ${item.DESCRIPTION ? `<span class="call__subtitle">${item.DESCRIPTION}</span>` : ''}
                          </div>`
      } else if (item.isComment){
        timeLineStory += `<div class="call"><span class="call__title">${item.message}</span></div>`
      }
    }
    return timeLineStory;
  }
  getTypeCall(call){
    if (!call.SETTINGS.hasOwnProperty('length')) {
      return `<span class="call__status call__denied">пропущенный звонок</span>`
    } else if (!call.DESCRIPTION) {
      return `<span class="call__status call__denied">занято</span>`
    } else {
      return `<span class="call__status call__approved">успешный звонок</span>`
    }
  }
  openLead(lead){
    const htmlDom = document.querySelector('HTML');
    htmlDom.setAttribute("style", "overflow-y:hidden;");
    const currentY = window.pageYOffset;
    const layout = `<div style="top: ${currentY}px;" class="card">
                      <div data-name="close-card" class="return"> 
                        <span class="return__arrow"></span>
                        <span class="return__text">Назад</span>
                      </div>
                      <div class="card__info"> 
                        <span data-id="${lead.ID}" ${lead.HAS_PHONE === 'Y' && `data-phone="${lead.PHONE[0].VALUE}"`} data-name="contract" class="btn">квалифицировать</span>
                        <span class="card__title">Лид №${lead.ID} ${lead.DATE_CREATE ? `от ${lead.DATE_CREATE.split('T')[0].split('-').reverse().join('.')}` : ''}</span>
                        <p class="card__subtitle">Телефон
                          ${lead.HAS_PHONE === 'Y' ?
                            `<a class="card__subtitle-child" href="tel:${lead.PHONE[0].VALUE}">${lead.PHONE[0].VALUE}</a>`  
                              : ''
                          }
                        </p>
                        <p class="card__subtitle">Риелтор 
                          <span class="card__subtitle-child">${lead.owner}</span>
                        </p>
                      </div>                                         
                      <div class="card__info"> 
                        <span class="card__title">История</span>  
                        ${(lead.timeline && lead.timeline.length > 0) ? this.getCall(lead.timeline) : ''}  
                      </div>
                    </div>`
    this.container.insertAdjacentHTML('beforeend', layout);
    document.querySelector('.card').classList.add('card_open');
    this.handlerCard('card');
  }
  handlerCard(select){
    document.querySelector(`.${select}`).addEventListener('click', event => {
      if (event.target.dataset.name === 'close-card') {
        document.querySelector('.card').classList.add('card_close');
        setTimeout(() => {
          this.closeModule(select);
        }, 500);
      }
    })
  }
  openContract(id, phone){
    const htmlDom = document.querySelector('HTML');
    htmlDom.setAttribute("style", "overflow-y:hidden;");
    const currentY = window.pageYOffset;
    const layout = `<div style="top: ${currentY}px;" class="module">
                      <div class="module__group">
                        <button data-id="${id}" data-qualify="yes" data-phone=${phone} class="module__btn module__btn_green">Сделку + Контакт</button>
                        <button data-id="${id}" data-qualify="no" data-type="lose" class="module__btn module__btn_red">Не целевой лид</button>
                        <button data-id="${id}" data-qualify="no" data-type="other" class="module__btn module__btn_red">Другое АН</button>
                        <button data-name="close" class="module__btn">Закрыть</button>
                      </div>
                    </div>`
    this.container.insertAdjacentHTML('beforeend', layout);
    this.handlerModule('module');
  }
  handlerModule(select){
    document.querySelector(`.${select}`).addEventListener('click', event => {
      if (event.target.dataset.name === 'close'){
        this.closeModule(select);
      } else if (event.target.dataset.name === 'close-card'){
        document.querySelector('.card').classList.add('card_close');
        setTimeout(() => {
          this.closeModule(select);
        }, 500);
      } else if (event.target.dataset.qualify === 'yes'){
        this.closeModule(select);
        this.openQualifyForm(event.target.dataset.id, event.target.dataset.phone);
      } else if (event.target.dataset.qualify === 'save'){
        const allInputs = document.querySelector(`.${select}`).querySelectorAll('INPUT');
        this.sendSelectQualify(allInputs, event.target.dataset.id, event.target.dataset.phone);
        this.setLoader();
      } else if (event.target.dataset.qualify === 'no') {
        this.setLoader();
        this.setLoseQualify(event.target.dataset.id, event.target.dataset.type);
      }
    })
  }
  closeModule(select){
    document.querySelector('HTML').removeAttribute('style');
    document.querySelector(`.${select}`).remove();
  }
  openMainPage(){
    window.location.href='../index.html';
  }
  setLoseQualify(id, type){
    getData({
      action: 'setLose',
      UID: id,
      type: type,
    }).then(() => {
      location.href = 'index.php';
    })
  }
  openQualifyForm(id, phone){
    const htmlDom = document.querySelector('HTML');
    htmlDom.setAttribute("style", "overflow-y:hidden;");
    const currentY = window.pageYOffset;
    const layout = `<div style="top: ${currentY}px;" class="qualify">
                        <div class="qualify__wrap"> 
                          <span class="qualify__subtitle">Фамилия</span>
                          <input class="select__input" type="text" name="LAST_NAME" autocomplete="off">
                        </div>
                        <div class="qualify__wrap"> 
                          <span class="qualify__subtitle">Имя</span>
                          <input class="select__input" type="text" name="NAME" autocomplete="off">
                        </div>
                        <div class="qualify__wrap"> 
                          <span class="qualify__subtitle">Отчество</span>
                          <input class="select__input" type="text" name="SECOND_NAME" autocomplete="off">
                        </div>
                        <div class="qualify__wrap">
                          <span class="qualify__subtitle">Направление</span>
                          <div class="select"> 
                              <input class="select__input" type="text" readonly value="Вторичка - Спрос" name="category">
                              <div class="select__field isVisible category"> 
                            <span class="select__option" data-type="category" data-option="Вторичка - Спрос">Вторичка - Спрос</span>
                            <span class="select__option" data-type="category" data-option="Вторичка - Заявка">Вторичка - Заявка</span>
                            <span class="select__option" data-type="category" data-option="Новостройка - Спрос">Новостройка - Спрос</span>
                            <span class="select__option" data-type="category" data-option="Реализация выкупленных объектов">Реализация выкупленных объектов</span>
                            <span class="select__option" data-type="category" data-option="Аренда - РКЦ">Аренда - РКЦ</span>
                            <span class="select__option" data-type="category" data-option="Партнеры для выкупов">Партнеры для выкупов</span>
                            <span class="select__option" data-type="category" data-option="Выкупы от банков">Выкупы от банков</span>
                            <span class="select__option" data-type="category" data-option="Аренда - Снять">Аренда - Снять</span>
                            <span class="select__option" data-type="category" data-option="Аренда - Сдать">Аренда - Сдать</span>
                            <span class="select__option" data-type="category" data-option="ОКН - Продам">ОКН - Продам</span>
                            <span class="select__option" data-type="category" data-option="ОКН - Сдам">ОКН - Сдам</span>
                            <span class="select__option" data-type="category" data-option="ОКН - Куплю">ОКН - Куплю</span>
                            <span class="select__option" data-type="category" data-option="ОКН - Сниму">ОКН - Сниму</span>
                            <span class="select__option" data-type="category" data-option="ОКН - Оценка">ОКН - Оценка</span>
                            <span class="select__option" data-type="category" data-option="ОКН - Ипотека">ОКН - Ипотека</span>
                            <span class="select__option" data-type="category" data-option="ДЭД - Оценка">ДЭД - Оценка</span>
                            <span class="select__option" data-type="category" data-option="ДЭД - Ипотека">ДЭД - Ипотека</span>
                            <span class="select__option" data-type="category" data-option="СКС - Жалобы">СКС - Жалобы</span>
                            <span class="select__option" data-type="category" data-option="Акредитация (ИБ)">Акредитация (ИБ)</span>
                            <span class="select__option" data-type="category" data-option="Воронки и туннели продаж">Воронки и туннели продаж</span>
                              </div>                      
                          </div> 
                        </div>
                      <button data-id=${id} data-qualify="save" data-phone=${phone} class="btn">сохранить</button>
                      <button data-name="close" class="btn btn_red">закрыть</button>
                    </div>`
    this.container.insertAdjacentHTML('beforeend', layout);
    this.handlerModule('qualify');
  }
}

const leads = new Leads();
getData({
  action: 'getList',
  type: 'noQualify',
  userId: loginID,
}).then(data=>{
  console.log(data)
  leads.leads = data;
  leads.init();
});

async function getData(raw){
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json; charset=utf-8");
  const requestOptions = {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: "include",
    headers: myHeaders,
    body: JSON.stringify(raw)
  };

  let response = await fetch("https://crm.centralnoe.ru/dealincom/factory/leadFactory.php", requestOptions);
  if (!response.ok) {
    throw new Error('Ответ сети был не ok.');
  }

  return await response.json();
}

