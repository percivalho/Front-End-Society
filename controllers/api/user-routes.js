const router = require('express').Router();
const { User, Playlist } = require('../../models');

// CREATE new user - handling signup
router.post('/signup', async (req, res) => {
  try {

    await console.log(req.body);  
    const dbUserData = await User.create({
      username: req.body.username,
      password: req.body.password,
      //sound: "Ping1.mp3",
      sound: req.body.sound,
    });
    console.log(dbUserData)
    // Create a playlist for the user
    const dbPlaylistData = await Playlist.create({
      title: 'My Playlist',
      user_id: dbUserData.id,  // use the id of the user just created
      imagelink: '',  // specify default image link or leave empty at the moment
      public: 0,      // 0 - private playlist
    });

    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.username = req.body.username;
      req.session.sound = req.body.sound;
      req.session.soundPlayed = 0;

      // redirect back to / after signup successfully
      res.redirect('/');        

    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Login path - for user login
router.post('/login', async (req, res) => {
  try {
    const dbUserData = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!dbUserData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password. Please try again!' });
      return;
    }

    const validPassword = await dbUserData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password. Please try again!' });
      return;
    }
    console.log(dbUserData)
    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.username = req.body.username;
      req.session.sound = dbUserData.sound;
      req.session.soundPlayed = 0;

      // redirect to / on successful login
      res.redirect('/');        
      
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Logout 
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
