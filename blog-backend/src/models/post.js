import mongoose from 'mongoose';

const { Schema } = mongoose;

const PostSchema = new Schema({
  title: String,
  body: String,
  //문자열로 이루어진 배열
  tags: [String],
  publishedDate: {
    type: Date,
    default: Date.now,
  },
});

//첫번째 매개변수로 스키마명을 주고 두번째 매개변수로 스키마 객체를 넘겨준다.
//세번째 매개변수가 없으면 자동으로 컬렉션명에 's' 가 붙는다. 세번째 매개변수가 있다면 세번째 매개변수로 컬렉션 이름이 정해진다.
//세번째 매개변수가 있는 경우 첫번째 매개변수는 다른 스키마에서 참조할 이름으로 사용된다.
const Post = mongoose.model('Post', PostSchema, 'custon_book_collection');
export default Post;
