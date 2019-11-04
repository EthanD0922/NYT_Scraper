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
    console.log(dbArticle)
    const data = {
      data: dbArticle
    }
    res.render('index', data)
  }).catch(err => {
    res.json(err)
  })
})

app.post('/note/:id', (req, res) => {
  db.Note.create(req.body).then(dbNote => {
    return db.Article.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id}, {new: true})
  })
  .then(dbArticle => {  
    const data = {
      data: dbArticle
    }
    res.render('index', data)
  }).catch(err => {
    res.json(err)
  })
})

app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note").then(function(dbArticle) {
      const data = {
        data: dbArticle
      }
      res.render('index', data)
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get('/', (req, res) => {
  res.render('index')
})


app.listen(PORT, function() {
    console.log("Server listening on: http://localhost:" + PORT);
  });