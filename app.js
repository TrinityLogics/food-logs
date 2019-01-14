var express                 = require("express"),
    app                     = express(),
    request                 = require("request"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    bodyParser              = require("body-parser"),
    User                    = require("./models/user"),
    FoodLog                 = require("./models/food_log"),
    moment                  = require('moment-timezone'),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose");
    
// console.log(moment().format());


// var date = moment.tz(moment().hours(0).minute(0).second(0), "America/Los_Angeles").format();
// console.log(date);
// var date0 = moment(date).hours(0).minute(0).second(0).milliseconds(0);
// console.log(date0);
// var dateOffset = moment.tz(date, "America/Los_Angeles").format("Z");
// console.log(dateOffset);
// var dateZ = moment.utc(date).format('YYYY-MM-DDTHH:mm:ssZ');
// console.log(dateZ);
// var dateA = moment(dateZ).toArray();
// dateA[3] = 0;
// dateA[4] = 0;
// dateA[5] = 0;
// dateA[6] = 0;
// console.log(dateA);
// var dateObj = dateA[0] + " " + dateA[1] + " " + dateA[2] + " " + dateA[3] + ":" + dateA[4] + ":" + dateA[5] + ":" + dateA[6];
// console.log(dateObj);
// var newDate = moment(dateObj, "YYYY MM DD H:m:s:S").format();
// console.log(newDate);


var dbURL = process.env.DATABASEURL || "mongodb://localhost/lindora";
mongoose.connect(dbURL, {useNewUrlParser: true});
mongoose.set('useCreateIndex', true);

app.set("view engine", "ejs");

app.use(require("express-session")({
    secret: "Ben Matt Georgi",
    resave: false,
    saveUninitialized: false
    
}));

app.use(passport.initialize());
app.use(passport.session());

// app.use(function(req, res, next) {
//     res.setHeader("Content-Security-Policy", "script-src 'self' https://apis.google.com");
//     return next();
// });

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

//ROUTES
app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
   res.render("login"); 
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/forms/index",
    failureRedirect: "/login",
    session: "false"
}), function(req, res){
    
});

app.get("/register", function(req, res){
   res.render("register"); 
});

app.post("/register", function(req, res){
    if (req.body.password != req.body.verifypassword){
        alert("Passwords must match.");
        return res.render("register");
    } else {
        User.register(new User({username: req.body.username}), req.body.password, function(err, savedUser){
            if (err) {
                console.log(err);
                return res.render("register");
            }
            passport.authenticate("local")(req, res, function(){
                res.redirect("/forms/index");
            });
        });
    }
});

app.get("/forms/food-log", function(req, res){
    FoodLog.find({'date': req.query.date, 'user.id' : req.user._id }, function(err, docObj){
        if (err || !docObj) {
            console.log(err);
            res.send("Data not found");
        } else {
            var logData = JSON.parse(JSON.stringify(docObj));
            res.send(logData);
        }
    });
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/login");
});

app.get("/forms/:form", isLoggedIn, function(req, res){
    res.render("forms/" + req.params.form);
});

app.post("/forms/save", function(req, res){
    var foodLogData = req.body.log;
    foodLogData['user'] = {
        id: req.user._id,
        username: req.user.username
        };
    FoodLog.create(foodLogData, function(err, savedLog){
        if (err || !savedLog) {
            res.send(err);
        } else {
            res.send(savedLog);
        }
    });    
});

app.post("/forms/save/:logId", function(req, res){
    var foodLogData = req.body.log;
    foodLogData['user'] = {
        id: req.user._id,
        username: req.user.username
        };
    FoodLog.replaceOne({"id" : req.params.userId }, foodLogData, function(err, savedLog){
        if (err || !savedLog) {
            res.send(err);
        } else {
            res.send("Updated Food Log");
        }
    });    
});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Food log server started");
});

function dateID(date){
    if (isValidDate(date)) {
        date = date.toString();
        // return (date.getTime() / 1000 / 60 / 60 / 24);
    }
}

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}