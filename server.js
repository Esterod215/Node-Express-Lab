const express = require('express');

const db = require('./data/db');

const server = express();

//middleWare
server.use(express.json());


server.get('/',(req,res) =>{
    res.send('Hello');
});
server.get('/api/posts', (req,res)=>{
    db.find()
    .then(posts=> {
        res.status(200).json({ success: true, posts }); // sets the Content-Type header
    
    }).catch(err=>{
        res.status(500).json({success:false, message:'The posts information could not be retrieved.'})
    })
});

server.post('/api/posts',(req,res)=>{
   const { title, contents, created_at, updated_at } = req.body;
    if(!title || !contents) {
        res.status(400).json({message:"Please provide title and contents for the post."})
        return;
    }
    
    db
    .insert({
        title, contents, created_at, updated_at
    })
    .then(response =>{
        res.status(201).json(response)
    }).catch(err=>{
        res.status(400).json({message: err})
        return;
    });
});

server.get('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    db
      .findById(id)
      .then(user => {
        if (user.length === 0) {
          res.status(404).json({success:false,message:'The post with the specified ID does not exist.'});
          return;
        }
        res.json(user);
      })
      .catch(error => {
        res.status(500).json({message:'The post information could not be retrieved.'});
      });
  });

  server.delete('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    db
      .remove(id)
      .then(response => {
        if (response === 0) {
          res.status(404).json({message:'The post with the specified ID does not exist.'});
          return;
        }
        res.json({ success: true,message:`Post with id: ${id} removed from system` });
      })
      .catch(error => {
        res.status(500).json({message:'The post could not be removed'});
        return;
      });
  });

  server.put('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    const { title, contents } = req.body;
    if (!contents || !title) {
      res.status(400).json({message:'Must provide name and bio'});
      return;
    }
    db
      .update(id, { title, contents })
      .then(response => {
        if (response == 0) {
            res.status(404).json({message:'The post with the specified ID does not exist.'});
          return;
        }
        db
          .findById(id)
          .then(user => {
            if (user.length === 0) {
              res.status(404).json({message:'Post with that id not found'});
              return;
            }
            res.json(user);
          })
          .catch(error => {
            res.status(500).json({message:'Error looking up Post'});
          });
      })
      .catch(error => {
        res.status(500).json({message:'The post information could not be modified.'});
        return;
      });
  });

  module.exports = server;