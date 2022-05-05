/*
 * This is an IBM Corp file that has been modified by Marc Rossello
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../utils/CAUtil.js');
const { buildCCPOrg1, buildCCPOrg2, buildCCPOrg3, buildWallet } = require('../utils/AppUtil.js');

// Token channel and chaincode names
const channelName = 'mychannel';
const chaincodeName = 'token_erc20';

// Collaboration channel and chaincode names
const channelName2 = 'collaborationchannel';
const chaincodeName2 = 'assetschain';


// ORGANISATIONS
// Org1 variables
var ccp;
var caClient;
var wallet;
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');

// Org2 variables
var ccp2;
var caClient2;
var wallet2;
const mspOrg2 = 'Org2MSP';
const walletPath2 = path.join(__dirname, 'wallet2');

// Org3 variables
var ccp3;
var caClient3;
var wallet3;
const mspOrg3 = 'Org3MSP';
const walletPath3 = path.join(__dirname, 'wallet3');


// USERS
// Org1 users
const uibUser = 'UIB';
const uibUserNumber = 1;
const uibUserAccount = "eDUwOTo6Q049VUlCLE9VPW9yZzErT1U9Y2xpZW50K09VPWRlcGFydG1lbnQxOjpDTj1jYS5vcmcxLmV4YW1wbGUuY29tLE89b3JnMS5leGFtcGxlLmNvbSxMPUR1cmhhbSxTVD1Ob3J0aCBDYXJvbGluYSxDPVVT";

const org1Student1 = 'appUser1';
const org1Student1Number = 1;
const student1Account = "eDUwOTo6Q049YXBwVXNlcjEsT1U9b3JnMStPVT1jbGllbnQrT1U9ZGVwYXJ0bWVudDI6OkNOPWNhLm9yZzEuZXhhbXBsZS5jb20sTz1vcmcxLmV4YW1wbGUuY29tLEw9RHVyaGFtLFNUPU5vcnRoIENhcm9saW5hLEM9VVM=";

const org1Student2 = 'appUser2';
const org1Student2Number = 1;
const student2Account = "eDUwOTo6Q049YXBwVXNlcjIsT1U9b3JnMStPVT1jbGllbnQrT1U9ZGVwYXJ0bWVudDI6OkNOPWNhLm9yZzEuZXhhbXBsZS5jb20sTz1vcmcxLmV4YW1wbGUuY29tLEw9RHVyaGFtLFNUPU5vcnRoIENhcm9saW5hLEM9VVM=";

const org1Student3 = 'appUser3';
const org1Student3Number = 1;
const student3Account = "eDUwOTo6Q049YXBwVXNlcjMsT1U9b3JnMStPVT1jbGllbnQrT1U9ZGVwYXJ0bWVudDI6OkNOPWNhLm9yZzEuZXhhbXBsZS5jb20sTz1vcmcxLmV4YW1wbGUuY29tLEw9RHVyaGFtLFNUPU5vcnRoIENhcm9saW5hLEM9VVM=";

// Org2 users
const org2User = 'universidad2';
const org2UserNumber = 2;
const org2UserAccount = "eDUwOTo6Q049dW5pdmVyc2lkYWQyLE9VPW9yZzIrT1U9Y2xpZW50K09VPWRlcGFydG1lbnQxOjpDTj1jYS5vcmcyLmV4YW1wbGUuY29tLE89b3JnMi5leGFtcGxlLmNvbSxMPUh1cnNsZXksU1Q9SGFtcHNoaXJlLEM9VUs=";

const org2Student1 = 'appUser1Org2';
const org2Student1Number = 2;
const org2Student1Account = "eDUwOTo6Q049YXBwVXNlcjFPcmcyLE9VPW9yZzIrT1U9Y2xpZW50K09VPWRlcGFydG1lbnQyOjpDTj1jYS5vcmcyLmV4YW1wbGUuY29tLE89b3JnMi5leGFtcGxlLmNvbSxMPUh1cnNsZXksU1Q9SGFtcHNoaXJlLEM9VUs=";

// Org3 users
const org3User = 'orgColab';
const org3UserNumber = 3;


async function initOrg1() {
	try {
		console.log('\x1b[36m%s\x1b[0m', 'Initialising org1');
		ccp = buildCCPOrg1();
		caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
		wallet = await buildWallet(Wallets, walletPath);

		await enrollAdmin(caClient, wallet, mspOrg1);

		await registerAndEnrollUser(caClient, wallet, mspOrg1, uibUser, 'org1.department1');

		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1Student1, 'org1.department2');
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1Student2, 'org1.department2');
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1Student3, 'org1.department2');

	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}
}

async function initOrg2() {
	try {
		console.log('\x1b[36m%s\x1b[0m', 'Initialising org2');
		ccp2 = buildCCPOrg2();
		caClient2 = buildCAClient(FabricCAServices, ccp2, 'ca.org2.example.com');
		wallet2 = await buildWallet(Wallets, walletPath2);

		await enrollAdmin(caClient2, wallet2, mspOrg2);
		await registerAndEnrollUser(caClient2, wallet2, mspOrg2, org2User, 'org2.department1');

		await registerAndEnrollUser(caClient2, wallet2, mspOrg2, org2Student1, 'org2.department2');

	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}
}

async function initOrg3() {
	try {
		console.log('\x1b[36m%s\x1b[0m', 'Initialising org3');
		ccp3 = buildCCPOrg3();
		caClient3 = buildCAClient(FabricCAServices, ccp3, 'ca.org3.example.com');
		wallet3 = await buildWallet(Wallets, walletPath3);

		await enrollAdmin(caClient3, wallet3, mspOrg3);
		await registerAndEnrollUser(caClient3, wallet3, mspOrg3, org3User, 'org3.department1');

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
	await getClientAccountID(org1Student3, org1Student3Number);

	await getClientAccountID(org2User, org2UserNumber);
	await getClientAccountID(org2Student1, org2Student1Number);

	//await getClientAccountID(org3User, org3UserNumber);

	//ALLOWED OPERATIONS ZONE
	console.log("\n--------------------------------------------------------------------");
	console.log("SIMULATION");
	console.log("--------------------------------------------------------------------");

	// UIB mints and transfers tokens to users 1, 2, and 3
	// This section simulates that users 1, 2, and 3 have done a "good" action and they are rewarded with tokens
	console.log('\x1b[36m%s\x1b[0m', '\nUsers receive tokens form university');
	await mint(uibUser, uibUserNumber, '300');
	await getClientAccountBalance(uibUser, uibUserNumber);

	await transfer(uibUser, uibUserNumber, '300', org1Student1, student1Account);
	await getClientAccountBalance(uibUser, uibUserNumber);
	await getClientAccountBalance(org1Student1, org1Student1Number);


	await mint(uibUser, uibUserNumber, '500');
	await getClientAccountBalance(uibUser, uibUserNumber);

	await transfer(uibUser, uibUserNumber, '500', org1Student2, student2Account);
	await getClientAccountBalance(uibUser, uibUserNumber);
	await getClientAccountBalance(org1Student2, org1Student2Number);


	await mint(uibUser, uibUserNumber, '200');
	await getClientAccountBalance(uibUser, uibUserNumber);

	await transfer(uibUser, uibUserNumber, '200', org1Student3, student3Account);
	await getClientAccountBalance(uibUser, uibUserNumber);
	await getClientAccountBalance(org1Student3, org1Student3Number);

	// Transactions between users
	console.log('\x1b[36m%s\x1b[0m', '\nUsers interact with each other');
	// Now the users execute transactions with the tokens they just received
	// Student 1 transfers to student 2
	await transfer(org1Student1, org1Student1Number, '150', org1Student2, student2Account);
	await getClientAccountBalance(org1Student1, org1Student1Number);
	await getClientAccountBalance(org1Student2, org1Student2Number);

	// Stuent 3 transfers to student 2
	await transfer(org1Student3, org1Student3Number, '20', org1Student2, student2Account);
	await getClientAccountBalance(org1Student3, org1Student3Number);
	await getClientAccountBalance(org1Student2, org1Student2Number);

	// Student 3 transfers again to student 2
	// With this transaction student 2 exceeds the receiving limit
	await transfer(org1Student3, org1Student3Number, '50', org1Student2, student2Account);
	await getClientAccountBalance(org1Student3, org1Student3Number);
	await getClientAccountBalance(org1Student2, org1Student2Number);

	// Student 2 transfers to student 3
	await transfer(org1Student2, org1Student2Number, '100', org1Student3, student3Account);
	await getClientAccountBalance(org1Student2, org1Student2Number);
	await getClientAccountBalance(org1Student3, org1Student3Number);

	// Student 1 transfers to student 2
	// With this transaction student 1 exceeds the lending limit
	await transfer(org1Student1, org1Student1Number, '70', org1Student2, student2Account);
	await getClientAccountBalance(org1Student1, org1Student1Number);
	await getClientAccountBalance(org1Student2, org1Student2Number);

	// Student 1 transfers to student 2
	// Student 1 tries again with less tokens and doesn't exceed the limit
	await transfer(org1Student1, org1Student1Number, '30', org1Student2, student2Account);
	await getClientAccountBalance(org1Student1, org1Student1Number);
	await getClientAccountBalance(org1Student2, org1Student2Number);

	// Student 2 transfers large amount to uib, here the limit does not apply
	/* 	await transfer(org1Student2, org1Student2Number, '300', uibUser, uibUserAccount);
		await getClientAccountBalance(org1Student2, org1Student2Number);
		await getClientAccountBalance(uibUser, uibUserNumber); */

	// The total supply is equal to the amount of tokens minted
	await getTotalSupply();


	// Getting transaction histories
	console.log('\x1b[36m%s\x1b[0m', '\nGetting balance histories');
	await GetBalanceHistory(uibUser, uibUserNumber);
	await GetBalanceHistory(org1Student1, org1Student1Number);
	await GetBalanceHistory(org1Student2, org1Student2Number);
	await GetBalanceHistory(org1Student3, org1Student3Number);

	console.log("\n--------------------------------------------------------------------");
	console.log("INTERACTION BETWEEN USERS OF DIFFERENT ORGANISATIONS");
	console.log("--------------------------------------------------------------------");

	console.log('\x1b[36m%s\x1b[0m', '\nUser 1 from org2 receives tokens form university');
	// University 2 mints tokens and transfers them to user 1 from this university
	await mint(org2User, org2UserNumber, '100');
	await getClientAccountBalance(org2User, org2UserNumber);

	await transfer(org2User, org2UserNumber, '100', org2Student1, org2Student1Account);
	await getClientAccountBalance(org2User, org2UserNumber);
	await getClientAccountBalance(org2Student1, org2Student1Number);

	console.log('\x1b[36m%s\x1b[0m', '\nUsers from different universities interact with each other');

	// Student 3 from org1 transfers tokens to student 1 from org 2
	await transfer(org1Student3, org1Student3Number, '150', org2Student1, org2Student1Account);
	await getClientAccountBalance(org1Student3, org1Student3Number);
	await getClientAccountBalance(org2Student1, org2Student1Number);

	// Student from org2 tries to transfer more tokens than lending limit
	await transfer(org2Student1, org2Student1Number, '300', org1Student3, student3Account);
	await getClientAccountBalance(org2Student1, org2Student1Number);
	await getClientAccountBalance(org1Student3, org1Student3Number);

	await transfer(org2Student1, org2Student1Number, '50', org1Student3, student3Account);
	await getClientAccountBalance(org2Student1, org2Student1Number);
	await getClientAccountBalance(org1Student3, org1Student3Number);

	await GetBalanceHistory(org2Student1, org2Student1Number);

	await getTotalSupply();

	console.log("\n--------------------------------------------------------------------");
	console.log("INTERACTIONS OF USERS WITH THE ASSETS CHANNEL");
	console.log("--------------------------------------------------------------------");

	console.log('\x1b[36m%s\x1b[0m', '\nUsers spending tokens for rewards\n');

	// Execute an exchange transaction of 30 for one coffee
	await exchange(org1Student2, 1, "asset1", "coffee", "30");
	await getAllAssets(uibUser, uibUserNumber);

	// Execute an exchange transaction of 150 for one book
	await exchange(org1Student3, 1, "asset2", "book", "150");
	await getAllAssets(uibUser, uibUserNumber);

	// Execute an exchange transaction of 100 for one padel reservation
	await exchange(org1Student1, 1, "asset3", "padelReservation", "100");
	await getAllAssets(uibUser, uibUserNumber);

	// Test assetExists and readAssets functions
	await assetExists(uibUser, uibUserNumber, "asset1");
	await assetExists(uibUser, uibUserNumber, "asset2");
	await assetExists(uibUser, uibUserNumber, "asset56");
	await readAsset(uibUser, uibUserNumber, "asset1");


	//RESTRICTED OPERATIONS ZONE
	console.log("\n--------------------------------------------------------------------");
	console.log("RESTRICTED OPERATIONS");
	console.log("--------------------------------------------------------------------");
	// Now let's try some restricted operations

	// User without mint permissions tries to mint
	await mint(org1Student1, org1Student1Number, '3000');

	// User without burn permissions tries to burn
	await burn(org1Student1, org1Student1Number, '1000');

	// User tries to transfer more tokens than those in their account (transfer is to uib to avoid lending limit)
	await transfer(org1Student1, org1Student1Number, '5000', uibUser, uibUserAccount);

	// User with burn permissions tries to burn more tokens than those in their account
	await burn(uibUser, uibUserNumber, '20000');

	// Try to mint, burn, and transfer negative amounts of tokens
	await mint(uibUser, uibUserNumber, '-3000');
	await burn(uibUser, uibUserNumber, '-3000');
	await transfer(uibUser, uibUserNumber, '-100', org2User, org2UserAccount);
	console.log();

	// Try to execute token transaction to user from org 3 (not present in this channel)
	await mint(org3User, org3UserNumber, '-3000');
	console.log();

	// Try to execute function from collaborationchannel with org2 user (not present in this channel)
	await createAsset(org2User, org2UserNumber, "asset34", "restricted", "0", "not owned");
}

