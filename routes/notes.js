const express = require('express');
const router = express.Router();
const fetchuser = require('../middle/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');
const multer = require('multer');

const mongoose = require('mongoose');
const  User =require('../models/User')














router.post('/addnotes',fetchuser,
 [
  body('title', 'Enter a valid title').isLength({ min: 3 }),
  body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),], 
  async (req, res) => {
    let success = false;
    
    const usern = await User.findById(req.user.id);
    try {
          const { title, description,tags } = req.body;
          const titlearray = title.split(" ").map(word => word.trim()).filter(word => word !== '');
        
          const tagarray = tags.split("#").map(word => word.trim()).filter(word => word !== '');
          const combined = titlearray.concat(tagarray).concat(usern.username); 
          const errors = validationResult(req);



          if (!errors.isEmpty()) {
              return res.status(400).json(success);
          }
          const note = new Notes({
              title, description, user:req.user.id,tags,a:combined,nk:usern.username
          })
          const savedNote = await note.save()
success=true

          res.json(success)

      } catch (error) {
          console.error(error.message);
          res.status(500).json(success);

      }

  }


)




//getnoted






router.get('/fetchnotes', fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});







// Update a note





router.put('/updatenote/:id', fetchuser,  async (req, res) => {
  let success = false;

  try {
    const { title, description, tags } = req.body;
    const newNote = {};
    const titlearray = title && typeof title === 'string' ? title.split(" ").map(word => word.trim()).filter(word => word !== '') : [];

   
    const tagarray = tags && typeof tags === 'string' ? tags.split("#").map(word => word.trim()).filter(word => word !== '') : [];
    const combined = titlearray.concat( tagarray);


    if (title) newNote.title = title;
    if (description) newNote.description = description;
  
    if (tags) newNote.tags =tags;
    if (tags) newNote.a =combined;

    let note = await Notes.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ success, message: "Note not found" });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ success, message: "Not authorized" });
    }

    note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
    success = true;

    res.json({ success, note });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success, error: error.message });
  }
});

// Delete a note
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
  try {
    let note = await Notes.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await Notes.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Find a specific note
router.get('/findnotes/:id', fetchuser, async (req, res) => {
  try {
    let note = await Notes.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});


//search

router.post('/search', async (req, res) => {
let success =false;

  try {
    const { search } = req.body;

    if (!search) {
      return res.status(400).json(success);
    }
  
   
    const searchArray = search.split(' ').map(word => word.trim()).filter(word => word !== '');

    const query = {
      a: { $in: searchArray }
    };


    const notes = await Notes.find(query);

    if (notes.length === 0) {
      return res.status(404).json(success);
    }
success=true

    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).json(success);
  }
});


module.exports = router;



//fetch all notes

router.get('/all',  async (req, res) => {
  try {
    const notes = await Notes.aggregate([
      { $sample: {size: 100}}
    ]);
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});




