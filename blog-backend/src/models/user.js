import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserSchema = new Schema({
  username: String,
  hashedPassword: String,
});

//인스턴스 메서드 만드는법
UserSchema.methods.setPassword = async function (password) {
  const hash = await bcrypt.hash(password, 10);
  //화살표 함수로 만들시에는 this 가 인스턴스 자신을 가르키지 못한다.
  this.hashedPassword = hash;
};

/**
 *
 * @param {String} password
 * @returns {Promise}
 */
UserSchema.methods.checkPassword = async function (password) {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result;
};

UserSchema.methods.serialize = function () {
  const data = this.toJSON();
  delete data.hashedPassword;
  return data;
};

//JWT TOKEN 을 생성하는 인스턴스 함수
UserSchema.methods.generateToken = function () {
  //토큰 생성
  const token = jwt.sign(
    //토큰에 세팅해주고 싶은 값들
    {
      _id: this.id,
      username: this.username,
    },
    //토큰 비밀키
    process.env.JWT_SECRET,
    //토큰 유효기간
    {
      expiresIn: '7d',
    },
  );
  return token;
};

//스태틱 메서드
UserSchema.statics.findByUsername = async function (username) {
  //하나의 다큐먼트만을 가져온다.
  return await this.findOne({ username });
};

const User = mongoose.model('User', UserSchema);

export default User;
