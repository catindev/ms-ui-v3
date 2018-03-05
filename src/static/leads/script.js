(function () {

    var leadsList = document.getElementById('leadsList');

    function leadHTML({ _id, name, state, contacts }) {
        const status = state === 'WAIT_RECALL' ?
            `<span class="missed">Перезвонить</span>` :
            `<span class="success">Заполнить профиль</span>`

        const callbackButtonHTML = contacts.length > 1 ?
            `<a class="col callbackButton" href="/customers/${_id}/contacts"></a>`
            :
            `<div class="col callbackButton" onclick="callbackNow(this);" customer="${_id}"></div>`
            ;

        return `
          <div class="row lead">
              ${callbackButtonHTML}
              <div class="col">
                  <a class="name" href="/leads/hot/${ _id}">${name}</a>
                  <div class="row info">${ status}</div>
              </div>
              <a href="/leads/hot/${ _id}" class="col saveButton"></a>
          </div>   
        `
    }

    fetch(Config.API_HOST + "/customers/leads?token=" + getCookie('msid'))
        .then(response => response.json())
        .then(checkResponse)
        .then(({ items }) => {
            if (!items) return false

            leadsList.classList.remove('preloader');
            leadsList.classList.add('list__content');

            leadsList.innerHTML = items.length > 0 ?
                items.map(leadHTML).join('') :
                `<div class="emptyList">
                    <p>Клиентов нет. Сюда попадут новые клиенты,
                    которые позвонят на рекламные номера.</p>
                </div>`;
        })
        .catch(error => console.error('Error:', error.message));
})();