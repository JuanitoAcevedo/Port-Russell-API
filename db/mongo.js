const mongoose = require('mongoose');

exports.initClientDbConnection = () => {
  mongoose.connect('mongodb://127.0.0.1:27017/port_russell')
    .then(() => console.log('MongoDB connecté'))
    .catch(err => console.error('Erreur MongoDB :', err));
};