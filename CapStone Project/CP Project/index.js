import express from "express";    
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import methodOverride from "method-override";
import session from "express-session";

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Session Middleware
app.use(session({
    secret: 'your-secret-key', // Replace with a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using https, otherwise false
}));

const Port = 3000;
const Rounds = 10;

app.listen(Port, () => {
    console.log(`Running on Port ${Port}`);
});

let Users = [];
let MyName = null;

app.get("/", (req, res) => {
    try {
        res.render("Login", { Success: null, error: null, MyName });
    } catch (err) {
        res.render("Login", { error: err });
    }
});

app.post("/Login", async (req, res) => {
    try {
        let UserFound = false;
        const { email, password } = req.body;
        for (let i = 0; i < Users.length; i++) {
            if (email.toLowerCase() === Users[i].email.toLowerCase()) {
                const match = await bcrypt.compare(password, Users[i].password);
                if (match) {
                    UserFound = true;
                    MyName = Users[i].Name;
                    req.session.user = Users[i]; // Store user in session
                    res.redirect("/main");
                    break;
                }
            }
        }
        if (!UserFound) {
            res.render("Login", { error: "Invalid Email or Password!" });
        }
    } catch (err) {
        res.render("Login", { error: err });
    }
});

app.get("/LogOut", async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            return res.status(500).send("Unable to log out"); // Handle the error if session destruction fails
        }
        res.clearCookie("connect.sid");
        res.redirect("/");
    });
})

app.get("/SignUp", (req, res) => {
    try {
        res.render("SignUp", { error: null });
    } catch (err) {
        res.render("SignUp", { error: err });
    }
});

app.post("/SignUp", async (req, res) => {
    try {
        const { Name, email, password, BirthDay } = req.body;

        if (!Name || !email || !password || !BirthDay) {
            return res.render("SignUp", { error: "Please Fill All Fields!" });
        }

        if (Users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
            return res.render("SignUp", { Success: null, error: "User With This Email Already Exists!" });
        }

        const CyberPass = await bcrypt.hash(password, Rounds);
        Users.push({ Name, email, password: CyberPass, BirthDay, posts: [] });
        res.render("Login", { Success: "New User Was Added Successfully", error: null });

    } catch (err) {
        console.error(err);
        res.render("SignUp", { error: "An unexpected error occurred. Please try again later." });
    }
});

app.get("/main", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/");
    }
    const user = req.session.user;
    res.render("MainPage", { MyName: user.Name, MyPosts: user.posts, error2: null });
});

app.post("/Poster", (req, res) => {
    const { Topic, Discription } = req.body;
    const user = req.session.user;
    if (Topic && Discription) {
        req.session.user.posts.push({ Topic, Discription });
        return res.redirect("/main");
    } else {
        res.render("MainPage", { MyName: user.Name, MyPosts: user.posts, error2: "Please Fill Both Topic and Description!" });
    }
});
 
app.get('/update/:id', (req, res) => {
    const id = req.params.id;
    const user = req.session.user;
    const Post = user.posts[id];
    res.render("MPEdit", { Post, PostID: id, error: null, MyName: user.Name });
});

app.put('/update/:id', (req, res) => {
    const id = req.params.id;
    const { Topic, Discription } = req.body;
    const user = req.session.user;
    user.posts[id] = { Topic, Discription };
    res.redirect("/main");
});

app.delete('/update/:id', (req, res) => {
    try {
        const id = req.params.id;
        const user = req.session.user;
        user.posts.splice(id, 1);
        res.redirect("/main");
    } catch (err) {
        res.render("MainPage", { MyName: user.Name, MyPosts: user.posts, error2: err });
    }
});