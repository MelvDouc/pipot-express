import { join as pathJoin } from "path";
import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import flash from "connect-flash";
import fileUpload from "express-fileupload";
import database from "./database.js";
import router from "./router.js";
import { methodOverride, setLocals, setSessionVars } from "../middleware/index.js";

declare module 'express-session' {
  interface SessionData {
    app: any;
    temp: any;
  }
}

if (process.env.NODE_ENV !== "production") {
  const dotenv = await import("dotenv");
  dotenv.config();
}

const app = express();
const port = process.env.PORT || 5000;
const rootDir = process.cwd();
const staticPath = pathJoin(rootDir, "static");
await database.init();

app.set("trust proxy", 1);
app.set("view engine", "pug");
app.locals.basedir = pathJoin(rootDir, "views");

app.use(express.static(staticPath));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload({
  // limits: 2e6,
  // safeFileNames: /[^\w_\-\.]/g,
  useTempFiles: true,
  tempFileDir: pathJoin(rootDir, "tmp")
}));
app.use(session({
  secret: <string>process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 60 * 60 * 1000,
    sameSite: "strict"
  },
  store: database.store
}));
app.use(cookieParser());
app.use(flash());
app.use(methodOverride);
app.use(setSessionVars);
app.use(setLocals);
app.use(router);

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}...`);
});