// Import required modules and js files
const express = require("express");
const fs = require("fs");
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// PORT to connect to server and start using express
const PORT = process.env.PORT || 3001;
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use the public folder
app.use(express.static('public'));

// initial link should go to index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

// /notes path should go to the notes.html file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})


// CONNECTING BACK-END TO FRONT-END

// get data from db.json and return it to front-end in json format
app.get('/api/notes', (req, res) => {
    console.log(`${req.method} request received`);
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if(err){
            console.error(err);
        }
        const storedData = JSON.parse(data);
        res.json(storedData); 
    })
})

// update db.json with the new note
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    // console.log(newNote);
    console.log(`${req.method} request received`);

    if (req.body){
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                newNote.id = uuidv4(); // give each note a unique ID
                const parsedData = JSON.parse(data);
                parsedData.push(newNote);
                fs.writeFile("./db/db.json", JSON.stringify(parsedData), (err) => {
                    err? console.error(err) : console.log("Successfully updated!")
                    res.json(newNote);
                })
            }
        })
    } else {
        console.error("Error in adding tip");
    }

})

// delete the note that has the passed specific ID
app.delete('/api/notes/:id', (req, res) => {
    console.log(`${req.method} request received`);
    
    if (req.params.id){
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                const parsedData = JSON.parse(data);
                for (let i = 0; i < parsedData.length; i++) {
                    const note = parsedData[i];
                    if (req.params.id === note.id){
                        parsedData.splice(i, 1);
                    }
                }
                // console.log(parsedData);
                fs.writeFile("./db/db.json", JSON.stringify(parsedData), (err) => {
                    err? console.error(err) : console.log("Successfully updated!")
                    res.json(req.params.id);
                })
            }
        })
    };
})

// listen to PORT, start server upon running
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);