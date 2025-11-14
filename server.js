const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const hbs = require('express-handlebars');
const session = require('express-session');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const upload = require('./config/multer.js');
const fs = require('fs');

const Officer = require('./models/officer');
const Event = require('./models/events');
const Product = require('./models/products');
const Admin = require('./models/admin');
const Donate = require('./models/donate');

// Don't forget to terminal project folder and install packages.
// Input: npm install express express-handlebars mongoose express-session bcrypt body-parser

const app = express();
const port = 3000;

const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/CHAI';

mongoose.connect(dbUrl, {
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
        res.render('aboutchai', { Title: 'About Us' });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/donate-now', async(req, res) => {
  try{
    const info = await Donate.findOne();

    const name = info ? info.name : 'Not Available';
    const contactNo = info ? info.contactNo : 'Not Available';

    res.render('donate', { Title: 'Donate Now', name: name, contactNo: contactNo });
  } catch(err){
    res.status(500).json({ error: err.message });
  }
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
      const events = await Event.find({ beneficiary: 'gg' }).lean();

      res.render('gg', { Title: 'Gift Global', events });
  } catch(err) {
      res.status(500).json({ error: err.message });
  }
});

// ----REGISTRATION----
app.get('/register', (req, res) => {
  res.render('register', { Title: '(ADMIN) Register' });
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
  res.render('login', { Title: '(ADMIN) Login'});
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
  res.render('centralhub', { Title: '(ADMIN) Central Hub', username: req.session.user.username });
});

