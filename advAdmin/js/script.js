function getPlaceholder(img){
  img.src = 'https://crm.centralnoe.ru/dealincom/assets/img/placeholder.png'
}

class Api {
  constructor() {
    this.API = 'https://hs-01.centralnoe.ru/Project-Selket-Main/Servers/Legal/Server.php';
    this.realtor = 'https://crm.centralnoe.ru/dealincom/factory/Users.php';
  }
  async getJson(api, requestNamed){
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json; charset=utf-8");
    const raw = JSON.stringify(requestNamed);
    const requestOptions = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: "include",
      headers: myHeaders,
      body: raw
    };
    let response = await fetch(api, requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }

    return await response.json();
  }
}

let transformImage = {
  rotate: 0,
  height: 100,
  width: 100,
}
const placeholderPDF = 'https://crm.centralnoe.ru/advertisement/img/default/pdf.png';

class App {
  constructor(data) {
    this.items = data.data;
    this.reasons = data.reasons;
    this.serverTime = data.serverTime;
    this.container = document.querySelector('.main');
    this.currentItem = '';
    this.currentItemActive = '';
    this.slideActive = '';
    this.currentPhoto = '';
    this.currentPhotoType = true;
    this.deniedReason = [];
    this.openFile = false;
    this.docsFiles = [];
    this.photoFiles = [];
    this.timerUpdateItems = '';
    this.timerClock = '';
    this.quantityType = {
      first: 0,
      last: 0,
      adv: 0,
    }
    this.filter = [];
  }
  init(){
    this.setQuantityType(this.items);
    this.container.insertAdjacentHTML('beforeend', this.layout());
    this.currentItemActive = document.querySelector('.list__item');
    this.currentItemActive.classList.add('list__item_active');
    this.getItem(this.items[0].itemUID);
    this.handler();
    this.handlerKeyboard();
    this.setTimer();
  }
  setQuantityType(items){
    for (let item of items){
      if (item.reqType === 'sk'){
        if (item.modType === 'first'){
          this.quantityType.first++;
        } else if (item.modType === 'last'){
          this.quantityType.last++;
        }
      } else if (item.reqType === 'adv'){
        if (item.modType === 'first'){
          this.quantityType.adv++;
        } else if (item.modType === 'last'){
          this.quantityType.last++;
        }
      }
    }
  }
  subtractionQuantityType(){
    const findItem = this.items.find(item => item.reqNumber === this.currentItem.ad);
    if (findItem){
      if (findItem.reqType === 'sk'){
        if (findItem.modType === 'first'){
          this.quantityType.first--;
        } else if (findItem.modType === 'last'){
          this.quantityType.last--;
        }
      } else if (findItem.reqType === 'adv'){
        if (findItem.modType === 'first'){
          this.quantityType.adv--;
        } else if (findItem.modType === 'last'){
          this.quantityType.last--;
        }
      }
      this.renderQuantity();
    }
  }
  renderQuantity(){
    document.querySelector('.count_first').innerHTML = `${this.quantityType.first}`;
    document.querySelector('.count_last').innerHTML = `${this.quantityType.last}`;
    document.querySelector('.count_adv').innerHTML = `${this.quantityType.adv}`;
  }
  setTimer(){
    clearInterval(this.timerUpdateItems);
    clearInterval(this.timerClock);
    this.timerUpdateItems = setInterval(() => {
      this.getNewItems();
    }, 300000);
    let date = new Date();
    let deadline = new Date (date.setMinutes(date.getMinutes()+5));
    if (this.items && this.items.length > 0) {
      this.initializeClock(deadline);
    }
  }

  getList(itemsArr){

    let listLayout = '';
    for (let item of itemsArr){
      listLayout += `<div class="list__item id${item.itemUID} ${this.getTypeEng(item)}" data-item="${item.itemUID}"> 
                      <div class="list__status"> 
                        <span class="btn__status btn__status_question"></span>
                      </div>
                      <div class="list__text_wrap"> 
                        <span class="list__text list__req">${item.reqNumber}</span>
                        <span class="list__text list__location">${item.reqStreet} ${item.reqHouseNumber}</span>
                      </div>
                      <span class="list__text list__type">${this.getType(item)}</span>
                     </div>`
    }
    return listLayout;
  }
  getType(item){
    if (item.reqType === "sk" && item.modType === "first"){
      return 'СК'
    } else if (item.modType === "last"){
      return 'Осн.'
    } else if (item.reqType === "adv"){
      return 'РД'
    }
  }
  getTypeEng(item){
    if (item.reqType === 'sk' && item.modType === 'first'){
      return 'first'
    } else if (item.modType === 'last') {
      return 'last'
    } else {
      return 'adv'
    }
  }
  layout(){
    const list = this.getList(this.items);
    return `<div class="left-side">
            <div class="left-side__input"> 
              <input class="input input__search" type="search" placeholder="поиск">
              <div class="search__field inVisible"></div>
            </div> 
            <div class="list"> 
              ${list}
            </div>
            <div class="count"> 
              <label class="count__btn">
                <input class="count__checkbox" type="checkbox" checked data-type="first">
                <p class="count__item">СК<span class="count_first">${this.quantityType.first}</span></p>
              </label>
              <label class="count__btn">
                <input class="count__checkbox" type="checkbox" checked data-type="last">
                <p class="count__item">Осн.<span class="count_last">${this.quantityType.last}</span></p>
              </label>
              <label class="count__btn">
                <input class="count__checkbox" type="checkbox" checked data-type="adv">
                <p class="count__item">РД<span class="count_adv">${this.quantityType.adv}</span></p>
              </label>
            </div>
            </div>
            <div class="center-side"> 
            </div>
            <div class="footer"> 
            <div class="footer__update"> 
              <span data-list="update" class="button"><span class="module__right button_update"></span></span>
              <span class="minutes__text timer__text"></span> : 
              <span class="seconds__text timer__text"></span>
            </div>
            </div>`
  }

