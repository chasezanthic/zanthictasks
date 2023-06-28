import { FileTest } from "@wasp/apis/types";
import { MiddlewareConfigFn } from "@wasp/middleware";
import multer, { FileFilterCallback } from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../../../uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const csvFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (
    file.mimetype === "text/csv" &&
    file.originalname.split(".")[1] == "csv"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const fileTest: FileTest = (req, res, context) => {
  console.log(process.env.UPLOAD_PATH);
  console.log(req.file);
};

export const fileTestMiddleWare: MiddlewareConfigFn = (middlewareConfig) => {
  const upload = multer({ storage: storage, fileFilter: csvFilter });

  middlewareConfig.set("multer", upload.single("newFile"));
  return middlewareConfig;
};
