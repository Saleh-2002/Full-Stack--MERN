const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const app = express();
const PORT = 3001;
const print = console.log.bind(console);

app.use(methodOverride('_method', { methods: ['POST', 'GET'] }));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB server
mongoose.connect('mongodb://127.0.0.1:27017/Workers', { useNewUrlParser: true })
  .then(() => print('Connected To Mongo!'))
  .catch((err) => print(err));
const schema = mongoose.Schema({ Name: String, ID: Number });
const Task = mongoose.model('Task', schema);

// Create a new task
app.post('/create', async (req, res) => {
  const FirstTask = new Task({ Name: req.body.Name, ID: req.body.ID });
  await FirstTask.save().then(() => res.redirect("/"));
});

// Get all tasks
app.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.render("todo.ejs", { todotasks: tasks });
  } catch (error) { print(`Error Occuord: ${error}!`); }
});

// Delete One Task  
app.delete('/delete/:id', async (req, res) => {
  try {
    const delTask = await Task.deleteOne({ _id: req.params.id });
    res.redirect("/");
  } catch (error) { print(`Error Occuord: ${error}!`); }
});

// Update User Information
app.get('/update/:id', async (req, res) => {
  const id = req.params.id;
  const tasks = await Task.find({});
  const idTask = id; // Define the idTask variable
  res.render("todoEdit.ejs", { todotasks: tasks, idTask: id });
});
  
app.get('/About', (req, res) => {
  res.render('About.ejs')
});

app.get('/Contact', (req, res) => {
  res.render('Contact.ejs')
});
// Fixed code**
app.put('/update/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await Task.findByIdAndUpdate(id, { Name: req.body.Name, ID: req.body.ID });
    res.redirect("/");
  }
  catch (error) {
    console.error(`Error occurred: ${error}`);
    res.status(500).send("Internal Server Error");
  }
});
// Start the server 
app.listen(PORT, () => MessagePort, print(`Server Working Successfully on port ${PORT}!`))
app.get('/', (req, res) => res.send(`<h1> Listening on port 3001 </h1>`));