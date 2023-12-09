const express = require("express");
const multer = require("multer");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({dest: 'uploads'});

app.post("/upload_files", upload.single("files"), uploadFiles);
function uploadFiles(req, res) {
    console.log(req.body);
    console.log(req.files);
    res.json({ message: "Successfully uploaded files" });
}
app.listen(5000, () => {
    console.log(`Server started...`);
});




