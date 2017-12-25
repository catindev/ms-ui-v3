(function () {

    function customerHTML({ _id, missed, date, customer: { id, name }, isCallback, owner }) {
        const status = missed === true ?
            `<span class="recentCall--missed">${date}</span>` :
            `<span class="recentCall">${date}</span>`

        const container = owner === 'you' ? 'a' : 'div'

        return `
          <div class="row lead">
              <div class="col callbackButton" customer="${id}"></div>
              <div class="col wbrdr">
                    <${container} class="name ${missed === true && 'recentCall--missed'}" 
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

    const fake = [
        {
            "_id": "5a40edacca6e854b301215be",
            "date": "Сегодня, 26 декабря 10:03",
            "customer": {
                "id": "5a409ca590f4b36a4624e11b",
                "name": "Замечательный тапир"
            },
            "missed": false,
            "isCallback": true,
            "owner": "you"
        },

        {
            "_id": "5a40edacca6e854b301215be",
            "date": "Сегодня, 26 декабря 09:23",
            "customer": {
                "id": "5a409ca590f4b36a4624e11b",
                "name": "Утончённый ягуар"
            },
            "missed": false,
            "isCallback": false,
            "owner": "Иван"
        },

        {
            "_id": "5a40edacca6e854b301215be",
            "date": "Сегодня, 26 декабря 08:45",
            "customer": {
                "id": "5a409ca590f4b36a4624e11b",
                "name": "Чудная акула"
            },
            "missed": true,
            "isCallback": false,
            "owner": "you"
        }
    ]

    fetch(Config.API_HOST + "/recent.calls?token=" + getCookie('msid'))
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