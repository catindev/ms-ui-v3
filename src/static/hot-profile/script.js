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
    // beta fix: разрешаем заполнять без менеджера
    const theQuestion =
      `<div class="card">
        <div class="data">
          <h3>${ targetQuestion}</h3>
          <div class="">
              <a href="/leads/hot/${ _id}/edit" class="button button--primary">Да</a> 
              <a href="/leads/hot/${ _id}/reject" class="button">Нет</a>              
          </div>           
        </div>
      </div>`;

    const needReject = (!user && isEnoughCalls(calls)) ?
      `<div class="card">
        <div class="data">
          <h3>Клиент не отвечает?</h3>
          <div class="">
              <a href="/leads/hot/${ _id}/reject" class="button">
                Отправить в отказы 🔫
              </a>              
          </div>           
        </div>
      </div>` : '';

    return `
          <h1 class="mobilePadding">
            <a href="/leads/hot" class="backButton"></a>
            ${ name}
          </h1>
          <h2 class="mobilePadding">${ phones.join('')}</h2>
          
          <div class="card">
            <div class="label">Рекламный источник</div>
            <div class="data">${ trunk.name}</div>
          </div>

          ${theQuestion}  
        `
  }

  fetch(`${Config.API_HOST}/customers/${location.pathname.split('/')[3]}?token=${getCookie('msid')}`)
    .then(response => response.json())
    .then(checkResponse)
    .then(({ customer }) => {
      Profile.classList.remove('preloader');
      Profile.innerHTML = template(customer) + createPlaylist(customer.calls)
      playerInit();
    })
    .catch(error => console.error('Error:', error.message));
})();