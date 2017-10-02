process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require("mongoose");
const server = require('../../app');
const should = chai.should();

chai.use(chaiHttp);

