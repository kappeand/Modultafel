const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const PORT = process.env.PORT || 8080;
const xlsx = require('xlsx');


app.use(express.static('public'), fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

app.post('/upload', function (req, res) {
    let excelFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    excelFile = req.files.excelFile;
    uploadPath = __dirname + '/tmp/' + Date.now() + "_" + excelFile.name;

    // move the file to temp path
    excelFile.mv(uploadPath, function (err) {
        if (err)
            return res.status(500).send(err);

        const workbook = xlsx.readFile(uploadPath); // parse excel file
        const sheetNames = workbook.SheetNames;
        const module = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[1]]);

        module.map(modul => {
            console.log(`${modul.Modulbezeichnung} hat ${modul.ECTS} ECTS `);
            //TODO @Andrin generate HTML from modules
        })

        //TODO @Andrin return generated file here instead of Modultafel.html
        res.attachment("Modultafel.html");
        res.send();
    });
});

app.listen(PORT, () => console.log('Server running on port ' + PORT));


