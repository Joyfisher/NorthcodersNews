var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var TopicSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    lowercase: true,
    required: true
  }
});

module.exports = mongoose.model('topics', TopicSchema);
