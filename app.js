const express      = require("express");
const mongoose     = require("mongoose");
const exphbs       = require("express-handlebars");
const keys         = require("./config/keys");
const cookieParser = require("cookie-parser");
const session      = require("express-session");
const passport     = require("passport");
const methodOverride = require('method-override')


const path         = require("path");
const bodyParser   = require("body-parser");

/** app init */
const app = express();

require("./models/User");
require("./models/Story");

const stories = require("./routes/stories");
const index = require("./routes/index");
require("./config/passport")(passport);

app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));


/** handlebars helpers */
const {
    truncate,
    stripTags,
    formatDate,
    select,
    editIcon
} = require("./helpers/hbs");


/** passport middleware */
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'))

/** set global vars */
app.use((req,res,next) => {
    res.locals.user = req.user || null;
    next();
})

const auth = require("./routes/auth");

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


/** db connect */
mongoose.connect(keys.mongoURI)
    .then( () => {console.log("DB connected")})
    .catch( err => console.log(err));


/** handlebars middleware */
app.engine("handlebars", exphbs({
    helpers: {
        truncate: truncate,
        stripTags: stripTags,
        formatDate: formatDate,
        select:select,
        editIcon: editIcon
    },
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");


/** set static folder */
app.use(express.static(path.join(__dirname, "public")));


app.use("/auth", auth);
app.use("/", index);
app.use("/stories", stories);

const port = process.env.PORT || 5000;

app.listen(port, () => { console.log(`App connected on port ${port}`)})
