import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, '/uploads/');	
	}
});

const upload = multer({
	storage: storage,
	limits: { fileSize: 52428800 }, //50MB
	fileFilter: (req, file, cb) => {
		const fileTypes = /jpeg|jpg|png/;
		const mimeType = fileTypes.test(file.mimetype);

		const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

		if (mimeType && extName) {
			return cb(null, true);
		}

		cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'File type is not supported'));
	}
});

export default upload;
