(function() {

    function template(customer) {
        const { _id, name, trunk, user, phones, params } = customer;

        function customs(params) {
            return (params.map(({ name, id }) => customer[id] ?
                `<div class="label">${ name }</div>
                <div class="data">${ customer[id] }</div>` :
                '')).join('')
        }

        return `
            <h1 class="mobilePadding">
                <a href="/closed" class="backButton"></a>
                ${ name }
            </h1>
            <h2 class="mobilePadding">${ phones.join('') }</h2>

            <div class="card">
                ${ customs(params) }
            </div>                      
        `
    }

    fetch(`${ Config.API_HOST }/customers/${ location.pathname.split('/')[2] }?token=${ getCookie('msid') }&params=1`)
        .then(response => response.json())
        .then(checkResponse)
        .then(({ customer }) => {
            Profile.classList.remove('preloader');
            Profile.innerHTML = template(customer)
        })
        .catch(error => console.error('Error:', error.message));
})();