// contracts/MyContract.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

pragma abicoder v2;

import "@openzeppelin/contracts/presets/ERC1155PresetMinterPauser.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract UnchainMyArt is ERC1155PresetMinterPauser {

    using Counters for Counters.Counter;

    enum RequestState {REQ_NEW, REQ_ASSIGNED, REQ_COMPLETED}
    //enum UserRole {UNDEFINED_ROLE, ARTMIN_ROLE, ARTIST_ROLE, COLLECTOR_ROLE}
    //bytes32 public constant UNDEFINED_ROLE = keccak256("UNDEFINED_ROLE");
    //bytes32 public constant MANAGER_ROLE = keccak256("ARTMIN_ROLE");
    //bytes32 public constant ARTIST_ROLE = keccak256("ARTIST_ROLE");
    //bytes32 public constant COLLECTOR_ROLE = keccak256("COLLECTOR_ROLE");
    //bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    struct PairID {
        uint256 nftID;
        uint256 ftID;
    }

    struct Item {
        address requester;          // requester address
        uint256 requestID;          // request ID
        uint256 requestTimestamp;   
        RequestState requestState;
        string creatorDid;
        string description;
        PairID pair;
        bool privacy;
        string proofOfExistenceURI;
        string proofOfPropertyURI;
        uint256 tokenCreationTimestamp;
    }

    struct User {
		address user;           // user's blockchain address
        string did;             // user's DID
	}

    event eRegister(address user, string did);
    event eArtToken(address to, uint256 NFTokenId, uint256 FTokenID, uint256 supply);
    event eRequest(address requester, uint256 reqID);

    mapping(address => User) private _users;	// Mapping of platform users  

    Counters.Counter private _requestsCounter;    
    mapping(uint256 => Item) private _requestToItem;
 
    constructor() ERC1155PresetMinterPauser("") {
    }

    function setRoleAdmin (address user) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "operation only allowed to platform administrator");
        grantRole(DEFAULT_ADMIN_ROLE, user);
        grantRole(MINTER_ROLE, user);
    }

    function registerUser(address userAddress, string memory userDid) public {
        
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "sender is not allowed to register an new user");
        require(_users[userAddress].user == address(0x0), "user is already registered");

        User memory newUser;
        newUser.user = userAddress;
        newUser.did = userDid;

        _users[userAddress] = newUser;    
        emit eRegister(userAddress, userDid);
    }

    function registerItem(
        string memory itemCreatorDid, 
        string memory itemDescription, 
        bool itemPrivacyFlag, 
        string memory itemPoeURI, 
        string memory itemPopURI) external {
		
        require(_users[msg.sender].user != address(0x0), "user not registered");
        //require(hasRole(MANAGER_ROLE, msg.sender), "only Artministrator is allowed to request an item to be registered");

        Item memory item = Item({
            requester: msg.sender, 
            requestID: Counters.current(_requestsCounter), 
            requestTimestamp: block.timestamp, 
            requestState: RequestState.REQ_NEW,
            creatorDid: itemCreatorDid,
            description: itemDescription,
            pair: PairID({
                nftID: 0,
                ftID: 0
            }),
            privacy: itemPrivacyFlag,
            proofOfExistenceURI: itemPoeURI,
            proofOfPropertyURI: itemPopURI,
            tokenCreationTimestamp: 0
        });

        _requestToItem[item.requestID] = item;
        Counters.increment(_requestsCounter);

		emit eRequest(msg.sender, item.requestID);
	}

    function getItemFromReqID(uint256 reqID) public view returns (Item memory) {

        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender));

        return _requestToItem[reqID];
    }

    function mintUMAToken(address to, uint256 reqID) public {
        
        require(hasRole(MINTER_ROLE, msg.sender));

        Item storage item = _requestToItem[reqID];
        item.pair.nftID = SafeMath.mul(reqID, 2);
        item.pair.ftID = SafeMath.add(item.pair.nftID, 1);

        uint256[] memory ids = new uint256[](2);
        ids[0] = item.pair.nftID;
        ids[1] = item.pair.ftID;
        uint256[] memory supply = new uint256[](2);
        supply[0] = 1;
        supply[1] = 100;

        mintBatch(to, ids, supply, "");

        emit eArtToken(to, item.pair.nftID, item.pair.ftID, supply[1]);

    }
}