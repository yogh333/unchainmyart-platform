const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./conf/config.json'));
const Users = config.Users;
const Arts = config.Artworks;

const UnchainMyArt = artifacts.require("./UnchainMyArt");

function displayRequest(request) {
  console.log("request requester = " + request.requester);
  console.log("request ID = " + request.requestID);
  console.log("request ts = " + request.requestTimestamp);
  console.log("request state = " + request.requestState);
  console.log("request creator = " + request.item.creatorDid);
  console.log("request owner = " + request.item.ownerDid);
  console.log("request description = " + request.item.description);
  console.log("request privacy = " + request.item.privacy);
  console.log("request poe = " + request.item.proofOfExistenceURI);
  console.log("request pop = " + request.item.proofOfPropertyURI);
  console.log("request token = " + request.item.tokenAddress);
  console.log("request token ts = " + request.item.tokenCreationTimestamp);
}

contract("Unchain", accounts => {

  let unchainMyArtInstance;
  
  beforeEach(async () => {
      unchainMyArtInstance = await UnchainMyArt.deployed();
  });

  it("...should register a new user.", async () => {

    let result = await unchainMyArtInstance.registerUser(Users[0].name, Users[0].did, {from: accounts[0]});

    assert.equal(result.logs[0].args["_name"], Users[0].name, "wrong user's name");
    assert.equal(result.logs[0].args["_did"], Users[0].did, "wrong user's DID");
  });

  it("...should register another user.", async () => {

    let result = await unchainMyArtInstance.registerUser(Users[1].name, Users[1].did, {from: accounts[1]});

    assert.equal(result.logs[0].args["_name"], Users[1].name, "wrong user's name");
    assert.equal(result.logs[0].args["_did"], Users[1].did, "wrong user's DID");
  });

  it("...should return the number of users.", async () => {

    let result = await unchainMyArtInstance.getNbOfUsers({from: accounts[0]});

    assert.equal(result.toNumber(), 2, "wrong number of users");
  });

  it("...should request to register an art item.", async () => {

    let artwork = Arts[0];

    let result = await unchainMyArtInstance.request(
      artwork.creator, 
      artwork.description,
      artwork.private, 
      artwork.proofOfExistence, 
      artwork.proofOfProperty,
      {from: accounts[1]}
    );

    assert.equal(result.logs[0].args["reqID"], 0, "wrong request ID");
  });

  it("...should review a request", async () => {
    
    let request = await unchainMyArtInstance.getRequest(0);

    //displayRequest(request);

    assert.equal(request.requestID, 0, "wrong request");
  });

  it("...should deploy a token linked with an artwork", async () => {

    let result = await unchainMyArtInstance.createArtToken(0, "TOKENART", "TOK", {from: accounts[1]});

    assert.equal(result.logs[0].args["reqID"], 0, "token not created");
  });

  it("...should review a request", async () => {
    
    let request = await unchainMyArtInstance.getRequest(0);

    displayRequest(request);

    assert.equal(request.requestID, 0, "wrong request");
  });

});