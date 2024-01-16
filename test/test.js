const expect = require("chai").expect;
const request = require("request");
const client = require('../dbConnection');

// Database Connection Testing
describe("Database Connection", () => {
    // Test to check if the MongoDB database is successfully connected
    it("Should connect to the MongoDB database", async function () {
        await client.connect();
        const isConnected = client.topology.isConnected();
        expect(isConnected).to.be.true;
    });
    // Closing DB connection to avoid infinity test running
    after(async function () {
        await client.close();
    });
});

// GET /api/Notes to check whether notes stored in Endpoints are retrieving successfully
describe("GET /api/Notes", () => {
    it("should get all notes from the database", function (done) {
        request.get("http://localhost:3000/api/Notes", (err, res, body) => {
            expect(res.statusCode).to.equal(200);
            const responseBody = JSON.parse(body);
            expect(responseBody).to.be.an("object");
            expect(responseBody.statusCode).to.equal(200);
            expect(responseBody.data).to.be.an("array");
            done();
        });
    });
});

// POST /api/Notes to test whether we can successfully add notes 
describe("POST /api/Notes", () => {
    it("should create a new note", function (done) {
        // Creating a Test Note
        const testNote = {
            title: "Test Note",
            description: "This is a test note."
        };
        request.post({
            url: "http://localhost:3000/api/Notes",
            json: true,
            body: testNote
        }, (err, res, body) => {
            expect(res.statusCode).to.equal(200);
            expect(body).to.be.an("object");
            expect(body.statusCode).to.equal(201);
            expect(body.data).to.be.an("object");
            expect(body.data.insertedId).to.be.a("string");
            done();
        });
    });
});