  renderItem(){
    const centerField = document.querySelector('.center-side');
    centerField.innerHTML = '';
    if (this.currentItem){
      centerField.insertAdjacentHTML('beforeend', this.centerLayout())
      this.checkSlider();
      this.setStartSlideSelect();
      this.setHeightForField();
      this.initMap();
    } else {
      centerField.insertAdjacentHTML('beforeend',`<p class="center-side__empty">Нет данных по объекту</p>`);
    }
  }
  initMap(){
    let cords = [];
    if (this.currentItem.object.lat && this.currentItem.object.lng) {
      cords.push(this.currentItem.object.lat);
      cords.push(this.currentItem.object.lng);
    } else {
      cords = ['55.030204', '82.920430'];
    }

    ymaps.ready(init);
    function init(){
      var myMap = new ymaps.Map("map", {
        center: cords,
        zoom: 15,
        controls: [],
      });
      var myGeoObject = new ymaps.GeoObject({
        geometry: {
          type: "Point", // тип геометрии - точка
          coordinates: cords, // координаты точки
        }
      });
      myMap.geoObjects.add(myGeoObject);
    }
  }
  setHeightForField(){
    const requestField = document.querySelector('.request__field');
    const messengerField = document.querySelector('.messenger__field');
    requestField.setAttribute('style', `height: ${requestField.offsetHeight}px;`);
    messengerField.setAttribute('style', `height: ${messengerField.offsetHeight}px;`);
  }
  sortFilesItem(){
    this.docsFiles = [];
    this.photoFiles = [];
    for (let file of this.currentItem.files){
      if (file.isDoc){
        this.docsFiles.push(file);
      } else {
        this.photoFiles.push(file);
      }
    }
  }
  getStatus(status){
    switch (status){
      case 'approved':
        return 'btn__status_approved'
      case 'denied':
        return 'btn__status_denied'
      case 'pending':
        return 'btn__status_question'
    }
  }
  getPhotoItem(files){
    if (files.length > 0){
      this.currentPhoto = files[0];
      this.currentPhotoType = this.currentPhoto.isDoc;
      let photos = {
        photoLayout: '',
        startPhoto: files[0].type === 'pdf' ? placeholderPDF : files[0].url,
        startStatus: this.getStatus(files[0].status),
      };
      for (let photo of files){
        photos.photoLayout += `<div data-photo_id="${photo.id}" class="slider__item slider__photo" style="background-image: url(${photo.type === 'pdf' ? placeholderPDF : this.checkURL(photo.url)})">
                                  <span class="btn__status ${this.getStatus(photo.status)} slider__status"></span>
                                  <span class="slider__reason">${photo.rejectionReason ? photo.rejectionReason : ''}</span>
                                  <span class="btn__status ${+photo.web === 1 ? 'btn__status_web' : ''}"></span>
                                </div>`
      }
      return photos;
    } else {
      return ''
    }
  }
  checkURL(url){
    const regExp = new RegExp(' ', 'i');
    if (regExp.test(url)){
      return url.replace(/ /g, '%20');
    } else {
      return url
    }
  }
  checkSlider(){
    const elms = document.querySelectorAll('.slider');
    for (let i = 0, len = elms.length; i < len; i++) {
      // инициализация elms[i] в качестве слайдера
      new ChiefSlider(elms[i], {
        loop: false,
      });
    }
  }
  getMessages(){
    if (this.currentItem.messages){
      if (this.currentItem.messages.length > 0){
        let messages = '';
        for (let message of this.currentItem.messages){
          messages += this.messageItem(message);
        }
        return messages;
      } else {
        return ''
      }
    } else {
      return '';
    }
  }
  messageItem(message){
    return `<span class="messenger__message message${message.UID}">${message.comment}
<!--              <i data-message="edit" data-id="${message.UID}" class="messenger__btn messenger__btn_edit"></i>-->
              <i data-message="delete" data-id="${message.UID}" class="messenger__btn messenger__btn_delete"></i>
            </span>`
  }
  sendMessage(){
    const messengerField = document.querySelector('.messenger__field');
    const message = document.querySelector('.messenger__textarea');
    if (message.value.length > 0 && message.value !== ' '){
      api.getJson(api.API, {
        action: 'newComment',
        reqNumber: this.currentItem.contractId,
        comment: message.value,
      }).then(data => {
        if (this.currentItem.messages === 'null' || this.currentItem.messages === null){
          this.currentItem.messages = [];
        }
        this.currentItem.messages.push(data);
        messengerField.insertAdjacentHTML('beforeend', this.messageItem(data));
        message.value = '';
      })
    }
  }
  deleteMessage(uid){
    api.getJson(api.API, {
      action: 'delComment',
      UID: uid,
    }).then(() => {
      const find = this.currentItem.messages.find(message => +message.UID === +uid);
      this.currentItem.messages.splice(this.currentItem.messages.indexOf(find), 1);
      document.querySelector(`.message${uid}`).remove();
    })
  }
  editMessage(uid){
    const find = this.currentItem.messages.find(message => +message.UID === +uid);
    const messengerTextarea = document.querySelector('.messenger__textarea');
    messengerTextarea.value = find.comment;
    document.querySelector('.messenger__send-btn').dataset.message = 'done';
    document.querySelector('.messenger__send-btn').setAttribute('data-id', `${find.UID}`);
  }
  sendEditMessage(uid){
    const messengerTextarea = document.querySelector('.messenger__textarea');
    if (messengerTextarea.value.length > 0 && messengerTextarea.value !== " "){
      api.getJson(api.API, {
        action: 'editComment',
        UID: uid,
        comment: messengerTextarea.value,
      }).then(() => {
        const find = this.currentItem.messages.find(message => +message.UID === +uid);
        find.comment = messengerTextarea.value;
        document.querySelector(`.message${uid}`).innerHTML = `${messengerTextarea.value}
                                                                    <i data-message="edit" data-id="${uid}" class="messenger__btn messenger__btn_edit"></i>
                                                                    <i data-message="delete" data-id="${uid}" class="messenger__btn messenger__btn_delete"></i>`;
        messengerTextarea.value = '';
        document.querySelector('.messenger__send-btn').dataset.message = 'send';
        document.querySelector('.messenger__send-btn').removeAttribute('data-id');
      })
    } else {
      messengerTextarea.value = '';
      document.querySelector('.messenger__send-btn').dataset.message = 'send';
      document.querySelector('.messenger__send-btn').removeAttribute('data-id');
    }
  }
  // getDocFiles(){
  //   let files = '';
  //   if (this.docsFiles.length > 0 && this.currentItem.type.reqType === 'adv'){
  //     for (let file of this.docsFiles){
  //       files += `<img data-open="file" data-fileid="${file.id}" class="photo__img-file" src="${file.type === 'pdf' ? 'img/pdf.png' : file.url}">`
  //     }
  //   }
  //   return files;
  // }
  centerLayout(){
    const photo = this.getPhotoItem(this.currentItem.type.modType === 'first' ? this.docsFiles : this.photoFiles);
    const message = this.getMessages();
    return `<div class="center-side__header">
              <div class="${this.currentPhotoType ? 'inVisible' : ''}">    
                <button data-action="approved" data-control="application" class="button button_approved">подтвердить</button>
                <button data-action="denied" data-control="application" class="button button_denied">вернуть</button>
              </div>
              <span class="card__title">
                ${this.currentItem.object.city ? `г. ${this.currentItem.object.city}` : ''} 
                ${this.currentItem.object.street ? `ул.${this.currentItem.object.street}` : ''} 
                ${this.currentItem.object.houseNumber ? `д. ${this.currentItem.object.houseNumber}` : ''} 
                ${this.currentItem.objectRoom ? `кв. ${this.currentItem.objectRoom}` : ''} 
              </span>
              <div class="contact">
                  <img class="contact__img" src="${this.currentItem.author.PERSONAL_PHOTO ? this.currentItem.author.PERSONAL_PHOTO : 'img/placeholder-user.png'}" alt="">
                  <span class="contact__link text" data-open="person" data-id="${this.currentItem.author.ID}">
                      ${this.currentItem.author.NAME ? this.currentItem.author.NAME : ''} 
                      ${this.currentItem.author.LAST_NAME ? this.currentItem.author.LAST_NAME : ''}
                  </span>                               
              </div>
            </div>
            <div class="center-side__top"> 
              <div class="card">
                <div class="card__info"> 
                  <p class="card__info-text">Заявка: 
                    <span data-info="more" data-req="${this.currentItem.ad}" class="card__info-text_link">
                      от ${this.currentItem.created && this.currentItem.created.split(" ")[0].split('-').reverse().join('.')}
                      ${this.currentItem.created && this.currentItem.created.split(" ")[1].split('.')[0]}
                    </span>
                  </p>
                  <p class="card__info-text">Клиент:<span>${this.currentItem.clients[0] ?
      `${this.currentItem.clients[0].lastName ? this.currentItem.clients[0].lastName : ''}
                    ${this.currentItem.clients[0].name ? this.currentItem.clients[0].name : ''}
                    ${this.currentItem.clients[0].secondName ? this.currentItem.clients[0].secondName : ''}`
      : ''} </span>
                  </p>
                  <p class="card__info-text">Тип договора:<span>${this.currentItem.type.type ? this.currentItem.type.type : ''} </span></p>
                  <p class="card__info-text">Срок действия:<span>${this.currentItem.publishedAt.stop ?
      this.currentItem.publishedAt.stop.split(" ")[0].split('-').reverse().join('.') : ''} </span></p>
                  <p class="card__info-text">Тип объекста:<span>${this.currentItem.objectType ?
      `${this.currentItem.objectType.type ? this.currentItem.objectType.type : ''}
                    ${this.currentItem.objectType.rooms ? `(${this.currentItem.objectType.rooms}к.)` : ''}`
      : ''} </span></p>
                  <p class="card__info-text">Квартира:<span>${this.currentItem.objectRoom ? this.currentItem.objectRoom : ''} </span></p>
                  <p class="card__info-text">Доля объекта:<span>${this.currentItem.objectShare ? this.currentItem.objectShare : ''} </span></p>
                  <div class='card__additionally inVisible'> 
                    <div>
                    <p class="card__info-text">Заявка:
                      <span class="card__info-text_link" data-info="less">
                        от ${this.currentItem.created.split(" ")[0].split('-').reverse().join('.')}
                        ${this.currentItem.created.split(" ")[1].split('.')[0]}
                      </span>
                    </p>
                    <p class="card__info-text">Площадь общая:<span>${this.currentItem.object.totalArea ? this.currentItem.object.totalArea : ''}</span></p>
                    <p class="card__info-text">Площадь жилая:<span>${this.currentItem.object.livingArea ? this.currentItem.object.livingArea : ''}</span></p>
                    <p class="card__info-text">Площадь кухни:<span>${this.currentItem.object.kitchenArea ? this.currentItem.object.kitchenArea : ''}</span></p>
                    <p class="card__info-text">Площадь участка:<span>${this.currentItem.object.landArea ? this.currentItem.object.landArea : ''}</span></p>
                    <p class="card__info-text">Этаж:<span>
                    ${this.currentItem.object.reqFloor ? this.currentItem.object.reqFloor : '0'}${this.currentItem.object.reqFloors ? `/${this.currentItem.object.reqFloors}` : ''}
                    </span></p>
                    </div>
                    <div class="card__buttons"> 
                      <button data-open="card" data-req="${this.currentItem.ad}" class="button card__btn">открыть</button>
                      <button data-open="edit" data-req="${this.currentItem.ad}" class="button card__btn">редактировать</button>
                    </div>
                  </div>
                </div> 
                <div class="card__comment"> 
                  <span class="card__comment-title">Комментарий</span>
                  <textarea class="card__comment-field input" cols="30" rows="5">${this.currentItem.comment ? this.currentItem.comment : ''}</textarea>
                  <span data-comment="toggle" data-ok="${+this.currentItem.commentOk === 1 ? 'yes' : 'no'}"
                    class="btn__status comment__status ${+this.currentItem.commentOk === 1 ? 'btn__status_approved' : 'btn__status_denied'}" 
                    ${this.currentItem.type.modType === 'first' && this.currentItem.type.reqType === 'sk' ? 'disabled' : ''}>
                  </span>
                </div>
              </div>
              <div class="photo"> 
                <div class="photo__wrap"> 
                  <img data-open="photo" class="photo__img" src="${photo.startPhoto}" alt="нет фото" onerror="getPlaceholder(this)">
                  <span class="btn__status ${photo.startStatus} photo__status"></span>   
                </div>
              </div> 
              <div class="info">
                <div id="map"></div>
                <div class="request"> 
                  <span class="card__comment-title info__title">Поиск дублей</span>
                  <div class="request__buttons"> 
                    <button data-request="getHouseList" class="button request__btn">адрес</button>
                    <button data-request="getClientList" class="button request__btn">контакт</button>
                  </div>
                  <div class="request__field"> 
                  </div>
                </div>
                <div class="messenger"> 
                  <span class="card__comment-title info__title">Для заметок</span>
                  <div class="messenger__field"> 
                    ${message}
                  </div>
                  <div class="messenger__send"> 
                    <textarea class="messenger__textarea"></textarea>
                    <span data-action="send" data-message="send" class="messenger__send-btn"></span>
                  </div>
                </div>
              </div>               
            </div>
            <div class="center-side__bottom"> 
              <div class="bottom"> 
                <div class="bottom__left"> 
                  <button class="button button__center inVisible" data-get="docs">док. ${this.docsFiles.length}</button>
                  <button class="button button__center inVisible" data-get="photos">фото ${this.photoFiles.length}</button>
                  
                  <div class="bottom__toggle item">
                    <input class="input__checkbox filter__input" name="filter" type="checkbox" id="new" value="новые">
                    <label class="bottom__btn button" for="new">новые</label>
                  </div>
                </div>
                <div class="bottom__center"> 
                  <div class="reason ${this.currentPhotoType ? 'inVisibility' : ''}"> 
                    <input data-input="reason" data-elem="check" data- class="input reason__input" type="text" readonly 
                    value="${this.currentPhoto.rejectionReason ? this.currentPhoto.rejectionReason : ''}">
                    <span data-elem="check" class="reason__arrow input__arrow"></span>
                    <div data-elem="check" class="reason__list inVisible"> 
                      <span data-reason="reason" data-elem="check" class="reason__item reason__item_empty">...</span>
                      <span data-reason="reason" data-elem="check" class="reason__item">Адрес объекта на фото</span>
                      <span data-reason="reason" data-elem="check" class="reason__item">Качество фотографии</span>
                      <span data-reason="reason" data-elem="check" class="reason__item">Лишние элементы</span>
                      <span data-reason="reason" data-elem="check" class="reason__item">Логотипы</span>
                      <span data-reason="reason" data-elem="check" class="reason__item">Люди на фото</span>
                      <span data-reason="reason" data-elem="check" class="reason__item">Плохая загрузка</span>
                      <span data-reason="reason" data-elem="check" class="reason__item">Повторная фотография</span>
                      <span data-reason="reason" data-elem="check" class="reason__item">Телевизор/логотипы</span>
                      <span data-reason="reason" data-elem="check" class="reason__item">Черновая/беловая</span>
                      <span data-reason="reason" data-elem="check" class="reason__item">Явные недостатки</span>
                    </div>
                  </div>
                  <div class="${this.currentPhotoType ? '' : 'inVisible'}"> 
                    <button data-action="approved" data-control="application" class="button button_approved">подтвердить</button>
                    <button data-action="denied" data-control="application" class="button button_denied">вернуть</button>
                   <!-- ${this.getStatusForReason(this.currentItem.type) === 'Первичная' ?
      `<button data-action="egrn" data-control="application" class="button button_approved">заказать ЕГРН</button>` : ''} -->
                  </div>
                  <div class="${this.currentPhotoType ? 'inVisible' : ''}"> 
                    <button data-action="approved" data-control="all" class="button button_approved">подтвердить все</button>
                    <button data-action="approved" data-control="one" class="button button_approved docs_hide">подтвердить</button>
                    <button data-action="denied" data-control="one" class="button button_denied docs_hide">вернуть</button>
                    <button data-action="denied" data-control="all" class="button button_denied">вернуть все</button>
                    <!-- ${this.getStatusForReason(this.currentItem.type) === 'Первичная' ?
      `<button  class="button button_approved">заказать ЕГРН</button>` : ''} -->
                  </div>
                </div>
                <!-- <div class="bottom__right"> 
                /**
                 this.getDocFiles()
                **/
                </div> -->
              </div>
              <div class="carousel"> 
                <div class="slider">
                  <div class="slider__container">
                      <div class="slider__wrapper">
                          <div class="slider__items">
                             ${photo.photoLayout}
                          </div>
                      </div>
                  </div>
                <!-- Кнопки для перехода к предыдущему и следующему слайду -->
                <a href="#" class="slider__control" data-slide="prev"></a>
                <a href="#" class="slider__control" data-slide="next"></a>
                </div>
              </div>
            </div>`
  }

