const router = require('express').Router();
const { User, Playlist, Comment, Artist, Song, PlaylistSong } = require('../models');
const withAuth = require('../utils/auth');

// GET all blogs for homepage
router.get('/', async (req, res) => {
  try {
    const dbPlaylistData = await Playlist.findAll({
      include: [
        {
          model: Comment,
        },
        {
          model: User,
        },
        {
          model: Song,
          through: PlaylistSong,
          as: 'songs',
          include: [
            {
              model: Artist,
              as: 'artist',
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],      
    });

    const playlists = dbPlaylistData.map((playlist) =>
      playlist.get({ plain: true })
    );
    console.log(playlists);
    console.log(playlists[0].songs);
    console.log(req.session);
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

// GET one blog only, and by id
router.get('/playlist/:id', withAuth, async (req, res) => {
  // If the user is logged in, allow them to view the blog
  try {
    const dbPlaylistData = await Playlist.findByPk(req.params.id, {
      include: [
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['username'],
            },
          ],
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

// Post Comment on a blog post
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
          blog_id: req.params.id,
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

// myPlaylist
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
        const dbPlaylistData = await Playlist.findAll({
          where: {
            user_id: dbUserData.id,
          },
          order: [['createdAt', 'DESC']],
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
    
        let playlists ={};
        if (dbPlaylistData){
          playlists = dbPlaylistData.map((playlist) =>
            playlist.get({ plain: true })
          );
        }
        console.log(playlists);
        res.render('myPlaylist', { playlists, loggedIn: req.session.loggedIn });
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

// Create Blog Post
router.post('/myPlaylist', withAuth, async (req, res) => {
  try {
    // retrieve the user.id from username
    const dbUserData = await User.findOne({
      where: {
        username: req.session.username,
      },
    });

    if (dbUserData.id) {
      try {
        const dbBlogData = await Blog.create({
          title: req.body.title,
          description: req.body.description,
          user_id: dbUserData.id
        });
        req.session.save(() => {
          req.session.loggedIn = true;
          req.session.username = req.session.username;
    
          res.status(200).json(dbBlogData);
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


// GET one Blog Post, own blog post
router.get('/myblog/:id', withAuth, async (req, res) => {
  try {
    const dbBlogData = await Blog.findByPk(req.params.id);

    if (dbBlogData){
      const blog = dbBlogData.get({ plain: true });
      res.render('myblog', { blog, loggedIn: req.session.loggedIn });
    } else {
      res.status(404).json({ message: 'No Blog found with that id!' });
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


// DELETE a blog post (can only do so by post creator)
router.delete('/myblog/:id', withAuth, async (req, res) => {
  try {
    const dbBlogData = await Blog.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!dbBlogData) {
      res.status(404).json({ message: 'No Blog found with that id!' });
      return;
    }
    res.status(200).json(dbBlogData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT update the blog post
router.put('/myblog/:id', withAuth, async (req, res) => {
  try {
    const dbBlogData = await Blog.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!dbBlogData[0]) {
      res.status(404).json({ message: 'No Blog with this id!' });
      return;
    }
    res.status(200).json(dbBlogData);
  } catch (err) {
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
router.get('/signup', (req, res) => {
  res.render('signup');
});


module.exports = router;
