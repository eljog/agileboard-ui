const hostname = window && window.location && window.location.hostname;

let url = "https://www.google.com";
if (hostname === "localhost") {
  url = "http://localhost:8888";
} else {
  url = "http://18.222.2.26:8888";
}

export default url;
