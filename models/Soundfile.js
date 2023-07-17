const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Soundfile extends Model {}

Soundfile.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    timestamps: false,
    modelName: "soundfile",
  }
);

module.exports = Soundfile;
