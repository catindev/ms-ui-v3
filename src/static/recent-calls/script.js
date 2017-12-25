(function () {

    function customerHTML({ _id, missing, date, customer: { id, name }, isCallback, owner }) {
        const status = missing === true ?
            `<span class="recentCall--missed">${date}</span>` :
            `<span class="recentCall">${date}</span>`

        const container = owner === 'you' ? 'a' : 'div'

        return `
          <div class="row lead">
              <div class="col callbackButton" customer="${id}"></div>
              <div class="col wbrdr">
                    <${container} class="name ${missing === true && 'recentCall--missed'}" 
                                href="/customers/${id}">
                                ${name}
                    </${container}>
                    <div class="row info">${ status}</div>
                    ${ owner !== 'you' ? `<div class="row info">менеджер — ${owner}</div>` : ''}
              </div>
              <div class="col ${isCallback === true ? 'outcomingIcon' : 'incomingIcon'}"></div>
          </div>   
        `
    }

    // fetch(Config.API_HOST + "/recent.calls?token=" + getCookie('msid'))
    fetch("http://localhost:5002/recent.calls?token=" + getCookie('msid'))
        .then(response => response.json())
        .then(checkResponse)
        .then(({ items }) => {
            if (!items) return false

            leadsList.classList.remove('preloader');
            leadsList.classList.add('list__content');

            leadsList.innerHTML = items.length > 0 ?
                items.map(customerHTML).join('') :
                `<div class="emptyList">
                    <p>Звонков нет. Сюда попадут контакты звонивших вам клиентов.</p>
                </div>`

            registerCallbacks();
        })
        .catch(error => console.error('Error:', error.message));
})();