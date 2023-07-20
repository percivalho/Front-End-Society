
document.addEventListener("DOMContentLoaded", function() {

    let sound = window.sound;
    let soundSrc = './assets/sound/' + sound;
    if (window.soundPlay <= 2) {
        // Create a new Howl instance
        let soundToPlay = new Howl({
            src: [soundSrc],
            autoplay: true 
        });
        message = soundSrc;
        
        // Play the sound
        soundToPlay.play();
    }
});
  