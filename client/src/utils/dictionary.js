import functions from "./functions";

const dictionary = {
  _completeFields: "Complete all fields and try again",
  _toastTimeOut: 5000,
  _uiRefreshRate: 1000,
  apiHost: functions.getHost(),
  // apiHost: "https://api.serenity.studentdigpay.com/",
  captiveHost: functions.getCaptiveHost(),
  _exportBtnFormats: ["excel", "pdf", "csv", "print", "copy"],
};

export default dictionary;
