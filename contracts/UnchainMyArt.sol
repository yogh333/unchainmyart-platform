// contracts/MyContract.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract ArtToken is ERC721 {
    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}
}

contract UnchainMyArt {

    using SafeMath for uint256;

    enum RequestState {REQ_NEW, REQ_ASSIGNED, REQ_REVIEWED, REQ_COMPLETED, REQ_CLOSED}

    struct Item {
        string creatorDid;
        string ownerDid;
        string description;
        bool privacy;
        string proofOfExistenceURI;
        string proofOfPropertyURI;
        address tokenAddress;
        uint256 tokenCreationTimestamp;
    }

    struct Request {
        address requester;          // requester address
        uint256 requestID;          // request ID
        uint256 requestTimestamp;   
        RequestState requestState;
        Item item; 
    }

    struct User {
		address user;           // user's blockchain address
        string did;             // user's DID
        string name;            // user's name
        bool userRegistered;    
	}

    event eRegister(string _name, string _did);
    event eArtToken(address tokenCreator, uint256 reqID, address ArtToken);
    event eRequest(address requester, uint256 reqID);

    mapping(address => User) private users;	// Mapping of users  
    uint256 private nbOfUsers;
    
    mapping(address => Request[]) private userToRequest; // list of requests by user
    
    mapping(uint256 => Request) requests;
    uint256 private nbOfRequests;
 
    constructor() {
        nbOfRequests = 0;
        nbOfUsers = 0;
    }

    function registerUser(string memory _name, string memory _did) external {
        
        require(!users[msg.sender].userRegistered, "user already registered");

        users[msg.sender].user = msg.sender;
		users[msg.sender].name = _name;
        users[msg.sender].did = _did;
        users[msg.sender].userRegistered = true;

        nbOfUsers = nbOfUsers.add(1);

		emit eRegister(_name, _did);
    }

    function getNbOfUsers() view external returns (uint256 n){
        return nbOfUsers;
    }

    function request(string memory _creatorDid, string memory _description, bool _private, string memory _poeURI, string memory _popURI) external {
		
        require(users[msg.sender].userRegistered, "user not registered");
        
		Request storage req = requests[nbOfRequests];

        req.requester = msg.sender;
        req.requestID = nbOfRequests;
        req.requestTimestamp = block.timestamp;
        req.requestState = RequestState.REQ_NEW; 

        req.item.creatorDid = _creatorDid;
        req.item.description = _description;
        req.item.privacy = _private;
        req.item.proofOfExistenceURI = _poeURI;
        req.item.proofOfPropertyURI = _popURI;

        userToRequest[msg.sender].push(req);

        nbOfRequests = nbOfRequests.add(1);

		emit eRequest(msg.sender, req.requestID);
	}

    function getRequest(uint256 _reqID) public view returns (Request memory) {
        require(users[msg.sender].userRegistered, "user not registered");
        require(requests[_reqID].requestState >= RequestState.REQ_NEW, "request does not exist yet");

        Request storage req = requests[_reqID];

        return req;
    }

    function createArtToken(uint256 _reqID, string memory name, string memory symbol) public {

        require(users[msg.sender].userRegistered, "user not registered");
        require(requests[_reqID].requestState >= RequestState.REQ_NEW, "request has not been assigned yet");

        Request storage req = requests[_reqID];
        Item storage item = req.item;

        item.tokenAddress = address(new ArtToken(name, symbol));
        item.tokenCreationTimestamp = block.timestamp;
        req.requestState = RequestState.REQ_COMPLETED;

        emit eArtToken(msg.sender, _reqID, item.tokenAddress);
    }
}