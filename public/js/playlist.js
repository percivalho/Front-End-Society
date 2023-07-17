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
      message = `Song with id ${songId} added to playlist.`;
    } else {
      message = `Failed to add song id ${songId} to playlist.`;
    }
    // Update the message element
    let messageElement = event.target.parentElement.nextElementSibling;
    messageElement.textContent = message;

    // Clear the message after 2 seconds
    setTimeout(function() {
      messageElement.textContent = '';
    }, 2000);    
  }
  