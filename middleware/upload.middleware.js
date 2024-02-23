import multer from "multer";
import moment from "moment";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (_, file, cb) => {
    cb(null, `${moment().format("DDMMYYYY-HHmmss_SSS")}-${file.originalname}`);
  },
});

export default multer({
  storage,
});
