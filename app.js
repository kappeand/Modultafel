const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const PORT = process.env.PORT || 8080;
const xlsx = require('xlsx');

const fs = require('fs')
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
    excelFile.mv(uploadPath, function (err) {
        if (err)
            return res.status(500).send(err);

        const workbook = xlsx.readFile(uploadPath); // parse excel file
        const sheetNames = workbook.SheetNames;

        const modules = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[1]]);
        const colors = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);

        modules.map(module => {
            module.Modulgruppe = colors.find(color => color.Modulgruppe == module.Modulgruppe).Hintergrundfarbe;
        });

        let semesterArray = [];
        let currentSemester = modules[0].Semester.split('.')[0];
        modules.forEach(module => {
            if (module.Semester.split('.')[0] == currentSemester) {
                semesterArray.push(modules.filter(module => module.Semester == currentSemester + '. Semester'));
                currentSemester++;
            }
        });

        res.render('main', {semesterArray: semesterArray}, (err, html) => {
                console.log(err);
                fs.writeFile('Modultafel.html', html, () => {
                });
            }
        );

    });
});

app.listen(PORT, () => console.log('Server running on port ' + PORT));