  handler(){
    this.container.addEventListener('click', event => {
      if (event.target.dataset.item){
        this.toggleActive(event.target);
        this.getItem(event.target.dataset.item);
      } else if (event.target.dataset.get === 'photos'){
        if (this.photoFiles.length > 0){
          for (let elem of document.querySelectorAll('.docs_hide')){
            elem.classList.remove('inVisible');
          }
          document.querySelector('.reason').classList.remove('inVisibility');
          this.setSliderPhoto(this.photoFiles);
          this.setMainPhoto();
          this.setStartSlideSelect();
        }
      } else if (event.target.dataset.get === 'docs'){
        if (this.docsFiles.length > 0){
          for (let elem of document.querySelectorAll('.docs_hide')){
            elem.classList.add('inVisible');
          }
          document.querySelector('.reason').classList.add('inVisibility');
          this.setSliderPhoto(this.docsFiles);
          this.setMainPhoto();
          this.setStartSlideSelect();
        }
      } else if (event.target.dataset.photo_id){
        this.currentPhoto = this.currentItem.files.find(item => item.id === event.target.dataset.photo_id);
        this.setMainPhoto();
        this.setNewSlideSelect(event.target);
      } else if (event.target.dataset.open === 'photo'){
        transformImage.rotate = 0;
        transformImage.height = 100;
        transformImage.width = 100;
        this.openPhotoFullScreen(this.currentPhoto);
      } else if (event.target.dataset.open === 'file'){
        const find = this.currentItem.files.find(file => file.id === event.target.dataset.fileid);
        this.openFile = !this.openFile;
        transformImage.rotate = 0;
        transformImage.height = 100;
        transformImage.width = 100;
        this.openPhotoFullScreen(find);
      } else if(event.target.dataset.control){
        this.switchActionSetStatus(event.target.dataset.action, event.target.dataset.control);
      } else if (event.target.dataset.list === 'update'){
        this.getNewItems();
      } else if (event.target.dataset.input === 'reason'){
        const reasonList = document.querySelector('.reason__list');
        reasonList.setAttribute('style', `height: ${window.innerHeight - event.target.getBoundingClientRect().bottom - 50}px;`)
        reasonList.classList.remove('inVisible');
      } else if (event.target.dataset.reason === 'reason'){
        this.setNewReason(event.target);
      } else if (event.target.dataset.search){
        document.querySelector('.search__field').classList.add('inVisible');
        const findItem = document.querySelector(`.id${event.target.dataset.search}`)
        findItem.scrollIntoView({block: "start", behavior: "smooth"});
        this.toggleActive(findItem);
        this.getItem(event.target.dataset.search);
      } else if (event.target.dataset.comment === 'toggle'){
        this.commentToggle(event);
      } else if (event.target.dataset.request){
        this.getRequest(event.target.dataset.request);
      } else if (event.target.dataset.open === 'card'){
        this.openCard(event.target.dataset.req);
      } else if (event.target.dataset.open === 'edit') {
        this.openEdit(event.target.dataset.req);
      } else if (event.target.dataset.open === 'person'){
        let readyString = `/company/personal/user/${event.target.dataset.id}/`;
        BX.SidePanel.Instance.open(readyString, {animationDuration: 300,  width: 925, });
        return true;
      } else if (event.target.dataset.message === 'send'){
        this.sendMessage();
      } else if (event.target.dataset.message === 'delete'){
        this.deleteMessage(event.target.dataset.id);
      } else if (event.target.dataset.message === 'edit'){
        this.editMessage(event.target.dataset.id);
      } else if (event.target.dataset.message === 'done'){
        this.sendEditMessage(event.target.dataset.id);
      } else if (event.target.type === 'checkbox' && event.target.name === 'filter'){
        if (event.target.checked){
          this.showNewSliderItems();
        } else{
          this.showAllSliderItems();
        }
      } else if (event.target.dataset.info === 'more'){
        document.querySelector('.card__additionally').classList.remove('inVisible');
      } else if (event.target.dataset.info === 'less'){
        document.querySelector('.card__additionally').classList.add('inVisible');
      } else if(event.target.dataset.type){
        this.isShowTypeElem(event.target.checked, event.target.dataset.type);
      }
    })


    const inputSearch = document.querySelector('.input__search');
    inputSearch.addEventListener('keyup', () => {
      this.renderFindItem(inputSearch.value);
    })
    inputSearch.addEventListener('blur', () => {
      inputSearch.value = '';
    })

    document.body.addEventListener('click', event => {
      if (event.target.dataset.elem !== 'check'){
        const reasonList = document.querySelector('.reason__list');
        const searchField = document.querySelector('.search__field');
        if (reasonList){
          document.querySelector('.reason__list').classList.add('inVisible');
        }
        if (searchField){
          document.querySelector('.search__field').classList.add('inVisible');
        }
      }
    })
  }
  isShowTypeElem(checked, type){
    for (let item of document.querySelectorAll(`.${type}`)){
      item.classList[checked ? 'remove' : 'add']('inVisible');
    }
  }

