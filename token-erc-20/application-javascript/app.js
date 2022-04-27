/*
 * This is an IBM Corp file that has been modified by Marc Rossello
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../application/javascript/CAUtil.js');
const { buildCCPOrg1, buildCCPOrg2, buildCCPOrg3, buildWallet } = require('../../application/javascript/AppUtil.js');

const channelName = 'mychannel';
const chaincodeName = 'token_erc20';

const mspOrg1 = 'Org1MSP';
const mspOrg2 = 'Org2MSP';
const mspOrg3 = 'Org3MSP';

const walletPath = path.join(__dirname, 'wallet');
const walletPath2 = path.join(__dirname, 'wallet2');
const walletPath3 = path.join(__dirname, 'wallet3');

// names for channel and chaincode of colaboration
const channelName2 = 'collaborationchannel';
const chaincodeName2 = 'assetschain';


const uibUser = 'UIB';
const uibUserNumber = 1;
const org1Student1 = 'appUser1';
const org1Student1Number = 1;
const org1Student2 = 'appUser2';
const org1Student2Number = 1;

const org2User = 'universidad2';
const org2UserNumber = 2;


const org3User = 'orgColab';
const org3UserNumber = 3;

const uibUserAccount = "eDUwOTo6Q049VUlCLE9VPW9yZzErT1U9Y2xpZW50K09VPWRlcGFydG1lbnQxOjpDTj1jYS5vcmcxLmV4YW1wbGUuY29tLE89b3JnMS5leGFtcGxlLmNvbSxMPUR1cmhhbSxTVD1Ob3J0aCBDYXJvbGluYSxDPVVT";
const student1Account = "eDUwOTo6Q049YXBwVXNlcjEsT1U9b3JnMStPVT1jbGllbnQrT1U9ZGVwYXJ0bWVudDI6OkNOPWNhLm9yZzEuZXhhbXBsZS5jb20sTz1vcmcxLmV4YW1wbGUuY29tLEw9RHVyaGFtLFNUPU5vcnRoIENhcm9saW5hLEM9VVM=";
const student2Account = "eDUwOTo6Q049YXBwVXNlcjIsT1U9b3JnMStPVT1jbGllbnQrT1U9ZGVwYXJ0bWVudDI6OkNOPWNhLm9yZzEuZXhhbXBsZS5jb20sTz1vcmcxLmV4YW1wbGUuY29tLEw9RHVyaGFtLFNUPU5vcnRoIENhcm9saW5hLEM9VVM=";

const org2UserAccount = "eDUwOTo6Q049dW5pdmVyc2lkYWQyLE9VPW9yZzIrT1U9Y2xpZW50K09VPWRlcGFydG1lbnQxOjpDTj1jYS5vcmcyLmV4YW1wbGUuY29tLE89b3JnMi5leGFtcGxlLmNvbSxMPUh1cnNsZXksU1Q9SGFtcHNoaXJlLEM9VUs=";

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}


var ccp;
var caClient;
var wallet;

var ccp2;
var caClient2;
var wallet2;

var ccp3;
var caClient3;
var wallet3;


async function initOrg1() {
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
		await registerAndEnrollUser(caClient, wallet, mspOrg1, uibUser, 'org1.department1');

		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1Student1, 'org1.department2');
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1Student2, 'org1.department2');

		// Create a new gateway instance for interacting with the fabric network.
		// In a real application this would be done as the backend server session is setup for
		// a user that has been verified.
		//const gateway = new Gateway();



		console.log('\x1b[36m%s\x1b[0m', 'I am cyan');  //cyan

	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}
}




async function initOrg2() {
	try {
		ccp2 = buildCCPOrg2();
		caClient2 = buildCAClient(FabricCAServices, ccp2, 'ca.org2.example.com');
		wallet2 = await buildWallet(Wallets, walletPath2);

		await enrollAdmin(caClient2, wallet2, mspOrg2);
		await registerAndEnrollUser(caClient2, wallet2, mspOrg2, org2User, 'org2.department1');

		console.log('\x1b[36m%s\x1b[0m', 'I am cyan');  //cyan

	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}
}

async function initOrg3() {
	try {
		ccp3 = buildCCPOrg3();
		caClient3 = buildCAClient(FabricCAServices, ccp3, 'ca.org3.example.com');
		wallet3 = await buildWallet(Wallets, walletPath3);

		await enrollAdmin(caClient3, wallet3, mspOrg3);
		await registerAndEnrollUser(caClient3, wallet3, mspOrg3, org3User, 'org3.department1');

		console.log('\x1b[36m%s\x1b[0m', 'I am cyan');  //cyan

	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}
}

async function main() {

	await initOrg1();

	await initOrg2();

	await initOrg3();


	//USER INFO ZONE
	console.log("\n--------------------------------------------------------------------");
	console.log("USERS INFO");
	console.log("--------------------------------------------------------------------");

	await getClientAccountID(uibUser, uibUserNumber);
	await getClientAccountID(org1Student1, org1Student1Number);
	await getClientAccountID(org1Student2, org1Student2Number);

	//ALLOWED OPERATIONS ZONE
	console.log("\n--------------------------------------------------------------------");
	console.log("ALLOWED OPERATIONS");
	console.log("--------------------------------------------------------------------");

	await mint(uibUser, '5000', uibUserNumber);

	await mint(org2User, '5000', org2UserNumber);

	await getClientAccountBalance(uibUser, uibUserNumber);

	await transfer(uibUser, '700', org1Student1, student1Account, uibUserNumber);

	await getClientAccountBalance(uibUser, uibUserNumber);
	await getClientAccountBalance(org1Student1, org1Student1Number);

	await transfer(org1Student1, '200', uibUser, uibUserAccount, org1Student1Number);

	await getClientAccountBalance(org1Student1, org1Student1Number);
	await getClientAccountBalance(uibUser, uibUserNumber);

	await burn(uibUser, '1000', uibUserNumber);
	await getClientAccountBalance(uibUser, uibUserNumber);

	await getTotalSupply();

	await transfer(org1Student1, '700', org1Student2, student2Account, org1Student1Number);

	await transfer(org1Student1, '350', org2User, org2UserAccount, org1Student1Number);

	//
	await getTransactionHistory(uibUser, uibUserNumber);
	//

	console.log("\n--------------------------------------------------------------------");
	console.log("RESTRICTED OPERATIONS INFO");
	console.log("--------------------------------------------------------------------");

	//RESTRICTED OPERATIONS ZONE
	//Now let's try some restricted operations

	// User without mint permissions tries to mint
	await mint(org1Student1, '3000', org1Student1Number);

	// User without burn permissions tries to burn
	await burn(org1Student1, '1000', org1Student1Number);

	// User with burn permissions tries to burn more tokens than those in their account
	await burn(uibUser, '20000', uibUserNumber);

	//USER INFO ZONE
	console.log("\n--------------------------------------------------------------------");
	console.log("USERS INFO");
	console.log("--------------------------------------------------------------------");

	await getClientAccountID(org2User, org2UserNumber);


	console.log("\n--------------------------------------------------------------------");
	console.log("ALLOWED OPERATIONS");
	console.log("--------------------------------------------------------------------");

	//ALLOWED OPERATIONS ZONE

	await getClientAccountBalance(org2User, org2UserNumber);

	await transfer(org2User, '350', uibUser, uibUserAccount, org2UserNumber);

	await getClientAccountBalance(org2User, org2UserNumber);

	//
	await getTransactionHistory(org2User, org2UserNumber);
	//

	await getClientAccountBalance(uibUser, uibUserNumber);

	await getTotalSupply();
}

main();

//Function that mints tokens for a given client
//amount is a string
async function mint(clientIdentity, amount, orgNum) {
	try {
		const gateway = new Gateway();
		try {
			switch (orgNum) {
				case 1:
					await gateway.connect(ccp, {
						wallet: wallet,
						identity: clientIdentity,
						discovery: { enabled: true, asLocalhost: true }
					});
					break;
				case 2:
					await gateway.connect(ccp2, {
						wallet: wallet2,
						identity: clientIdentity,
						discovery: { enabled: true, asLocalhost: true }
					});
					break;
				default:
					await gateway.connect(ccp3, {
						wallet: wallet3,
						identity: clientIdentity,
						discovery: { enabled: true, asLocalhost: true }
					});
			}

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

async function burn(clientIdentity, amount, orgNum) {
	try {
		const gateway = new Gateway();
		try {
			switch (orgNum) {
				case 1:
					await gateway.connect(ccp, {
						wallet: wallet,
						identity: clientIdentity,
						discovery: { enabled: true, asLocalhost: true }
					});
					break;
				case 2:
					await gateway.connect(ccp2, {
						wallet: wallet2,
						identity: clientIdentity,
						discovery: { enabled: true, asLocalhost: true }
					});
					break;
				default:
					await gateway.connect(ccp3, {
						wallet: wallet3,
						identity: clientIdentity,
						discovery: { enabled: true, asLocalhost: true }
					});
			}

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

async function transfer(clientIdentity, amount, recipient, recipientAccount, orgNum) {
	try {
		const gateway = new Gateway();
		try {
			switch (orgNum) {
				case 1:
					await gateway.connect(ccp, {
						wallet: wallet,
						identity: clientIdentity,
						discovery: { enabled: true, asLocalhost: true }
					});
					break;
				case 2:
					await gateway.connect(ccp2, {
						wallet: wallet2,
						identity: clientIdentity,
						discovery: { enabled: true, asLocalhost: true }
					});
					break;
				default:
					await gateway.connect(ccp3, {
						wallet: wallet3,
						identity: clientIdentity,
						discovery: { enabled: true, asLocalhost: true }
					});
			}

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

async function getClientAccountID(clientIdentity, orgNum) {
	try {
		const gateway = new Gateway();
		try {
			switch (orgNum) {
				case 1:
					await gateway.connect(ccp, {
						wallet: wallet,
						identity: clientIdentity,
						discovery: { enabled: true, asLocalhost: true }
					});
					break;
				case 2:
					await gateway.connect(ccp2, {
						wallet: wallet2,
						identity: clientIdentity,
						discovery: { enabled: true, asLocalhost: true }
					});
					break;
				default:
					await gateway.connect(ccp3, {
						wallet: wallet3,
						identity: clientIdentity,
						discovery: { enabled: true, asLocalhost: true }
					});
			}

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

async function getClientAccountBalance(clientIdentity, orgNum) {
	try {
		const gateway = new Gateway();
		try {
			switch (orgNum) {
				case 1:
					await gateway.connect(ccp, {
						wallet: wallet,
						identity: clientIdentity,
						discovery: { enabled: true, asLocalhost: true }
					});
					break;
				case 2:
					await gateway.connect(ccp2, {
						wallet: wallet2,
						identity: clientIdentity,
						discovery: { enabled: true, asLocalhost: true }
					});
					break;
				default:
					await gateway.connect(ccp3, {
						wallet: wallet3,
						identity: clientIdentity,
						discovery: { enabled: true, asLocalhost: true }
					});
			}

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

async function getTransactionHistory(clientIdentity, orgNum) {
	try {
		const gateway = new Gateway();
		try {
			switch (orgNum) {
				case 1:
					await gateway.connect(ccp, {
						wallet: wallet,
						identity: clientIdentity,
						discovery: { enabled: true, asLocalhost: true }
					});
					break;
				case 2:
					await gateway.connect(ccp2, {
						wallet: wallet2,
						identity: clientIdentity,
						discovery: { enabled: true, asLocalhost: true }
					});
					break;
				default:
					await gateway.connect(ccp3, {
						wallet: wallet3,
						identity: clientIdentity,
						discovery: { enabled: true, asLocalhost: true }
					});
			}

			const network = await gateway.getNetwork(channelName);
			const contract = network.getContract(chaincodeName);

			let result;

			console.log('\n--> Getting ' + clientIdentity + ' transaction history');
			result = await contract.evaluateTransaction('GetTransactionHistory');
			console.log('*** ' + clientIdentity + ' transaction history: ' + result);

		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
			gateway.disconnect();
		}
	} catch (error) {
		console.error(`${error}`);
	}
}