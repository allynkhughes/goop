var express = require('express');
var router = express.Router();
var moment = require('moment');

module.exports = router;




// =========================================================
// =
// =   SET UP MONGODB AND MONGOOSE
// =

// MongoDB is a JavaScript-oriented database.
// http://docs.mongodb.org/manual/core/crud-introduction/

// --> In Cloud9, you need to start MongoDB before running your app by typing 
// ./mongod 
// at the terminal ("bash" window). But you only need to do that once per workspace. 
// MongoDB should run forever after that.

// Mongoose makes it easy to access MongoDB using a pattern of "models".
// http://mongoosejs.com

// Use Mongoose to connect to the MongoDB database. We'll call our
// database "networks". It will be created automatically if it doesn't already exist.

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || ('mongodb://' + process.env.IP + '/networks'));




// =========================================================
// =
// =   DEFINE OUR DATA MODELS
// =

// Define the data structure of a Phrase model
// It has width, height, top, and left attributes, which are required to be numbers from 0–100
// And it has a color attribute, which is optionaland is a string (text)
// Allowed data types (Number, String, Date...): http://mongoosejs.com/docs/schematypes.html

var Image = mongoose.model('Image', {
  layers: {type: String, required: true, get: function(string) { return string.split(','); }},
});





// =========================================================
// =
// =   WEB ROUTES
// =


// HOME PAGE
// /
// Just redirect to /new

router.get('/', function(request, response, toss) {
  response.redirect('/new');
});



// ARCHIVE PAGE
// /archive
// Shows _all_ the phrases

router.get('/archive', function(request, response, toss) {
  
  // When the server receives a request for "/", this code runs

  // Find all the Shape records in the database
  Image.find().sort({_id: -1}).exec(function(err, images) {
    // This code will run once the database find is complete.
    // images will contain a list (array) of all the images that were found.
    // err will contain errors if any.

    // If there's an error, tell Express to do its default behavior, which is show the error page.
    if (err) return toss(err);
    
    // The list of images will be passed to the template.
    // Any additional variables can be passed in a similar way (response.locals.foo = bar;)
    response.locals.images = images;
    

    // layout tells template to wrap itself in the "layout" template (located in the "views" folder).
    response.locals.layout = 'layout';

    // Render the "home" template (located in the "views" folder).
    response.render('archive');

  });
  
});




// SHOW PAGE
// /show?id=54e2058e85b156d10b064ca0
// Shows a _single_ phrase

router.get('/show', function(request, response, toss) {
  
  // When the server receives a request for "/show", this code runs
  
  // Find a Phrase with this id
  Image.findOne({_id: request.query.id}, function(err, phrase) {
    // This code will run once the database find is complete.
    // image will contain the found image.
    // err will contain errors if any (for example, no such record).

    if (err) return toss(err);
    
    response.locals.image = image;
    response.locals.layout = 'layout';
    response.render('show');
    
  });
  
});



// NEW PAGE
// /new

router.get('/new', function(request, response) {

  // When the server receives a request for "/new", this code runs
  
  // Just render a basic HTML page with a form. We don't need to pass any variables.

  response.locals.layout = 'layout';
  response.render('new');
  
  // Please see views/new.hbs for additional comments
  
});



// CREATE PAGE
// /create?width=25&height=25&top=25&left=25&color=#ff0000
// Normally you get to this page by clicking "Submit" on the /new page, but
// you could also enter a URL like the above directly into your browser.

router.get('/create', function(request, response, toss) {
  
  // When the server receives a request for "/create", this code runs
  
  response.locals.layout = 'layout';

  // Make a new Phrase in memory, with the parameters that come from the URL 
  // ?width=25&height=25&top=25&left=25&color=#ff0000
  // and store it in the shape variable
  var image = new Image({
    layers: request.query.layers,
  });
  
  // Now save it to the database
  image.save(function(err) {
    // This code runs once the database save is complete

    // An err here can be due to validations
    if (err) return toss(err);
    
    // Redirect to the archive page after successful save
    response.redirect('/archive');

  });
  
});



// ABOUT PAGE
// /about

router.get('/about', function(request, response) {

  // When the server receives a request for "/about", this code runs

  response.locals.layout = 'layout';
  response.render('about');
  
});
