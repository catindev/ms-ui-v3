(function() {

    function template({ _id, name, phones, account: { targetQuestion } }) {
        return `
          <h1 class="mobilePadding">${ name }</h1>
          <h2 class="mobilePadding">${ phones.join(',') }</h2>
          
          <div class="card">
            <div class="data">
              <h3>${ targetQuestion }</h3>
              <div class="">
                  <a href="/customer/${ _id }/edit" class="button button--primary">Да</a> 
                  <a href="/customer/${ _id }/reject" class="button">Нет</a>              
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
            Profile.innerHTML = template(customer)
        })
        .catch(error => console.error('Error:', error.message));
})();