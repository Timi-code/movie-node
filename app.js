const express = require("express");
const serveStatic = require("serve-static");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const _ = require("underscore");
const Movie = require("./models/movie");
const port = process.env.PORT || 3000;
const app = express();


mongoose.connect('mongodb://localhost/study');


app.set("views", "./views/pages");
app.set("view engine", "jade");
//app.use(express.bodyParser())
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.static(path.join(__dirname, "bower_components")));
app.use(serveStatic("public"));
app.locals.moment = require("moment");

app.listen(port);

console.log("服务启动----------" + port);


//index page
app.get("/",function(req, res){

  Movie.fetch(function(err, movies){
    if(err){
      console.log(err);
    }

    res.render("index", {
      title: "首页",
      movies: movies
    })

  })
})

//detail page
app.get("/movie/:id",function(req, res){

  var id = req.params.id;
  Movie.findById(id, function(err, movie){

    res.render("detail", {
      title: "detail",
      movie: movie
    })

  })
})

//admin page
app.get("/admin/movie",function(req, res){
  res.render("admin", {
    title: "admin",
    movie: {
      title: "",
      doctor: "",
      country: "",
      year: "",
      poster: "",
      flash: "",
      summary: "",
      language: ""
    }
  })
})


//admin update movie
app.get("/admin/update/:id", function(req, res){
  var id = req.params.id;
  if(id){
    Movie.findById(id, function(err, movie){
      res.render("admin", {
        title: "更新页面",
        movie: movie
      })
    })
  }
})


//admin post movie
app.post("/admin/movie/new", function(req, res){
  var id = "";
  var movieObj = req.body;
  console.log(movieObj)
  var _movie;
  if(id){
    Movie.findById(id, function(err, movie){
      if(err){
        console.log(err);
      }

      _movie = _.extend(movie, movieObj);
      _movie.save(function(err, movie){
        if(err){
          console.log(err);
        }

        res.redirect("/movie/" + movie._id)
      })
    })
  }
  else{
    _movie = new Movie({
      doctor: movieObj.doctor,
      title: movieObj.title,
      country: movieObj.country,
      language: movieObj.language,
      year: movieObj.year,
      poster: movieObj.poster,
      summary: movieObj.summary,
      flash: movieObj.flash
    })

    _movie.save(function(err, movie){
      if(err){
        console.log(err);
      }

      res.redirect("/movie/" + movie._id)
    })

  }
})

//list page
app.get("/admin/list",function(req, res){

  Movie.fetch(function(err, movies){
    if(err){
      console.log(err);
    }

    res.render("list", {
      title: "list",
      movies: movies
    })
  })
})


//admin delete
app.delete("/admin/list", function(req, res){
  var id = req.query.id;

  Movie.remove({_id: id}, function(err, movie){
    if(err){
      console.log(err);
      res.json({success: "删除失败", retCode: "000"});
    }else{
      res.json({success: "删除成功", retCode: "001"});
    }
    
  })
})