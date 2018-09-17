const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { ensureAuthenticated } = require("../helpers/auth");

// Load Idea Model
const Idea = require("../models/Idea");

// SHOW IDEAS Route -- Index Route
router.get("/", ensureAuthenticated, (req, res) => {
  Idea.find({ user: req.user.id })
    .sort({ date: "desc" })
    .then(ideas => {
      res.render("./ideas/index", { ideas: ideas });
    });
});

// ADD IDEA Route - GET REQUEST
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("./ideas/add");
});

// EDIT IDEA Route - GET REQUEST
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
    .then(idea => {
      if (idea.user != req.user.id) {
        req.flash("error_msg", "Not Authorized");
        res.redirect("/ideas");
      } else {
        res.render("./ideas/edit", { idea: idea });
      }
    })
    .catch((err, idea) => {
      if (err || !idea) {
        req.flash("error_msg", "Idea not found");
        res.redirect("/ideas");
      }
    });
});

// ADD IDEA Route - POST REQUEST
router.post("/", ensureAuthenticated, (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({ text: "Please add a title" });
  }
  if (!req.body.details) {
    errors.push({ text: "Please add some details" });
  }

  if (errors.length > 0) {
    res.render("./ideas/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
    console.log(errors);
  } else {
    const newIdea = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    };

    new Idea(newIdea).save().then(idea => {
      req.flash("success_msg", "Website idea added");
      res.redirect("/ideas");
    });
  }
});

// EDIT IDEA Route - PUT REQUEST
router.put("/:id", ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
    .then(idea => {
      idea.title = req.body.title;
      idea.details = req.body.details;

      idea.save().then(idea => {
        req.flash("success_msg", "Website idea updated");
        res.redirect("/ideas");
      });
    })
    .catch((err, idea) => {
      if (err || !idea) {
        req.flash("error_msg", "Idea not found");
        res.redirect("/ideas");
      }
    });
});

// DELETE IDEA Route - DELETE REQUEST
router.delete("/:id", ensureAuthenticated, (req, res) => {
  Idea.deleteOne({
    _id: req.params.id
  })
    .then(() => {
      req.flash("success_msg", "Website idea removed");
      res.redirect("/ideas");
    })
    .catch((err, idea) => {
      if (err || !idea) {
        req.flash("error_msg", "Idea not found");
        res.redirect("/ideas");
      }
    });
});

module.exports = router;
