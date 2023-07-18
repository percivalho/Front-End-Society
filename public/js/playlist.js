// Add songs from public playlist to myplaylist:
let addButtons = document.querySelectorAll('.playlist-add');
addButtons.forEach((button) => {
    button.addEventListener('click', function (e) {
        e.preventDefault(); // Prevents the default action
        addSongToPlaylist(e); 
    });
});

/**
 * to add Song to MyPlaylist with Post Request
 * @param event
 * @returns None
 */
async function addSongToPlaylist(event) {
    const songId = event.target.getAttribute('data-id');
    console.log(songId);
  
    const response = await fetch(`/myPlaylist/addSong/${songId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    let message = "";
    if (response.ok) {
      const data = await response.json();
      const songName = data.song.name;      
      //console.log(response);
      //message = `Song with id ${songId} added to playlist.`;
      //message = `Song added to playlist.`;
      message = `Song "${songName}" added to playlist.`;
  
    } else {
      //message = `Failed to add song id ${songId} to playlist.`;
      message = `Failed to add song to playlist.`;
    }
    // Update the message element
    let messageElement = event.target.parentElement.nextElementSibling;
    messageElement.textContent = message;

    // Clear the message after 2 seconds
    setTimeout(function() {
      messageElement.textContent = '';
    }, 2000);    
  }


  const submitCommentHandler = async (event) => {
    event.preventDefault();
  
    const comment = document.querySelector('#comment').value.trim();
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
      ];
    
    if (comment) {
      const response = await fetch(`/api/playlist/${id}`, {
        method: 'POST',
        body: JSON.stringify({comment}),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        document.location.replace(`/playlist/${id}`);
      } else {
        alert('Failed to add comment.');
      }
    }
  };
  
  document
    .querySelector('.comment-form')
    .addEventListener('submit', submitCommentHandler);
  

  /*function createBubble(text) {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    
    bubble.textContent = text;
    
    let size = (Math.random() * 100 + 50);
    bubble.style.width = bubble.style.height = size + 'px';
    
    bubble.style.fontSize = (size * 0.2) + 'px';
    
    bubble.style.left = Math.random() * document.body.clientWidth + 'px';
    
    bubble.style.animationDuration = (Math.random() * 4 + 2) + 's';

    document.body.appendChild(bubble);
    
    setTimeout(() => {
        document.body.removeChild(bubble);
    }, 6000);
}
*/

/*document.addEventListener("DOMContentLoaded", function() {

  console.log(window.comment)
  let bubbleArray = (window.comment).map(comment => comment.description);
  console.log(bubbleArray);
  let delay = 3000; // 3 seconds delay

  for (let i = 0; i < bubbleArray.length; i++) {
      setTimeout(function() {
          createBubble(bubbleArray[i]);
      }, i * delay);
  }        
});*/