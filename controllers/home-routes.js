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

    const playlists = dbPlaylistData.map((playlist) =>
      playlist.get({ plain: true })
    );
    res.render('homepage', {
      playlists,
      loggedIn: req.session.loggedIn,
      username: req.session.username,
      sound: req.session.sound,
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
    const dbPlaylistData = await Playlist.findByPk(req.params.id, {
      include: [
        {
          model: Song,
          through: PlaylistSong,
          as: 'songs',
        },
      ],
    });
    if (dbPlaylistData){
      const playlist = dbPlaylistData.get({ plain: true });
      console.log(playlist);
      res.render('playlist', { playlist, loggedIn: req.session.loggedIn });
    } else {
      res.status(404).json({ message: 'No Playlist found with that id!' });
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
          res.render('myPlaylist', { playlist, loggedIn: req.session.loggedIn });
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
        req.session.save(() => {
          req.session.loggedIn = true;
          req.session.username = req.session.username;    
          res.status(200).json(dbPlaylistData);
          //res.render('myPlaylist', { playlists, loggedIn: req.session.loggedIn });

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
