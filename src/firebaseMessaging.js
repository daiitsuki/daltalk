// firebaseMessaging.js (단순 래핑 용도)
import { messaging } from "./firebase";
import { onMessage } from "firebase/messaging";

export const listenForMessages = (callback) => {
  onMessage(messaging, callback);
};
