(function() {

    function formatCurrency(input, mode) {
      const splitted = `${input}`.split('.');
      const money = splitted[0].replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&thinsp;');
      const change = splitted[1];
      // return mode === 'comma' && change ? `${money},${change}` : money;
      return money
    }

    function templateReject({ name, reject: { reason, comment } }) {
        return `
          <div class="row lead">
              <div class="col">
                  <div class="name">${ name }</div>
                  <div class="row info wbrdr">
                    ${ reason === 'Другое' && comment ? comment : reason }
                  </div>
              </div>
          </div>   
        `
    }

    function templateDeal({ name, deal: { amount } }) {
        return `
          <div class="row lead">
              <div class="col">
                  <div class="name">${ name }</div>
                  <div class="row info wbrdr">
                    ${ formatCurrency(amount) }
                  </div>
              </div>
          </div>   
        `
    }    


    function deals(items) {
      return `
        <h1 class="pageTitle">Успешные сделки 💰</h1>
        ${ 
            items && items.length > 0? 
              (items.map(templateDeal)).join('') 
              :
              '<div class="emptyList">Список сделок пуст</div>' 
        }`
    }

    function rejects(items) {
      return `
        <h2>Отказы 😕</h3>
        ${ 
            items && items.length > 0? 
              (items.map(templateReject)).join('') 
              :
              '<div class="emptyList">Пока без отказов</div>' 
        }`
    }

    fetch(Config.API_HOST + "/customers/closed?token=" + getCookie('msid'))
        .then(response => response.json())
        .then(checkResponse)
        .then(({ reject, deal }) => {
            if (!reject || !deal) return false

            closedList.classList.remove('preloader');
            closedList.classList.add('list__content');

            closedList.innerHTML = deals(deal) + rejects(reject) 

                        
        })
        .catch(error => console.error('Error:', error.message));
})();