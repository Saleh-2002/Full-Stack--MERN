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

let Users = [];
let MyPosts = [];
let MyName = null;

app.get("/", (req, res) => {
    res.render("Login", { error: null });
});

app.post("/Login", (req, res) => {
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
});

app.get("/SignUp", (req, res) => {
    res.render("SignUp", { error: null });
})

app.post("/SignUp", (req, res) => {
    try {
        const { Name, email, password, BirthDay } = req.body;
        if (Name && email && password && BirthDay) {
            Users.push({ Name, email, password, BirthDay });
            res.redirect("/");
        } else if (Name == null || email == null || password == null || BirthDay == null) {
            res.render("SignUp", { error: "Please Fill All Fields!" });
        } else {
            res.render("SignUp", { error: "Please Fill All Fields!" });
        }
    } catch (err) {
        res.render("SignUp", { error: "Something Went Wrong!" });
    }
})

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