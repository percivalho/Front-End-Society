const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Song extends Model {}

Song.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    songlink: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    artist_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "artist",
        key: "id",
      },
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    timestamps: false,
    modelName: "song",
  }
);

module.exports = Song;
