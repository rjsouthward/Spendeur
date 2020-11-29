const express = require("express");
const bodyParser = require('body-parser');
const ejs = require("ejs");
const app = express();
const _ = require("lodash")
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://rsouthward:0HJNeZ0{J@spendeurdb.3jdem.mongodb.net/SpendeurDB", { useNewUrlParser: true, useUnifiedTopology: true });
const optionsSchema = new mongoose.Schema({
  name: String,
  position: Number,
  values: Array
})
const imagesSchema = new mongoose.Schema({
  id: Number,
  created_at: String,
  position: Number,
  updated_at: String,
  product_id: Number,
  variant_ids: Array,
  src: String,
  width: Number,
  height: Number,
})
const featuredImagesSchema = new mongoose.Schema({
  id: Number,
  product_id: Number,
  position: Number,
  created_at: String,
  updated_at: String,
  alt: String,
  width: Number,
  height: Number,
  src: String,
  variant_ids: Array
})
const variantSchema = new mongoose.Schema({
  id: Number,
  title: String,
  option1: String,
  option2: String,
  option3: String,
  sku: String,
  requires_shipping: Boolean,
  taxable: Boolean,
  featured_image: featuredImagesSchema,
  available: Boolean,
  price: String,
  grams: Number,
  compare_at_price: String,
  position: Number,
  product_id: Number,
  created_at: String,
  updated_at: String,
})
const productSchema = new mongoose.Schema({
  id: Number,
  title: String,
  handle: String,
  body_html: String,
  published_at: String,
  created_at: String,
  updated_at: String,
  vendor: String,
  product_type: String,
  tags: Array,
  variants: [variantSchema],
  images: [imagesSchema],
  options: [optionsSchema]
})
const brandSchema = new mongoose.Schema({
  brandName: {
    type: String,
    required: [true, "Error: Brand Name not included."]
  },
  brandImageURL:{
    type: String,
    required: [true, "Error: brandImageURL not included."]
  },
  brandDesc:{
    type: String,
    required: [true, "Error: brandDesc not included."]
  },
  brandTags:{
    type: Array,
    required: [true, "Error: brandTags not included."]
  },
  brandLinkRedirect: {
    type: String,
    required: [true, "Error: brandLinkRedirect not included."]
  },
  brandLinkInternal:{
    type: String
  },
  products: [productSchema],
  category: String,
  cause: String
})



const Brand = mongoose.model("brand", brandSchema);
let port = process.env.PORT
if (port == null||port ==""){
  port = 3000;
}
app.listen(port);
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  Brand.find({}, function(err, allPosts){
    if (!err){
    res.render("home");
  }
})
});
