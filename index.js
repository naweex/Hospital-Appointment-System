const express = require('express');
const bodyParser = require('body-parser');
var session = require('express-session');
const MongoStore = require("connect-mongo");
const port = 5000;
const app = express();