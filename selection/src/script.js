class Selection {
  constructor(objects) {
    this.objectsList = objects;
    this.sortObjectsList = {};
    this.header = document.querySelector('.header');
    this.selection = document.querySelector('.selection');
    this.cardsSelected = document.querySelector('.cards-select');
    this.cardsRemoved = document.querySelector('.cards-remove');
  }
  init(){
    if (this.objectsList.length > 0){
      this.sortObject();
      this.renderHeader();
      this.renderObjects();
      this.handler();
    }
  }
  sortObject(){
    this.objectsList.reverse();
    for (let object of this.objectsList){
      if (object.status === 'active'){
        if (this.sortObjectsList[object.datecreate.split(' ')[0]]){
          this.sortObjectsList[object.datecreate.split(' ')[0]].push(object);
        } else {
          this.sortObjectsList[object.datecreate.split(' ')[0]] = [];
          this.sortObjectsList[object.datecreate.split(' ')[0]].push(object);
        }
      } else if (object.status === 'unactive'){
        if (this.sortObjectsList.removeCard){
          this.sortObjectsList.removeCard.push(object);
        } else {
          this.sortObjectsList.removeCard = [];
          this.sortObjectsList.removeCard.push(object);
        }
      }
    }
  }

  renderHeader(){
    this.header.insertAdjacentHTML('beforeend',
      `<div class="wrapper"></div>
            <div class="wrapper header__buttons"> 
              <span data-link="copy" class="btn btn_link"></span>
              <span class="btn btn_contract"></span>
              <span class="btn btn_history"></span>
            </div>`)
  }
  renderObjects(){
    for (let key in this.sortObjectsList){
      if (key === 'removeCard'){
        for (let card of this.sortObjectsList[key]){
          this.cardsRemoved.insertAdjacentHTML('beforeend', new ObjectCard(key ,card).render());
        }
      } else {
          this.cardsSelected.insertAdjacentHTML('beforeend',
            `<div class="cards-select_wrap">
                    <span data-number="${key}" data-accordion="open" class="accordion wrapper">от ${key}</span>
                    <div data-number="${key}" class="cards-sort">
                        ${this.renderSelectCard(key, this.sortObjectsList[key])}
                    </div>
                  </div>`);
      }
    }
  }
  renderSelectCard(key, objectSelectedList){
    let allSelectedCards = '';
    for (let card of objectSelectedList){
      allSelectedCards += new ObjectCard(key, card).render();
    }
    return allSelectedCards
  }

  handler(){
    this.selection.addEventListener('click', event => {
      if (event.target.dataset.comment){
        this.setComment(event.target);
      } else if (event.target.dataset.link === 'copy'){
        this.copyLink();
      } else if (event.target.dataset.accordion){
        this.toggleShowBlockCards(event);
      } else if (event.target.dataset.card === 'move'){
        this.movingCard(event.target.dataset.key, event.target.dataset.id);
      }
    })
  }

  /** обработчики кнопок **/
  copyLink(){
    navigator.clipboard.writeText(document.location.href).then(() => {
      alert('Ссылка на подборку скопирована');
    }).catch(err => {
      console.log('Ошибка', err)
    })
  }
  setComment(btn){
    const textArea = document.querySelector(`TEXTAREA[data-area="${btn.dataset.id}"]`);
    btn.classList.toggle('btn_save');
    textArea.toggleAttribute('disabled')
    if (btn.dataset.comment === 'edit'){
      textArea.focus();
      btn.dataset.comment = 'save'
    } else if (btn.dataset.comment === 'save'){
      btn.dataset.comment = 'edit';
      server.request({
        action: 'setComment',
        offer_id: btn.dataset.id,
        comment: textArea.value,
      })
      let find = this.objectsList.find(item => item.member === btn.dataset.id);
      find ? find.comment = textArea.value : '';
    }
  }
  toggleShowBlockCards(event){
    event.target.classList.toggle('accordion_active');
    const accordionBody = document.querySelector(`DIV[data-number="${event.target.dataset.number}"]`);
    if (event.target.dataset.accordion === 'open'){
      accordionBody.classList.add('accordion-body_close');
      setTimeout(() => {
        accordionBody.classList.add('inVisible');
        accordionBody.classList.remove('accordion-body_close');
      }, 300);
      event.target.dataset.accordion = 'close';
    } else if (event.target.dataset.accordion === 'close'){
      accordionBody.classList.remove('inVisible');
      accordionBody.classList.add('accordion-body_open');
      setTimeout(() => {
        accordionBody.classList.remove('accordion-body_open');
      }, 300);
      event.target.dataset.accordion = 'open';
    }
  }
  movingCard(key, id){
    const find = this.sortObjectsList[key].find(card => card.member === id);
    const index = this.sortObjectsList[key].indexOf(find);

    find.status = find.status === 'active' ? 'unactive' : 'active';
    key === 'removeCard' && `${find.createdate = new Date().toISOString().split('T').join(' ')}`;

    const newKey = key !== 'removeCard' ? 'removeCard' : find.createdate.split(' ')[0];

    if (this.sortObjectsList[newKey]){
      this.sortObjectsList[newKey].push(find);
    } else {
      this.sortObjectsList[newKey] = [];
      this.sortObjectsList[newKey].push(find);
    }

    this.sortObjectsList[key].splice(index, 1);
    document.querySelector(`DIV[data-card="${id}"]`).remove();

    if (newKey === 'removeCard'){
      this.cardsRemoved.insertAdjacentHTML('beforeend', new ObjectCard(newKey ,find).render());
    } else {
      const container = document.querySelector(`DIV[data-number="${newKey}"]`);
      if (container){
        container.insertAdjacentHTML('beforeend', new ObjectCard(newKey ,find).render());
      } else {
        this.cardsSelected.insertAdjacentHTML('afterbegin',
          `<div class="cards-select_wrap">
                    <span data-number="${newKey}" data-accordion="open" class="accordion wrapper">от ${newKey}</span>
                    <div data-number="${newKey}" class="cards-sort">
                        ${new ObjectCard(newKey, find).render()}
                    </div>
                  </div>`);
      }
    }
    server.request({
      action: find.status === 'active' ? 'makeActive' : 'makeUnactive',
      offer_id: find.member
    });
  }
}

