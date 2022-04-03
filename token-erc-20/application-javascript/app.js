/*
 * This is an IBM Corp file that has been modified by Marc Rossello
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../test-application/javascript/AppUtil.js');

const channelName = 'mychannel';
const chaincodeName = 'token_erc20';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');


const org1UserId = 'appUser';
const org1User2Id = 'appUser2';

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}


async function main() {
	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		const ccp = buildCCPOrg1();

		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

		// setup the wallet to hold the credentials of the application user
		const wallet = await buildWallet(Wallets, walletPath);

		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, mspOrg1);

		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1User2Id, 'org1.department1');

		// Create a new gateway instance for interacting with the fabric network.
		// In a real application this would be done as the backend server session is setup for
		// a user that has been verified.
		const gateway = new Gateway();

		try {
			// setup the gateway instance
			// The user will now be able to create connections to the fabric network and be able to
			// submit transactions and query. All transactions submitted by this gateway will be
			// signed by this user using the credentials stored in the wallet.
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			// Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(channelName);

			// Get the contract from the network.
			const contract = network.getContract(chaincodeName);

			console.log("\n--------------------------------------------------------------------");
			console.log("User 1");
			console.log("--------------------------------------------------------------------");


			let result;

			console.log('\n--> Getting client account ID');
			result = await contract.evaluateTransaction('ClientAccountID');
			console.log(`*** Client account ID: ${result}`);



			// Now let's try to submit a transaction.
			// This will be sent to both peers and if both peers endorse the transaction, the endorsed proposal will be sent
			// to the orderer to be committed by each of the peer's to the channel ledger.
			console.log('\n--> Minting tokens 5000 tokens');
			result = await contract.submitTransaction('Mint', '5000');
			console.log(`*** Completed`);

			var recipient = "eDUwOTo6Q049YXBwVXNlcjIsT1U9b3JnMStPVT1jbGllbnQrT1U9ZGVwYXJ0bWVudDE6OkNOPWNhLm9yZzEuZXhhbXBsZS5jb20sTz1vcmcxLmV4YW1wbGUuY29tLEw9RHVyaGFtLFNUPU5vcnRoIENhcm9saW5hLEM9VVM=";
			result = await contract.submitTransaction('Transfer', recipient, '3000');
			console.log(`*** transferred 3000 tokens to user 2`);

			console.log('\n--> Getting client account balance');
			result = await contract.evaluateTransaction('ClientAccountBalance');
			console.log(`*** Client account balance: ${result}`);


			//Burn 1000 tokens
			console.log('\n--> Burning 1000 tokens');
			result = await contract.submitTransaction('Burn', '1000');
			console.log(`*** 1000 tokens burned`);

			console.log('\n--> Getting client account balance');
			result = await contract.evaluateTransaction('ClientAccountBalance');
			console.log(`*** Client account balance: ${result}`);

			try {
				//Try to transfer 10000 tokens (not enough in wallet)
				var recipient = "eDUwOTo6Q049YXBwVXNlcjIsT1U9b3JnMStPVT1jbGllbnQrT1U9ZGVwYXJ0bWVudDE6OkNOPWNhLm9yZzEuZXhhbXBsZS5jb20sTz1vcmcxLmV4YW1wbGUuY29tLEw9RHVyaGFtLFNUPU5vcnRoIENhcm9saW5hLEM9VVM=";
				console.log('\n--> Transfering 10.000 tokens with an account\'s balance of 1.000');
				result = await contract.submitTransaction('Transfer', recipient, '10000');
			} catch (error) {
				//console.log(`*** Successfully caught the error: \n    ${error}`);
			}


			// try {
			// 	// How about we try a transactions where the executing chaincode throws an error
			// 	// Notice how the submitTransaction will throw an error containing the error thrown by the chaincode
			// 	console.log('\n--> Submit Transaction: UpdateAsset asset70, asset70 does not exist and should return an error');
			// 	await contract.submitTransaction('UpdateAsset', 'asset70', 'blue', '5', 'Tomoko', '300');
			// 	console.log('******** FAILED to return an error');
			// } catch (error) {
			// 	console.log(`*** Successfully caught the error: \n    ${error}`);
			// }


		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
			gateway.disconnect();
		}

		console.log("\n--------------------------------------------------------------------");
		console.log("User 2");
		console.log("--------------------------------------------------------------------");
		try {
			// setup the gateway instance
			// The user will now be able to create connections to the fabric network and be able to
			// submit transactions and query. All transactions submitted by this gateway will be
			// signed by this user using the credentials stored in the wallet.
			await gateway.connect(ccp, {
				wallet,
				identity: org1User2Id,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			// Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(channelName);

			// Get the contract from the network.
			const contract = network.getContract(chaincodeName);

			let result;

			console.log('\n--> Getting client account ID');
			result = await contract.evaluateTransaction('ClientAccountID');
			console.log(`*** Client account ID: ${result}`);

			console.log('\n--> Getting client account balance');
			result = await contract.evaluateTransaction('ClientAccountBalance');
			console.log(`*** Client account balance: ${result}`);


			// Now let's try to submit a transaction.
			// This will be sent to both peers and if both peers endorse the transaction, the endorsed proposal will be sent
			// to the orderer to be committed by each of the peer's to the channel ledger.
			console.log('\n--> Minting 7000 tokens');
			result = await contract.submitTransaction('Mint', '7000');
			console.log(`*** Completed`);

			console.log('\n--> Getting client account balance');
			result = await contract.evaluateTransaction('ClientAccountBalance');
			console.log(`*** Client account balance: ${result}`);


		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
			gateway.disconnect();
		}

		console.log("\n--------------------------------------------------------------------------------");
		console.log("SIMULATION FINISHED SUCCESSFULLY")
		console.log("--------------------------------------------------------------------------------");

	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}
}

main();
