console.log("RUN MY SCRIPT");

const axiosScript = document.createElement("script");
axiosScript.src =
  "https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.2/axios.min.js";
axiosScript.onload = () => {
  var s = document.createElement("script");
  s.src = chrome.extension.getURL("script.js");
  document.body.appendChild(s);
};

document.body.appendChild(axiosScript);
