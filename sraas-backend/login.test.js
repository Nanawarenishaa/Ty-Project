// login.test.js
const request = require('supertest');
const { expect } = require('chai');
const app = require('./server'); // Import your app (server.js)

describe('POST /login', () => {
  it('should return a success message for valid credentials', (done) => {
    const user = {
      username: 'user1',
      password: 'password123'  // Use correct password here
    };

    request(app)
      .post('/login')
      .send(user)
      .expect(200) // Expect a 200 OK status
      .end((err, res) => {
        if (err) return done(err);

        // Check for a success message and token
        expect(res.body.status).to.equal('success');
        expect(res.body.token).to.not.be.empty;
        done();
      });
  });

  it('should return an error for invalid credentials', (done) => {
    const user = {
      username: 'user1',
      password: 'wrongpassword'
    };

    request(app)
      .post('/login')
      .send(user)
      .expect(400) // Expect a 400 Bad Request status
      .end((err, res) => {
        if (err) return done(err);

        // Check for an error message
        expect(res.body.status).to.equal('error');
        expect(res.body.message).to.equal('Invalid password');
        done();
      });
  });
});
