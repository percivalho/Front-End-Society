// Get select element (drop down box)
let selectElement = document.getElementById("login-sound");


const signupFormHandler = async (event) => {
    event.preventDefault();
  
    const username = document.querySelector('#username-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();
    let sound = selectElement.options[selectElement.selectedIndex].text.trim();
  
    if (username && password) {
      const response = await fetch('/api/users/signup', {
        method: 'POST',
        body: JSON.stringify({ username, password, sound }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        document.location.replace('/');
      } else {
        alert('Failed to sign up.');
      }
    }
  };
  
  document
    .querySelector('.signup-form')
    .addEventListener('submit', signupFormHandler);


// Add event listener for changing the option in dropdowm box
selectElement.addEventListener("change", function() {
  // Get the selected option text
  let sound = selectElement.options[selectElement.selectedIndex].text;
  let soundSrc = './assets/sound/' + sound;
  let soundToPlay = new Howl({
      src: [soundSrc],
      autoplay: true 
  });
  
  // Play the sound
  soundToPlay.play();  
});
