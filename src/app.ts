import { json } from "body-parser";
import express from "express";
import http from "http";
import path from "path";


// Creates express server
const app = express();
const distPath = path.join(__dirname, "../dist");

app.use(express.static(distPath));
app.use(json());

const server = http.createServer(app);
export default server;
