const express = require("express");
const mongodb = require("./data/database");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const GitHubStrategy = require("passport-github2").Strategy;
const cors = require("cors");
const app = express();

const port = process.env.PORT || 3000;

app
  .use(bodyParser.json())
  .use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: true,
    })
  )
  //this is the basic express session initialization
  .use(passport.initialize())
  //init passport on every route call
  .use(passport.session())
  //allow possport to use express-session
  .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Z-Key"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    next();
  })
  .use(cors({ methods: ["GET", "POST", "PUT", "DELETE", "UPDATE", "PATCH"] }))
  .use(cors({ origin: "*" }))
  .use("/", require("./routes/index.js"));

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    function (accessToken, refeshToken, profile, done) {
      //User.findOrCreate({githubId: profile.id}, function(err, user) {
      return done(null, profile);
      // });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get("/", (req, res) => {
  res.send(
    req.session.user !== undefined
      ? `Logged in as ${req.session.user.displayName || req.session.user.username}`
      : "Logged Out"
  );
});

app.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/api-docs",
    session: false,
  }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
  }
);

mongodb.initDb((err) => {
  if (err) {
    console.log(`There was a mongodb error: ${err}`);
  } else {
    app.listen(port, () => {
      console.log(`DB is listening and node Running on port ${port}`);
    });
  }
});
