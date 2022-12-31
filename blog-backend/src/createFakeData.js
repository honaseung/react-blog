import Post from './models/post';

//더미 데이터 생성 함수
export default function createFakeData() {
  //40사이즈 배열생성후 해당 배열의 키값들을 추출하여 얕은 복사한 배열
  const posts = [...Array(40).keys()].map((i) => ({
    title: `포스트#${i}`,
    body:
      'So we can reach to each done case. What should we do next? We should print all elements which is on.' +
      'How can you know is each element is on or off? Did you write it somewhere? On your note? You should let ' +
      "computer knows! We need a switcher to write down each element's status. Which data structure can be a" +
      " good switcher? I always prefer hash(dictionary in python). But if key's type is number, list can be a" +
      ' switcher too. Teacher use a list for switcher. In this case, keys are number such as 1, 2, 3. And values ' +
      ' are on and off. On and off can be expressed like 1 or 0, True or False. Or if you just satisfy with on and ' +
      " off, then values are can be 'on' or 'off'. One more thing, if you use a list as a switcher, you have to " +
      "consider index. Because index start from '0' not '1'. I will show you an example.",
    tags: [`dummy${i}`, `가짜${i}`],
  }));
  Post.insertMany(posts, (err, docs) => {
    console.log(docs);
  });
}
