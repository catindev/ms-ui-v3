(function() {

    function template({ _id, name, trunk, phones, user, account: { targetQuestion } }) {
        const manager = user && user.name ? `
          <div class="label">Менеджер</div>
          <div class="data">${ user.name }</div>
        ` : '';

        return `
          <h1 class="mobilePadding">
            <a href="/leads/hot" class="backButton"></a>
            ${ name }
          </h1>
          <h2 class="mobilePadding">${ phones.join('') }</h2>
          
          <div class="card">
            <div class="label">Рекламный источник</div>
            <div class="data">${ trunk.name }</div>
            ${ manager }
          </div>

          <div class="card">
            <div class="data">
              <h3>${ targetQuestion }</h3>
              <div class="">
                  <a href="/leads/hot/${ _id }/edit" class="button button--primary">Да</a> 
                  <a href="/leads/hot/${ _id }/reject" class="button">Нет</a>              
              </div>           
            </div>
          </div>  
        `
    }

    fetch(`${ Config.API_HOST }/customers/${ location.pathname.split('/')[3] }?token=${ getCookie('msid') }`)
        .then(response => response.json())
        .then(checkResponse)
        .then(({ customer }) => {
            Profile.classList.remove('preloader');
            Profile.innerHTML = template(customer) + createPlaylist(customer.calls)
            playerInit();
        })
        .catch(error => console.error('Error:', error.message));
})();