process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const { expect } = chai;
const should = chai.should();

const app = require('../app');
const Ngo = require('../models/User/user');

chai.use(chaiHttp);

describe('USER TEST', () => {
    beforeEach((done) => { // Before each test we empty the database
        Ngo.remove({}, (err) => {
            done();
        });
    });


    describe('/GET ALL USER LISTS ', () => {
        it('should GET all the NGO', (done) => {
            chai.request(app)
                .get('/ngoAuth/login')
                .end((err, res) => {
                    res.should.have.status(403);
                    done();
                });
        });
    });
});
