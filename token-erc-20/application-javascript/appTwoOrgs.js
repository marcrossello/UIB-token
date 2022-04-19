/*
 * This is an IBM Corp file that has been modified by Marc Rossello
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet, buildCCPOrg2 } = require('../../application/javascript/AppUtil.js');

const channelName = 'mychannel';
const chaincodeName = 'token_erc20';
const mspOrg1 = 'Org1MSP';
const mspOrg2 = 'Org2MSP';
const walletPath = path.join(__dirname, 'wallet');
const walletPath2 = path.join(__dirname, 'wallet2');


const org1Minter = 'minter';
const org1Student1 = 'appUser2';
const org1Student2 = 'appUser3';

const org2User = 'orgColaboradora'

const minterAccount = "eDUwOTo6Q049YXBwVXNlcixPVT1vcmcxK09VPWNsaWVudCtPVT1kZXBhcnRtZW50MTo6Q049Y2Eub3JnMS5leGFtcGxlLmNvbSxPPW9yZzEuZXhhbXBsZS5jb20sTD1EdXJoYW0sU1Q9Tm9ydGggQ2Fyb2xpbmEsQz1VUw==";
const student1Account = "eDUwOTo6Q049YXBwVXNlcjIsT1U9b3JnMStPVT1jbGllbnQrT1U9ZGVwYXJ0bWVudDI6OkNOPWNhLm9yZzEuZXhhbXBsZS5jb20sTz1vcmcxLmV4YW1wbGUuY29tLEw9RHVyaGFtLFNUPU5vcnRoIENhcm9saW5hLEM9VVM=";
const student2Account = "eDUwOTo6Q049YXBwVXNlcjMsT1U9b3JnMStPVT1jbGllbnQrT1U9ZGVwYXJ0bWVudDI6OkNOPWNhLm9yZzEuZXhhbXBsZS5jb20sTz1vcmcxLmV4YW1wbGUuY29tLEw9RHVyaGFtLFNUPU5vcnRoIENhcm9saW5hLEM9VVM=";



function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}


var ccp;
var caClient;
var wallet;

var ccp2;
var caClient2;
var wallet2;

async function main() {
	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		ccp = buildCCPOrg1();

		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

		// setup the wallet to hold the credentials of the application user
		wallet = await buildWallet(Wallets, walletPath);

		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, mspOrg1);

		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1Minter, 'org1.department1');

		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1Student1, 'org1.department2');
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1Student2, 'org1.department2');



		// build an in memory object with the network configuration (also known as a connection profile)
		ccp2 = buildCCPOrg2();

		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		caClient2 = buildCAClient(FabricCAServices, ccp2, 'ca.org2.example.com');

		// setup the wallet to hold the credentials of the application user
		wallet2 = await buildWallet(Wallets, walletPath2);

		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient2, wallet2, mspOrg2);

		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		await registerAndEnrollUser(caClient2, wallet2, mspOrg2, org2User, 'org2.department1');

		// Create a new gateway instance for interacting with the fabric network.
		// In a real application this would be done as the backend server session is setup for
		// a user that has been verified.
		const gateway = new Gateway();

		console.log('\x1b[36m%s\x1b[0m', 'I am cyan');  //cyan

	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}

	//USER INFO ZONE
	console.log("\n--------------------------------------------------------------------");
	console.log("USERS INFO");
	console.log("--------------------------------------------------------------------");

	await getClientAccountID(org1Minter, 1);
	await getClientAccountID(org1Student1, 1);
	await getClientAccountID(org1Student2, 1);
	await getClientAccountID(org2User, 2);


	console.log("\n--------------------------------------------------------------------");
	console.log("ALLOWED OPERATIONS");
	console.log("--------------------------------------------------------------------");

	//ALLOWED OPERATIONS ZONE
	await mint(org1Minter, '5000');

	await getClientAccountBalance(org1Minter);

	await transfer(org1Minter, '700', org1Student1, student1Account);

	await getClientAccountBalance(org1Minter);
	await getClientAccountBalance(org1Student1);

	await transfer(org1Student1, '200', org1Minter, minterAccount);

	await getClientAccountBalance(org1Student1);
	await getClientAccountBalance(org1Minter);

	await burn(org1Minter, '1000');
	await getClientAccountBalance(org1Minter);

	await getTotalSupply();

	await transfer(org1Student1, '700', org1Student2, student2Account);

	console.log("\n--------------------------------------------------------------------");
	console.log("RESTRICTED OPERATIONS INFO");
	console.log("--------------------------------------------------------------------");

	//RESTRICTED OPERATIONS ZONE
	//Now let's try some restricted operations

	await mint(org1Student1, '3000');

	await burn(org1Student1, '1000');
}

main();

//Function that mints tokens for a given client
//amount is a string
async function mint(clientIdentity, amount) {
	try {
		const gateway = new Gateway();
		try {
			await gateway.connect(ccp, {
				wallet,
				identity: clientIdentity,
				discovery: { enabled: true, asLocalhost: true }
			});

			const network = await gateway.getNetwork(channelName);
			const contract = network.getContract(chaincodeName);

			let result;

			console.log('\n--> User ' + clientIdentity + ' is minting ' + amount + ' tokens');
			result = await contract.submitTransaction('Mint', amount);
			console.log(`*** Completed`);

		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
			gateway.disconnect();
		}
	} catch (error) {
		//console.error(`******** FAILED to run the application: ${error}`);
	}
}

async function burn(clientIdentity, amount) {
	try {
		const gateway = new Gateway();
		try {
			await gateway.connect(ccp, {
				wallet,
				identity: clientIdentity,
				discovery: { enabled: true, asLocalhost: true }
			});

			const network = await gateway.getNetwork(channelName);
			const contract = network.getContract(chaincodeName);

			let result;

			console.log('\n--> User ' + clientIdentity + ' is burning ' + amount + ' tokens');
			result = await contract.submitTransaction('Burn', amount);
			console.log(`*** Completed`);

		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
			gateway.disconnect();
		}
	} catch (error) {
		//console.error(`******** FAILED to run the application: ${error}`);
	}
}

async function transfer(clientIdentity, amount, recipient, recipientAccount) {
	try {
		const gateway = new Gateway();
		try {
			await gateway.connect(ccp, {
				wallet,
				identity: clientIdentity,
				discovery: { enabled: true, asLocalhost: true }
			});

			const network = await gateway.getNetwork(channelName);
			const contract = network.getContract(chaincodeName);

			let result;

			console.log('\n--> User ' + clientIdentity + ' is transferring ' + amount + ' tokens to ' + recipient);
			result = await contract.submitTransaction('Transfer', recipientAccount, amount);
			console.log('*** Transferred ' + amount + ' tokens to ' + recipient);

		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
			gateway.disconnect();
		}
	} catch (error) {
		//console.error(`******** FAILED to run the application: ${error}`);
	}
}

async function getClientAccountID(clientIdentity, orgNumber) {
	try {
		const gateway = new Gateway();
		try {
			if (orgNumber == 1){
				console.log("wallet1")
				await gateway.connect(ccp, {
					wallet,
					identity: clientIdentity,
					discovery: { enabled: true, asLocalhost: true }
				});
			}else {
				console.log("wallet2")
				await gateway.connect(ccp2, {
					wallet2,
					identity: clientIdentity,
					discovery: { enabled: true, asLocalhost: true }
				});
			}

			console.log("a")

			const network = await gateway.getNetwork(channelName);
			console.log("b")
			const contract = network.getContract(chaincodeName);

			let result;

			console.log('\n--> Getting ' + clientIdentity + ' account ID');
			result = await contract.evaluateTransaction('ClientAccountID');
			console.log('*** ' + clientIdentity + ' account ID: ' + result);
			console.log(Buffer.from(result.toString(), 'base64').toString('ascii'));

		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
			gateway.disconnect();
		}
	} catch (error) {
		console.error(`${error}`);
	}
}

async function getClientAccountBalance(clientIdentity) {
	try {
		const gateway = new Gateway();
		try {
			await gateway.connect(ccp, {
				wallet,
				identity: clientIdentity,
				discovery: { enabled: true, asLocalhost: true }
			});

			const network = await gateway.getNetwork(channelName);
			const contract = network.getContract(chaincodeName);

			let result;

			console.log('\n--> Getting ' + clientIdentity + ' account balance');
			result = await contract.evaluateTransaction('ClientAccountBalance');
			console.log('*** ' + clientIdentity + ' account balance: ' + result);

		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
			gateway.disconnect();
		}
	} catch (error) {
		console.error(`${error}`);
	}
}

async function getTotalSupply() {
	try {
		const gateway = new Gateway();
		try {
			await gateway.connect(ccp, {
				wallet,
				identity: org1Minter,
				discovery: { enabled: true, asLocalhost: true }
			});

			const network = await gateway.getNetwork(channelName);
			const contract = network.getContract(chaincodeName);

			let result;

			console.log('\n--> Getting global token balance');
			result = await contract.evaluateTransaction('TotalSupply');
			console.log(`*** Global token balance: ${result}`);

		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
			gateway.disconnect();
		}
	} catch (error) {
		//console.error(`******** FAILED to run the application: ${error}`);
	}
}