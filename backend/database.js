
const mongoose = require('mongoose');
const URI = 'mongodb+srv://servo:suporte5@cluster0.m6vqe.mongodb.net/travel-map?retryWrites=true&w=majority';


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('debug', true);

mongoose
  .connect(URI)
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.log(err));