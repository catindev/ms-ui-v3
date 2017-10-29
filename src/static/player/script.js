
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
      <h2>История звонков</h2>
      ${ (calls.map(call)).join('') }      
    </div>
  `
}


function playerInit() {
  $('.jouele').jouele();
  $('.track').on('click',function() {
    const player = $('.jouele', this).data("jouele");
    player && player.play();
  })  
}