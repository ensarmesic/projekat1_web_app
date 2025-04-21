const fs = require('fs');
const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const Goal = require('./models/goal');

const app = express();

// Kreiranje log stream-a za pristupne logove
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'logs', 'access.log'),
  { flags: 'a' }
);

app.use(morgan('combined', { stream: accessLogStream }));
app.use(bodyParser.json());

// CORS zaglavlja
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// GET ciljeva
app.get('/goals', async (req, res) => {
  console.log('Pokušaj dohvatanja ciljeva');
  try {
    const goals = await Goal.find();
    res.status(200).json({
      goals: goals.map((goal) => ({
        id: goal.id,
        text: goal.text,
      })),
    });
    console.log('Ciljevi dohvaćeni');
  } catch (err) {
    console.error('Greška pri dohvatanju ciljeva');
    console.error(err.message);
    res.status(500).json({ message: 'Greška pri prikazu ciljeva.' });
  }
});

// POST novi cilj
app.post('/goals', async (req, res) => {
  console.log('Pokušaj snimanja cilja');
  const goalText = req.body.text;

  if (!goalText || goalText.trim().length === 0) {
    console.log('Nevalidan ulaz - nema teksta');
    return res.status(422).json({ message: 'Nevalidan tekst cilja.' });
  }

  const goal = new Goal({ text: goalText });

  try {
    await goal.save();
    res
      .status(201)
      .json({ message: 'Snimljen cilj', goal: { id: goal.id, text: goalText } });
    console.log('Snimljen novi cilj');
  } catch (err) {
    console.error('Greška pri snimanju cilja');
    console.error(err.message);
    res.status(500).json({ message: 'Greška pri snimanju' });
  }
});

// DELETE cilj
app.delete('/goals/:id', async (req, res) => {
  console.log('Pokušaj brisanja cilja');
  try {
    await Goal.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Izbrisan cilj!' });
    console.log('Izbrisan cilj!');
  } catch (err) {
    console.error('Greška pri brisanju!');
    console.error(err.message);
    res.status(500).json({ message: 'Greška pri brisanju.' });
  }
});

// 🔧 Konekcija na MongoDB koristeći varijablu iz Docker okruženja
const dbURI = process.env.DB_URI;

mongoose.connect(
  dbURI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.error('Greška pri spajanju na MONGODB');
      console.error(err);
    } else {
      console.log('Spojen sa MONGODB');
      app.listen(5000);
    }
  }
);

