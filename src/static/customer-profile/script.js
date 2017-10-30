(function() {

    function template(customer) {
        const { _id, name, trunk, user, phones, params } = customer;
        const manager = user && user.name ? `
          <div class="label">Менеджер</div>
          <div class="data">${ user.name }</div>
        ` : '';

        function customs(params) {
            return (params.map(({ name, id }) => customer[id] ?
                `<div class="label">${ name }</div>
                <div class="data">${ customer[id] }</div>` :
                '')).join('')
        }

        return `
            <h1 class="mobilePadding">
            <a href="/customers" class="backButton"></a>
            ${ name }
            </h1>
            <h2 class="mobilePadding">${ phones.join('') }</h2>

            <div class="card">
                <div class="label">Источник</div>
                <div class="data">${ trunk.name }</div>
                ${ manager }
                ${ customs(params) }
            </div>

            <div class="optionsPanel onlyMobile">
                <a class="optionsButton" href="/customers/${ _id }/edit">
                    Изменить профиль 📝
                </a>
                <a class="optionsButton" href="/customers/${ _id }/deal">
                    Закрыть сделку 💸
                </a>                  
                <a class="optionsButton" href="/customers/${ _id }/reject">
                    Оформить отказ 🚯
                </a>
            </div> 

            <div class="sidebar onlyDesktop">
                <a class="sidebar__link sidebar__link--active" href="/customers/${ _id }">Профиль 🗿</a>
                <div class="sidebar__divider"></div>
                <a class="sidebar__link" href="/customers/${ _id }/edit">
                    Изменить профиль 📝
                </a>
                <a class="sidebar__link" href="/customers/${ _id }/deal">
                    Закрыть сделку 💸
                </a>            
                <a class="sidebar__link" href="/customers/${ _id }/reject">
                    Оформить отказ 🚯
                </a>
            </div>                      
        `
    }

    fetch(`${ Config.API_HOST }/customers/${ location.pathname.split('/')[2] }?token=${ getCookie('msid') }&params=1`)
        .then(response => response.json())
        .then(checkResponse)
        .then(({ customer }) => {
            Profile.classList.remove('preloader');
            Profile.innerHTML = template(customer) + createPlaylist(customer.calls)
            playerInit();
        })
        .catch(error => console.error('Error:', error.message));
})();