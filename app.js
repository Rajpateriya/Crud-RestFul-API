const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");

const app = express();

//connect to mongodb
mongoose.connect("mongodb://localhost:27017/API_Testing",{
    useNewUrlParser:true,useUnifiedTopology:true
}).then(()=>{
    console.log("Connected with MongoDB")
}).catch((err)=>{
    console.log(err)
})


app.use(bodyparser.urlencoded({extended:false}));
app.use(express.json());

const prodcutSchema = mongoose.Schema({
    name:String,
    description:String,
    price:Number,
})

const Product = new mongoose.model("Product",prodcutSchema)


// add productss
app.post("/api/v1/product/new",async(req,res)=>{
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
})

// read productss

app.get("/api/v1/products",async(req,res)=>{

    const products = await Product.find();
    res.status(200).json({
        success:true,
        products
    })
})

// update products

app.put("/api/v1/product/:id",async(req,res)=>{
    let product = await Product.findById(req.params.id);
    if(!product){
        return res.status(500).json({
            message:"Product not found.."
        })
    }

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        useFindAndModify: false,
        ranValidators:true
    })
   

    res.status(200).json({
        success:true,
        product
    })
})

//delete products
app.delete("/api/v1/products/:id",async(req,res)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return res.status(500).json({
            message:"Product not found..",
            success:false
        })
    }

    await product.deleteOne();

    res.status(200).json({
        success:true,
        message:"Product is deleted succesfully"
    })
    

})

app.listen(4500,(req,res)=>{
    console.log(`Server is running....`)
})



//crud operations RESTFUL API 
//along with using mongodb compass and POSTMAN