import express from "express";
import cors from "cors"
import { router } from "./routes";
import { connectionDB } from "./db/connection";
import { populateDB } from "./db/startDB";
const app = express();
app.use(cors())
const port = 3000;

app.use(express.json());

app.use(express.static(__dirname + '/public'));

app.use(router);


connectionDB().catch(console.dir);
populateDB()

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});