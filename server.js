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

app.get('/scrape', (req, res) => {
  axios.get("http://nytimes.com").then( response => {
    var $ = cheerio.load(response.data);

    $('.esl82me1').each((i, element) => {
      var result= {}; 

      result.link = $(element)
        .parent('a').attr('href');
      result.title = $(element)
        .children('h2').text();
      result.summary = $(element).parent()
        .find('p').text();

      db.Article.create(result).then(dbarticles => {
        console.log(dbarticles);
      }).catch(err => {
        console.log(err);
      })
    })
    res.send("scrape Complete")  
  })
})  

app.get('/load', (req, res) => {
  db.Article.find({}).then( dbArticle => {
    res.render('index', dbArticle)
  }).catch(err => {
    res.json(err)
  })
})

app.get('/', (req, res) => {
  res.render('index')
})


app.listen(PORT, function() {
    console.log("Server listening on: http://localhost:" + PORT);
  });