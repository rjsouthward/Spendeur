const express = require("express");
const bodyParser = require('body-parser');
const ejs = require("ejs");
const app = express();
const _ = require("lodash")
const mongoose = require('mongoose');

let dburl = process.env.dburl
console.log("success")
if (dburl == null||dburl ==""){
  dburl = "mongodb+srv://rsouthward:0HJNeZ0{J@spendeurdb.3jdem.mongodb.net/SpendeurDB";
}
mongoose.connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true });
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
app.listen(port, function(){
  console.log("Listening on a Port")
});
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  Brand.find({}, function(err, allPosts){
    if (!err){
    res.render("home", {siteposts: allPosts});
  }
})
});

// var test = new Brand({
// brandName:  "test1",
// brandImageURL:  "testimage.png",
// brandDesc:  "This is test data",
// brandTags:  "test",
// brandLinkRedirect:  "test.com",
// brandLinkInternal:  "/test",
// products: [{
// id: 4452928487466,
// title: "Choose Bar 3",
// handle: "choose-bar-34",
// body_html: "<strong>***This is a hidden product used with the Product Options application, Please do not delete this product.***</strong>",
// published_at: "2020-05-04T01:02:03-04:00",
// created_at: "2020-05-04T01:02:03-04:00",
// updated_at: "2020-11-29T01:51:04-05:00",
// vendor: "Herb'N Eden",
// product_type: "OPTIONS_HIDDEN_PRODUCT",
// tags: [
// "BOLD_HIDDEN_PRODUCT",
// "OPTIONS_HIDDEN_PRODUCT",
// ],
// variants: [
// {
// id: 31543212933162,
// title: "Rosewater Kefir & Lavender",
// option1: "Rosewater Kefir & Lavender",
// option2: null,
// option3: null,
// sku: "",
// requires_shipping: true,
// taxable: true,
// featured_image: null,
// available: true,
// price: "1.00",
// grams: 0,
// compare_at_price: null,
// position: 1,
// product_id: 4452928487466,
// created_at: "2020-05-04T01:02:03-04:00",
// updated_at: "2020-11-28T17:23:31-05:00",
// },
// {
// id: 31543212965930,
// title: "Grapefruit & Himalayan Pink",
// option1: "Grapefruit & Himalayan Pink",
// option2: null,
// option3: null,
// sku: "",
// requires_shipping: true,
// taxable: true,
// featured_image: null,
// available: true,
// price: "1.00",
// grams: 0,
// compare_at_price: null,
// position: 2,
// product_id: 4452928487466,
// created_at: "2020-05-04T01:02:04-04:00",
// updated_at: "2020-11-29T01:46:41-05:00",
// },
// {
// id: 31543212998698,
// title: "Vanilla Mint Coffee",
// option1: "Vanilla Mint Coffee",
// option2: null,
// option3: null,
// sku: "",
// requires_shipping: true,
// taxable: true,
// featured_image: null,
// available: true,
// price: "1.00",
// grams: 0,
// compare_at_price: null,
// position: 3,
// product_id: 4452928487466,
// created_at: "2020-05-04T01:02:05-04:00",
// updated_at: "2020-11-29T00:00:40-05:00",
// },
// {
// id: 31543213064234,
// title: "Cedarwood & Sea Clay",
// option1: "Cedarwood & Sea Clay",
// option2: null,
// option3: null,
// sku: "",
// requires_shipping: true,
// taxable: true,
// featured_image: null,
// available: true,
// price: "1.00",
// grams: 0,
// compare_at_price: null,
// position: 4,
// product_id: 4452928487466,
// created_at: "2020-05-04T01:02:06-04:00",
// updated_at: "2020-11-28T21:07:26-05:00",
// },
// ],
// images: [ ],
// options: [
// {
// name: "Title",
// position: 1,
// values: [
// "Rosewater Kefir & Lavender",
// "Grapefruit & Himalayan Pink",
// "Vanilla Mint Coffee",
// "Cedarwood & Sea Clay",
// ],
// }
// ],
// },
// {
// id: 4452927504426,
// title: "Choose Bar 4",
// handle: "choose-bar-33",
// body_html: "<strong>***This is a hidden product used with the Product Options application, Please do not delete this product.***</strong>",
// published_at: "2020-05-04T01:00:23-04:00",
// created_at: "2020-05-04T01:00:23-04:00",
// updated_at: "2020-11-29T01:51:04-05:00",
// vendor: "Herb'N Eden",
// product_type: "OPTIONS_HIDDEN_PRODUCT",
// tags: [
// "BOLD_HIDDEN_PRODUCT",
// "OPTIONS_HIDDEN_PRODUCT",
// ],
// variants: [
// {
// id: 31543209263146,
// title: "Grapefruit & Himalayan Pink Salt",
// option1: "Grapefruit & Himalayan Pink Salt",
// option2: null,
// option3: null,
// sku: "",
// requires_shipping: true,
// taxable: true,
// featured_image: null,
// available: true,
// price: "1.00",
// grams: 0,
// compare_at_price: null,
// position: 1,
// product_id: 4452927504426,
// created_at: "2020-05-04T01:00:24-04:00",
// updated_at: "2020-11-28T17:58:06-05:00",
// },
// {
// id: 31543209328682,
// title: "Vanilla Mint Coffee",
// option1: "Vanilla Mint Coffee",
// option2: null,
// option3: null,
// sku: "",
// requires_shipping: true,
// taxable: true,
// featured_image: null,
// available: true,
// price: "1.00",
// grams: 0,
// compare_at_price: null,
// position: 2,
// product_id: 4452927504426,
// created_at: "2020-05-04T01:00:25-04:00",
// updated_at: "2020-11-28T21:54:50-05:00",
// },
// {
// id: 31543209394218,
// title: "Rosewater Kefir & Lavender",
// option1: "Rosewater Kefir & Lavender",
// option2: null,
// option3: null,
// sku: "",
// requires_shipping: true,
// taxable: true,
// featured_image: null,
// available: true,
// price: "1.00",
// grams: 0,
// compare_at_price: null,
// position: 3,
// product_id: 4452927504426,
// created_at: "2020-05-04T01:00:26-04:00",
// updated_at: "2020-11-28T15:41:56-05:00",
// },
// {
// id: 31543209426986,
// title: "Cedarwood & Sea Clay",
// option1: "Cedarwood & Sea Clay",
// option2: null,
// option3: null,
// sku: "",
// requires_shipping: true,
// taxable: true,
// featured_image: null,
// available: true,
// price: "1.00",
// grams: 0,
// compare_at_price: null,
// position: 4,
// product_id: 4452927504426,
// created_at: "2020-05-04T01:00:27-04:00",
// updated_at: "2020-11-29T01:46:40-05:00",
// },
// ],
// images: [ ],
// options: [
// {
// name: "Title",
// position: 1,
// values: [
// "Grapefruit & Himalayan Pink Salt",
// "Vanilla Mint Coffee",
// "Rosewater Kefir & Lavender",
// "Cedarwood & Sea Clay",
// ],
// }
// ],
// }],
// category: "Test products"
//
// })
