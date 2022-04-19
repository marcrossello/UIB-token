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
const mspOrg2 = 'Org2MSP';

const walletPath = path.join(__dirname, 'wallet2');

const uibUser = 'UIB';

const org2User = 'orgColaboradora';

const uibUserAccount = "eDUwOTo6Q049VUlCLE9VPW9yZzErT1U9Y2xpZW50K09VPWRlcGFydG1lbnQxOjpDTj1jYS5vcmcxLmV4YW1wbGUuY29tLE89b3JnMS5leGFtcGxlLmNvbSxMPUR1cmhhbSxTVD1Ob3J0aCBDYXJvbGluYSxDPVVT";
const student1Account = "";
const student2Account = "";



function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

var ccp;
var caClient;
var wallet;

async function main() {
	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		ccp = buildCCPOrg2();

		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		caClient = buildCAClient(FabricCAServices, ccp, 'ca.org2.example.com');


		// setup the wallet to hold the credentials of the application user
		wallet = await buildWallet(Wallets, walletPath);

		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, mspOrg2);

		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		await registerAndEnrollUser(caClient, wallet, mspOrg2, org2User, 'org2.department1');

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

	await getClientAccountID(org2User);


	console.log("\n--------------------------------------------------------------------");
	console.log("ALLOWED OPERATIONS");
	console.log("--------------------------------------------------------------------");

	//ALLOWED OPERATIONS ZONE

	await getClientAccountBalance(org2User);

	await transfer(org2User, '350', uibUser, uibUserAccount);

	await getClientAccountBalance(org2User);

	console.log("a")

	await getTotalSupply();

	console.log("a")

	console.log("\n--------------------------------------------------------------------");
	console.log("RESTRICTED OPERATIONS INFO");
	console.log("--------------------------------------------------------------------");

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
			await gateway.connect(ccp, {
				wallet,
				identity: clientIdentity,
				discovery: { enabled: true, asLocalhost: true }
			});

			const network = await gateway.getNetwork(channelName);
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
				identity: uibUser,
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