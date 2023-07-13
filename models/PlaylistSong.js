const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class PlaylistSong extends Model {}

PlaylistSong.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    playlist_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'playlist',
        key: 'id',
      },      
    },
    song_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'song',
        key: 'id',
      },      
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    timestamps: true,     
    modelName: 'playlistsong',
  }
);

module.exports = PlaylistSong;
