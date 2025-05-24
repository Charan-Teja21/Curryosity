//create user-api app
const exp = require("express")
const userApp = exp.Router();
const multer = require('multer');
const bcryptjs = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/verifyToken")
// const commonApp = require("./common-api");
require('dotenv').config()

//
// Configure multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
//


//get userscollection 
let userscollection;
userApp.use((req, res, next) => {
  userscollection = req.app.get("userscollection");
  next();
})

//get orderscollection
let orderscollection;
userApp.use((req, res, next) => {
  orderscollection = req.app.get("orderscollection");
  next();
})

//get recipescollection
let recipescollection;
userApp.use((req, res, next) => {
  recipescollection = req.app.get("recipescollection");
  next();
})

//Get chat collection
let chatcollection;
userApp.use((req, res, next) => {
  chatcollection = req.app.get("chatcollection");
  next();
});

//user registration route
// user registration route
userApp.post('/user', expressAsyncHandler(async (req, res) => {
  // get user resource from client
  const newUser = req.body;
  console.log(newUser);

  // check for duplicate username
  const dbUser = await userscollection.findOne({ username: newUser.username });

  // duplicate found
  if (dbUser !== null) {
     res.send({ message: "username already exist" });
  } 

  // hash password
  let hashedPassword = await bcryptjs.hash(newUser.password, 5);

  // replace plain password with hashed password
  newUser.password = hashedPassword;

  // save in the db
  await userscollection.insertOne(newUser);
  
   res.send({ message: "User Created" });
}));


//user login route
userApp.post("/login", expressAsyncHandler(async (req, res) => {
  // get user credential details from body
  let userCredential = req.body;

  // find username
  let dbUser = await userscollection.findOne({ username: userCredential.username });

  // user not exist
  if (dbUser === null) {
    return res.send({ message: "Invalid Username" });
  }

  // check password
  const status = await bcryptjs.compare(userCredential.password, dbUser.password);

  // password wrong
  if (status === false) {
    return res.send({ message: "Invalid Password" });
  }

  // create jwt token
  let signedToken = jwt.sign({ username: dbUser.username },process.env.SECRET_KEY, { expiresIn: "30d" });

  // send jwt
  return res.send({ message: "Login Success", token: signedToken, user: dbUser });
}));  

// adding new recipe by author
userApp.post('/recipe', expressAsyncHandler(async (req, res) => {
  // get new article by author
  const newRecipe = req.body;
  // post to articles collection
  await recipescollection.insertOne(newRecipe);
  // send res
  res.send({ message: "New Recipe created" })
}))

// get recipes of all users
userApp.get('/recipe', expressAsyncHandler(async (req, res) => {
  // get recipescollection form express app
  const recipescollection = req.app.get('recipescollection')
  // get all recipes
  let recipeList = await recipescollection.find({ status: true }).toArray()
  // send res
  res.send({ message: "articles", payload: recipeList })
}))

//modify recipe by user
userApp.put('/recipe',expressAsyncHandler(async (req, res) => {
  //get modified recipe from client
  const modifiedRecipe = req.body;

  //update by recipe id
  let result = await recipescollection.updateOne({ recipeid: modifiedRecipe.recipeid }, { $set: { ...modifiedRecipe } })
  let latestRecipe = await recipescollection.findOne({ recipeid: modifiedRecipe.recipeid })
  res.send({ message: "Recipe modified", article: latestRecipe })
}))

// delete an recipe by recipeid 
userApp.put('/recipe/:recipeid',expressAsyncHandler(async(req,res)=>{
  // get recipeid from url
  const recipeIdFromUrl = req.params.recipeid;
  // update status of recipe to false
  await recipescollection.updateOne({recipeid:recipeIdFromUrl},{$set:{status:false}})
  res.send({message:'recipe removed'})
}))

// read recipes of user
userApp.get('/recipes/:username',expressAsyncHandler(async(req,res)=>{
  // get user's username from url
  const userName=req.params.username
  // get recipes whose status is true
  const recipesList=await recipescollection.find({status:true,username:userName}).toArray()
  res.send({message:"List of recipes",payload:recipesList})
}))

