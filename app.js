const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");

const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.static('public'));

app.post('/upload', (
    fileUpload({createParentPath: true}),
    (req, res) => {
        const file = req.files;
        console.log(file)
        return res.json({status:'logged', message:'logged'})
    }
));

app.listen(PORT, () => console.log('Server running on port ' + PORT));


