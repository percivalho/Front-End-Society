const router = require('express').Router();
const { User, Playlist, Comment, Artist, Song, PlaylistSong, Soundfile } = require('../models');
const withAuth = require('../utils/auth');
const { Op } = require('sequelize');

// GET all public playlist for homepage
router.get('/', async (req, res) => {
  try {
    const dbPlaylistData = await Playlist.findAll({
      where: {
        public: 1
      },      
      //order: [['createdAt', 'DESC']],      
    });

    const playlistsAll = dbPlaylistData.map((playlist) =>
      playlist.get({ plain: true })
    );

    // Function to shuffle the array
    const shuffleArray = array => {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
    }

    // Shuffling the playlists array
    shuffleArray(playlistsAll);

    // Selecting the first 10 playlists after shuffle
    const playlists = playlistsAll.slice(0, 10);

    // Check if soundPlayed or not. If so, set it to true and send soundPlay as true to the frontend
    /*let soundPlay = false;
    if (req.session.soundPlayed === false) {
      req.session.soundPlayed = true;
      soundPlay = true;
    } */
    req.session.soundPlayed += 1;


    res.render('homepage', {
      playlists,
      loggedIn: req.session.loggedIn,
      username: req.session.username,
      sound: req.session.sound,
      soundPlay: req.session.soundPlayed,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET one public playlist only, and by id
router.get('/playlist/:id', withAuth, async (req, res) => {
  // If the user is logged in, allow them to view the public playlist
  try {
    /*const dbPlaylistData = await Playlist.findByPk(req.params.id, {
      include: [
        {
          model: Song,
          through: PlaylistSong,
          as: 'songs',
        },
      ],
    });*/
    const dbPlaylistData = await Playlist.findOne({
      where: {
        id: req.params.id,
        public: 1
      },
      include: [
        {
          model: Comment,
        },        
        {
          model: Song,
          through: PlaylistSong,
          as: 'songs',
        },
      ],
    });    

    if (dbPlaylistData){
      const playlist = dbPlaylistData.get({ plain: true });

      // Map over the comments to get an array of descriptions
      const commentsArray = playlist.comments.map(comment => comment.description);   
      const commentsArrayString = JSON.stringify(commentsArray);    
      console.log(playlist);
      console.log(commentsArrayString);
      //console.log(playlist.comments)

      console.log(playlist);
      //console.log(playlist.comments)
      res.render('playlist', { 
        playlist, 
        commentsArrayString, 
        loggedIn: req.session.loggedIn,
        username: req.session.username,
      });
    } else {
      res.render('404');
      //res.status(404).json({ message: 'No Playlist found with that id!' });
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


// retrieve myPlaylist (private playlist for your own account)
router.get('/myPlaylist', withAuth, async (req, res) => {
  try {
    // find  the user.id from username
    const dbUserData = await User.findOne({
      where: {
        username: req.session.username,
      },
    });
    
    if (dbUserData.id) {
      try {
        const dbPlaylistData = await Playlist.findOne({
          where: {
            user_id: dbUserData.id,
          },
          include: [
            {
              model: Song,
              through: PlaylistSong,
              as: 'songs',
              include: [
                {
                  model: Artist,
                  as: 'artist'
                }
              ]
            },
          ]
        });
    
        if (dbPlaylistData){
          const playlist = dbPlaylistData.get({ plain: true });
          res.render('myPlaylist', { 
            playlist, 
            loggedIn: req.session.loggedIn,
            username: req.session.username,
          });
        }
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Search for song in my myplaylist
router.get('/myResult/search', withAuth, async (req, res) => {
  try {
    console.log(req.query);
    let searchTerm = req.query.query;


    const dbSongData = await Song.findAll({
        where: {
            [Op.or]: [
                { name: { [Op.like]: `%${searchTerm}%` } },
                { '$Artist.name$': { [Op.like]: `%${searchTerm}%` } }
            ]
        },
        include: [{
            model: Artist
        }]
    }); 

    console.log(dbSongData);     
    let songs ={};
    if (dbSongData){
      songs = dbSongData.map((song) =>
        song.get({ plain: true })
      );
    }
    console.log(songs);
    //res.render('myResult', { songs, loggedIn: req.session.loggedIn });
    res.json({ songs, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }

});

// Add a song into playlist
router.post('/myPlaylist/addSong/:id', withAuth, async (req, res) => {
  try {
    const id = req.params.id;
    await console.log(id);
    // retrieve the user.id from username
    console.log(req.session.username);
    const dbUserData = await User.findOne({
      where: {
        username: req.session.username,
      },
    });

    if (dbUserData.id) {
      const dbPlaylistData = await Playlist.findOne({
        where: {
          user_id: dbUserData.id,
        },
      });      
      try {
        const dbPlaylistSongData = await PlaylistSong.create({
          playlist_id: dbPlaylistData.id,
          song_id: id,
        });
        // Query for the song data
        const dbSongData = await Song.findByPk(id);

        // If the song exists in the database, include the name in the response
        if (dbSongData) {
          req.session.save(() => {
            req.session.loggedIn = true;
            req.session.username = req.session.username; 

            // Send back the song name as part of the response
            res.status(200).json({
              playlist: dbPlaylistData,
              song: dbSongData.get({ plain: true })
            });
          });
        }
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
        /*req.session.save(() => {
          req.session.loggedIn = true;
          req.session.username = req.session.username;    
          res.status(200).json({
            //dbPlaylistData);
            playlist: dbPlaylistData,
            song: dbSongData.get({ plain: true })
          });            */
          //res.render('myPlaylist', { playlists, loggedIn: req.session.loggedIn });

        //});
      /*} catch (err) {
        console.log(err);
        res.status(500).json(err);
      }*/
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


// Delete song from playlist
router.delete('/myPlaylist/:id', withAuth, async (req, res) => {
  try {
    const id = req.params.id;
    await console.log(id);
    // retrieve the user.id from username
    console.log(req.session.username);
    const dbUserData = await User.findOne({
      where: {
        username: req.session.username,
      },
    });

    if (dbUserData.id) {
      const dbPlaylistData = await Playlist.findOne({
        where: {
          user_id: dbUserData.id,
        },
      });      
      
      try {  
        const dbPlaylistSongData = await PlaylistSong.destroy({
          where: {
            playlist_id: dbPlaylistData.id,
            song_id: id,
          },
        });
        if (!dbPlaylistSongData) {
          res.status(404).json({ message: 'No Song deleted from playlist!' });
          return;
        }
        res.status(200).json(dbPlaylistSongData);
      } catch (err) {
        res.status(500).json(err);
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Post Comment on a playlist post
router.post('/api/playlist/:id', withAuth, async (req, res) => {

  try {
    // retrieve the user.id from username
    const dbUserData = await User.findOne({
      where: {
        username: req.session.username,
      },
    });

    if (dbUserData.id) {
      try {
        const dbCommentData = await Comment.create({
          playlist_id: req.params.id,
          description: req.body.comment,
          user_id: dbUserData.id
        });
        req.session.save(() => {
          req.session.loggedIn = true;
          req.session.username = req.session.username;
    
          res.status(200).json(dbCommentData);
        });
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});






// Login 
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

// Signup
router.get('/signup', async (req, res) => {
  // to show the soundfile available to frontend dropdown box
  const dbsoundfileData = await Soundfile.findAll();
  if (dbsoundfileData){
    const soundfiles = dbsoundfileData.map((soundfile) =>
      soundfile.get({ plain: true })
    );

    console.log(soundfiles);
    res.render('signup', {soundfiles});
  }
});


module.exports = router;
