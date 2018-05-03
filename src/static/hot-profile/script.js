(function () {

  function isEnoughCalls(calls) {
    if (!calls || calls.length === 0) return false;

    // const callsWithRecord = calls.filter(({ record }) => record);
    // if (callsWithRecord.length > 0) return true;

    const callbacks = calls.filter(({ isCallback }) => isCallback === true);
    if (callbacks.length >= 3) return true;

    return false;
  }

  function template({ _id, name, trunk, calls, phones, user, account: { targetQuestion } }) {

    // если user, то вопрос, иначе кнопка списать
    const theQuestion =
      `<div class="card">
        <div class="data">
          <h3>${targetQuestion}</h3>
          <div class="">
              <a href="/leads/hot/${_id}/edit" data-type="Yeap"
                 class="button button--primary js-checkOwner">Да</a> 
              <a href="/leads/hot/${_id}/reject" data-type="Nope"
                 class="button js-checkOwner">Нет</a>              
          </div>           
        </div>
      </div>`;

    const needReject =
      `<div class="card">  
          <div class="data" style="background:#FCF3AF">
          Чтобы заполнить и взять лида в работу нужно дозвониться до него чтобы уточнить данные для профиля
          </div>    
      </div>      
      <div class="card">
        <div class="data">
          <h3>Клиент не отвечает или есть другие проблемы?</h3>
          <div class="">
              <a href="/leads/hot/${_id}/reject" class="button">
                Заполнить причину и закрыть 🔫
              </a>              
          </div>           
        </div>
      </div>`;

    return `
          <h1 class="mobilePadding">
            <a href="/leads/hot" class="backButton"></a>
            ${name}
          </h1>
          <h2 class="mobilePadding">${trunk.name}</h2>
          ${ user ? theQuestion : needReject}
          <div class="label">Контакты</div>
          <div class="data">     
              <div id="ContactsListWidget" 
                  data-customer="${_id}" 
                  data-msid="${getCookie('msid')}"></div>                       
          </div>           
        `
  }

  function listenAndCheckBeforeEdit(calls) {
    const callbacks = calls.filter(({ isCallback }) => isCallback === true);
    const btns = document.querySelectorAll('.js-checkOwner');

    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function (e) {
        e.preventDefault();
        const target = e.target || e.srcElement,
          href = target.getAttribute('href'),
          type = target.dataset.type;

        if (type === 'Nope' && callbacks.length >= 3) return location.href = href;

        fetch(`${Config.API_HOST}/customers/${location.pathname.split('/')[3]}/isowner?token=${getCookie('msid')}`)
          .then(response => response.json())
          .then(checkResponse)
          .then(({ isOwner }) => {
            if (isOwner) location.href = href;
            else alert('Клиент назначен на другого менеджера')
          })
          .catch(error => {
            console.error('Error:', error.message)
            alert(error.message)
          });
      });
    }
  }

  fetch(`${Config.API_HOST}/customers/${location.pathname.split('/')[3]}?token=${getCookie('msid')}`)
    .then(response => response.json())
    .then(checkResponse)
    .then(({ customer }) => {
      Profile.classList.remove('preloader');

      // OLD: Profile.innerHTML = template(customer) + createPlaylist(customer.calls)
      Profile.innerHTML = template(customer) + drawStory(customer.breadcrumbs, location.pathname.split('/')[3])

      loadScript('/static/common/contactsWidget/script.js');
      playerInit();
      // listenAndCheckBeforeEdit(customer.calls);
    })
    .catch(error => console.error('Error:', error.message));
})();