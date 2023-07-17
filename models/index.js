const User = require('./User');
const Playlist = require('./Playlist');
const Comment = require('./Comment');
const Artist = require('./Artist');
const Song = require('./Song');
const PlaylistSong = require('./PlaylistSong');
const Soundfile = require('./Soundfile');

User.hasMany(Playlist, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Playlist.belongsTo(User, {
  foreignKey: 'user_id'
});

Playlist.hasMany(Comment, {
  foreignKey: 'playlist_id',
  onDelete: 'CASCADE',  
});

User.hasMany(Comment, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',  
});


Comment.belongsTo(Playlist, {
  foreignKey: 'playlist_id',
});

Comment.belongsTo(User, {
  foreignKey: 'user_id' 
});

Artist.hasMany(Song, {
  foreignKey: 'artist_id',
  onDelete: 'CASCADE'
});

Song.belongsTo(Artist, {
  foreignKey: 'artist_id'
});


// Products belongToMany Tags (through ProductTag)
Playlist.belongsToMany(Song, {
  through: PlaylistSong,
  foreignKey: 'playlist_id'
});

// Tags belongToMany Products (through ProductTag)
Song.belongsToMany(Playlist, {
  through: PlaylistSong,
  foreignKey: 'song_id'
});

/*User.hasOne(Soundfile, {
  foreignKey: 'soundfile_id',
  onDelete: 'CASCADE'
});*/


module.exports = { User, Playlist, Comment, Artist, Song, PlaylistSong, Soundfile };
