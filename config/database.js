const { mongoose, ServerApiVersion } = require("mongoose");

// const { MONGO_URI } = process.env;
const password = "mosunmola";

// const username = "seun4ola";
exports.connect = () => {
  // Connecting to the database
  mongoose
    .connect(
      `mongodb+srv://cleanbreed:${password}@cluster0.jtdblyq.mongodb.net/?retryWrites=true&w=majority`,

      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: ServerApiVersion,
        //   useCreateIndex: true,
        //   useFindAndModify: false,
      }
    )
    .then(() => {
      console.log("connected to the database successfully");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};