main();


//TOKEN FUNCTIONS

//Function that mints tokens for a given client
//amount is a string
async function mint(clientIdentity, orgNum, amount) {
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
			try {

			console.log('\n--> User ' + clientIdentity + ' is minting ' + amount + ' tokens');
			result = await contract.submitTransaction('Mint', amount);
			console.log(`*** Completed`);
				
			} catch (error) {
				
			}

			

		} finally {
			gateway.disconnect();
		}
	} catch (error) {
		console.error(`FAILED to mint: ${error}`);
	}
}

async function burn(clientIdentity, orgNum, amount) {
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
			gateway.disconnect();
		}
	} catch (error) {
		//console.error(`******** FAILED to run the application: ${error}`);
	}
}

async function transfer(clientIdentity, orgNum, amount, recipient, recipientAccount) {
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
			gateway.disconnect();
		}
	} catch (error) {
		//console.error(`******** FAILED to run the application: ${error}`);
	}
}

async function GetBalanceHistory(clientIdentity, orgNum) {
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

			console.log('\n--> Getting ' + clientIdentity + ' balance history');
			result = await contract.evaluateTransaction('GetBalanceHistory');
			console.log('*** ' + clientIdentity + ' transaction history: ' + result);

		} finally {
			gateway.disconnect();
		}
	} catch (error) {
		console.error(`${error}`);
	}
}

