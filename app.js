const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");

const PORT = process.env.PORT || 8000;

const app = express();

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:63342');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"))
});



app.post('/upload', (
    fileUpload({createParentPath: true}),
    (req, res) => {
        const file = req.files;
        console.log(file)
        return res.json({status:'logged', message:'logged'})
    }
));

app.listen(PORT, () => console.log('Server running on port ' + PORT));


