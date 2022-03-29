class Booking {
  constructor() {
    this.container = document.querySelector('.booking');
    this.complexes = [];
    this.params = JSON.parse(params);
  }
  init(){
    console.log(this.params)
    this.container.insertAdjacentHTML('beforeend', new Render(this.params).render());
    new Handler(this.complexes, this.container, this.params).init();
  }
  getComplex(cb){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://hs-01.centralnoe.ru/Project-Selket-Main/Servers/Object/Booking.php", true);
    xhr.responseType = 'json';
    xhr.send(JSON.stringify({action: 'getDevelopers'}));

    xhr.onload = () => {
      cb(xhr.response);
    };
  }
}

class Render{
  constructor(params) {
    this.params = params;
  }
  getPhoneNumber(){
    if (this.params.dealId && this.params.contact && this.params.contact.PHONE){
      if (this.params.contact.PHONE[0] === '7'){
        return  "8" + this.params.contact.PHONE.slice(1);
      } else if (this.params.contact.PHONE[0] === '+'){
        return  "8" + this.params.contact.PHONE.slice(2);
      } else {
        return this.params.contact.PHONE
      }
    } else {
      return ''
    }
  }
  render(){
    return `<div class="header"> 
                <h2>Уведомление/бронь по новостройке</h2>
                <div class="header__right"> 
                  <span class="header__text">ЖК нет в списке</span>
                  <span data-complain="open" class="header__button">пожаловаться</span>
                </div>
            </div> 
            <div class="tabset">
              <input type="radio" name="tabset_1" id="tabset_1_notification" hidden="" aria-hidden="true" ${this.params.reqType === 0 ? 'checked' : `${this.params.reqType === 1 ? '' : 'checked'}`}="">
              <input type="radio" name="tabset_1" id="tabset_1_booking" hidden="" aria-hidden="true" ${this.params.reqType === 1 ? 'checked' : ''}>
              <ul hidden="" aria-hidden="true">
                <li><label for="tabset_1_notification">Уведомление</label></li>
                <li><label for="tabset_1_booking">Бронирование</label></li>
              </ul>
              <div>
                <section>
                  <form name="notification" id="notification" class="form" autocomplete="off"> 
                    <h3 class="title">общая информация о клиенте</h3>
                    <div class="info__client"> 
                      <div class="field"> 
                        <input class="field__input" name="lastName" type="text" id="lastName" autocomplete="off" 
                        value="${this.params.dealId ? `${this.params.contact.LAST_NAME ? this.params.contact.LAST_NAME : ''}` : ''}" aria-labelledby="placeholder-feild">
                        <label class="field__placeholder" for="lastName" id="placeholder-feild"> 
                          <div class="field__text">Фамилия</div>
                        </label>
                      </div>                              
                      <div class="field"> 
                        <input class="field__input" name="name" type="text" id="name" autocomplete="off" 
                        value="${this.params.dealId ? `${this.params.contact.NAME ? this.params.contact.NAME : ''}` : ''}" aria-labelledby="placeholder-feild">
                        <label class="field__placeholder" for="name" id="placeholder-feild"> 
                          <div class="field__text">Имя</div>
                        </label>
                      </div>      
                      <div class="field"> 
                        <input class="field__input" name="secondName" type="text" id="secondName" autocomplete="off" 
                        value="${this.params.dealId ? `${this.params.contact.SECOND_NAME ? this.params.contact.SECOND_NAME : ''}` : ''}" aria-labelledby="placeholder-feild">
                        <label class="field__placeholder" for="secondName" id="placeholder-feild"> 
                          <div class="field__text">Отчество</div>
                        </label>
                      </div>    
                      <div class="field"> 
                        <input class="field__input" name="clientPhone" type="text" id="clientPhone" autocomplete="off" 
                        value="${this.getPhoneNumber()}" aria-labelledby="placeholder-feild">
                        <label class="field__placeholder" for="clientPhone" id="placeholder-feild"> 
                          <div class="field__text">Номер телефона</div>
                        </label>
                      </div>                                                
                    </div>
                    <h3 class="title">Объект<span data-button="add" class="title__add">добавить жх</span></h3>
                    <div class="info__object">
                      <div class="field"> 
                        <input data-complex="0" class="search__input search__complex" type="search" name="complex" value="" placeholder="Выберете ЖК">  
                        <div class="search__field items-complex isVisible"></div>  
                      </div> 
                      <div class="field"> 
                        <input disabled data-developer="0" class="search__input search__dev" type="search" name="developer" value="" placeholder="Застройщик"> 
                      </div> 
                      <div class="field"> 
                       <input data-manager="0" class="field__input manager" name="manager0" type="text" id="manager0" autocomplete="off" 
                        value="" aria-labelledby="placeholder-feild">
                        <label class="field__placeholder" for="manager0" id="placeholder-feild"> 
                          <div class="field__text">Менеджер застройщика</div>
                        </label>
                      </div> 
                    </div>
                    <div class="button__wrap"> 
                      <button data-type="0" class="form__button" type="submit">Отправить уведомление</button>
                    </div>
                  </form>
                </section>
                <section>
                  <form name="booking" id="booking" class="form" autocomplete="off"> 
                    <h3 class="title">общая информация о клиенте</h3>
                    <div class="info__client"> 
                      <div class="field"> 
                        <input class="field__input" name="lastName" type="text" id="lastName" autocomplete="off" 
                        value="${this.params.dealId ? `${this.params.contact.LAST_NAME ? this.params.contact.LAST_NAME : ''}` : ''}" aria-labelledby="placeholder-feild">
                        <label class="field__placeholder" for="lastName" id="placeholder-feild"> 
                          <div class="field__text">Фамилия</div>
                        </label>
                      </div>                              
                      <div class="field"> 
                        <input class="field__input" name="name" type="text" id="name" autocomplete="off" 
                        value="${this.params.dealId ? `${this.params.contact.NAME ? this.params.contact.NAME : ''}` : ''}" aria-labelledby="placeholder-feild">
                        <label class="field__placeholder" for="name" id="placeholder-feild"> 
                          <div class="field__text">Имя</div>
                        </label>
                      </div>                              
                      <div class="field"> 
                        <input class="field__input" name="secondName" type="text" id="secondName" autocomplete="off" 
                        value="${this.params.dealId ? `${this.params.contact.SECOND_NAME ? this.params.contact.SECOND_NAME : ''}` : ''}" aria-labelledby="placeholder-feild">
                        <label class="field__placeholder" for="secondName" id="placeholder-feild"> 
                          <div class="field__text">Отчество</div>
                        </label>
                      </div>                              
                      <div class="field"> 
                        <input class="field__input" name="clientPhone" type="text" id="clientPhone" autocomplete="off" 
                        value="${this.getPhoneNumber()}" aria-labelledby="placeholder-feild">
                        <label class="field__placeholder" for="clientPhone" id="placeholder-feild"> 
                          <div class="field__text">Номер телефона</div>
                        </label>
                      </div>
                      <div class="field"> 
                        <input class="field__input" name="price" type="text" id="price" autocomplete="off" 
                        value="" aria-labelledby="placeholder-feild">
                        <label class="field__placeholder" for="price" id="placeholder-feild"> 
                          <div class="field__text">Цена</div>
                        </label>
                      </div>   
                      <div class="field"> 
                        <div class="input__wrap"> 
                          <input class="search__input priceType" name="priceType" type="search" autocomplete="off" 
                          value="" placeholder="Выберите тип оплаты" readonly>
                        </div>
                        <div class="search__field priceType-block isVisible"> 
                          <p data-price="type" class="search__item">Наличные</p>
                          <p data-price="type" class="search__item">Ипотека</p>
                          <p data-price="type" class="search__item">Прочее</p>
                        </div>
                      </div>   
                    </div>
                    <h3 class="title">объект<span data-button="add" class="title__add">добавить жх</span></h3>
                    <div class="info__object">
                      <div class="field"> 
                        <input data-complex="0" class="search__input search__complex" type="search" name="complex" value="" placeholder="Выберете ЖК">  
                        <div class="search__field items-complex isVisible"></div>  
                      </div> 
                      <div class="field"> 
                        <input disabled data-developer="0" class="search__input search__dev" type="search" name="developer" value="" placeholder="Застройщик"> 
                      </div> 
                      <div class="field"> 
                       <input data-manager="0" class="field__input manager" name="manager0" type="text" id="manager0" autocomplete="off" 
                        value="" aria-labelledby="placeholder-feild">
                        <label class="field__placeholder" for="manager0" id="placeholder-feild"> 
                          <div class="field__text">Менеджер застройщика</div>
                        </label>
                      </div> 
                    </div>
                    <h3 class="title">данные для бронирования</h3>
                    <div class="info__passport"> 
                      <div class="info__passport-wrap">
                        <h4 class="info__passport-text">Паспорт</h4>
                        <div class="field"> 
                          <input class="field__input" name="passSeries" type="text" id="passSeries" autocomplete="off" value="" aria-labelledby="placeholder-feild">
                          <label class="field__placeholder" for="passSeries" id="placeholder-feild"> 
                            <div class="field__text">Серия</div>
                          </label>
                        </div>
                        <div class="field"> 
                          <input class="field__input" name="passNumber" type="text" id="passNumber" autocomplete="off" value="" aria-labelledby="placeholder-feild">
                          <label class="field__placeholder" for="passNumber" id="placeholder-feild"> 
                            <div class="field__text">Номер</div>
                          </label>
                        </div>
                      </div>
                      <div class="info__passport-wrap">
                        <h4 class="info__passport-text">Данные о квартире</h4>
                        <div class="field"> 
                          <input class="field__input" name="floor" type="text" id="floor" autocomplete="off" value="" aria-labelledby="placeholder-feild">
                          <label class="field__placeholder" for="floor" id="placeholder-feild"> 
                            <div class="field__text">Этаж</div>
                          </label>
                        </div>
                        <div class="field"> 
                          <input class="field__input" name="numberAppartment" type="text" id="numberAppartment" autocomplete="off" value="" aria-labelledby="placeholder-feild">
                          <label class="field__placeholder" for="numberAppartment" id="placeholder-feild"> 
                            <div class="field__text">Номер квартиры</div>
                          </label>
                        </div>
                        <div class="field"> 
                          <input class="field__input" name="area" type="text" id="area" autocomplete="off" value="" aria-labelledby="placeholder-feild">
                          <label class="field__placeholder" for="area" id="placeholder-feild"> 
                            <div class="field__text">Площадь квартиры</div>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div class="upload__wrap">                    
                      <div data-container="passport" class="file"> 
                        <input name="passport" class="file__input" id="file_passport" type="file" multiple>
                        <label class="file__label" for="file_passport"></label>
                        <span class="file__text">Загрузите копию паспорта клиента</span>
                      </div>
                      <div class="file__container container__passport"></div>                          
                    </div> 
                    <div class="button__wrap"> 
                      <button data-type="1" class="form__button" type="submit">Забронировать</button>
                    </div>
                  </form>
                </section>             
              </div>
            </div>`
  }
}

