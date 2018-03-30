


function createPlaylist(calls, emptyMessage) {

  function call({ isCallback, date, record }) {
    const type = isCallback === true ?
      (record ? 'outcoming' : 'outcoming-missed')
      :
      (record ? 'incoming' : 'incoming-missed')
      ;

    return `
        <div class="track ${ type}">
            ${
      record ?
        `<a href="${record}" class="jouele" data-hide-timeline-on-pause="true">
                  ${ date}
                </a>`
        :
        date
      } 
        </div> 
    `
  }

  return `
    <div class="playListWithCalls" style="padding-top: .5rem">
      <h2 class="mobilePadding">История звонков</h2>
      ${
    calls && calls.length > 0 ?
      (calls.map(call)).join('')
      :
      `<span class="mobilePadding" style="font-size:13px;">
            ${ emptyMessage || 'В истории нет звонков'}
          </span>`
    }      
    </div>
  `
}


function drawStory(breadcrumbs, emptyMessage) {

  function call({ isCallback, date, record }) {
    const type = isCallback === true ?
      (record ? 'outcoming' : 'outcoming-missed')
      :
      (record ? 'incoming' : 'incoming-missed')
      ;

    return `
        <div class="track ${ type}">
            ${
      record ?
        `<a href="${record}" class="jouele" data-hide-timeline-on-pause="true">
                  ${ date}
                </a>`
        :
        date
      } 
        </div> 
    `
  }

  function breadcrumbHTML(date, manager, icon, text) {
    const managerHTML = manager ?
      ` <span class="breadcrumb__divider"></span> ${manager.name}`
      :
      ` <span class="breadcrumb__divider"></span> Майндсейлс`;

    return `
    <div class="breadcrumb">
      <div class="breadcrumb__date">
        ${date}${managerHTML}  ${icon}
      </div>
      <div class="breadcrumb__description">${text}</div>
    </div> 
`
  }


  function drawBreadcrumb(breadcrumb) {
    if (breadcrumb.type === 'call' || breadcrumb.type === 'callback')
      return call(breadcrumb.call)

    if (breadcrumb.type === 'assigned') return breadcrumbHTML(
      breadcrumb.date, breadcrumb.user,
      '👥', 'Клиент назначен на менеджера'
    )

    if (breadcrumb.type === 'reopen') return breadcrumbHTML(
      breadcrumb.date, breadcrumb.user,
      '💫', 'Открыта новая сделка'
    )

    if (breadcrumb.type === 'reject') return breadcrumbHTML(
      breadcrumb.date, breadcrumb.user,
      '🚽', 'Отказ от сделки:</br>— «' + breadcrumb.comment + '»'
    )

    if (breadcrumb.type === 'deal') return breadcrumbHTML(
      breadcrumb.date, breadcrumb.user,
      '💰', 'Успешная сделка. Сумма — ' + breadcrumb.amount + (breadcrumb.comment ? '</br>— «' + breadcrumb.comment + '»' : '')
    )

    if (breadcrumb.type === 'note') return breadcrumbHTML(
      breadcrumb.date, breadcrumb.user, '💬', breadcrumb.comment
    )

    return breadcrumbHTML(
      breadcrumb.date, breadcrumb.user,
      '👋', 'Клиент зарегистрирован в ЦРМ'
    )
  }


  return `
    <div class="playListWithCalls" style="padding-top: .5rem">
      <h2 class="mobilePadding">История</h2>

      <form id="newBreadcrumbNoteForm" class="mobilePadding">
          <div class="form__item">
            <input type="text" id="comment" name="comment" 
              placeholder="Новая заметка"
              onfocus="onFocus()"
              onblur="onBlur()"/>
          </div>
          <div>
            <button>Добавить</button>
          </div>
      </form>

      ${ breadcrumbs && breadcrumbs.length > 0 ?
      (breadcrumbs.map(drawBreadcrumb)).join('')
      :
      `<span class="mobilePadding" style="font-size:13px;">
            ${ emptyMessage || 'С клиентом пока ничего не происходило 👀'}
      </span>` }      
    </div>
  `
}


function playerInit() {

  $('.jouele').jouele();
  $('.track').on('click', function () {
    const player = $('.jouele', this).data("jouele");
    if (player) {
      player.play();
      // $('.jouele-info-control-button', this).show();
    }

  })

  newBreadcrumbNoteForm.addEventListener("submit", onFormSubmit);
}

/* Form events */

// TODO: отрефакторить этот писдец 💩
function onFocus() {
  bottomTabs.style.display = 'none';
}

function onBlur() {
  const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
  if (width < 1024) bottomTabs.style.display = 'block'
}

let isRequest = false;
function onFormSubmit(event) {
  event.preventDefault();
  if (isRequest == true) return false;

  const { comment } = newBreadcrumbNoteForm
  if (!comment.value) return false

  isRequest = true;
  const customerID = location.pathname.split('/')[2];
  fetch(`${Config.API_HOST}/customers/${customerID}/breadcrumbs?token=${getCookie('msid')}`, {
    method: "post",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({
      comment: comment.value,
      type: 'note'
    })
  })
    .then(response => response.json())
    .then(checkResponse)
    .then((respp) => {
      document.location.reload()
      // console.log(respp)
    })
    .catch(error => {
      isRequest = false;
      console.error('Error:', error.message)
      alert(error.message + '  😦');
    });

}