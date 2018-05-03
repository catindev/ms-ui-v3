
// TODO: Отрефакторить сей пиздец 💩

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

// New breadcrumbs story

var CustomerID = false;

function breadcrumbHTML(date, manager, icon, text, isNew = false) {
  const managerHTML = manager ?
    ` <span class="breadcrumb__divider"></span> ${manager.name}`
    :
    ` <span class="breadcrumb__divider"></span> Майндсейлс`;

  return `
  <div class="breadcrumb ${isNew && 'breadcrumb--new'}">
    <div class="breadcrumb__date">
      ${date}${managerHTML}  ${icon}
    </div>
    <div class="breadcrumb__description">${text}</div>
  </div> 
`
}

function drawStory(breadcrumbs, cid = false) {
  var emptyMessage = '';

  CustomerID = cid; // 🙄 💩 🤮

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

  function drawBreadcrumb(breadcrumb) {
    if (breadcrumb.type === 'call' || breadcrumb.type === 'callback')
      return call(breadcrumb.call)

    if (breadcrumb.type === 'assigned') return breadcrumbHTML(
      breadcrumb.date, breadcrumb.user,
      '👥', 'Клиент назначен на менеджера'
    )

    if (breadcrumb.type === 'task') {
      const when = breadcrumb.task.time ?
        breadcrumb.task.when + ' в ' + breadcrumb.task.time
        :
        breadcrumb.task.when
      return breadcrumbHTML(
        breadcrumb.date, breadcrumb.user,
        '📝', 'Новая задача — ' + breadcrumb.comment + '</br>' + when
      )
    }

    if (breadcrumb.type === 'reopen') return breadcrumbHTML(
      breadcrumb.date, breadcrumb.user,
      '💫', 'Открыта новая сделка'
    )

    if (breadcrumb.type === 'reject') {
      const comment = 'Отказ от сделки. ' + (
        breadcrumb.comment ?
          (breadcrumb.reason + '. ' + breadcrumb.comment)
          :
          breadcrumb.reason
      )

      return breadcrumbHTML(
        breadcrumb.date, breadcrumb.user,
        '🚽', comment
      )
    }

    if (breadcrumb.type === 'deal') return breadcrumbHTML(
      breadcrumb.date, breadcrumb.user,
      '💰', 'Успешная сделка. Сумма — ' + breadcrumb.amount + (breadcrumb.comment ? '</br>— «' + breadcrumb.comment + '»' : '')
    )

    if (breadcrumb.type === 'note') return breadcrumbHTML(
      breadcrumb.date, breadcrumb.user, '💬', breadcrumb.comment
    )

    if (breadcrumb.type === 'created') {
      const commentText = 'Клиент зарегистрирован ' + (breadcrumb.user ?
        'менеджером' : 'автоматически по звонку на источник «' + breadcrumb.trunk.name + '»'
      )
      return breadcrumbHTML(
        breadcrumb.date, breadcrumb.user,
        '🐣', commentText
      )
    }

    return breadcrumbHTML(
      breadcrumb.date, breadcrumb.user,
      '😳', 'Неизвестное событие'
    )
  }


  return `
    <div class="playListWithCalls" style="padding-top: .5rem">
      <h2 class="mobilePadding">История</h2>

      <form id="newBreadcrumbNoteForm" class="mobilePadding">
          <div class="form__item">
            <textarea class="bNewNote__input" rows="1" 
              id="NewNoteComment" name="comment" 
              placeholder="Новая заметка"
              onfocus="onFocus()"
              onblur="onBlur()"/></textarea>
          </div>
          <div>
            <button class="bNewNote__button">
              Добавить
            </button>
          </div>
      </form>

      <div id="BreadcrumbsList">
      ${ breadcrumbs && breadcrumbs.length > 0 ?
      (breadcrumbs.map(drawBreadcrumb)).join('')
      :
      `<span class="mobilePadding" style="font-size:13px;">
        ${ emptyMessage || 'С клиентом пока ничего не происходило 👀'}
      </span>` }   
      </div>   
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

  const frm = document.getElementById('newBreadcrumbNoteForm')
  frm && frm.addEventListener("submit", onFormSubmit);

  autosize(document.getElementById('NewNoteComment'))
}

/* Form events */

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
  fetch(`${Config.API_HOST}/customers/${CustomerID || customerID}/breadcrumbs?token=${getCookie('msid')}&df=human`, {
    method: "post",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({
      comment: comment.value,
      type: 'note'
    })
  })
    .then(response => response.json())
    .then(checkResponse)
    .then(({ breadcrumb }) => {
      comment.value = '';

      const BreadcrumbsList = document.getElementById('BreadcrumbsList')
      const newNote = document.createElement('div');
      newNote.innerHTML = breadcrumbHTML(
        breadcrumb.date, breadcrumb.user, '💬', breadcrumb.comment
      );

      BreadcrumbsList.insertBefore(newNote, BreadcrumbsList.firstChild);

      newNote.className += ' breadcrumb--new';
      setTimeout(function () {
        newNote.className += ' breadcrumb--show';
      }, 10);

      isRequest = false;
    })
    .catch(error => {
      isRequest = false;
      console.error('Error:', error.message)
      alert(error.message + '  😦');
    });

}