const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const PORT = process.env.PORT || 8080;


app.use(express.static('public'), fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

app.post('/upload', function (req, res) {
    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    sampleFile = req.files.sampleFile;
    uploadPath = __dirname + '/tmp/' + Date.now() + "_" + sampleFile.name;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, function (err) {
        if (err)
            return res.status(500).send(err);

        res.send('File uploaded!');
    });
});

app.listen(PORT, () => console.log('Server running on port ' + PORT));


