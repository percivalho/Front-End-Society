const sequelize = require('../config/connection');
const { User, Playlist, Comment, Artist, Song, PlaylistSong } = require('../models');

const userData = require('./userData.json');
const playlistData = require('./playlistData.json');
const commentData = require('./commentData.json');
const artistData = require('./artistData.json');
const songData = require('./songData.json');
const playlistsongData = require('./playlistsongData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

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


  for (const playlist of playlistData) {
    await Playlist.create({
      ...playlist,
      user_id: users[Math.floor(Math.random() * users.length)].id,
    });
  }

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