class Handler{
  constructor(complexes, container, params) {
    this.container = container;
    // this.developers = developers;
    this.complexes = complexes;
    // this.filtredDeveloper = [];
    this.filtredComplex = [];
    this.searchCount = 1;
    this.fileBooking = [];
    this.booking = {};
    this.params = params;
  }
  init(){
    this.handler();
    this.handlerFormValue();
    this.setFiltredComplex( `search__complex`,'items-complex');
    this.correctNumberPhone();
    this.handlerFile();
    this.handlerForm();
    this.handlerPrice();
  }
  handler(){
    this.container.addEventListener('click', event =>{
      if (event.target.dataset.button === 'add'){
        this.addFieldObject();
        this.handlerFormValue();
      } else if (event.target.dataset.action === 'file-delete'){
        const find = this.fileBooking.find(item => item.UID === event.target.dataset.file);
        const indexFind = this.fileBooking.indexOf(find);
        this.fileBooking.splice(indexFind, 1);
        document.querySelector(`.file${event.target.dataset.file}`).remove();
      } else if (event.target.dataset.complain === 'open'){
        this.openComplain();
        this.handlerComplain();
        this.handlerFormValue();
      }
    })
  }
  openComplain(){
    document.querySelector('HTML').setAttribute("style", "overflow-y:hidden;");

    const currentY = window.pageYOffset;
    document.body.insertAdjacentHTML('beforeend',
              `<div style="top: ${currentY}"  class="module"> 
                    <div class="module__window"> 
                      <div class="field"> 
                        <input class="field__input" name="newComplex" type="text" id="newComplex" autocomplete="off" 
                        value="" aria-labelledby="placeholder-feild">
                        <label class="field__placeholder" for="newComplex" id="placeholder-feild"> 
                          <div class="field__text">Введите имя ЖК</div>
                        </label>
                      </div> 
                      <div class="field"> 
                        <input class="field__input" name="newDeveloper" type="text" id="newDeveloper" autocomplete="off" 
                        value="" aria-labelledby="placeholder-feild">
                        <label class="field__placeholder" for="newDeveloper" id="placeholder-feild"> 
                          <div class="field__text">Введите застройщика</div>
                        </label>
                      </div> 
                      <textarea cols="30" rows="10" placeholder="Введите комментарий"></textarea>
                      <div class="module__buttons"> 
                        <span data-module="close" class="module__btn module__btn-cancel">Отменить</span> 
                        <span data-module="send" class="module__btn">Отправить</span> 
                      </div>
                    </div>
                  </div>`)

  }
  handlerComplain(){
    const module = document.querySelector('.module');
    module.addEventListener('click', event => {
      if (event.target.classList.contains('module')){
        module.remove();
      } else if (event.target.dataset.module === 'close'){
        module.remove();
      } else if (event.target.dataset.module === 'send'){
        const residential = module.querySelector(`INPUT[name='newComplex']`);
        if (residential.value.length === 0) {
          residential.classList.add('inValid');
        } else {
          this.sendFormToServer(data => {
            module.remove();
            console.log(data)
          }, {
            applicant: loginID ? loginID : this.params.currentUserId,
            residential: module.querySelector(`INPUT[name='newComplex']`).value,
            developer: module.querySelector(`INPUT[name='newDeveloper']`).value,
            comment: module.querySelector(`TEXTAREA`).value,
          }, 'https://crm.centralnoe.ru/dealincom/connector/devError.php')
        }
      }
    })

  }
  handlerPrice(){
    const allPriceType = document.querySelectorAll(`INPUT[name='priceType']`);
    const allPriceTypeBlock = document.querySelectorAll(`.priceType-block`);
    allPriceType.forEach(input => {
      input.addEventListener('click', () => {
        allPriceTypeBlock.forEach(block => {
          block.classList.remove('isVisible');
        })
      })
    })
    allPriceTypeBlock.forEach(block => {
      block.addEventListener('click', event => {
        if (event.target.dataset.price === 'type'){
          allPriceType.forEach(input => {
            input.value = event.target.innerHTML;
          })
        }
      })
    })
  }

