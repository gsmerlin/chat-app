"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const newTimeStamp = () => `[${moment_1.default(new Date().getTime()).format("DD/MM/YYYY - kk:mm:ss")}]`;
exports.newMsg = (text) => {
    return {
        text,
        createdAt: newTimeStamp(),
    };
};
exports.newUrlMsg = (url) => {
    return {
        url,
        createdAt: newTimeStamp(),
    };
};
