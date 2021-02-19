// Setup empty JS object to act as endpoint for all routes
let projectData = {
    journalEntries:[]
};

// Require Express to run server and routes
const express = require('express');
// Start up an instance of app
const app = express();
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());
// Initialize the main project folder
app.use(express.static('website'));

// Setup Server
const port = 5555;
// Callback to debug
const listening = () => {
    console.log(`start listing on ${port}`);
}
const server = app.listen(port, listening);

// Post Route
const postJournalHandler = (req,resp)=> {
    console.log(req)
    projectData.journalEntries.push(req.body);
    resp.send(projectData.journalEntries);
}
app.post('/journal/save',postJournalHandler);



