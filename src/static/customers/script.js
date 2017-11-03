(function() {

    let funnel;

    function customer({ name, info, _id,  }, next) {
        return `
          <div class="row lead" id="${ _id }">
              <div class="col callbackButton" customer="${ _id }"></div>
              <div class="col">
                  <a class="name" href="/customers/${ _id }">
                    ${ name }
                  </a>
                  <div class="row info wbrdr">
                    <span>${ info }</span>
                </div>
              </div>
              <a class="col ${ next === false? 'dealButton' : 'funnelDownButton' } " 
                   ${ next === false && `href=/customers/${_id}/deal` }
                   item-id="${ _id }"
                   to-step-id="${ next }"></a>
          </div>  
        `
    }    


    function customers({ name, customers }, index ) {
      const nextID = index !== funnel.length - 1? 
        funnel[index + 1].name : false;

      const empty = !customers || customers.length === 0;
      
      return `
          ${ 
            name === 'in-progress' ? 
              `<h1 class="pageTitle">В работе</h1>` 
              : 
              `<h2 class="funnelTitle">${name}</h2>` 
          }
          
          <div id="${ name }" next-step-id="${ nextID }"> 
            <div class="emptyList" ${ !empty && 'style="display:none;"' }>
              Нет клиентов
            </div>
            ${ empty ? '' : (customers.map(c => customer(c, nextID) )).join('') }
          </div>`
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
            registerFunnelButtons();  
            registerCallbacks();             
        })
        .catch(error => console.error('Error:', error.message));
})();