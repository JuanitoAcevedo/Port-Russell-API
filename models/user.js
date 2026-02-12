const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Le nom d’utilisateur est requis'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L’email est requis'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères']
  }
}, { timestamps: true });

UserSchema.pre('save', function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

module.exports = mongoose.model('User', UserSchema);
