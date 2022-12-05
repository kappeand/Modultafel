const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const PORT = process.env.PORT || 8080;
const xlsx = require('xlsx');

const fs = require('fs')
const {add} = require("nodemon/lib/rules");
app.set('view engine', 'ejs')

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
    excelFile.mv(uploadPath, async function (err) {
        if (err)
            return res.status(500).send(err);

        const workbook = xlsx.readFile(uploadPath); // parse excel file
        const sheetNames = workbook.SheetNames;

        const modules = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[1]]);
        const settings = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
        modules.map(module => {
            module.FarbeModulkaestchen = settings.find(settings => settings.Modulgruppe == module.Modulgruppe).FarbeModulkaestchen;
            module.Hintergrundfarbe = settings.find(settings => settings.Modulgruppe == module.Modulgruppe).Hintergrundfarbe;
            module.Schriftfarbe = settings.find(settings => settings.Modulgruppe == module.Modulgruppe).Schriftfarbe;
        });

        let semesterArray = [];
        let addedSemesters = [];
        modules.forEach(module => {
            let currentSemesterNumber = module.Semester.split('.')[0];
            if (!addedSemesters.includes(currentSemesterNumber)) {
                semesterArray.push(modules.filter(module => module.Semester == currentSemesterNumber + '. Semester'));
                addedSemesters.push(currentSemesterNumber)
            }
        });

        const returnFile = __dirname + '/tmp/' + Date.now() + "_" + 'Modultafel.html'
        res.render('main', {semesterArray: semesterArray, settings: settings[0]}, (err, html) => {
                fs.writeFile(returnFile, html, () => {
                    res.download(returnFile);
                });
            }
        );
    });
});

app.listen(PORT, () => console.log('Server running on port ' + PORT));