  showAllSliderItems(){
    if (this.currentPhotoType){
      this.setSliderPhoto(this.docsFiles);
    } else {
      this.setSliderPhoto(this.photoFiles);
    }
    this.setMainPhoto();
    this.setStartSlideSelect();
    // const sliderPhotos = document.querySelectorAll('.slider__photo ');
    // for (let photo of sliderPhotos){
    //   if (photo.classList.contains('inVisible')){
    //     photo.classList.remove('inVisible');
    //   }
    // }
  }
  showNewSliderItems(){
    const pendingPhoto = [];
    for (let photo of this.currentPhotoType ? this.docsFiles : this.photoFiles){
      if (photo.status === 'pending'){
        pendingPhoto.push(photo);
      }
    }
    this.setSliderPhoto(pendingPhoto);
    this.setMainPhoto();
    this.setStartSlideSelect();
    // const sliderPhotos = document.querySelectorAll('.slider__photo ');
    // for (let photo of sliderPhotos){
    //   if (photo.querySelector('.btn__status_denied') || photo.querySelector('.btn__status_approved ')){
    //     photo.classList.add('inVisible');
    //   }
    // }
  }

  openCard(reqNumber){
    let readyString = "https://crm.centralnoe.ru/CDB/object/card/cardObject.php?source=1c&id="+reqNumber;
    BX.SidePanel.Instance.open(readyString, {animationDuration: 300,  width: 925, });
    return true;
  }
  openEdit(reqNumber){
    let readyString = `https://crm.centralnoe.ru/CDB/object/card/add/?login=yes&action=old&id=${reqNumber}&contact=&curdeal=`;
    BX.SidePanel.Instance.open(readyString, {animationDuration: 300,  width: 925, });
    return true;
  }

