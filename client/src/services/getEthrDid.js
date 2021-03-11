import EthereumDidRegistry from "./../contracts/EthereumDIDRegistry.json";
import EthrDID from 'ethr-did'
import { Resolver } from 'did-resolver'
import { getResolver, delegateTypes } from 'ethr-did-resolver'
import getWeb3 from './getWeb3';

let web3 = null;
let deployedNetwork = null;
let keyPair = null;
let ethrDid = null;
let resolver = null;

export async function getEthrDid() {
    console.log("in getEthrDid()");
    web3 = await getWeb3();
    console.log("got Web3()");
    const networkID = await web3.eth.net.getId();
    deployedNetwork = EthereumDidRegistry.networks[networkID];
    const instance = new web3.eth.Contract(
      EthereumDidRegistry.abi,
      deployedNetwork && deployedNetwork.address,
    );
    keyPair = EthrDID.createKeyPair();
    ethrDid = new EthrDID({provider: web3.currentProvider, registry: deployedNetwork.address, address: keyPair.address});
    resolver = new Resolver(getResolver({
        provider: web3.currentProvider,
        registry: deployedNetwork.address}));
    
    const did = ethrDid.did;
    const diddoc = await resolver.resolve(did);

    return { did:did, diddoc:JSON.stringify(diddoc)};
}