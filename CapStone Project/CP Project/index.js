import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt"
import methodOverride from "method-override";

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const Port = 3000;
const Rounds = 10;

app.listen(Port, () => {
    console.log(`Running on Port ${Port}`);
});

let Users = [];
let MyPosts = [];
let MyName = null;

app.get("/", (req, res) => {
    try {
        res.render("Login", { Success: null, error: null, MyName }); // Pass MyName if needed
    } catch (err) {
        res.render("/", { error: err })
    }
});


app.post("/Login", (req, res) => {
    try {
        let UserFound = false;
        const { Name, email, password } = req.body;
        for (let i = 0; i < Users.length; i++) {
            if (email.toLowerCase() === Users[i].email.toLowerCase() && password === Users[i].password) {
                UserFound = true;
                MyName = Users[i].Name;
                res.redirect("/main");
                break;
            }
        }
        if (!UserFound) {
            res.render("Login", { error: "Invalid Email or Password!" });
        }
    } catch (error) {
        res.render("Login", { error: err });
    }
});

app.get("/SignUp", (req, res) => {
    try {
        res.render("SignUp", { error: null });

    } catch (error) {
        res.render("SignUp", { error: err });
    }
})

app.post("/SignUp", async (req, res) => {
    try {
        const { Name, email, password, BirthDay } = req.body;

        if (!Name || !email || !password || !BirthDay) {
            return res.render("SignUp", { error: "Please Fill All Fields!" });
        }

        if (Users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
            return res.render("SignUp", { Success: null, error: "User With This Email Already Exists!" });
        }

        const CyberPass = await bcrypt.hash(password, Rounds)
        Users.push({ Name, email, password: CyberPass, BirthDay });
        res.render("Login", { Success: "New User Was Added Successfully", error: null });

    } catch (err) {
        console.error(err); // Log the error for debugging
        res.render("SignUp", { error: "An unexpected error occurred. Please try again later." });
    }
});


app.get("/main", (req, res) => {
    res.render("MainPage", { MyName, MyPosts, error2: null });
});

app.get('/update/:id', (req, res) => {
    const id = req.params.id;
    const Post = MyPosts[id];
    res.render("MPEdit", { Post, PostID: id, error: null, MyName, MyPosts });
});

app.put('/update/:id', (req, res) => {
    const id = req.params.id;
    const { Topic, Discription } = req.body;
    MyPosts[id] = { Topic, Discription };
    res.redirect("/main");
});

app.post("/Poster", (req, res) => {
    const { Topic, Discription } = req.body;
    if (Topic && Discription) {
        MyPosts.push({ Topic, Discription });
        res.redirect("/main");
    } else {
        res.render("MainPage", { MyName, MyPosts, error2: "Please Fill Both Topic and Description!" });
    }
});

app.delete('/update/:id', (req, res) => {
    try {
        const id = req.params.id;
        MyPosts.splice(id, 1);
        res.redirect("/main");
    }
    catch (err) {
        res.render("MainPage", { MyName, MyPosts, error2: err });
    }
});