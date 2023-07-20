const newPostButton = document.querySelector('.new-post-button');
const articleElement = document.querySelector('.sample-img');
const createButton = document.querySelector('#crate');
const searchButton = document.querySelector('#searchBtn');
let historyEl = document.getElementById('history');

const submitSearchHandler = async (event) => {
  let searchTerm = document.querySelector('#search').value;
  if (!searchTerm){
    searchTerm = event.target.textContent;
  }
  
  if (searchTerm) {
    const response = await fetch(`/myResult/search?query=${searchTerm}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {

      const data = await response.json(); // Get data as JSON

      var mycard = document.querySelector('.mycard');
      var myresult = document.querySelector('.myresult');

      // Clear the contents of songContainerInMyResult
      let songContainerInMyResult = document.querySelector('.myresult .mysong-container');
      songContainerInMyResult.innerHTML = '';    

      if(data.songs.length > 0) {
        for (let song of data.songs) {
          // Create the elements
          const section = document.createElement('section');
          const article = document.createElement('article');
          const div = document.createElement('div');
          const div1 = document.createElement('div');
          const iframe = document.createElement('iframe');
          const button = document.createElement('button');
          const pEl = document.createElement('p');

          // Set the classes and attributes
          section.className = 'mysong-section';
          article.className = 'play-sample-img';
          div.className = 'detail';
          div1.className = "media-container";
          pEl.classNmae = 'message';
          pEl.id = 'message' + song.id;  
          iframe.width = '90%';
          iframe.height = '80px';
          iframe.allowTransparency = 'true';
          iframe.allow = 'encrypted-media';
          iframe.src = 'https://open.spotify.com/embed/track/' + song.songlink; // songlink
          button.className = "adjust-button";

          // Set button properties
          button.innerText = '+';
          button.setAttribute('data-id', song.id); 
          button.addEventListener('click', addSongToPlaylist); // Add event listener

          // Append the elements
          div1.appendChild(iframe); // Append iframe to the inner div
          div1.appendChild(button); // Append button to the inner div
          div.appendChild(div1); // Append inner div to the outer div
          div.appendChild(pEl); // Append pEl to the outer div
          article.appendChild(div); // Append outer div to article
          section.appendChild(article); // Append article to section

          songContainerInMyResult.appendChild(section);   
        }
        if (myresult.classList.contains('hidden')) {      
          mycard.classList.toggle('visible');
          mycard.classList.toggle('hidden');
          myresult.classList.toggle('visible');
          myresult.classList.toggle('hidden');
        }
        // save history to local storage
        saveHistory(searchTerm);        
      }
      else {
        let messageElement = document.querySelector(".search-message");
        messageElement.textContent = "No songs found!";
        setTimeout(function() {
          messageElement.textContent = '';
        }, 2000);    
      }
    } else {
      alert('Failed to retrive search result.');
    }
  }
};

/**
 * to save the searchTerm to save history (local storage)
 * @param searchTerm
 * @returns None
 */
function saveHistory(searchTerm){
  // get localHistory to array
  var array = [];
  if (localStorage.getItem('searchTerm')!= null){
    array = JSON.parse(localStorage.getItem('searchTerm'));
  }
  // Find the index of the element in the array
  var index = array.indexOf(searchTerm);
  // Check if the element exists (index will be -1 if the element is not found)
  if (index !== -1) {
    // Remove the element using splice()
    array.splice(index, 1);
  }  
  array.push(searchTerm);
  localStorage.setItem('searchTerm', JSON.stringify(array));
  // remove existing entries
  // Remove all li elements (children) from the ul
  while (historyEl.firstChild) {
    historyEl.removeChild(historyEl.firstChild);
  }  
  // create all childs
  for (i=array.length-1; i>=0; i--){
    liEl = document.createElement('li');
    liEl.textContent = array[i];
    liEl.classList.add('histBtn',  'btn', 'btn-primary', 'w-100', 'list-group-item', 'list-group-item-action', 'mb-1');
    historyEl.appendChild(liEl);
  }
  
}

/**
 * to load the save history from local history
 * @param None
 * @returns None
 */
function loadFromLocalStorage(){
  var array = [];
  if (localStorage.getItem('searchTerm')!= null){
    array = JSON.parse(localStorage.getItem('searchTerm'));
  }
  while (historyEl.firstChild) {
    historyEl.removeChild(historyEl.firstChild);
  }  
  // create all childs
  for (i=array.length-1; i>=0; i--){
    liEl = document.createElement('li');
    liEl.textContent = array[i];
    liEl.classList.add('histBtn',  'btn', 'btn-primary', 'w-100', 'list-group-item', 'list-group-item-action', 'mb-2');
    historyEl.appendChild(liEl);
  }

}


// when key pressed (and it is Enter!)
document.querySelector('#search').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault(); // Prevents the default action
    submitSearchHandler(e); 
    document.querySelector('#search').value = "";
  }
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
    //message = `Song with id ${songId} added to playlist.`;
    //message = `Song added to playlist.`;
    message = `Song "${songName}" added to playlist.`;
  } else {
    message = `Failed to add song to playlist.`;
  }
  // Update the message element
  let messageElement = document.querySelector('#message' + `${songId}`); // Use the identifier to select the p element
  messageElement.textContent = message;  

  // Clear the message after 2 seconds
  setTimeout(function() {
    messageElement.textContent = '';
  }, 2000);    

}


// delete song from myplaylist
let deleteButtons = document.querySelectorAll('.delete');
deleteButtons.forEach((button) => {
    button.addEventListener('click', function (e) {
        e.preventDefault(); // Prevents the default action
        deleteSongFromPlaylist(e); 
    });
});

/**
 * to delete Song from MyPlaylist with Delete Request
 * @param event
 * @returns None
 */
async function deleteSongFromPlaylist(event) {
  const songId = event.target.getAttribute('data-id');

  const response = await fetch(`/myPlaylist/${songId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    location.reload(); // Refresh the page to reflect the change(delete)
  } else {
    console.error(`Failed to delete song id ${songId} to playlist.`);
  }
}




// after webpage loaded
document.addEventListener("DOMContentLoaded", function() {

  // load data from local Storage for search history
  loadFromLocalStorage();

  // for clicking on saved history button, search the backend
  document.addEventListener('click', function(event) {
    if (event.target.matches('.histBtn')) {
      event.preventDefault(); // Prevents the default action
      submitSearchHandler(event); 
    }
  }); 

});