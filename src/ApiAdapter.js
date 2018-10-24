var url = undefined;
console.log("process.env.NODE_ENV : " + process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  url = "/agileboard";
} else {
  url = "http://localhost:8888";
}

export default url;
