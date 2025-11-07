const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Officer = require('./models/officer');
const Event = require('./models/events');
const Product = require('./models/products');
const hbs = require('express-handlebars');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/CHAI', {
	 useNewUrlParser: true,
	 useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))

app.use(express.static(path.join(__dirname, 'public')));

app.engine('hbs', hbs.engine({extname: 'hbs'})); 
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

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

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
