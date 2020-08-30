require("../dbconfig/db");
const Author = require("../models/Author");
const faker = require("faker");
const AuthorPost = async () => {
  const newAuthor = Author.insertMany([
    {
      name: faker.name.findName()
    },
    { name: faker.name.findName() },
    { name: faker.name.findName() },
    { name: faker.name.findName() }
  ]);
  try {
    const result = await newAuthor;
    console.log(result);
  } catch (e) {
    console.error(e);
  }
};

AuthorPost();
