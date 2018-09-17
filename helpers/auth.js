// Load Idea Model
const Idea = require("../models/Idea");

module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Not Authorized");
    res.redirect("/users/login");
  }
  // ensureAuthenticatedToEdit: function(req, res, next) {
  //   if (!req.isAuthenticated()) {
  //     req.flash("error_msg", "Not Authorized");
  //     res.redirect("/users/login");
  //   } else {
  //     Idea.findOne({
  //       _id: req.params.id
  //     }).then(idea => {
  //       if (!idea) {
  //         req.flash("error_msg", "Idea Not Found");
  //         res.redirect("/ideas");
  //       } else {
  //         next();
  //       }
  //     });
  //   }
  // }
};