  renderFindItem(value){
    this.filter = [];
    const searchField = document.querySelector('.search__field');
    searchField.innerHTML = '';
    searchField.classList.remove('inVisible');
    const regExp = new RegExp(value, 'i');
    this.filter = this.items.filter(item => regExp.test(item.reqNumber) || regExp.test(item.reqStreet));
    if (this.filter.length > 0){
      for (let item of this.filter){
        searchField.insertAdjacentHTML('beforeend', this.getFindItem(item));
      }
    } else {
      searchField.insertAdjacentHTML('beforeend', `<p class="search__item">Нет совпадений</p>`);
    }
  }
  getFindItem(item){
    return `<div data-elem="check" data-search="${item.reqNumber}" class="search__item"> 
              <span data-elem="check">${item.reqNumber}</span>
              <span data-elem="check">${item.reqStreet} ${item.reqHouseNumber}</span>
            </div>`
  }

  commentToggle(event){
    if (event.target.dataset.ok === 'yes'){
      this.currentItem.commentOk = 0;
      event.target.dataset.ok = 'no';
      event.target.classList.remove('btn__status_approved');
      event.target.classList.add('btn__status_denied');
    } else if (event.target.dataset.ok === 'no'){
      this.currentItem.commentOk = 1;
      event.target.dataset.ok = 'yes';
      event.target.classList.remove('btn__status_denied');
      event.target.classList.add('btn__status_approved');
    }
  }

