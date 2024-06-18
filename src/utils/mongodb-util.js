require("dotenv").config();
const { MongoClient } = require("mongodb");

// Set MongoDB client
const client = new MongoClient(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Function to connect to your mongodb
const connectToMongoDB = async () => {
  try {
    await client.connect();
    return client;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Function to get a content by course name
const getContentsByCourse = (courseName) =>
  connectToMongoDB()
    .then(async (client) => {
      const db = client.db("DLX");
      const contentsCollection = db.collection("contents");
      const coursesCollection = db.collection("courses");

      return coursesCollection.findOne({ name: courseName }).then((course) =>
        contentsCollection
          .find({ title: { $in: course.dlx } })
          .toArray()
          .then((contents) => {
            // Insert a url for routing to each dlx
            for (let i = 0; i < contents.length; i++) {
              contents[i].url = `${process.env.URL}/dlx/${contents[i].param}`;
            }
            return contents;
          })
      );
    })
    .catch((err) => {
      console.error(err);
    });

const getContentByParam = (param) =>
  connectToMongoDB()
    .then(async (client) => {
      const db = client.db("DLX");
      const contentsCollection = db.collection("contents");

      return contentsCollection
        .findOne({ param: param })
        .then((content) => content);
    })
    .catch((err) => {
      console.error(err);
    });

// Function to add dummy data for testing
const addDummyData = () =>
  connectToMongoDB().then(async (client) => {
    const db = client.db("DLX");
    const contentsCollection = db.collection("contents");
    const coursesCollection = db.collection("courses");

    return Promise.all([
      contentsCollection.find({}).toArray(),
      coursesCollection.find({}).toArray(),
    ])
      .then(async ([contents, courses]) => {
        // Insert dummy data to empty collection
        if (contents.length === 0)
          contentsCollection
            .insertMany(dummyContents)
            .then(() => dummyContents);

        if (courses.length === 0)
          coursesCollection.insertMany(dummyCourses).then(() => dummyCourses);
      })
      .catch((err) => {
        console.error(err);
      });
  });

// Dummy data (temporary)
const dummyContents = [
  {
    type: "ltiResourceLink",
    title: "React Multiplayer App",
    param: "reactmultiplayerapp",
  },
  {
    type: "ltiResourceLink",
    title: "My Test",
    param: "launchtesting",
  },
  {
    type: "ltiResourceLink",
    title: "Roll-a-ball",
    param: "rab",
  },
  {
    type: "ltiResourceLink",
    title: "MP Circuits Lab 1",
    param: "mpcl1",
  },
  {
    type: "ltiResourceLink",
    title: "MP Circuits Lab 2",
    param: "mpcl2",
  },
  {
    type: "ltiResourceLink",
    title: "Powerline",
    param: "powerline",
  },
];

const dummyCourses = [
  {
    name: "vConestoga LMS",
    dlx: [
      "My Test",
      "Roll-a-ball",
      "React Multiplayer App",
      "launchtesting",
      "MP Circuits Lab 1",
      "MP Circuits Lab 2",
      "Powerline",
    ],
  },
  {
    name: "Jonathan Saravia's Course",
    dlx: ["React Multiplayer App"],
  },
  {
    name: "LTI-Steve",
    dlx: [
      "Roll-a-ball",
      "React Multiplayer App",
      "launchtesting",
      "MP Circuits Lab 1",
      "MP Circuits Lab 2",
      "Powerline",
    ],
  },
  {
    name: "WEB-3133 React",
    dlx: ["Roll-a-ball", "MP Circuits Lab 1", "MP Circuits Lab 2"],
  },
  {
    name: "FeathersJS",
    dlx: ["MP Circuits Lab 1", "MP Circuits Lab 2"],
  },
  {
    name: "1234-Test",
    dlx: [],
  },
];

module.exports = {
  getContentsByCourse,
  getContentByParam,
  addDummyData,
};
