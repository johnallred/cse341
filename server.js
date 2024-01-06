const express = require('express');
const mongodb = require('./data/database');
const bodyParser = require('body-parser');
const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/', require('./routes'));

mongodb.initDb((err) => {
    if(err){
        console.log(err);
    }else{
        app.listen(port, () => {console.log(`DB is listening and node Running on port ${port}`)});
    }
});