  getRequest(action){
    api.getJson(api.API, {
      action: action,
      reqNumber: this.currentItem.ad,
    }).then(data => {
      this.renderAnswer(data);
    })
  }
  renderAnswer(answers){
    const requestField = document.querySelector('.request__field');
    requestField.innerHTML = '';
    if (answers){
      for (let answer of answers){
        requestField.insertAdjacentHTML('beforeend',
          `<span data-open="card" data-req="${answer.reqNumber}" class="reason__item request__item">
                    ${answer.reqStreet} ${answer.reqHouseNumber}${answer.reqFlat ? `-${answer.reqFlat}` : ''} ${answer.reqNumber}
                </span>`)
      }
    } else {
      requestField.insertAdjacentHTML('beforeend', `<span class="reason__item request__item">нет</span>`);
    }
  }

  switchActionSetStatus(action, control){
    switch (control){
      case 'all':
        this.changeStatusAll(action);
        break
      case  'one':
        this.changeStatusOne(action);
        break
      case 'application':
        this.changeStatusApplication(action);
        break
    }
  }
  changeStatusAll(action){
    let changeArr = this.currentPhoto.isDoc ? this.docsFiles : this.photoFiles;
    let sliderStatusIcons = this.container.querySelectorAll('.slider__status');
    this.setStatus(this.container.querySelector('.photo__status'), action);
    for (let file of changeArr){
      file.status = action;
      if (action === 'approved'){
        file.rejectionReason = '';
      }
    }
    for (let icon of sliderStatusIcons){
      this.setStatus(icon, action);
    }
    if (action === 'denied' && this.currentPhotoType){
      this.openSelectReason();
    } else if (action === 'approved'){
      document.querySelector('.reason__input').value = '';
    }
  }
  changeStatusOne(action){
    this.currentPhoto.status = action;
    if (action === 'approved'){
      this.currentPhoto.rejectionReason = '';
      document.querySelector('.reason__input').value = '';
    }
    this.setStatus(this.slideActive.querySelector('span'), action);
    this.setStatus(this.container.querySelector('.photo__status'), action);
  }
  changeStatusApplication(action){
    if (this.currentItem){
      if (action === 'approved'){
        this.setStatusCurrentItem(action);
        this.sendItem('approved');
      } else if (action === 'denied'){
        this.openSelectReason();
      } else if (action === 'egrn'){
        this.deniedReason.push(300);
        this.setStatusCurrentItem('denied');
        this.sendItem('denied');
      }
    }
  }
  setStatusCurrentItem(status){
    const statusIcon = this.currentItemActive.querySelector('.btn__status ');
    statusIcon.classList.remove('btn__status_question');
    this.setStatus(statusIcon, status);
  }
  setNewReason(reason){
    document.querySelector('.reason__list').classList.add('inVisible');
    document.querySelector('.reason__input').value = reason.innerHTML;
    this.currentPhoto.rejectionReason = reason.innerHTML === '...' ? '' : reason.innerHTML;
  }
  getReason(type){
    let reasons = '';
    for (let reason of this.reasons){
      if (type === reason.modType){
        reasons += `<div class="module__reason-item">
                        <input name="${reason.UID}" type="checkbox" id="${reason.UID}">
                        <label for="${reason.UID}">${reason.message}</label>
                      </div>`
      }
    }
    return reasons;
  }
  getStatusForReason(type){
    if (type.reqType === 'sk'){
      if (type.modType === 'first'){
        return 'Первичная'
      } else if (type.modType === 'last'){
        return 'Основная'
      }
    } else if (type.reqType === 'adv'){
      if (type.modType === 'first'){
        return 'Рекламный'
      } else if (type.modType === 'last'){
        return 'Основная'
      }
    }
  }
  openSelectReason(){
    document.querySelector('HTML').setAttribute("style", "overflow-y:hidden;");
    const currentY = window.pageYOffset;
    const layout = `<div style="top: ${currentY}"  class="module">
                      <span data-name="close" class="module__close"></span>
                      <div class="module__wrap"> 
                        <p class="module__title">Причина</p>
                        <div class="module__reason"> 
                            ${this.getReason(this.getStatusForReason(this.currentItem.type))}                                                    
                        </div>
                        <textarea name="message" class="module__area messenger__textarea" cols="30" rows="10"></textarea>
                        <div> 
                          <button data-name="apply" class="button button_approved">применить</button>
                          <button data-name="close" class="button button_denied">отменить</button>
                        </div>
                      </div>
                  </div>`
    document.body.insertAdjacentHTML('beforebegin', layout);
    this.handlerModule();
  }

