process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require("mongoose");
const app = require('../app');
const should = chai.should();
const Ngo = require('../models/ngo');
chai.use(chaiHttp);

describe('NGO TEST' ,()=>{
    beforeEach((done) => { //Before each test we empty the database
        Ngo.remove({}, (err) => {
            done();
        });
    });


    describe('/GET ALL NGO LISTS ', () => {
        it('it should GET all the NGO', (done) => {
            chai.request(app)
                .get('/ngoAuth/login')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });
});

describe('Math', function() {
    describe('#abs()', function() {
        it('should return positive value of given negative number', function() {
            expect(Math.abs(-5)).to.be.equal(5);
        });
    });
});