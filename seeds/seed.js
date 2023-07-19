const sequelize = require('../config/connection');
const { User, Playlist, Comment, Artist, Song, PlaylistSong, Soundfile} = require('../models');

const userData = require('./userData.json');
const playlistData = require('./playlistData.json');
const commentData = require('./commentData.json');
const artistData = require('./artistData.json');
const songData = require('./songData.json');
const playlistsongData = require('./playlistsongData.json');
const soundfileData = require('./soundfileData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const soundfiles = await Soundfile.bulkCreate(soundfileData, {
    individualHooks: true,
    returning: true,
  });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  const artists = await Artist.bulkCreate(artistData, {
    individualHooks: true,
    returning: true,
  });

  const songs = await Song.bulkCreate(songData, {
    individualHooks: true,
    returning: true,
  });


  const playlists = await Playlist.bulkCreate(playlistData, {
    individualHooks: true,
    returning: true,
  });  

  for (const comment of commentData) {
    await Comment.create({
      ...comment,
      user_id: users[Math.floor(Math.random() * users.length)].id,
    });
  }

  const playlistsongs = await PlaylistSong.bulkCreate(playlistsongData, {
    individualHooks: true,
    returning: true,
  });


  process.exit(0);
};

seedDatabase();
