(function() {

    function leadHTML({ _id, name, state }) {
        const status = state === 'WAIT_RECALL' ?
            `<span class="missed">Перезвонить</span>` :
            `<span class="success">Заполнить профиль</span>`

        return `
          <div class="row lead">
              <div class="col callbackButton" customer="${ _id }"></div>
              <div class="col">
                  <a class="name" href="/customer/${ _id }">${ name }</a>
                  <div class="row info">${ status }</div>
              </div>
              <a href="/customer/${ _id }" class="col saveButton"></a>
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
                `<div class="emptyList">Клиентов нет 🙈</div>`

            registerCallbacks();                   
        })
        .catch(error => console.error('Error:', error.message));
})();