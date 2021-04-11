"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = require("body-parser");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const app = express_1.default();
const distPath = path_1.default.join(__dirname, "../dist");
app.use(express_1.default.static(distPath));
app.use(body_parser_1.json());
const server = http_1.default.createServer(app);
exports.default = server;