//ASSET TRANSFER FUNCTIONS

async function getAllAssets(clientIdentity, orgNum) {
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

			const network = await gateway.getNetwork(channelName2);
			const contract = network.getContract(chaincodeName2);

			let result;

			console.log('\n--> Getting all assets in the ledger');
			result = await contract.evaluateTransaction('GetAllAssets');
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);

		} finally {
			gateway.disconnect();
		}
	} catch (error) {
		//console.error(`******** FAILED to run the application: ${error}`);
	}
}

async function createAsset(clientIdentity, orgNum, assetID, assetType, assetValue, assetOwner) {
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

			const network = await gateway.getNetwork(channelName2);
			const contract = network.getContract(chaincodeName2);

			let result;

			console.log('\n--> Creating asset ' + assetID + ' of type ' + assetType + ', value ' + assetValue + ', and owner ' + assetOwner);
			result = await contract.submitTransaction('CreateAsset', assetID, assetType, assetValue, assetOwner);
			console.log('*** Result: committed');
			if (`${result}` !== '') {
				console.log(`*** Result: ${prettyJSONString(result.toString())}`);
			}

		} finally {
			gateway.disconnect();
		}
	} catch (error) {
		console.error(`FAILED creating asset: ${error}`);
	}
}

async function readAsset(clientIdentity, orgNum, assetId) {
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

			const network = await gateway.getNetwork(channelName2);
			const contract = network.getContract(chaincodeName2);

			let result;

			console.log('\n--> Reading information of asset: ' + assetId);
			result = await contract.evaluateTransaction('ReadAsset', assetId);
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);

		} finally {
			gateway.disconnect();
		}
	} catch (error) {
		//console.error(`******** FAILED to run the application: ${error}`);
	}
}

