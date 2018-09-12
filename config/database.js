if (process.env.NODE_ENV === "production") {
  module.exports = {
    mongoURI:
      "mongodb://alaa:desouky123654@ds153552.mlab.com:53552/webjot_desouky"
  };
} else {
  module.exports = { mongoURI: "mongodb://localhost/vidjot-dev" };
}
