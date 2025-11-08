const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Officer = require('./models/officer');
const Event = require('./models/events');
const Product = require('./models/products');
const hbs = require('express-handlebars');

// Don't forget to terminal project folder and install packages.
// Input: npm install express express-handlebars mongoose express-session bcrypt body-parser
const Admin = require('./models/admin');
const session = require('express-session');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

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

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
