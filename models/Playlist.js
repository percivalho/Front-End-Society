const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Playlist extends Model {}

Playlist.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "user",
        key: "id",
      },
    },
    imagelink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    public: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }

  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    timestamps: true,
    modelName: "playlist",
  }
);

module.exports = Playlist;