async function assetExists(clientIdentity, orgNum, assetId) {
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

			const network = await gateway.getNetwork(channelName2);
			const contract = network.getContract(chaincodeName2);

			let result;

			console.log('\n--> Checking if asset: ' + assetId + ' exists');
			result = await contract.evaluateTransaction('AssetExists', assetId);
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);

		} finally {
			gateway.disconnect();
		}
	} catch (error) {
		//console.error(`******** FAILED to run the application: ${error}`);
	}
}

async function exchange(clientIdentity, orgNum, assetId, assetType, tokenAmount) {
	console.log("User " + clientIdentity + " is exchanging " + tokenAmount + " tokens for " + assetType);
	await getClientAccountBalance(uibUser, uibUserNumber); // Get info to test correct functionality (unnecessary)
	await getClientAccountBalance(clientIdentity, orgNum); // Get info to test correct functionality (unnecessary)
	await transfer(clientIdentity, orgNum, tokenAmount, uibUser, uibUserAccount);
	await getClientAccountBalance(uibUser, uibUserNumber); // Get info to test correct functionality (unnecessary)
	await getClientAccountBalance(clientIdentity, orgNum); // Get info to test correct functionality (unnecessary)
	await createAsset(org3User, org3UserNumber, assetId, assetType, tokenAmount, clientIdentity);
	await readAsset(uibUser, uibUserNumber, assetId); // Get info to test correct functionality (unnecessary)
	await getClientAccountBalance(uibUser, uibUserNumber); // Get info to test correct functionality (unnecessary)
	await burn(uibUser, uibUserNumber, tokenAmount);
	await getClientAccountBalance(uibUser, uibUserNumber); // Get info to test correct functionality (unnecessary)
}

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

