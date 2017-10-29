(function() {

    function template({ _id, name, trunk, phones }) {
        return `
          <h1 class="mobilePadding">
            <a href="/leads/cold" class="backButton"></a>
            ${ name }
          </h1>
          <h2 class="mobilePadding">${ trunk.name }</h2>
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