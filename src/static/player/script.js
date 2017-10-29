
function createPlaylist(calls) {

  function call({ isCallback, date, record }) {
    const type = isCallback === true?
      (record? 'outcoming' : 'outcoming-missed')
      :
      (record? 'incoming' : 'incoming-missed')
      ;

    return `
        <div class="track ${ type }">
            ${ 
              record? 
                `<a href="${ record }" class="jouele" data-hide-timeline-on-pause="true">
                  ${ date }
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
            В истории нет звонков
          </span>`
      }      
    </div>
  `
}


function playerInit() {
  $('.jouele').jouele();
  $('.track').on('click',function() {
    const player = $('.jouele', this).data("jouele");
    if (player) {
      player.play();
      // $('.jouele-info-control-button', this).show();
    }  

  })  
}