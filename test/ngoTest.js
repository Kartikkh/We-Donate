process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const { expect } = chai;
const should = chai.should();

const app = require('../app');
const Ngo = require('../models/Ngo/ngo');

chai.use(chaiHttp);

describe('NGO TEST', () => {
    beforeEach((done) => { // Before each test we empty the database
        Ngo.remove({}, (err) => {
            done();
        });
    });


    describe('/GET ALL NGO LISTS ', () => {
        it('should GET all the NGO', (done) => {
            chai.request(app)
                .get('/ngoAuth/login')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });
});
