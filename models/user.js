const mongoose = require('mongoose');
const { urlRegex } = require('../utils/regex');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    minlength: 4,
    validate: {
      validator(url) {
        return urlRegex.test(url);
      },
      message: 'Неверная ссылка на картинку',
    },
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