  correctNumberPhone(){
    const numberPhoneField = document.querySelectorAll(`INPUT[name="clientPhone"]`);
    const regExp = new RegExp(/^89/, 'i');
    for (let input of numberPhoneField){
      input.addEventListener('focus', event => {
        if (event.target.value.length === 0 || !regExp.test(event.target.value)) {
          for (let input of numberPhoneField) {
            event.target.value = 89;
            input.setAttribute("value", '89');
          }
        }
      })
    }
    for (let input of numberPhoneField){
      input.addEventListener('keyup', event => {
        for (let input of numberPhoneField){
          if (!regExp.test(event.target.value)){
            event.target.value = 89;
            input.setAttribute("value", '89');
          } else {
            event.target.value = event.target.value.replace(/[^\d]$/g, '');
            event.target.value = event.target.value.slice(0, 11);
          }
        }
      })
    }
  }

  setFiltredComplex(searchComplex, complexList){
    const search = this.container.querySelectorAll(`.${searchComplex}`);
    const containerComplex = this.container.querySelectorAll(`.${complexList}`);
    for (let input of search){
      input.addEventListener('focus', event => {
        if (input.value.length === 0){
          for (let container of containerComplex) {
            container.innerHTML = '';
            for (let complex of this.complexes) {
              container.classList.remove('isVisible');
              container.insertAdjacentHTML('beforeend',
                `<p 
                      data-complex="${complex.resdName} ${complex.address}" 
                      data-dev="${complex.developer}" 
                      class="search__item">${complex.resdName}
                      <span> Адрес: ${complex.address}</span>
                    </p>`)
            }
          }
        }
      })
    }
    for(let input of search){
      input.addEventListener('blur', () => {
        if (!this.complexes.find(complex => complex.resdName === input.value)){
          for(let input of search) {
            input.value = '';
            document.querySelector(`INPUT[data-developer='${input.dataset.complex}']`).value = '';
          }
        }
      })
    }

    for (let input of search){
      input.addEventListener('keyup', event => {
        const regexp = new RegExp(event.target.value, 'i');
        this.filtredComplex = this.complexes.filter(complex => regexp.test(complex.resdName));
        for (let container of containerComplex){
          container.innerHTML = '';
          container.classList.remove('isVisible');
          for (let complex of this.filtredComplex){
            container.insertAdjacentHTML('beforeend',
              `<p 
                      data-complex="${complex.resdName} ${complex.address}" 
                      data-dev="${complex.developer}" 
                      class="search__item">${complex.resdName}
                      <span> Адрес: ${complex.address}</span>
                    </p>`)
          }
        }
        if(regexp.test('')){
          for (let list of document.querySelectorAll(`.${complexList}`)){
            list.innerHTML = '';
          }
          for (let input of document.querySelectorAll(`.${searchComplex}`)){
            input.value = '';
          }
          for (let input of search){
            input.value = '';
          }
        }
      })
    }
    for (let container of containerComplex){
      container.addEventListener('click', event => {
        if(event.target.dataset.complex){
          for (let input of search){
            input.value = event.target.dataset.complex;
            for (let inputDev of document.querySelectorAll(`INPUT[data-developer='${input.dataset.complex}']`)){
              inputDev.value = event.target.dataset.dev;
            }
            for (let container of containerComplex){
              container.classList.add('isVisible');
            }
          }
        }
      })
    }
  }
  // setFiltredComplex(developerName, searchComplex, container){
  //   const searchComplexInputs = document.querySelectorAll(`.${searchComplex}`);
  //   const containerComplex = document.querySelectorAll(`.${container}`);
  //   const regexp = new RegExp(developerName, 'i');
  //   this.filtredComplex = this.complexes.filter(dev => regexp.test(dev.developer));
  //
  //   for (let container of containerComplex){
  //     container.innerHTML = '';
  //     for (let complex of this.filtredComplex){
  //       container.insertAdjacentHTML('beforeend', `<p data-complexName="${complex.complexName}" class="search__item">${complex.complexName}</p>`)
  //     }
  //     for (let input of searchComplexInputs){
  //       input.value = '';
  //     }
  //   }
  //   for (let input of searchComplexInputs){
  //     if (input.value.length === 0) {
  //       input.addEventListener('focus', () => {
  //         for (let container of containerComplex) {
  //           container.classList.remove('isVisible');
  //         }
  //       })
  //     }
  //   }
  //
  //   for(let input of searchComplexInputs){
  //     input.addEventListener('blur', () => {
  //       if (!this.complexes.find(complex => complex.complexName === input.value)){
  //         for(let input of searchComplexInputs) {
  //           input.value = '';
  //         }
  //       }
  //     })
  //   }
  //
  //   for (let container of containerComplex){
  //     container.addEventListener('click', event => {
  //       for (let input of searchComplexInputs){
  //         input.value = event.target.dataset.complexname;
  //         for (let container of containerComplex){
  //           container.classList.add('isVisible');
  //         }
  //       }
  //     })
  //   }
  // }

