(function() {

    function leadHTML({ _id, name, funnelStep, lastActivity }) {
        const state = activity => {
          if (activity === 'пропущенный') return 'пропущенный 📵'
          if (activity === 'продажа') return 'продажа 💵'
          if (activity === 'входящий звонок') return 'входящий звонок 📞'
          if (activity === 'прогресс в воронке') return 'прогресс в воронке 🎉'
          return activity
        }

        const url = step => {
          if (step === 'cold') return '/leads/cold/'
          if (step === 'in-progress') return '/customers/'
          if (step === 'reject' || step === 'deal') return '/closed/'
          return '/customers/'          
        }

        return `
          <div class="row lead">
              <div class="col callbackButton" customer="${ _id }"></div>
              <div class="col">
                  <a class="name" href="${ url(funnelStep) }${ _id }">${ name }</a>
                  <div class="row info wbrdr">${ state(lastActivity) }</div>
              </div>
              <a href="${ url(funnelStep) }${ _id }" class="col saveButton"></a>
          </div>   
        `
    }

    fetch(Config.API_HOST + "/customers/recents?token=" + getCookie('msid'))
        .then(response => response.json())
        .then(checkResponse)
        .then(({ items }) => {
            if (!items) return false

            customersList.classList.remove('preloader');
            customersList.classList.add('list__content');

            customersList.innerHTML = items.length > 0 ?
                items.map(leadHTML).join('') :
                `<div class="emptyList">
                    <p>Пусто. Ждём активности по клиентам 🙄</p>
                </div>`

            registerCallbacks();                   
        })
        .catch(error => console.error('Error:', error.message));
})();