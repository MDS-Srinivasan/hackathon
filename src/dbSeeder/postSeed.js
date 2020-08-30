require("../dbconfig/db");
const Post = require("../models/Post");
const Author = require("../models/Author");
const faker = require("faker");

const postSeeder = async () => {
  try {
    const author = await Author.find();
    let authorIds = [];
    author.forEach((element) => {
      authorIds.push(element["_id"]);
    });
    authorIds.forEach(async (element) => {
      for (let i = 0; i < 5; i++) {
        try {
          const postData = {
            title: faker.lorem.sentence(),
            content: faker.lorem.paragraph(),
            datetime: faker.date.past(),
            author: element
          };

          const newPosts = new Post(postData);
          const result = await newPosts.save();
          console.log(result);
        } catch (e) {
          console.log(e);
        }
      }
    });
  } catch (e) {}
};

postSeeder();
