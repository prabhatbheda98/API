const express = require('express');
const app = express();
const sharp = require("sharp");
const bodyParser = require('body-parser')


const cors = require('cors')
const routes = require("./routes/index")
const port = 3000;

app.use(bodyParser.json({limit:"1024mb"}))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
app.use('/',routes);
app.listen(port, () => {
    console.log(`http://localhost:${port}
    Run SucessFull`)
})


