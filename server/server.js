const express = require('express')
const {Todo} = require('./models/todo')
const {ObjectId} = require('mongodb')
const {mongoose} = require('./db/mongoose.js')
const _ = require('lodash')
const bodyParser = require('body-parser')

var app = express();

var port = process.env.PORT || 3000

app.use(bodyParser.json())
////////////////////////////////////////////////////////////////////////
// R O U T I N G
////////////////////////////////////////////////////////////////////////

// T O D O S //

// C R E A T E   A   T O D O ///////////////////////////////////////////

app.post('/todos/', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  })
  todo.save().then((doc) => {
    res.send(doc)
  }, (e) => {
    res.status(400).send(e)
  })
})

// R E T R I E V E   T O D O S ///////////////////////////////////////////

app.get('/todos/', (req, res) => {
  Todo.find({}).then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  })
})

// R E T R I E V E   S P E C I F I C   T O D O   W I T H   I D ////////////

app.get('/todos/:id', (req, res) => {
  var id = req.params.id
  if(!ObjectId.isValid(id)){
    res.status(404).send('Invalid ID')
  }

  Todo.findById(id).then((doc) => {
    res.send(doc);
  }).catch((e) => {
    res.status(400).send(e)
  })
})

// R E T R I E V E   S P E C I F I C   T O D O   W I T H   T E X T /////

app.get('/lovey/', (req, res) => {
  res.send('LOVE YOU BABE!!!');
})

// R E M O V E   A   T O D O ///////////////////////////////////////////

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id
  if(!ObjectId.isValid(id)){
    return res.status(404).send('Invalid ID')
  }

  Todo.findByIdAndRemove(id).then((doc) => {
    if(!doc){
      return res.status(404).send('Todo not found')
    }
    res.send(doc);
  }).catch((e) => {
    res.status(400).send(e)
  })
})

// U P D A T E   A   T O D O ///////////////////////////////////////////

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id
  var body = _.pick(req.body, ['text', 'completed'])

  if(!ObjectId.isValid(id)){
    return res.status(404).send('Invalid ID')
  }

  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime()
  }else {
    body.completed = false
    body.completedAt = null
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((doc) => {
    if(!doc){
      return res.status(404).send('Todo not found')
    }
    res.send(doc)
  }).catch((e) => {
    res.status(400).send(e)
  })
})

////////////////////////////////////////////////////////////////////////
// L I S T E N E R
////////////////////////////////////////////////////////////////////////

app.listen(port, () => {
  console.log(`Server up on port number ${port}`)
})

// E X P O R T S ///////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////
