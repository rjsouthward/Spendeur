const express = require("express");
const bodyParser = require('body-parser');
const ejs = require("ejs");
const app = express();
const _ = require("lodash")
const mongoose = require('mongoose');
let dburl = process.env.dburl
// console.log("success")
if (dburl == null||dburl ==""){
  dburl = "mongodb+srv://rsouthward:0HJNeZ0{J@spendeurdb.3jdem.mongodb.net/SpendeurDB";
}
mongoose.connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true }, function(error){
  if (!error){
    console.log("Connected to DB");
  } else {
    console.log(error);
  }
});
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
  height: Number
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
  updated_at: String
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
    type: Array,
    required: [true, "Error: brandImageURL not included."]
  },
  brandDesc:{
    type: String
  },
  brandTags:{
    type: Array,
    required: [true, "Error: brandTags not included."]
  },
  brandLinkRedirect: {
    type: String
  },
  brandLinkInternal:{
    type: String
  },
  category: Array,
  cause: String,
  brandProductTypes: Array,
  products: [productSchema]
})

const categorySchema = new mongoose.Schema({
  categoryName: String,
  categoryProducts: Array
})
const Brand = mongoose.model("brand", brandSchema);

// DB of products to include in each category (ie Featured, Small Biz, etc. Only 8 products.)


const Category = mongoose.model("category", categorySchema);


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

app.get("/", async function(req, res){
  let featuredPosts = await Category.find({categoryName: "Featured"});
  let brandsToBeSent = await Brand.find({_id: featuredPosts[0].categoryProducts});

  let postsToBeSent = await Brand.find({});

  res.render("home", {featuredposts: brandsToBeSent, siteposts: postsToBeSent});
});

Brand.find({}, "brandName", function(err, brands){
  if (!err){
  let listofids = []
  brands.forEach(function(brand){
  listofids.push(brand._id)
  })
  var unique = null
  var uniquePTypes = null
  listofids.forEach(function(id){
    Brand.find({_id: id}, function(err, brandproducts){
      var alltags = []
      var producttypes = []
      brandproducts.forEach(function(brandproduct){
        brandproduct.products.forEach(function(product){
          // console.log(product.tags)
          function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
          }
          product.tags.forEach(function(tag){
            alltags.push(tag)
          })
          unique = alltags.filter(onlyUnique);
        })
        // Brand.updateOne({_id: id}, {brandTags: unique}, function(err, results){
        //   if (err){
        //     console.log(err);
        //   } else {
        //     console.log("Succesfully updated the brandTags field")
        //   }
        // })
        //
      })
    })
  })


}
})
Brand.find({}, "brandName", function(err, brands){
  if (!err){
  let listofids = []
  brands.forEach(function(brand){
  listofids.push(brand._id)
  })
  var uniquePTypes = null
  listofids.forEach(function(id){
    Brand.find({_id: id}, function(err, brandproducts){
      var producttypes = []
      brandproducts.forEach(function(brandproduct){
        brandproduct.products.forEach(function(product){
          // console.log(product.product_type)
          function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
          }
          producttypes.push(product.product_type)
          uniquePTypes = producttypes.filter(onlyUnique);
        })
        function fix (list){
          var finalPTypes = []
          for (i = 0; i<list.length; i++){
            if (list[i] != null && list[i] != "" && list[i] != undefined){
              finalPTypes.push(list[i])
            }
          }
          return finalPTypes
        }
        // Brand.updateOne({_id: id}, {brandProductTypes: fix(uniquePTypes)}, function(err, results){
        //   if (err){
        //     console.log(err);
        //   } else {
        //     console.log("Succesfully updated the brandProductTypes field")
        //   }
        // })
        //
      })
    })
  })


}
})
