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
      message = `Song "${songName}" added to playlist.`;  
    } else {
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
  

/**
 * to create bubbles 
 * @param size1 - bubble size
 * @param size2 - smallest bubble size
 * @param offset1 - left offset so that the bubble not to the left
 * @param offset1 - the right offset, in ratio of the whole width
 * @param text - if text to display in the bubble
 * @returns None
 */    
function createBubble(size1, size2, offset1, offset2, text) {
  const bubble = document.createElement('div');
  bubble.classList.add('bubble');
  
  bubble.textContent = text;
  
  let size = (Math.random() * size1 + size2);
  bubble.style.width = bubble.style.height = size + 'px';
  
  bubble.style.fontSize = (size * 0.1) + 'px';
  
  bubble.style.left = (offset1 + Math.random() * (document.body.clientWidth*offset2)) + 'px';
  
  let animationDuration = Math.random() * 2 + 4;
  bubble.style.animationDuration = (Math.random() * 2 + 4) + 's';

  document.body.appendChild(bubble);
  
  setTimeout(() => {
      document.body.removeChild(bubble);
  }, 8000);
}
    
document.addEventListener("DOMContentLoaded", function() {

  var bubbleArray = window.comment1;

  let delay = 1500; // 1.5 seconds delay
  let randomOffset = 500; // make it more random

  // small bubbles without comments
  for (let i = 0; i < 100; i++) {
    setTimeout(function() {
        createBubble(100, 40, 0, 1, "");
    }, i * delay/15 + Math.random() * randomOffset/15);
  }        
  // bubbles with comments
  for (let i = 0; i < bubbleArray.length; i++) {
      setTimeout(function() {
          createBubble(100, 150, 100, 0.7, bubbleArray[i]);
      }, i * delay + Math.random() * randomOffset);
  }        
});
