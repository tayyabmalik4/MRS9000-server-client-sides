const multer = require("multer");
const { memoryStorage } = require("multer");
const AppError = require("./AppError");

const upload = multer({
    storage: memoryStorage(),
    fileFilter: (req, file, callback) => {
        // console.log("------------->", file)
        if (["image/png", "image/jpeg", "application/octet-stream"].includes(file.mimetype)
        ) {
            callback(null, true);
        } else {
            callback(
                new AppError(
                    `Not an image or Document file! Please upload only image or Document files`,
                    400
                ),
                false
            );
        }
    },
});

module.exports = upload;
