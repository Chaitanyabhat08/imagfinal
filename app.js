const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
// const socketIO = require('socket.io);
const http = require('http');
const dotenv = require('dotenv');
const connect = require('./config/database');
const connectDatabase = require('./config/database');
const cloudinary = require('cloudinary');
dotenv.config({ path: '../config/.env' });
const Post = require('./models/post');

const app = express();
const server = http.createServer(app); // Create an HTTP server
// const io = socketIO(server); // Pass the server instance to Socket.io

const setupSwagger = require('./swagger');

const user = require('./routes/userRoute');
const posts = require('./routes/postRoute');
const comments = require('./routes/commentRoute');
const likes = require('./routes/likeRoute');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cookieParser());


app.set('view-engine', 'ejs');

app.get("/", (req, res) => {
  res.render('welcome');
});

app.use("/users", user);
app.use("/posts", posts);
app.use("/comments", comments);
app.use("/likes", likes);
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
const io = require("socket.io")(3000, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  }
});
io.on('connection', (socket) => {
  console.log('A user connected', socket.id);
  socket.on('newComment', async(postId, comment )  => {
    try {
      const post = await Post.findById(postId);
      console.log('New comment received:', postId, comment);
      post.comments.push({ text: comment, post: postId });
      await post.save();
      io.emit("commented", postId, comment)
      //socket.broadcast.emit('commented', { postId, comment });
    } catch (error) {
      console.error('Error saving comment:', error);
    }
  });

  socket.on('newPost', async (postData) => {
    try {
      console.log('New post received:', postData);
      const post = new Post({
        title: postData.title,
        caption: postData.caption,
        image: postData.image
      });
      await post.save();
      socket.broadcast.emit('newPost', post);
    } catch (error) {
      console.error('Error saving post:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});
// io.on('connection', (socket) => {
//   console.log('A user connected', socket.id);

// });
setupSwagger(app);
process.on('uncaughtException', err => {
  console.log("Error: " + err.message);
  console.log('Shutting down server due to uncaught Exception: ' + err.stack);
  server.close(() => {
    process.exit(1);
  });
});
server.listen(8080, () => {
  console.log('Server is running on port 8080');
});

//Handling uncaught exceptions

dotenv.config({ path: './config/.env' });
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})
connectDatabase();
module.exports = app;

// app.route('/example')
//   .get((req, res) => {
//     // logic for handling GET request
//     res.send('This is a GET request')
//   })
//   .post((req, res) => {
//     // logic for handling POST request
//     res.send('This is a POST request')
//   })