app.get('/logout', (req, res) =>{
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// ----DONATE PAGE ADMIN----
app.get('/admin/donate-edit', requireLogin, async(req, res) =>{
  try{
    const prevInfo = await Donate.findOne().lean();
    res.render('admindonate', { Title: '(ADMIN) Edit Donate Page Contact Details', donateInfo: prevInfo });
  } catch(err){
    res.status(500).json({ error: err.message });
  }
});

app.post('/admin/donate-edit', requireLogin, async(req, res) =>{
  try{
    const { name, contactNo } = req.body;
    const prevInfo = await Donate.findOne().lean();
    if (prevInfo){
      await Donate.updateOne({}, { name, contactNo });
    } else { // when there is nothing in donate database, create a new one
      const newDonate = new Donate({
          name: name,
          contactNo: contactNo
      });
      await newDonate.save();
    }
    
    res.redirect('/admin/donate-edit?updated=true');
  } catch(err){
    res.status(500).json({ error: err.message });
  }
});

// ----POST MANAGEMENT----
app.get('/admin/showBGLPosts', requireLogin, async (req, res) => {
  try{
    const bglEvents = await Event.find({ beneficiary: 'bgl' }).lean();
    const sorted = bglEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.render('postMgmnt-BGL', {Title: '(ADMIN) Edit BGL Posts', bglEvents: sorted});
  } catch (err) {
    console.error('Error fetching BGL posts: ', err);
    res.status(500).json({error: err.message});
  }
});

app.get('/admin/showGGPosts', requireLogin, async (req, res) => {
  try{
    const ggEvents = await Event.find({ beneficiary: 'gg' }).lean();
    const sorted = ggEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.render('postMgmnt-GG', {Title: '(ADMIN) Edit GG Posts', ggEvents: sorted});
  } catch (err) {
    console.error('Error fetching GG posts: ', err);
    res.status(500).json({error: err.message});
  }
});

function fetchDate(date) {
  let newDate = '';
  let month = String(date.getMonth() + 1).padStart(2, '0');
  let day = String(date.getDate()).padStart(2, '0');
  let year = date.getFullYear();

  newDate = year + '-' + month + '-' + day;
  return newDate;
};

app.get('/admin/editBGLPost/:id', requireLogin, async (req, res) => {
  try{ 
    const id = req.params.id;
    const post = await Event.findById(id).lean();

    const date = new Date(post.date);
    const formattedDate = fetchDate(date);
    res.render('postMgmnt-editBGLPost', {Title: '(ADMIN) Edit BGL Post Contents', post, date: formattedDate });
  } catch (err) {
    console.error('Error fetching BGL post: ', err);
    res.status(500).json({error: err.message});
  }
});

app.get('/admin/editGGPost/:id', requireLogin, async (req, res) => {
  try{ 
    const id = req.params.id;
    const post = await Event.findById(id).lean();

    const date = new Date(post.date);
    const formattedDate = fetchDate(date);
    res.render('postMgmnt-editGGPost', {Title: '(ADMIN) Edit GG Post Contents', post, date: formattedDate });
  } catch (err) {
    console.error('Error fetching GG post: ', err);
    res.status(500).json({error: err.message});
  }
});

app.get('/admin/menuCreateBGLPost', requireLogin, async (req, res) => {
  try{
    res.render('postMgmnt-createBGLPost', {Title: '(ADMIN) Create BGL Post'});
  } catch (err) {
    console.error('Error finding create BGL posts menu: ', err);
    res.status(500).json({error: err.message});
  }
});

app.get('/admin/menuCreateGGPost', requireLogin, async (req, res) => {
  try{
    res.render('postMgmnt-createGGPost', {Title: '(ADMIN) Create GG Post'});
  } catch (err) {
    console.error('Error finding create GG posts menu: ', err);
    res.status(500).json({error: err.message});
  }
});

function formatDate(dateString) {
  let newDate = '';
  let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  let month = monthNames[dateString.getMonth()]; 
  let day = dateString.getDate();
  let year = dateString.getFullYear();

  newDate = month + ' ' + day + ', ' + year;
  return newDate;
};

app.post('/admin/createBGLPost', requireLogin, upload.single('formFile'), async (req, res) => {
    try {
      const { title, date, description } = req.body;
      //const imagePaths = req.files.map((file) => file.path.replace(/\\/g, '/')) || [];
      const beneficiary = 'bgl';
      let imagePath = '';
      const selectedDate = new Date(date);
      let newDate = formatDate(selectedDate);

      if(req.file){ 
        imagePath = '/images/' + req.file.filename;
      } else { // places default image on post if no image uploaded
        imagePath = '/images/favicon.png';
      }

      const newEvent = new Event({
          title,
          date: newDate,
          image: imagePath,
          beneficiary: beneficiary,
          description
      });

      await newEvent.save();
      res.redirect('/admin/menuCreateBGLPost?updated=true');
    } catch (err) {
      console.error('Error creating post: ', err);
      res.status(500).json({ message: 'Failed to create post. Please check your input.' });
    }
});

app.post('/admin/createGGPost', requireLogin, upload.single('formFile'), async (req, res) => {
    try {
      const { title, date, description } = req.body;
      //const imagePaths = req.files.map((file) => file.path.replace(/\\/g, '/')) || [];
      const beneficiary = 'gg';
      let imagePath = '';
      const selectedDate = new Date(date);
      let newDate = formatDate(selectedDate);

      if(req.file){ 
        imagePath = '/images/' +  req.file.filename;
      } else { // places default image on post if no image uploaded
        imagePath = '/images/favicon.png';
      }

      const newEvent = new Event({
          title,
          date: newDate,
          image: imagePath,
          beneficiary: beneficiary,
          description
      });

      await newEvent.save();
      res.redirect('/admin/showGGPosts');
      
    } catch (err) {
      console.error('Error creating post: ', err);
      res.status(500).json({ message: 'Failed to create post. Please check your input.' });
    }
});

app.post('/admin/deleteBGLPost/:id', requireLogin, async (req, res) => {
    const id = req.params.id;

    try {
      const post = await Event.findById(id);
      if (!post) 
        return res.status(404).json({ message: "Post not found." });
      let imagePath = post.image;
      await Event.findByIdAndDelete(id);

      imagePath = imagePath.replace('/images/', '');
      // delete the old image saved in images folder (only if it is not the default image)
      if (post.image !== '/images/favicon.png') {
          const fullPath = path.join(process.cwd(), 'public', 'images', imagePath);

          fs.unlink(fullPath, (err) => {
              if (err) console.error("Failed to delete image:", imagePath, err.message);
              else console.log("Deleted image from deleted post:", imagePath);
          }); 
        }

      res.redirect('/admin/showBGLPosts');
    } catch (err) {
      console.error("Error deleting post: ", err);
      res.status(500).json({ message: "Failed to delete Post." });
    }
});

app.post('/admin/deleteGGPost/:id', requireLogin, async (req, res) => {
    const id = req.params.id;

    try {
      const post = await Event.findById(id);
      if (!post) 
        return res.status(404).json({ message: "Post not found." });
      let imagePath = post.image;
      await Event.findByIdAndDelete(id);

      imagePath = imagePath.replace('/images/', '');
      // delete the old image saved in images folder (only if it is not the default image)
      if (post.image !== '/images/favicon.png') {
          const fullPath = path.join(process.cwd(), 'public', 'images', imagePath);

          fs.unlink(fullPath, (err) => {
              if (err) console.error("Failed to delete image:", imagePath, err.message);
              else console.log("Deleted image from deleted post::", imagePath);
          }); 
        }

      res.redirect('/admin/showGGPosts');
    } catch (err) {
      console.error("Error deleting post: ", err);
      res.status(500).json({ message: "Failed to delete Post." });
    }
});

app.post('/admin/editPost/:id', requireLogin, upload.single('formFile'), async (req, res) => {
    try { 
        const id = req.params.id;
        const { title, date, description } = req.body;

        const prevPost = await Event.findById(id);
        if (!prevPost) return res.status(404).json({ message: "Post not found." });
        const oldImg = prevPost.image;
        const selectedDate = new Date(date);
        let newDate = formatDate(selectedDate);

        if(req.file){ 
        const imagePath = '/images/' + req.file.filename;
        const updatedPost = await Event.findByIdAndUpdate(
            id,
            {$set:{
                title,
                date: newDate,
                image: imagePath,
                description
              }     
            }, {
                new: true, runValidators: true 
            }
          );
          // Delete old image (if it is not the default image)
          // remove leading 'images/' prevent duplicate in the code after this
          if (oldImg !== '/images/favicon.png'){
            const oldFilename = oldImg.replace('/images/', '');

            // build absolute path from project root
            const fullPath = path.join(process.cwd(), 'public', 'images', oldFilename);
            try {
              await fs.promises.unlink(fullPath);
              console.log(`Deleted old image: ${oldFilename}`);
            } catch (err) {
              console.error(`Failed to delete image ${err.message}:`);
            }
          } 
        } else { // no new image
           const updatedPost = await Event.findByIdAndUpdate(
            id,
            {$set:{
                title,
                date: newDate,
                description
              }     
            }, {
                new: true, runValidators: true 
            }
          );
        }

        if (prevPost.beneficiary === 'bgl'){
          res.redirect('/admin/showBGLPosts');
        } else {
          res.redirect('/admin/showGGPosts');
        } 
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error updating post." });
    }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
