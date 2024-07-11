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
        // Step 01: If there is no data in the database, insert all the dummyContents to MongoDB
        if (contents.length === 0) {
          await contentsCollection.insertMany(dummyContents);
        }
    
        if (courses.length === 0) {
          await coursesCollection.insertMany(dummyCourses);
        }
    
        // Step 02: Check whether the content table has been updated and update to the latest version
        const contentParams = contents.map((content) => content.param); // Retrieve the 'content' table's data from the 'DLX' database and extract all the data field assosiate with 'param'
        const newContents = dummyContents.filter(
          (dummyContent) => !contentParams.includes(dummyContent.param)
        );
    
        const obsoleteContents = contents.filter(
          (content) => !dummyContents.some((dummyContent) => dummyContent.param === content.param)
        );
    
        if (newContents.length > 0) {
          await contentsCollection.insertMany(newContents);
        }
    
        if (obsoleteContents.length > 0) {
          const obsoleteContentParams = obsoleteContents.map((content) => content.param);
          await contentsCollection.deleteMany({ param: { $in: obsoleteContentParams } });
        }
    
        // Step 03: Check whether the course table has been updated and update to the latest version
        const courseNames = courses.map((course) => course.name);
        const newCourses = dummyCourses.filter(
          (dummyCourse) => !courseNames.includes(dummyCourse.name)
        );

        const obsoleteCourses = courses.filter(
          (course) => !dummyCourses.some((dummyCourse) => dummyCourse.name === course.name)
        );
      
        if (newCourses.length > 0) {
          await coursesCollection.insertMany(newCourses);
        }
      
        if (obsoleteCourses.length > 0) {
          const obsoleteCourseNames = obsoleteCourses.map((course) => course.name);
          await coursesCollection.deleteMany({ name: { $in: obsoleteCourseNames } });
        }
        
        // Step 04: Update dlx lists to match dummyCourses
        const dlxEquals = (a, b) => {
          if (a.length !== b.length) return false;
          for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
          }
          return true;
        };

        for (const dummyCourse of dummyCourses) {
          const course = courses.find((course) => course.name === dummyCourse.name);

          if (course) {
            if (!dlxEquals(course.dlx, dummyCourse.dlx)) {
              await coursesCollection.updateOne(
                { name: dummyCourse.name },
                { $set: { dlx: dummyCourse.dlx } }
              );
              console.log(`Updated dlx list for course: ${dummyCourse.name}`);
            } else {
              console.log(`dlx list for course: ${dummyCourse.name} is already up to date`);
            }
          } 
          
        }
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
    param: "Powerline",
  },
  {
    type: "ltiResourceLink",
    title: "CORE Sandbox V2",
    param: "CORE-Sandbox-V2",
  },
  {
    type: "ltiResourceLink",
    title: "Public Health Inspection",
    param: "Public-Health-Inspection",
  },
  {
    type: "ltiResourceLink",
    title: "Trades Electrical",
    param: "Trades-Electrical",
  },
  {
    type: "ltiResourceLink",
    title: "Paramedic Ambulance",
    param: "Paramedic-Ambulance",
  },
  {
    type: "ltiResourceLink",
    title: "LTI Package Test",
    param: "LTI-Package-Test",
  },
  {
    type: "ltiResourceLink",
    title: "MongoDB Test",
    param: "MongoDB-Test",
  },
  
];

const dummyCourses = [
  {
    name: "DevOps Test",
    dlx: [
      "Roll-a-ball",
      "React Multiplayer App",
      "launchtesting",
      "MP Circuits Lab 1",
      "MP Circuits Lab 2",
      "Powerline",
      "CORE Sandbox V2",
      "Public Health Inspection",
      "Trades Electrical",
      "Paramedic Ambulance",
      "LTI Package Test",
      "MongoDB Test"
    ],
  },
  
];

module.exports = {
  getContentsByCourse,
  getContentByParam,
  addDummyData,
};
