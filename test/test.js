var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var fs = require('fs');

chai.use(chaiHttp);
var expect = chai.expect;

// Expected return from APIs
var returnedObject = {
  "username": "gbergamo",
  "password": "mysupersecretpwd"
}

describe('Our First HTTP mock test', function () {

  it('testing our get api', function (done) {
    chai.request(app)
      .get('/api/gbergamo/mysupersecretpwd') // adding parameters into URL
      .set('app-header-valid', '0123456789') // adding headers
      .end(function (err, res) {

        expect(res).to.have.status(200); // Checking the response status (200 - OK)
        expect(res).to.not.have.status(500);
        expect(res.body).to.be.an('object'); // Checking if return is an object
        expect(res.body).to.deep.equal(returnedObject); // Checking if return is exactly equals our mocked object
        expect(res.body, returnedObject).to.be.ok; // Another way to check if response object are loosely equals (==)
        expect(res.body).to.have.property('username'); // Checking if object have a specific property
        expect(res.body).to.have.all.keys('username', 'password').to.not.have.any.keys('name', 'surname'); // Checking if object have all properties. And concating checks.
        expect(res.body.username).to.include('bergamo'); // Checking a substring
        expect(res.body).to.not.be.null; // Checking if body is not null. Note: This is not recommended, use .to.be.null or to.equal(value)

        done();
      });
  });

  it('testing our post api', function (done) {
    chai.request(app)
      .post('/api')
      .set('content-type', 'application/json')
      .set('app-header-valid', '0123456789') // Adding headers
      .send({ "username": "gbergamo", "password": "mysupersecretpwd" }) // Adding json parameters to body
      .end(function (err, res) {

        expect(res).to.have.status(200); // Checking the response status (200 - OK)
        expect(res).to.not.have.status(500);
        expect(res.body).to.be.an('object'); // Checking if return is an object
        expect(res.body).to.deep.equal(returnedObject); // Checking if return is exactly equals our mocked object
        expect(res.body, returnedObject).to.be.ok; // Another way to check if response object are loosely equals (==)
        expect(res.body).to.have.property('username'); // Checking if object have a specific property
        expect(res.body).to.have.all.keys('username', 'password').to.not.have.any.keys('name', 'surname'); // Checking if object have all properties. And concating checks.
        expect(res.body.username).to.include('bergamo'); // Checking a substring
        expect(res.body).to.not.be.null; // Checking if body is not null. Note: This is not recommended, use .to.be.null or to.equal(value)

        done();
      });
  });

  it('testing upload and download file', function (done) {
    chai.request(app)
      .post('/api/upload')
      .set('content-type', 'application/json')
      .set('app-header-valid', '0123456789') // Adding headers
      .send({ "username": "gbergamo", "password": "mysupersecretpwd" }) // Adding json parameters to body
      .attach('file', fs.readFileSync('./test/file/Capture.png'), 'capture.png') // attaching file to post request
      .end(function (err, res) {

        // Declaring file name and path to save received file.
        let receivedFilePath = './test/file/received.png';

        // Reading buffer from response body
        var imageBuffer = new Buffer(res.body, 'base64');

        // Writing buffer into a real file
        fs.writeFileSync(receivedFilePath, imageBuffer);

        expect(res).to.have.status(200); // Checking the response status (200 - OK)
        expect(res.header['content-type']).to.equal('image/png');
        expect(fs.existsSync(receivedFilePath)).to.be.true;

        done();
      });
  });
});