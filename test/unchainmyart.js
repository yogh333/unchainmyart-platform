const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./conf/config.json'));
const Admins = config.Administrators;
const Users = config.Users;
const Arts = config.Artworks;

const UnchainMyArt = artifacts.require("./UnchainMyArt");

function displayItem(item) {
  console.log("request requester = " + item.requester);
  console.log("request ID = " + item.requestID);
  console.log("request ts = " + item.requestTimestamp);
  console.log("request state = " + item.requestState);
  console.log("request creator = " + item.creatorDid);
  console.log("request description = " + item.description);
  console.log("request NFT ID = " + item.pair.nftID);
  console.log("request FT ID = " + item.pair.ftID);
  console.log("request privacy = " + item.privacy);
  console.log("request poe = " + item.proofOfExistenceURI);
  console.log("request pop = " + item.proofOfPropertyURI);
  console.log("request token ts = " + item.tokenCreationTimestamp);
}

contract("Unchain", accounts => {

  let unchainMyArtInstance;
  
  beforeEach(async () => {
      unchainMyArtInstance = await UnchainMyArt.deployed();
  });

  it("...should register a new user.", async () => {

    let result = await unchainMyArtInstance.registerUser(Users[0].address, Users[0].did, {from: Admins[0].address});

    assert.equal(result.logs[0].args["user"], Users[0].address, "wrong user's name");
    assert.equal(result.logs[0].args["did"], Users[0].did, "wrong user's DID");
  });

  it("...should register another user.", async () => {

    let result = await unchainMyArtInstance.registerUser(Users[1].address, Users[1].did, {from: Admins[0].address});

    assert.equal(result.logs[0].args["user"], Users[1].address, "wrong user's name");
    assert.equal(result.logs[0].args["did"], Users[1].did, "wrong user's DID");
  });

/*  it.skip("...should return the number of users.", async () => {

    let result = await unchainMyArtInstance.getNbOfUsers({from: accounts[0]});

    assert.equal(result.toNumber(), 2, "wrong number of users");
  });
*/
  it("...should request to register an art item.", async () => {

    let artwork = Arts[0];

    let result = await unchainMyArtInstance.registerItem(
      artwork.creator, 
      artwork.description,
      artwork.private, 
      artwork.proofOfExistence, 
      artwork.proofOfProperty,
      {from: Users[0].address}
    );

    assert.equal(result.logs[0].args["reqID"], 0, "wrong request ID");
  });

  it("...should review a request", async () => {
    
    let item = await unchainMyArtInstance.getItemFromReqID(0);

    displayItem(item);

    assert.equal(item.requestID, 0, "wrong request");
  });

  it("...should mint ERC1155 token linked with an artwork", async () => {

    let result = await unchainMyArtInstance.mintUMAToken(Users[0].address, 0, {from: Admins[0].address});

    assert.equal(result.logs[0].args["to"], Users[0].address, "token not created");
  });

  it("...should review a request", async () => {
    
    let item = await unchainMyArtInstance.getItemFromReqID(0);

    displayItem(item);

    assert.equal(item.requestID, 0, "wrong request");
  });

  it("...should display balance of ERC1155 token for an account", async () => {
    
    let item = await unchainMyArtInstance.balanceOfBatch([Users[0].address, Users[0].address], [0, 1]);

    console.log(item[0].toString(), item[1].toString());
  });

});