  openPhotoFullScreen(photo){
    if (photo){
      if (photo.type === 'jpg'){
        this.openJPG(photo);
      } else if (photo.type === 'pdf'){
        this.openPDF(photo);
      }
    }
  }
  openJPG(photo){
    document.querySelector('HTML').setAttribute("style", "overflow-y:hidden;");

    const currentY = window.pageYOffset;
    const layout = `<div style="top: ${currentY}"  class="module">
                      <span data-name="close" class="module__close"></span>
                      <img class="module__img" src="${photo.url}" alt="нет фото" onerror="getPlaceholder(this)"> 
                      <div class="module__controller"> 
                        <span data-rotate="left" class="module__btn module__left"></span>
                        <span data-rotate="right" class="module__btn module__right"></span>
                        <span data-scale="plus" class="module__btn module__zoom-plus"></span>
                        <span data-scale="minus" class="module__btn module__zoom-minus"></span>
                        <a href="${photo.url}" target="_blank" download class="module__btn module__download""></a>
                      </div>
                  </div>`
    document.body.insertAdjacentHTML('beforebegin', layout);
    this.handlerModule('photo');
  }
  openPDF(photo){
    document.querySelector('HTML').setAttribute("style", "overflow-y:hidden;");

    const currentY = window.pageYOffset;
    const layout = `<div style="top: ${currentY}"  class="module">
                      <span data-name="close" class="module__close"></span>
                      <div id="my_pdf_viewer"> 
                        <div id="canvas_container">
                            <canvas id="pdf_renderer"></canvas>
                        </div>
                        <div class="pdf_controls"> 
                          <div id="navigation_controls">
                            <button id="go_previous" class="module__btn module__prev"></button>
                            <input id="current_page" class="input" value="1" type="number"/>
                            <button id="go_next" class="module__btn module__next"></button>
                          </div>
                          <div id="zoom_controls">  
                            <button id="zoom_in" class="module__btn module__zoom-plus"></button>
                            <button id="zoom_out" class="module__btn module__zoom-minus"></button>
                          </div>
                        </div>
                      </div>
                  </div>`
    document.body.insertAdjacentHTML('beforebegin', layout);
    this.callPDFjs(photo);
    this.handlerModule();
  }
  callPDFjs(photo){
    const myState = {
      pdf: null,
      currentPage: 1,
      zoom: 1
    }
    // img/New_Horizons.pdf
    // ${this.currentPhoto.url}
    console.log(photo.url);
    pdfjsLib.getDocument(`${photo.url}`).then((pdf) => {
      console.log(pdf)
      myState.pdf = pdf;
      render();
    });
    function render() {
      myState.pdf.getPage(myState.currentPage).then((page) => {
        const canvas = document.getElementById("pdf_renderer");
        const ctx = canvas.getContext('2d');

        const viewport = page.getViewport(myState.zoom);
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        page.render({
          canvasContext: ctx,
          viewport: viewport
        })
      });
    }
    document.getElementById('go_previous')
      .addEventListener('click', () => {
        if(myState.pdf == null
          || myState.currentPage === 1) return;
        myState.currentPage -= 1;
        document.getElementById("current_page")
          .value = myState.currentPage;
        render();
      });

    document.getElementById('go_next')
      .addEventListener('click', () => {
        if(myState.pdf == null
          || myState.currentPage > myState.pdf
            ._pdfInfo.numPages)
          return;

        myState.currentPage += 1;
        document.getElementById("current_page")
          .value = myState.currentPage;
        render();
      });

    document.getElementById('current_page')
      .addEventListener('keypress', (e) => {
        if(myState.pdf == null) return;

        // Get key code
        var code = (e.keyCode ? e.keyCode : e.which);

        // If key code matches that of the Enter key
        if(code === 13) {
          var desiredPage =
            document.getElementById('current_page')
              .valueAsNumber;

          if(desiredPage >= 1
            && desiredPage <= myState.pdf
              ._pdfInfo.numPages) {
            myState.currentPage = desiredPage;
            document.getElementById("current_page")
              .value = desiredPage;
            render();
          }
        }
      });

    document.getElementById('zoom_in')
      .addEventListener('click', () => {
        if(myState.pdf === null) return;
        myState.zoom += 0.5;
        render();
      });

    document.getElementById('zoom_out')
      .addEventListener('click', () => {
        if(myState.pdf == null) return;
        myState.zoom -= 0.5;
        render();
      });
  }
  handlerModule(sourceLayout){
    const module = document.querySelector('.module');
    module.addEventListener('click', event => {
      if (event.target.dataset.name === 'close'){
        this.closeModule(module);
      } else if(event.target.dataset.rotate === 'left'){
        transformImage.rotate === 270 || transformImage.rotate === -270 ? transformImage.rotate = 0 : transformImage.rotate -= 90;
        document.querySelector('.module__img').setAttribute('style', `transform: rotate(${transformImage.rotate}deg); height: ${transformImage.height}%`)
      } else if(event.target.dataset.rotate === 'right'){
        transformImage.rotate === 270 || transformImage.rotate === -270 ? transformImage.rotate = 0 : transformImage.rotate += 90;
        document.querySelector('.module__img').setAttribute('style', `transform: rotate(${transformImage.rotate}deg); height: ${transformImage.height}%`)
      } else if (event.target.dataset.name === 'apply'){
        this.deniedReason = [];
        const selectReason = module.querySelectorAll('INPUT:checked');
        const area = document.querySelector('.module__area ');
        if (selectReason && selectReason.length > 0){
          for (let reason of selectReason){
            this.deniedReason.push(reason.id);
          }
          // area.value.length > 0 ? this.deniedReason.push(area.value) : '';
          this.setStatusCurrentItem('denied');
          this.sendItem('denied', area.value);
          this.closeModule(module);
        }
      } else if(event.target.dataset.scale === 'plus'){
        transformImage.height += 5;
        transformImage.width += 5;
        document.querySelector('.module__img').setAttribute('style', `transform: rotate(${transformImage.rotate}deg); height: ${transformImage.height}%; width: ${transformImage.width}%;`);
      } else if(event.target.dataset.scale === 'minus'){
        transformImage.height -= 5;
        transformImage.width -= 5;
        document.querySelector('.module__img').setAttribute('style', `transform: rotate(${transformImage.rotate}deg); height: ${transformImage.height}%; width: ${transformImage.width}%;`);
      }
    })
    sourceLayout === 'photo' && this.handlerMouse(module);
  }
  handlerMouse(module){
    let down = 0;
    let x = "";
    let y = "";
    module.addEventListener('mousedown', event => {
      event.preventDefault();
      down = 1;
      x = event.clientX;
      y = event.clientY;
    })
    module.addEventListener('mouseup', () => {
      event.preventDefault();
      down = 0;
      x = "";
      y = "";
    })
    module.addEventListener('mousemove', event => {
      if (down === 1){
        if (x && y){
          module.scrollBy(x - event.clientX, y - event.clientY);
        }
        x = event.clientX;
        y = event.clientY;
      }
    })
    module.addEventListener('wheel', event => {
      event.preventDefault();
      if (event.deltaY === -100){
        //up
        transformImage.height += 5;
        transformImage.width += 5;
        document.querySelector('.module__img').setAttribute('style', `transform: rotate(${transformImage.rotate}deg); height: ${transformImage.height}%; width: ${transformImage.width}%;`);
      } else if (event.deltaY === 100){
        //down
        transformImage.height -= 5;
        transformImage.width -= 5;
        document.querySelector('.module__img').setAttribute('style', `transform: rotate(${transformImage.rotate}deg); height: ${transformImage.height}%; width: ${transformImage.width}%;`);
      }
    })
  }
  closeModule(module){
    if (this.openFile){
      this.openFile = !this.openFile;
    }
    document.querySelector('HTML').removeAttribute("style");
    module.remove();
  }

