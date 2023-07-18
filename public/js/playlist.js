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