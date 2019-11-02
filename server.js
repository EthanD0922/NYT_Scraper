var express = require('express');
var mongoose = require('mongoose');
var exphbs = require('express-handlebars');
var axios = require('axios');
var cheerio = require('cheerio');

var db = require('./models')

var PORT = process.env.PORT || 3030;

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

mongoose.connect('mongodb://localhost/NYTScraper', { useNewUrlParser: true })

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var router = require('./routes')

app.use(router)

app.listen(PORT, function() {
    console.log("Server listening on: http://localhost:" + PORT);
  });