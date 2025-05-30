//create express modules
const exp = require("express");
const app = exp()
const path = require("path")
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') })

// deploy react build in this server
app.use(exp.static(path.join(__dirname, "../frontend/build")))

//import mongoclient
const mongoClient = require("mongodb").MongoClient;

//body parser middleware
app.use(exp.json());

//connect to database
mongoClient.connect(process.env.DB_URL)
  .then(client => {
    //get db obj
    const recipedb = client.db('recipedb');
    //get collection obj
    const userscollection = recipedb.collection("userscollection")
    const recipescollection = recipedb.collection("recipescollection");
    const orderscollection = recipedb.collection("first");
    const chatcollection = recipedb.collection('chatcollection');
    const personalcollection = recipedb.collection('personalcollection');
    const personalChatRequests = recipedb.collection('personalChatRequests');
    //share collection obj with exp app
    app.set("orderscollection",orderscollection);
      //share collection obj with exp app
      app.set("userscollection",userscollection);
      app.set("recipescollection",recipescollection);
      app.set('chatcollection', chatcollection);
      app.set('personalcollection', personalcollection);
      app.set('personalChatRequests', personalChatRequests);
      //confirm connection status
      console.log("DB is connected");
  })
  .catch(err => {
    console.log("Error in connection", err);
  })


//import api routes
const userApp = require("./APIs/user-api")

//if patr starts with user-api,send request to userApi
app.use("", userApp);




//details with page refresh

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"))
})

//exp err handler
app.use((err, req, res, next) => {
  res.send({ message: "Error", payload: err.message});
})
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server is running on port : ${port}`))
