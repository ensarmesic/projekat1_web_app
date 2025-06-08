const fs = require('fs');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const Goal = require('./models/goal');

const app = express();
const router = express.Router();

// ✔️ Kreiranje logs foldera ako ne postoji
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const accessLogStream = fs.createWriteStream(
  path.join(logDir, 'access.log'),
  { flags: 'a' }
);

app.use(morgan('combined', { stream: accessLogStream }));
app.use(bodyParser.json());

// ✔️ CORS zaglavlja
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// ✔️ API rute pod '/api'
router.get('/goals', async (req, res) => {
  try {
    const goals = await Goal.find();
    res.status(200).json({
      goals: goals.map((goal) => ({
        id: goal.id,
        text: goal.text,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: 'Greška pri prikazu ciljeva.' });
  }
});

router.post('/goals', async (req, res) => {
  const goalText = req.body.text;

  if (!goalText || goalText.trim().length === 0) {
    return res.status(422).json({ message: 'Nevalidan tekst cilja.' });
  }

  const goal = new Goal({ text: goalText });

  try {
    await goal.save();
    res.status(201).json({ message: 'Snimljen cilj', goal: { id: goal.id, text: goalText } });
  } catch (err) {
    res.status(500).json({ message: 'Greška pri snimanju' });
  }
});

router.delete('/goals/:id', async (req, res) => {
  try {
    await Goal.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Izbrisan cilj!' });
  } catch (err) {
    res.status(500).json({ message: 'Greška pri brisanju.' });
  }
});

app.use('/api', router);

// 🔧 Konekcija na MongoDB
const dbURI = process.env.DB_URI;

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Spojen sa MONGODB');
    app.listen(5000, () => {
      console.log('Server slusa na portu 5000');
    });
  })
  .catch(err => {
    console.error('Greška pri spajanju na MONGODB');
    console.error(err);
  });
