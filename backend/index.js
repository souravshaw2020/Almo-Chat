const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const app=express();

const dbPath = path.join(__dirname, 'assets','Sample_Database.csv');

app.get('/orders', (req, res) => {
    const results = [];
    fs.createReadStream(dbPath).pipe(csv()).on('data', (data) => {
        results.push(data);
    }).on('end', () => {
        res.json(results);
    }).on('error', (error) => {
        console.error("Error reading a csv file: ", error);
        res.status(500).json({message: "Internal Server Error"});
    });
});

app.get('/orders/:orderId', (req, res) => {
    const orderId=req.params.orderId;
    const results = [];
    let foundOrder=null;
    fs.createReadStream(dbPath).pipe(csv()).on('data', (data) => {
        if(data.order_id === orderId) {
            console.log(orderId, typeof orderId, typeof data.order_id);
            foundOrder=data;
        }
    }).on('end', () => {
        if(foundOrder){
            res.json(foundOrder);
        }
        else {
            res.status(404).json({message: 'Order not found'});
        }
    }).on('error', (error) => {
        console.error("Error reading a csv file: ", error);
        res.status(500).json({message: "Internal Server Error"});
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`)
});