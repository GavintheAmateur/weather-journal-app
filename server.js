// Setup empty JS object to act as endpoint for all routes
let projectData = {};

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
    console.log("hello, I received your message!");
}
const server = app.listen(port, listening);



// Get Route
const getJournalHandler = (req,resp)=> {
    console.log(req)
    resp.send("hello world");
}

app.get('/all',getJournalHandler);
// Post Route
const postJournalHandler = ()=> {

}

app.post('/',postJournalHandler);
