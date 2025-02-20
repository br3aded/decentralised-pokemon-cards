# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```

make sure node.js is installed

ensure hardhat is installed locally in the project directory with `npm install --save-dev hardhat`

To run project

`npx hardhat node`

`npx hardhat run scripts/deploy.js --network localhost`

`npm run dev`


for metamask wallet connect to local hardhat network using

     Network Name: Hardhat Local
     
     New RPC URL: http://127.0.0.1:8545/
     
     Chain ID: 31337
     
     Currency Symbol: ETH

to ensure you are on the owner address import the private key into metamask from the node console account 0 with the private key given

