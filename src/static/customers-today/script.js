(function () {

  let funnel;

  function sideMenu(today) {
    return `
    <div class="sidebar onlyDesktop">
        <a class="sidebar__link ${today ? '' : 'sidebar__link--active'}" href="/customers">
            Все клиенты
        </a> 
        <a class="sidebar__link ${today ? 'sidebar__link--active' : ''}" href="/customers/today">
            На сегодня
        </a>         
    </div>    
    `
  }

  function customer({ name, task: { what = '', time = '', displayWhen = '' } = {}, _id, }, next) {
    return `
          <div class="row lead" id="${ _id}">
              <div class="col callbackButton" customer="${ _id}"></div>
              <div class="col">
                  <a class="name" href="/customers/${ _id}">
                    ${ name}
                  </a>
                  <div class="row info wbrdr">
                    <span>${what}</span><br>
                    <small>в ${displayWhen}</small>
                </div>
              </div>
              <a onclick="processCustomer(this)" class="col ${ next === false ? 'dealButton' : 'funnelDownButton'} " 
                   ${ next === false && `href=/customers/${_id}/deal`}
                   item-id="${ _id}"
                   to-step-id="${ next}"></a>
          </div>  
        `
  }


  function customers({ name, customers, id }, index) {
    const nextID = index !== funnel.length - 1 ?
      funnel[index + 1].id : false;

    const empty = !customers || customers.length === 0;

    return `
      ${sideMenu(true)}

      ${
      name === 'in-progress' ?
        `<h1 class="pageTitle">Звонок</h1>`
        :
        `<h2 class="funnelTitle">${name}</h2>`
      }
          
      <div id="${ id}" next-step-id="${nextID}"> 
        <div class="emptyList" ${ !empty && 'style="display:none;"'}>
          Нет клиентов
        </div>
        ${ empty ? '' : (customers.map(c => customer(c, nextID))).join('')}
      </div>`
  }

  fetch(`${Config.API_HOST}/customers/funnel?token=${getCookie('msid')}&today=true`)
    .then(response => response.json())
    .then(checkResponse)
    .then(({ items }) => {
      funnel = items;
      closedList.classList.remove('preloader');

      if (!items || items.length === 0) return closedList.innerHTML = `
        ${sideMenu(true)}
        <h1 class="pageTitle">В работе</h1>
        <div class="emptyList" style="color: #777;">
          Нет клиентов с задачами на сегодня. Переключитесь на всех клиентов и поставьте задачи в карточках
        </div>
      `

      closedList.innerHTML = (items.map(customers)).join('')
      registerCallbacks();
    })
    .catch(error => console.error('Error:', error.message));
})();