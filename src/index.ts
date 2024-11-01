import express from "express";
import { router } from "./routes";
import { connectionDB } from "./db/connection";
const app = express();
const port = 3000;

app.use(express.json());

app.use(express.static(__dirname + '/public'));

app.use(router);


connectionDB().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
});