import Web3 from 'web3';
import { abi } from "./abi";

const providerUrl = "<websocket  rpc provider>";
const contractAddress = "0x95D2d8e7EB936638be0c383f5FDC0b3788A2257D";

const web3 = new Web3(new Web3.providers.WebsocketProvider(providerUrl));
const contract = new web3.eth.Contract(abi, contractAddress);

//@ts-ignore
contract.events.PaymentReceived({
  fromBlock: 0
})
  .on('data', async function(event) {
    console.log(`Adding user ${event.returnValues.email} to the course`);
  })
