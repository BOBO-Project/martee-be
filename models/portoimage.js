'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PortoImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PortoImage.belongsTo(models.Porto, {foreignKey:"PortoId"})
    }
  }
  PortoImage.init({
    image_url: DataTypes.STRING,
    is_main: DataTypes.BOOLEAN,
    PortoId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'PortoImage',
  });
  return PortoImage;
};