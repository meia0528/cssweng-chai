const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Officer = require('./models/officer');
const Event = require('./models/events');
const Product = require('./models/products');
const hbs = require('express-handlebars');
const Admin = require('./models/admin');
const session = require('express-session');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const upload = require('./config/multer.js');
const fs = require('fs');

// Don't forget to terminal project folder and install packages.
// Input: npm install express express-handlebars mongoose express-session bcrypt body-parser

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/CHAI', {
	 useNewUrlParser: true,
	 useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))

// ----MIDDLEWARE----
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
   secret: 'supersecretkey',
   resave: false,
   saveUninitialized: false
}));
app.use((req, res, next) => {
   res.locals.user = req.session.user;
   next();
})

//app.use('/post-mgmt', eventRouter); ---TBD ---

// ---HANDLEBARS----
app.engine('hbs', hbs.engine({extname: 'hbs'})); 
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// ----ROUTES----
app.get('/', (req, res) => {
  res.render('main', { Title: 'Home' });
});

app.get('/about-us', async(req, res) => {
    try {
        const officers = await Officer.find({ beneficiary: 'chai' }).lean();
        res.render('aboutchai', { Title: 'About Us', officers });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/donate-now', (req, res) => {
  res.render('donate', { Title: 'Donate Now' });
});

app.get('/batang-gift-of-love', async(req, res) => {
  try {
        const officers = await Officer.find({ beneficiary: 'bgl' }).lean();
        const allEvents = await Event.find({ beneficiary: 'bgl' }).lean();

        //sorting dates for upcoming & past events
        const today = new Date();

        const upcomingEvents = allEvents.filter(event => new Date(event.date) >= today)
                                        .sort((a, b) => new Date(a.date) - new Date(b.date));

        const pastEvents = allEvents.filter(event => new Date(event.date) < today)
                                    .sort((a, b) => new Date(b.date) - new Date(a.date));

        res.render('bgl', { Title: 'Batang Gift of Love', officers, upcomingEvents, pastEvents  });
        
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/likhang-maharlika', async(req, res) => {
  try {
      const officers = await Officer.find({ beneficiary: 'lm' }).lean();
      const products = await Product.find({ }).lean();  

      res.render('lm', { Title: 'Likhang Maharlika', officers, products });
  } catch(err) {
      res.status(500).json({ error: err.message });
  }
});

app.get('/gift-global', async(req, res) => {
  try {
      const events = await Event.find({ beneficiary: 'bgl' }).lean();

      res.render('gg', { Title: 'Gift Global', events });
  } catch(err) {
      res.status(500).json({ error: err.message });
  }
});

// ----REGISTRATION----
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async(req, res) => {
  const { username, password } = req.body;
  const exists = await Admin.findOne({ username });
  if (exists) return res.render('register', { error: 'Username already exists!' });
   
  const hashed = await bcrypt.hash(password, 10);
  const newAdmin = new Admin({ username, password: hashed });

  await newAdmin.save();
  res.redirect('/login');
});

// ----LOGIN----
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async(req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });
  if (!admin) return res.render('login', {error: 'User not found.'});

  if (!admin.password) return res.render('login', { error: 'No password set for this user.' });

  const passwordMatch = await bcrypt.compare(password, admin.password);
  if (!passwordMatch) return res.render('login', {error: 'Invalid password.'});

  req.session.user = { id: admin._id, username: admin.username };
  res.redirect('/centralhub');
});

function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
};

app.get('/centralhub', requireLogin, (req, res) => {
  res.render('centralhub', { username: req.session.user.username });
});

app.get('/logout', (req, res) =>{
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// ----POST MANAGEMENT----
app.get('showAllPosts', requireLogin, async (req, res) => {
  try{
    const allEvents = await Event.find().lean();
    res.render('postMgmnt-main', {allEvents});
  } catch (err) {
    console.error('Error fetching posts: ', err);
      res.status(500).json({error: err.message});
  }
});

app.get('displayPost/:id', requireLogin, async (req, res) => {
  try{ // removing {} around id might break something idk
    const postId = req.params.id;
    const post = await Event.findById({postId}).lean();
    res.render('postMgmnt-singlePost', {post});
  } catch (err) {
    console.error('Error fetching posts: ', err);
      res.status(500).json({error: err.message});
  }
});

app.post('/createPost', requireLogin, upload.single('formFile'), async (req, res) => {
    try {
      const { title, date, beneficiary, description } = req.body;
      //const imagePaths = req.files.map((file) => file.path.replace(/\\/g, '/')) || [];
      
      if(req.file){ 
        const imagePath = '/images/' + Date.now() + req.file.filename;
      } else { // places default image on post if no image uploaded
        const imagePath = '/images/logo.png';
      }

      const newEvent = new Event({
          title,
          date,
          image: imagePath,
          beneficiary,
          description
      });

      const allEvents = await Event.find().lean();
      await newEvent.save();
      res.render('postMgmnt-main', {message: 'Event post created successfully!', allEvents });

    } catch (err) {
      console.error('Error creating post: ', err);
      res.status(500).json({ message: 'Failed to create post. Please check your input.' });
    }
});

app.post('/deletePost/:id', requireLogin, async (req, res) => {
    // removing {} around id might break something idk
    const id = req.params.id;

    try {
      const post = await Event.findById(id);
      if (!post) 
        return res.status(404).json({ message: "Post not found." });
      const imagePath = post.image;
      await Event.findByIdAndDelete(id);

      imagePath = imagePath.replace('/images/', '');
      // delete the old image saved in images folder (only if it is not the default image)
      if (post.image !== '/images/logo.png') {
          const fullPath = path.join(process.cwd(), 'public', 'images', imagePath);

          fs.unlink(fullPath, (err) => {
              if (err) console.error("Failed to delete image:", imagePath, err.message);
              else console.log("Deleted image:", imagePath);
          }); 
        }

      const allEvents = await Event.find().lean();
      res.render('postMgmnt-main', {message: 'Event post deleted successfully!', allEvents });
    } catch (err) {
        console.error("Error deleting post: ", err);
        res.status(500).json({ message: "Failed to delete Post." });
    }
});

app.post('/updatePost/:id', requireLogin, upload.single('formFile'), async (req, res) => {
    try { // removing {} around id might break something idk
        const id = req.params.id;
        const { title, date, beneficiary, description } = req.body;

        const prevPost = await Post.findById(id);
        if (!prevPost) return res.status(404).json({ message: "Post not found." });

        if(req.file){ 
        const imagePath = '/images/' + Date.now() + req.file.filename;
        const oldImg = prevPost.image;
        const updatedPost = await Event.findByIdAndUpdate(
            id,
            {$set:{
                title,
                date,
                image: imagePath,
                beneficiary,
                description
              }     
            }, {
                new: true, runValidators: true 
            }
          );
          // Delete old image
          // remove leading 'images/' prevent duplicate in the code after this
            const oldFilename = oldImg.replace('/images/', '');

          // build absolute path from project root
          const fullPath = path.join(process.cwd(), 'public', 'images', oldFilename);
          try {
                await fs.promises.unlink(fullPath);
                console.log(`Deleted old image: ${oldFilename}`);
            } catch (err) {
                console.error(`Failed to delete image ${err.message}:`);
            }
        } else { // no new image
           const updatedPost = await Event.findByIdAndUpdate(
            id,
            {$set:{
                title,
                date,
                beneficiary,
                description
              }     
            }, {
                new: true, runValidators: true 
            }
          );
        }

        const allEvents = await Event.find().lean();
        res.render('postMgmnt-main', {message: 'Post updated successfully!', allEvents });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error updating post." });
    }
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
