import moment from "moment";
import { IMessage } from "../interfaces/IMessage";
import { IUrlMessage } from "../interfaces/IUrlMessage";

const newTimeStamp = () =>`[${moment(new Date().getTime()).format("DD/MM/YYYY - kk:mm:ss")}]`;
export const newMsg = (text: string): IMessage => {
  return {
    text,
    createdAt: newTimeStamp(),
  };
};

export const newUrlMsg = (url: string): IUrlMessage => {
  return {
    url,
    createdAt: newTimeStamp(),
  };
};