  handlerFile(){
    const container = document.querySelectorAll('.file');

    container.forEach((e, i) => {
      e.addEventListener("dragenter", dragenter, false);
    });

    container.forEach((e, i) => {
      e.addEventListener("dragover", dragover, false);
    });

    container.forEach((e, i) => {
      e.addEventListener("dragleave", dragleave, false);
    });

    container.forEach((e, i) => {
      e.addEventListener("drop", drop, false);
    });

    for (let item of document.querySelectorAll('.file__input')){
      item.addEventListener('change', event => {
        event.target.parentElement.style.background = "#E5E5E5";
        const files = event.target.files;
        this.getFilePlace(files, event.target.name);
      })
    }
    function dragenter(e){
      e.stopPropagation();
      e.preventDefault();
      if (e.target.classList.contains('file')) {
        e.target.style.background = "#E5E5E5";
      }
    }
    function dragover(e) {
      e.stopPropagation();
      e.preventDefault();
      if (e.target.classList.contains('file')) {
        e.target.style.background = "#E5E5E5";
      }
    }
    function dragleave(e) {
      e.stopPropagation();
      e.preventDefault();
      if (e.target.classList.contains('file')) {
        e.target.style.background = "";
      }
    }
    function drop(e) {
      e.stopPropagation();
      e.preventDefault();
      let files = e.dataTransfer.files;
      this.getFilePlace(files, e.target.dataset.container);
    }
  }
  getFilePlace(files, container){
    let data = new FormData();

    for (let item of files){
      data.append('photo[]', item)
    }

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://hs-01.centralnoe.ru/Project-Selket-Main/Servers/MediaExchange/UploaderNew.php", true)
    xhr.responseType = 'json';
    xhr.send(data)
    xhr.onload = () => {
      this.fileBooking = this.fileBooking.concat(xhr.response);
      this.renderFile(xhr.response, container)
    }

  }
  renderFile(data, container){
    for (let file of data) {
      const fileName = `<div class="file__item file${file.UID}">
                        <p class="file__files"><span>${file.name}</span></p>
                        <div class="file__icon">
                          <a class="file__svg file__svg-download" href="${file.URI}"
                              download="${file.name}"></a>
                          <span class="file__svg file__svg-delete" data-file="${file.UID}" data-action="file-delete"></span>
                        </div>
                      </div>`;
      const dropBox = document.querySelector(`.container__${container}`);
      dropBox.insertAdjacentHTML('beforeend', fileName);
    }
  }

