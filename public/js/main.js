
document.addEventListener("DOMContentLoaded", function() {

    let sound = window.sound;
    let soundSrc = './assets/sound/' + sound;
    console.log(window.soundPlay);
    console.log(soundSrc);
    if (window.soundPlay <= 2) {
        // Create a new Howl instance
        let soundToPlay = new Howl({
            src: [soundSrc],
            autoplay: true 
        });
        message = soundSrc;
        console.log(message);
        
        // Play the sound
        soundToPlay.play();
    }
});
  