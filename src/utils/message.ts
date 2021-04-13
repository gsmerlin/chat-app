import moment from "moment";
import { IMessage } from "../interfaces/IMessage";
import { IUrlMessage } from "../interfaces/IUrlMessage";

// Creates timestamp
const newTimeStamp = () =>`[${moment(new Date().getTime()).format("DD/MM/YYYY - kk:mm:ss")}]`;

// Creates simple message with timestamp
export const newMsg = (text: string): IMessage => {
  return {
    text,
    createdAt: newTimeStamp(),
  };
};

// Creates url message with timestamp
export const newUrlMsg = (url: string): IUrlMessage => {
  return {
    url,
    createdAt: newTimeStamp(),
  };
};
