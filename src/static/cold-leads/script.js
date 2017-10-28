(function() {

    function leadHTML({ _id, name, info }) {
        return `
          <div class="row lead">
              <div class="col callbackButton" customer="${ _id }"></div>
              <div class="col">
                  <a class="name" href="/customer/${ _id }">${ name }</a>
                  <div class="row info wbrdr">
                    <span>${ info }</span>
                  </div>
              </div>
              <a href="/customer/${ _id }" class="col saveButton"></a>
          </div>   
        `
    }

    fetch(Config.API_HOST + "/customers/cold.leads?token=" + getCookie('msid'))
        .then(response => response.json())
        .then(checkResponse)
        .then(({ items }) => {
            if (!items) return false

            leadsList.classList.remove('preloader');
            leadsList.classList.add('list__content');

            leadsList.innerHTML = items.length > 0 ?
                items.map(leadHTML).join('') :
                `
                  <div class="emptyList">
                    Список пуст 🙈
                  </div>
                  <a href="/leads/cold/new" class="newButton">Добавить 🐣</a>
                `

            registerCallbacks();                   
        })
        .catch(error => console.error('Error:', error.message));
})();