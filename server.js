const express = require("express");
const cors = require("cors");
const RestaurantDB = require("./modules/restaurantDB.js"); 
const db = new RestaurantDB();
require("dotenv").config();

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

db.initialize(`mongodb+srv://${process.env.Mongoose_USERNAME}:${process.env.Mongoose_PASSWORD}@restaurantdb.6rjptnv.mongodb.net/sample_restaurants?retryWrites=true&w=majority`)
    .then(()=>{
        app.listen(HTTP_PORT, ()=>{
         console.log(`server listening on: ${HTTP_PORT}`);
        });    
    }).catch((err)=>{
    console.log(err);
});

// call this function after the http server starts listening for requests
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
  }

app.get("/", (req, res) => {
    res.json({message: "API Listening"});
});

app.post("/api/restaurants", (req,res) => {
    db.addNewRestaurant(req.body)
    .then((data) => {
        res.status(201).json(data);
    })
    .catch((err) => {
        res.status(500).json({message: "New restaurant is not added"});
    });
});

app.get("/api/restaurants", (req, res) => {
    db.getAllRestaurants(req.query.page, req.query.perPage, req.query.borough)
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        res.status(500).json(err);
    });
});

app.get("/api/restaurants/:id", (req, res) => {
    db.getRestaurantById(req.params.id)
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        res.status(500).json({message: "This is an invalid ID"});
    });
}); 

app.put("/api/restaurants/:id", (req, res) => {
    db.updateRestaurantById(req.body, req.params.id)
    .then((data) => {
        res.status(201).json({message: "Data is updated successfully"});
    })
    .catch((err) => {
        res.status(500).json({message: "This is an invalid ID"});
    });
});

app.delete("/api/restaurants/:id", (req, res) => {
    db.deleteRestaurantById(req.params.id)
    .then((data) => {
        res.status(204).json({message: "Data is deleted successfully"});
    })
    .catch((err) => {
        res.status(500).json({message: "Data is not deleted"});
    }); 
});