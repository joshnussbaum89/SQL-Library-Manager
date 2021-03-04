'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Book extends Sequelize.Model { };
  Book.init({
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: '"Title" is required'
        }
      }
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: '"Author" is required'
        }
      }
    },
    genre: Sequelize.STRING,
    year: Sequelize.INTEGER
  }, {
    sequelize,
    modelName: 'Book',
  });

  return Book;
};