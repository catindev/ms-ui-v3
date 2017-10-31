(function() {

    function template({ _id, name, trunk, user, phones }) {
        const manager = user && user.name ? `
          <div class="label">Менеджер</div>
          <div class="data">${ user.name }</div>
        ` : '';

        return `
            <h1 class="mobilePadding">
            <a href="/leads/cold" class="backButton"></a>
            ${ name }
            </h1>
            <h2 class="mobilePadding">${ phones.join('') }</h2>

            <div class="card">
                ${ manager }
            </div>

            <div class="optionsPanel onlyMobile">
                <a class="optionsButton" href="/leads/cold/${ _id }/edit">
                    Заполнить профиль 📝
                </a>
                <a class="optionsButton" href="/leads/cold/${ _id }/reject">
                    Оформить отказ 🚯
                </a>
            </div>           

            <div class="sidebar onlyDesktop">
                <a class="sidebar__link sidebar__link--active">Профиль 🗿</a>
                <div class="sidebar__divider"></div>
                <a class="sidebar__link" href="/leads/cold/${ _id }/edit">
                    Заполнить профиль 📝
                </a>
                <a class="sidebar__link" href="/leads/cold/${ _id }/reject">
                    Оформить отказ 🚯
                </a>
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