class ObjectCard{
  constructor(key, card) {
    this.key = key;
    this.card = card;
  }
  render(){
    return `<div class="card" data-card="${this.card.member}"> 
              <div class="wrapper card__about"> 
                <img class="card__img" src="${this.card.photo}" alt="photo">
                <div> 
                  <span class="card__address">${this.card.address}</span>
                  <spam class="card__price">${this.card.price} тыс. руб.</spam>
                </div>
              </div>
              <div class="wrapper wrapper_comment"> 
                <textarea data-area="${this.card.member}" rows="10" class="card__comment" disabled>${this.card.comment}</textarea>
              </div>            
              <div class="wrapper card__buttons"> 
                <span class="btn ${this.card.likes ? 'btn_like' : 'btn_dislike'} ${this.card.status === 'active' ? '' : 'inVisible'}"></span>
                <span data-comment="edit" data-id="${this.card.member}" class="btn btn_edit ${this.card.status === 'active' ? '' : 'inVisible'}"></span>
                <span data-key="${this.key}" data-id="${this.card.member}" data-card="move" class="btn btn_remove ${this.card.status === 'active' ? '' : 'inVisible'}"></span>
                <span data-key="${this.key}" data-id="${this.card.member}" data-card="move" class="btn btn_return ${this.card.status === 'active' ? 'inVisible' : ''}"></span>
              </div>
            </div>`
  }
}

class Server {
  constructor() {
    this.API = 'https://crm.centralnoe.ru/dealincom/selections/selectionUOI.php';
  }
  async request(requestNamed){
    const myHeaders = {
      "Content-Type": "application/json; charset=utf-8"
    };
    const requestOptions = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: "include",
      headers: myHeaders,
      body: JSON.stringify(requestNamed)
    };

    let response = await fetch(this.API, requestOptions);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }
    return await response.json();
  }
}

const server = new Server();
server.request({
  action: 'getForDeal',
  deal: 31471,
}).then(data => {
  console.log(data)
  new Selection(data).init();
});