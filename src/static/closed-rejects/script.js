(function () {

    function sideMenu() {
        return `
        <div class="sidebar onlyDesktop">
            <a class="sidebar__link" href="/closed">
                Сделки 💰
            </a> 
            <a class="sidebar__link sidebar__link--active" href="/rejects">
                Отказы 😕
            </a>         
        </div>    
        `
    }

    function formatCurrency(input, mode) {
        const splitted = `${input}`.split('.');
        const money = splitted[0].replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&thinsp;');
        const change = splitted[1];
        // return mode === 'comma' && change ? `${money},${change}` : money;
        return money
    }

    function templateReject({ name, reject: { reason, comment }, _id }) {
        return `
          <div class="row lead">
              <div class="col">
                  <a href="/closed/${ _id}" class="name">${name}</a>
                  <div class="row info wbrdr">
                    ${ reason === 'Другое' && comment ? comment : reason}
                  </div>
              </div>
          </div>   
        `
    }

    function templateDeal({ name, deal: { amount }, _id }) {
        return `
          <div class="row lead">
              <div class="col">
                  <a href="/closed/${ _id}" class="name">${name}</a>
                  <div class="row info wbrdr">
                    ${ formatCurrency(amount)}
                  </div>
              </div>
          </div>   
        `
    }


    function deals(items) {
        return `
        <h1 class="pageTitle">Успешные сделки</h1>
        ${
            items && items.length > 0 ?
                (items.map(templateDeal)).join('')
                :
                '<div class="emptyList">Список сделок пуст</div>'
            }`
    }

    function rejects(items) {
        return `
        ${sideMenu()}
        <h1>Отказы</h1>
        ${
            items && items.length > 0 ?
                (items.map(templateReject)).join('')
                :
                '<div class="emptyList">Пока без отказов</div>'
            }`
    }

    fetch(Config.API_HOST + "/customers/closed?filter=reject&token=" + getCookie('msid'))
        .then(response => response.json())
        .then(checkResponse)
        .then(({ reject, deal }) => {
            if (!reject || !deal) return false

            closedList.classList.remove('preloader');
            closedList.classList.add('list__content');

            closedList.innerHTML = rejects(reject)


        })
        .catch(error => console.error('Error:', error.message));
})();