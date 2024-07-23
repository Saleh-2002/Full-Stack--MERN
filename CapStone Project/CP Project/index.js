import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const Port = 3000;

app.listen(Port, () => {
    console.log(`Running on Port ${Port}`);
});

let Users = [
    { email: "User1", password: "1234" },
    { email: "User2", password: "1234" }
];
let MyPosts = [];
let MyName = null;

app.get("/", (req, res) => {
    res.render("Login", { error: null });
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

app.get("/main", (req, res) => {
    res.render("MainPage", { MyName, MyPosts, error2: null });
});

app.post("/Login", (req, res) => {
    let UserFound = false;
    const { Name, email, password } = req.body;
    for (let i = 0; i < Users.length; i++) {
        if (email.toLowerCase() === Users[i].email.toLowerCase() && password === Users[i].password) {
            UserFound = true;
            MyName = Name;
            res.redirect("/main");
            break;
        }
    }
    if (!UserFound) {
        res.render("Login", { error: "Invalid Email or Password!" });
    }
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
    const id = req.params.id;
    MyPosts.splice(id, 1);
    res.redirect("/main");
});