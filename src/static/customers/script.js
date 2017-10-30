(function() {

    let funnel;

    function getNextStepID(index) {
        return index !== funnel.length - 1 ? funnel[index + 1].id : false;
    }

    function customer({ name, info, _id,  }, index) {
        return `
          <div class="row lead" id="${ _id }">
              <div class="col callbackButton"></div>
              <div class="col">
                  <a class="name" href="/customer/${ _id }">
                    ${ name }
                  </a>
                  <div class="row info">
                    <span>${ info }</span>
                </div>
              </div>
              <a class="col ${ getNextStepID(index) === false? 'dealButton' : 'funnelDownButton' } " 
                   ${ getNextStepID(index) === false && 'href=/deal/' + _id }
                   item-id="${ _id }"
                   to-step-id="${ getNextStepID(index) }"></a>
          </div>  
        `
    }    


    function customers({ name, customers }) {
      return `
        ${ 
          name === 'in-progress'? 
            `<h1 class="pageTitle">В работе</h1>` 
            : 
            `<h2 class="funnelTitle">${name}</h2>` 
          }
        ${ 
            customers && customers.length > 0? 
              (customers.map(customer)).join('') 
              :
              '<div class="emptyList">Нет клиентов</div>' 
        }`
    }

    fetch(`${ Config.API_HOST }/customers/funnel?token=${ getCookie('msid') }`)
        .then(response => response.json())
        .then(checkResponse)
        .then(({ items }) => {
            funnel = items;
            closedList.classList.remove('preloader');

            if (!items || items.length === 0) return closedList.innerHTML = `
              <h1 class="pageTitle">В работе</h1>
              <div class="emptyList">Клиентов нет</div>
            `

            closedList.innerHTML = (items.map(customers)).join('')               
        })
        .catch(error => console.error('Error:', error.message));
})();