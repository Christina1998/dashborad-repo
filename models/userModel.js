const mysql = require('mysql');
 
const UserSchema = new Schema({
 email: {
  type: String,
  required: true,
  trim: true
 },
 password: {
  type: String,
  required: true
 },
 role: {
  type: String,
  default: 'basic',
  enum: ["staff", "company user", "admin"]
 },
 accessToken: {
  type: String
 }
});
 
const User = mongoose.model('user', UserSchema);
 
module.exports = User;