  addFieldObject(){
    const fieldObject = document.querySelectorAll('.info__object');
    for (let field of fieldObject){
      field.insertAdjacentHTML('beforeend', `
                      <div class="field"> 
                        <input data-complex="${this.searchCount}" class="search__input search__complex${this.searchCount}" type="search" name="complex" value="" placeholder="Выберете ЖК">  
                        <div class="search__field items-complex${this.searchCount} isVisible"></div>  
                      </div>
                      <div class="field"> 
                        <input disabled data-developer="${this.searchCount}" class="search__input search__dev${this.searchCount}" type="search" name="developer" value="" placeholder="Застройщик">  
                      </div> 
                      <div class="field"> 
                       <input data-manager="${this.searchCount}" class="field__input manager" name="manager${this.searchCount}" type="text" id="manager${this.searchCount}" autocomplete="off" 
                        value="" aria-labelledby="placeholder-feild">
                        <label class="field__placeholder" for="manager${this.searchCount}" id="placeholder-feild"> 
                          <div class="field__text">Менеджер застройщика</div>
                        </label>
                      </div>`)
    }
    this.setFiltredComplex(`search__complex${this.searchCount}`,`items-complex${this.searchCount}`);
    this.searchCount++;
  }

  handlerForm(){
    for (let form of document.querySelectorAll('.form')){
      form.addEventListener('submit', event => {
        event.preventDefault();
        const allInputs = form.querySelectorAll(`INPUT:not([type='file'])`);
        if (this.isValidForm(allInputs, event.target.id)){
          this.setLoader();
          this.setValue(allInputs, event.target.id);
          console.log(this.booking)
          // this.sendFormToServer(data => {
          //   this.removeLoader();
          //   if (data.result) {
          //     alert('Успешно отправлено');
          //     location.reload();
          //   } else {
          //     alert('Ошибка,попробуйте снова');
          //   }
          // }, this.booking, 'https://hs-01.centralnoe.ru/Project-Selket-Main/Servers/Object/NewbuildBooking.php')
        }
      })
    }
  }
  handlerFormValue(){
    const allInputs = document.querySelectorAll('INPUT[type=text]');
    for (let item of allInputs){
      item.addEventListener("keyup", () => {
        for (let input of allInputs){
          if (input.name === item.name){
            input.setAttribute("value", item.value);
          }
        }
      })
    }
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

  isValidForm(allInputs, formName){
    const library = {
      lastName: true,
      name: true,
      secondName: true,
      clientPhone: true,
      developer: true,
      complex: true,
      passSeries: true,
      passNumber: true,
      floor: true,
      numberAppartment: true,
      area: true,
      file: true,
      price: true,
      priceType: true,
      manager: true,
    }
    const regexp = {
      lastName: /\.*/,
      name: /\.*/,
      secondName: /\.*/,
      clientPhone: /^\d{11}$/,
      developer: /\.*/,
      complex: /\.*/,
      passSeries:  /\.*/,
      passNumber: /\.*/,
      floor: /^\d{1,2}$/,
      numberAppartment: /^\d{1,6}$/,
      area: /^\d*\.?\d*?$/,
      price: /\.*/,
      priceType: /\.*/,
      manager: /\.*/,
    }
    for (let input of allInputs){
      if (input.name !== 'secondName' && input.name !== 'floor' && input.name !== 'numberAppartment' && input.name !== 'area'){
        if (input.value.length === 0 && !input.classList.contains('manager')){
          library[input.name] = false;
          input.classList.add('inValid');
        } else if (input.classList.contains('manager')){
          if (formName !== 'notification'){
            if (!regexp.manager.test(input.value)) {
              library[input.name] = false;
              input.classList.add('inValid');
            } else if (input.value.length === 0){
              library[input.name] = false;
              input.classList.add('inValid');
            }
          }
        } else if (!regexp[input.name].test(input.value)){
          library[input.name] = false;
          input.classList.add('inValid');
        } else {
          library[input.name] = true;
          input.classList.remove('inValid');
        }
      } else {
        if (input.value.length > 0){
          if (!regexp[input.name].test(input.value)){
            library[input.name] = false;
            input.classList.add('inValid');
          } else {
            library[input.name] = true;
            input.classList.remove('inValid');
          }
        } else {
          library[input.name] = true;
          input.classList.remove('inValid');
        }
      }
    }

    if (formName === 'booking'){
      if (this.fileBooking.length > 0){
        library.file = true;
        document.querySelector('.file').classList.remove('inValid');
      } else {
        library.file = false;
        document.querySelector('.file').classList.add('inValid');
      }
    } else {
      library.file = true;
      document.querySelector('.file').classList.remove('inValid');
    }

    let countTrue = 0;
    for (let key in library){
      if (library[key] === true){
        countTrue++;
      }
    }

    return countTrue === Object.keys(library).length;
  }
  setValue(allInputs, type){
    this.booking = {};
    this.booking.list = [];
    for (let input of allInputs){
      if (input.name !== 'developer' && input.name !== 'complex' && !input.classList.contains('manager')){
        this.booking[input.name] = input.value;
      } if (input.name === 'developer') {
        this.booking.list.push({
          developer: input.value,
          complex: document.querySelector(`INPUT[data-complex="${input.dataset.developer}"]`).value,
          manager: document.querySelector(`INPUT[data-manager="${input.dataset.developer}"]`).value,
        })
      }
    }
    this.booking.type = type;
    this.booking.applicant = loginID ? loginID : this.params.currentUserId;
    this.booking.file = this.fileBooking;
    this.booking.deal = `${this.params.dealId ? this.params.dealId : 0}`

    console.log(this.booking)
  }
  sendFormToServer(callback, obj, API){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", API, true);
    xhr.responseType = 'json';
    xhr.send(JSON.stringify(obj));

    xhr.onload = () => {
      callback(xhr.response);
    };
  }
}


const booking = new Booking();
booking.getComplex(data => {
  booking.complexes = data;
  booking.init();
});

document.body.addEventListener('click', event => {
  if (!event.target.classList.contains('search__input')){
    const devContainer = document.querySelectorAll('.search__field');
    for (let container of devContainer){
      container.classList.add('isVisible');
    }
  }
})