// get orders of all users
userApp.get('/orders',expressAsyncHandler(async(req,res)=>{
  // get orderscollection form express app
  const orderscollection = req.app.get('orderscollection')
  // get all orders
  let orderList = await orderscollection.find().toArray()
  // send res
  res.send({ message: "orders", payload: orderList })
}
))

// restore an recipe by recipe id
userApp.put('/restorerecipe/:recipeid',expressAsyncHandler(async(req,res)=>{
   // get recipeid from url
   const recipeIdFromUrl = req.params.recipeid;
   // update status of recipe to false
   await recipescollection.updateOne({recipeid:recipeIdFromUrl},{$set:{status:true}})
  res.send({message:'recipe restored'})
}))

// read deleted recipes by user
userApp.get('/deletedRecipes/:username',expressAsyncHandler(async(req,res)=>{
  // get user's username from url
  const userName=req.params.username
  // get recipeList whose status is false
  const recipeList=await recipescollection.find({status:false,username:userName}).toArray()
  res.send({message:"List of recipes",payload:recipeList})
}))

// post reviews for an recipe by recipe id
userApp.post('/review/:recipeId',expressAsyncHandler(async(req,res)=>{
  // get user review obj
  const userReview=req.body
  // get reviewId by url parameter
  const recipeIdFromUrl = (req.params.recipeId);
  // insert userComment object to comments array of article by id
  const result=await recipescollection.updateOne({recipeid:recipeIdFromUrl},{$addToSet:{reviews:userReview}})
  console.log(result)
  res.send({message:"review posted"})
}))

// get recipe by recipeid
userApp.get('/recip/:recipeId',expressAsyncHandler(async(req,res)=>{
  // get reviewId by url parameter
  const recipeIdFromUrl = (req.params.recipeId);
  // find the recipe by its id
  const result = await recipescollection.findOne({recipeid:recipeIdFromUrl})
  // console.log(result)
  res.send({message:"recipe",payload:result})
}))

// //update user image
// userApp.put('/updateimage/:username',expressAsyncHandler(async(req,res)=>{
//   // get user's username from url
//   const userName=req.params.username
//   // get user's image from body
//   const userImae=req.body
//   // update user's image
//   console.log(userImae);
//   const result=await userscollection.updateOne({username:userName},{$set:{userImage:userImae.imgUrl}})
//   res.send({message:"image updated"})
//   }))

//
userApp.post(
  '/upload-profile-image/:username',
  upload.single('profileImage'),
  expressAsyncHandler(async (req, res) => {
    const username = req.params.username;
    const image = req.file;

    if (!image) {
      return res.status(400).send({ message: 'No image provided' });
    }

    // Prepare image as base64 string with content type
    const imageData = {
      data: image.buffer.toString('base64'),
      contentType: image.mimetype,
    };

    await userscollection.updateOne(
      { username },
      { $set: { profileImage: imageData } }
    );

    res.send({ message: 'Image uploaded successfully' });
  })
);

userApp.get('/user/:username', expressAsyncHandler(async (req, res) => {
  const username = req.params.username;
  const user = await userscollection.findOne({ username });
  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }
  res.send({ user });
}));

// Get all chat messages (public)
userApp.get('/community/messages', expressAsyncHandler(async (req, res) => {
  const messages = await chatcollection.find().sort({ timestamp: 1 }).toArray();
  res.send({ messages });
}));

// Post a new chat message (authenticated)
userApp.post('/community/message', verifyToken, expressAsyncHandler(async (req, res) => {
  const { username, message } = req.body;
  if (!message || !username) return res.status(400).send({ message: "Invalid" });
  const chatMsg = {
    username,
    message,
    timestamp: new Date()
  };
  await chatcollection.insertOne(chatMsg);
  res.send({ message: "Message sent" });
}));

//export user App
module.exports = userApp;