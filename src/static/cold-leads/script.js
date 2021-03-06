(function () {

    function leadHTML({ _id, name, info, contacts }) {
        const callbackButtonHTML = contacts.length > 1 ?
            `<a class="col callbackButton" href="/customers/${_id}/contacts"></a>`
            :
            `<div class="col callbackButton" onclick="coldbackNow(this);" customer="${_id}"></div>`
            ;

        return `
          <div class="row lead">
            ${callbackButtonHTML}
            <div class="col">
                <a class="name" href="/leads/cold/${ _id}">${name}</a>
                <div class="row info wbrdr">
                <span>${ info}</span>
                </div>
            </div>
            <a href="/leads/cold/${ _id}" class="col saveButton"></a>
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
                items.map(leadHTML).join('')
                : `<div class="emptyList">
                    <p>Список пуст. Добавьте сюда клиентов, которых вы нашли самостоятельно.</p>
                </div>`

            // registerCallbacks();
        })
        .catch(error => console.error('Error:', error.message));
})();