  handlerKeyboard(){
    document.body.addEventListener('keyup', event => {
      if (event.code === 'ArrowRight'){
        if (!this.openFile){
          const nextElem = this.slideActive.nextElementSibling;
          if (nextElem && !nextElem.classList.contains('inVisible')){
            const nextArrow = document.querySelector(`.slider__control[data-slide='next']`);
            nextArrow.click();
            this.currentPhoto = this.currentItem.files.find(item => item.id === nextElem.dataset.photo_id);
            this.setMainPhoto();
            this.setNewSlideSelect(nextElem);
            const openPhoto = document.querySelector('.module__img');
            if (openPhoto){
              openPhoto.src = this.currentPhoto.url;
            }
          }
        }
      } else if (event.code === 'ArrowLeft'){
        if (!this.openFile){
          const prevElem = this.slideActive.previousElementSibling;
          if (prevElem && !prevElem.classList.contains('inVisible')){
            const prevArrow = document.querySelector(`.slider__control[data-slide='prev']`);
            prevArrow.click();
            this.currentPhoto = this.currentItem.files.find(item => item.id === prevElem.dataset.photo_id);
            this.setMainPhoto();
            this.setNewSlideSelect(prevElem);
            const openPhoto = document.querySelector('.module__img');
            if (openPhoto){
              openPhoto.src = this.currentPhoto.url;
            }
          }
        }
      } else if (event.code === 'Escape'){
        if (this.openFile){
          this.openFile = !this.openFile;
        }
        const module = document.querySelector('.module');
        if (module){
          this.closeModule(module);
        }
      }
    })
  }
  setSliderPhoto(files){
    const sliderContainer = document.querySelector('.slider__items');
    sliderContainer.innerHTML = '';
    const photos = this.getPhotoItem(files);
    sliderContainer.insertAdjacentHTML('beforeend', photos.photoLayout);
    this.checkSlider();
  }
  setMainPhoto(){
    document.querySelector('.photo__img').src = this.currentPhoto.type === 'pdf' ? placeholderPDF : this.currentPhoto.url;
    this.setStatus(document.querySelector('.photo__status'), this.currentPhoto.status);
    document.querySelector('.reason__input').value = this.currentPhoto.rejectionReason ? this.currentPhoto.rejectionReason : '';
  }
  setStatus(elem, status){
    elem.classList.remove('btn__status_approved');
    elem.classList.remove('btn__status_denied');
    elem.classList.remove('btn__status_pending');
    elem.classList.add(`${this.getStatus(status)}`);
  }
  setStartSlideSelect(){
    this.slideActive = document.querySelector('.slider__photo ');
    this.slideActive.classList.add('slider__select');
  }
  setNewSlideSelect(select){
    this.slideActive.classList.remove('slider__select');
    this.slideActive = select;
    this.slideActive.classList.add('slider__select');
  }
  toggleActive(newElem){
    this.currentItemActive.classList.remove('list__item_active');
    this.currentItemActive = newElem;
    this.currentItemActive.classList.add('list__item_active');
  }
  getItem(reqNumber){
    api.getJson(api.API, {
      action: 'getItem',
      reqNumber: reqNumber,
    }).then(item => {
      if(!Array.isArray(item)){
        this.currentItem = item;
        console.log('this is item')
        console.log(this.currentItem)
        api.getJson(api.realtor, {
          id: this.currentItem.author,
          adm: this.currentItem.author,
        }).then(realtor => {
          this.currentItem.author = realtor;
          this.sortFilesItem();
          this.renderItem();
          console.log(this.currentItem)
        })
      } else {
        this.currentItem = '';
        this.renderItem();
      }
    })
  }
  sendItem(status, comment){
    this.currentItem.comment = document.querySelector('.card__comment-field').value.replace(/\n/g, ` *EOL `);
    console.log(this.currentItem)
    api.getJson(api.API, {
      action: 'setItem',
      reqStatus: status,
      data: this.currentItem,
      reason: `${this.deniedReason.length > 0 ? this.deniedReason : ''}`,
      commentReason: comment
    }).then(() => {
      console.log('here')
      this.subtractionQuantityType();
      let nextItem = this.getNext(this.currentItemActive);
      if (nextItem){
        nextItem.scrollIntoView({block: "start", behavior: "smooth"})
        this.toggleActive(nextItem);
        this.getItem(nextItem.dataset.item);
      } else {
        const centerField = document.querySelector('.center-side');
        centerField.innerHTML = '';
        centerField.insertAdjacentHTML('beforeend',`<p class="center-side__empty">Обновите объекты</p>`);
      }
    })
  }
  getNext(elem){
    let next = elem;
    do {
      next = next.nextElementSibling;
    } while (next && next.classList.contains('inVisible'));
    return next;
  }
  getNewItems(){
    if (this.items && this.items.length > 0){
      document.querySelector('.button_update').classList.add('button_load');
    }
    api.getJson(api.API, {
      action: `${this.items && this.items.length > 0 ? 'getUpdates' : 'getList'}`,
      serverTime: this.serverTime,
    }).then(newData => {
      if(this.items && this.items.length > 0){
        this.serverTime = newData.serverTime;
        document.querySelector('.button_update').classList.remove('button_load');
        this.setTimer();
        if (+newData.items > 0){
          this.items.push(newData.data);
          this.setQuantityType(newData.data);
          document.querySelector('.list').insertAdjacentHTML('beforeend', this.getList(newData.data));
          this.renderQuantity();
        }
        console.log('this is update');
        console.log(newData);
      } else {
        clearInterval(this.timerUpdateItems);
        clearInterval(this.timerClock);
        document.querySelector('.center-side__empty').remove();
        app = new App(newData);
        app.init();
      }
    })
  }

  initializeClock(deadline){
    const minutesSpan = document.querySelector('.minutes__text');
    const secondsSpan = document.querySelector('.seconds__text');
    function updateClock(){
      let t = getTimeRemaining(deadline);
      minutesSpan.innerHTML = `${t.minutes < 10 ? `0${t.minutes}` : t.minutes}`;
      secondsSpan.innerHTML = `${t.seconds < 10 ? `0${t.seconds}` : t.seconds}`;
      if(t.total<=0){
        clearInterval(this.timerClock);
      }
    }
    // updateClock();

    this.timerClock = setInterval(updateClock,1000);

    function getTimeRemaining(deadline){
      let t = Date.parse(deadline) - Date.parse(new Date());
      let seconds = Math.floor( (t/1000) % 60 );
      let minutes = Math.floor( (t/1000/60) % 60 );

      return {
        'total': t,
        'minutes': minutes,
        'seconds': seconds,
      };
    }
  }
}

const api = new Api();
let app = '';
api.getJson(api.API, {
  action : "getList"
}).then(data => {
  console.log(data)
  if (data.items > 0){
    app = new App(data);
    app.init();
  } else {
    app = new App(data);
    app.setTimer();
    document.querySelector('.main').insertAdjacentHTML('beforebegin', `<p class="center-side__empty">Нет объектов</p>`)
  }
})