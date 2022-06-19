/*
 * This is an IBM Corp file that has been modified by Marc Rossello
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../utils/CAUtil.js');
const { buildCCPOrg1, buildCCPOrg2, buildCCPOrg3, buildWallet } = require('../utils/AppUtil.js');

// Nombres de los chaincodes de tokens y activos
const channelName = 'mychannel';
const chaincodeName = 'token_erc20';

// Nombres de los canales de tokens y activos
const channelName2 = 'collaborationchannel';
const chaincodeName2 = 'assetschain';


// ORGANIZACIONES
// Variables Org1
var ccp;
var caClient;
var wallet;
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');

// Variables Org2
var ccp2;
var caClient2;
var wallet2;
const mspOrg2 = 'Org2MSP';
const walletPath2 = path.join(__dirname, 'wallet2');

// Variables Org3
var ccp3;
var caClient3;
var wallet3;
const mspOrg3 = 'Org3MSP';
const walletPath3 = path.join(__dirname, 'wallet3');


// USUARIOS
// Usuarios Org1
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

// Usuarios Org2
const org2User = 'universidad2';
const org2UserNumber = 2;
const org2UserAccount = "eDUwOTo6Q049dW5pdmVyc2lkYWQyLE9VPW9yZzIrT1U9Y2xpZW50K09VPWRlcGFydG1lbnQxOjpDTj1jYS5vcmcyLmV4YW1wbGUuY29tLE89b3JnMi5leGFtcGxlLmNvbSxMPUh1cnNsZXksU1Q9SGFtcHNoaXJlLEM9VUs=";

const org2Student1 = 'appUser1Org2';
const org2Student1Number = 2;
const org2Student1Account = "eDUwOTo6Q049YXBwVXNlcjFPcmcyLE9VPW9yZzIrT1U9Y2xpZW50K09VPWRlcGFydG1lbnQyOjpDTj1jYS5vcmcyLmV4YW1wbGUuY29tLE89b3JnMi5leGFtcGxlLmNvbSxMPUh1cnNsZXksU1Q9SGFtcHNoaXJlLEM9VUs=";

// Usuarios Org3
const org3User = 'orgColab';
const org3UserNumber = 3;


async function initOrg1() {
	try {
		console.log('\x1b[36m%s\x1b[0m', 'Inicializando org1');
		ccp = buildCCPOrg1();
		caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
		wallet = await buildWallet(Wallets, walletPath);

		await enrollAdmin(caClient, wallet, mspOrg1);

		await registerAndEnrollUser(caClient, wallet, mspOrg1, uibUser, 'org1.department1');

		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1Student1, 'org1.department2');
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1Student2, 'org1.department2');
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1Student3, 'org1.department2');

	} catch (error) {
		console.error(`******** Error de ejecución: ${error}`);
	}
}

async function initOrg2() {
	try {
		console.log('\x1b[36m%s\x1b[0m', 'Inicializando org2');
		ccp2 = buildCCPOrg2();
		caClient2 = buildCAClient(FabricCAServices, ccp2, 'ca.org2.example.com');
		wallet2 = await buildWallet(Wallets, walletPath2);

		await enrollAdmin(caClient2, wallet2, mspOrg2);
		await registerAndEnrollUser(caClient2, wallet2, mspOrg2, org2User, 'org2.department1');

		await registerAndEnrollUser(caClient2, wallet2, mspOrg2, org2Student1, 'org2.department2');

	} catch (error) {
		console.error(`******** Error de ejecución: ${error}`);
	}
}

async function initOrg3() {
	try {
		console.log('\x1b[36m%s\x1b[0m', 'Inicializando org3');
		ccp3 = buildCCPOrg3();
		caClient3 = buildCAClient(FabricCAServices, ccp3, 'ca.org3.example.com');
		wallet3 = await buildWallet(Wallets, walletPath3);

		await enrollAdmin(caClient3, wallet3, mspOrg3);
		await registerAndEnrollUser(caClient3, wallet3, mspOrg3, org3User, 'org3.department1');

	} catch (error) {
		console.error(`******** Error de ejecución: ${error}`);
	}
}

async function main() {

	await initOrg1();
	await initOrg2();
	await initOrg3();

	//ZONA DE INFORMACIÓN DE USUARIOS
	console.log("\n--------------------------------------------------------------------");
	console.log("INFO USUARIOS");
	console.log("--------------------------------------------------------------------");

	await getClientAccountID(uibUser, uibUserNumber);
	await getClientAccountID(org1Student1, org1Student1Number);
	await getClientAccountID(org1Student2, org1Student2Number);
	await getClientAccountID(org1Student3, org1Student3Number);

	await getClientAccountID(org2User, org2UserNumber);
	await getClientAccountID(org2Student1, org2Student1Number);

	//ZONA DE OPERACIONES INTRAUNIVERSITARIAS
	console.log("\n--------------------------------------------------------------------");
	console.log("SIMULACIÓN");
	console.log("--------------------------------------------------------------------");

	// La UIB crea tokens y los transfiere a los usuarios 1, 2 y 3
	// Esta sección simula que los usuarios 1, 2 y 3 han realizado una acción "buena" y son recompensados con tokens
	console.log('\x1b[36m%s\x1b[0m', '\nLos usuarios reciben tokens de la universidad');
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

	// Transacciones entre usuarios
	console.log('\x1b[36m%s\x1b[0m', '\nLos usuarios interaccionan entre ellos');
	// Los usuarios ejecutan acciones con los tokens que acaban de recibir
	// El estudiante 1 transfiere tokens al estudiante 2
	await transfer(org1Student1, org1Student1Number, '150', org1Student2, student2Account);
	await getClientAccountBalance(org1Student1, org1Student1Number);
	await getClientAccountBalance(org1Student2, org1Student2Number);

	// El estudiante 3 transfiere tokens al estudiante 2
	await transfer(org1Student3, org1Student3Number, '20', org1Student2, student2Account);
	await getClientAccountBalance(org1Student3, org1Student3Number);
	await getClientAccountBalance(org1Student2, org1Student2Number);

	// El estudiante 1 transfiere tokens al estudiante 2 otra vez
	// Con esta transacción el estudiante 2 excede el límite de recepción de tokens
	await transfer(org1Student3, org1Student3Number, '50', org1Student2, student2Account);
	await getClientAccountBalance(org1Student3, org1Student3Number);
	await getClientAccountBalance(org1Student2, org1Student2Number);

	// El estudiante 2 transfiere tokens al estudiante 3
	await transfer(org1Student2, org1Student2Number, '100', org1Student3, student3Account);
	await getClientAccountBalance(org1Student2, org1Student2Number);
	await getClientAccountBalance(org1Student3, org1Student3Number);

	// El estudiante 1 transfiere tokens al estudiante 2
	// Con esta transacción el estudiante 1 excede el límite de prestamo de tokens
	await transfer(org1Student1, org1Student1Number, '70', org1Student2, student2Account);
	await getClientAccountBalance(org1Student1, org1Student1Number);
	await getClientAccountBalance(org1Student2, org1Student2Number);

	// El estudiante 1 transfiere tokens al estudiante 2
	// El estudiante 1 prueba otra vez con una cantidad menor de tokens y no excede el límite
	await transfer(org1Student1, org1Student1Number, '30', org1Student2, student2Account);
	await getClientAccountBalance(org1Student1, org1Student1Number);
	await getClientAccountBalance(org1Student2, org1Student2Number);

	// El suministro total es igual a la cantidad total de tokens creados
	await getTotalSupply();


	// Obteniendo historiales de transacciones
	console.log('\x1b[36m%s\x1b[0m', '\nObteniendo historiales de balance');
	await GetBalanceHistory(uibUser, uibUserNumber);
	await GetBalanceHistory(org1Student1, org1Student1Number);
	await GetBalanceHistory(org1Student2, org1Student2Number);
	await GetBalanceHistory(org1Student3, org1Student3Number);

	console.log("\n--------------------------------------------------------------------");
	console.log("INTERACCIÓN ENTRE USUARIOS DE DIFERENTES ORGANIZACIONES");
	console.log("--------------------------------------------------------------------");

	console.log('\x1b[36m%s\x1b[0m', '\nEl usuario 1 de la org2 recibe tokens de la universidad');
	// La universidad 2 crea tokens y los transfiere al usuario 1 de esta universidad
	await mint(org2User, org2UserNumber, '100');
	await getClientAccountBalance(org2User, org2UserNumber);

	await transfer(org2User, org2UserNumber, '100', org2Student1, org2Student1Account);
	await getClientAccountBalance(org2User, org2UserNumber);
	await getClientAccountBalance(org2Student1, org2Student1Number);

	console.log('\x1b[36m%s\x1b[0m', '\nUsuarios de diferentes universidades interactúan entre ellos');

	// El estudiante 3 de la org1 transfiere tokens al estudiante 1 de la org2
	await transfer(org1Student3, org1Student3Number, '150', org2Student1, org2Student1Account);
	await getClientAccountBalance(org1Student3, org1Student3Number);
	await getClientAccountBalance(org2Student1, org2Student1Number);

	// El estudiante de la org2 intenta transferir más tokens que su límite de prestamo
	await transfer(org2Student1, org2Student1Number, '300', org1Student3, student3Account);
	await getClientAccountBalance(org2Student1, org2Student1Number);
	await getClientAccountBalance(org1Student3, org1Student3Number);

	await transfer(org2Student1, org2Student1Number, '50', org1Student3, student3Account);
	await getClientAccountBalance(org2Student1, org2Student1Number);
	await getClientAccountBalance(org1Student3, org1Student3Number);

	await GetBalanceHistory(org2Student1, org2Student1Number);

	await getTotalSupply();

	console.log("\n--------------------------------------------------------------------");
	console.log("INTERACCIONES DE USUARIOS CON EL CANAL DE ACTIVOS");
	console.log("--------------------------------------------------------------------");

	console.log('\x1b[36m%s\x1b[0m', '\nLos usuarios usan tokens para obtener recompensas\n');

	// Se ejecuta una transacción de intercambio de 30 tokens por un café
	await exchange(org1Student2, 1, "asset1", "café", "30");
	await getAllAssets(uibUser, uibUserNumber);

	// Se ejecuta una transacción de intercambio de 150 tokens por un libro
	await exchange(org1Student3, 1, "asset2", "libro", "150");
	await getAllAssets(uibUser, uibUserNumber);

	// Se ejecuta una transacción de intercambio de 100 tokens por una reserva de una pista de padel
	await exchange(org1Student1, 1, "asset3", "reserva de padel", "100");
	await getAllAssets(uibUser, uibUserNumber);

	// Prueba de las funcioens assetExists y readAssets
	await assetExists(uibUser, uibUserNumber, "asset1");
	await assetExists(uibUser, uibUserNumber, "asset2");
	await assetExists(uibUser, uibUserNumber, "asset56");
	await readAsset(uibUser, uibUserNumber, "asset1");


	//ZONA DE OPERACIONES RESTRINGIDAS
	console.log("\n--------------------------------------------------------------------");
	console.log("OPERACIONES RESTRINGIDAS");
	console.log("--------------------------------------------------------------------");
	// Ahora se intentan ejecutar operaciones restringidas

	// Usuario sin permisos de creación intenta crear tokens
	await mint(org1Student1, org1Student1Number, '3000');

	// Usuario sin permisos de destrucción intenta eliminar tokens
	await burn(org1Student1, org1Student1Number, '1000');

	// Usuario intenta transferir más tokens de los que hay ne su cuenta (la transacción es a la cuenta de la uib para no verse limitada por el límite de prestamo)
	await transfer(org1Student1, org1Student1Number, '5000', uibUser, uibUserAccount);

	// Usuario con permisos de destrucción intenta eliminar más tokens de los que hay en su cuenta
	await burn(uibUser, uibUserNumber, '20000');

	// Se intentan crear, destruir y transferir cantidades de tokens negativas
	await mint(uibUser, uibUserNumber, '-3000');
	await burn(uibUser, uibUserNumber, '-3000');
	await transfer(uibUser, uibUserNumber, '-100', org2User, org2UserAccount);
	console.log();

	// Un usuario de la organización 3 intenta ejecutar una operación con trokens (este usuario no pertenece al canal de tokens)
	await mint(org3User, org3UserNumber, '3000');
	console.log();

	// Se intenta ejecutar una función del canal collaborationchannel con un usuario de la org2 (este usuario no pertenece a este canal)
	await createAsset(org2User, org2UserNumber, "asset34", "restringido", "0", "sin propietario");


	//CASO PRÁCTICO
	console.log("\n--------------------------------------------------------------------");
	console.log("CASO PRÁCTICO");
	console.log("--------------------------------------------------------------------");

	console.log();
	console.log('\x1b[36m%s\x1b[0m', '\nEl estudiante 1 hace uso de las instalaciones deportivas y hace uso del lector RFID');
	console.log("");

	await mint(uibUser, uibUserNumber, '300');
	await getClientAccountBalance(uibUser, uibUserNumber);

	await getClientAccountBalance(org1Student1, org1Student1Number);

	await transfer(uibUser, uibUserNumber, '300', org1Student1, student1Account);
	await getClientAccountBalance(uibUser, uibUserNumber);
	await getClientAccountBalance(org1Student1, org1Student1Number);

	console.log('\x1b[36m%s\x1b[0m', '\nEl estudiante 1 selecciona el menú saludable y se le otorgan tokens');
	console.log("");

	await mint(uibUser, uibUserNumber, '300');
	await getClientAccountBalance(uibUser, uibUserNumber);

	await getClientAccountBalance(org1Student1, org1Student1Number);

	await transfer(uibUser, uibUserNumber, '300', org1Student1, student1Account);
	await getClientAccountBalance(uibUser, uibUserNumber);
	await getClientAccountBalance(org1Student1, org1Student1Number);

	console.log('\x1b[36m%s\x1b[0m', '\nEl estudiante 1 usa los tokens acumulados para canjear su recompensa');
	console.log("");

	// Se ejecuta una transacción de intercambio de 30 tokens por un café
	await exchange(org1Student1, 1, "activo1", "recompensa", "500");
	await readAsset(uibUser, uibUserNumber, "activo1");

}

main();


//FUNCIONES CON TOKENS

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

			console.log('\n--> El usuario ' + clientIdentity + ' está creando ' + amount + ' tokens');
			result = await contract.submitTransaction('Mint', amount);
			console.log(`*** Completado`);
				
			} catch (error) {
				
			}

			

		} finally {
			gateway.disconnect();
		}
	} catch (error) {
		console.error(`Error en la creación: ${error}`);
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

			console.log('\n--> El usuario ' + clientIdentity + ' está eliminando ' + amount + ' tokens');
			result = await contract.submitTransaction('Burn', amount);
			console.log(`*** Completado`);

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

			console.log('\n--> El usuario ' + clientIdentity + ' está transfiriendo ' + amount + ' tokens a ' + recipient);
			result = await contract.submitTransaction('Transfer', recipientAccount, amount);
			console.log('*** Se han transferido ' + amount + ' tokens a ' + recipient);

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

			console.log('\n--> Obteniendo el ID de cuenta del usuario ' + clientIdentity);
			result = await contract.evaluateTransaction('ClientAccountID');
			console.log('*** ID de cuenta del usuario ' + clientIdentity + ': ' + result);
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

			console.log('\n--> Obteniendo el balance de cuenta del usuario ' + clientIdentity);
			result = await contract.evaluateTransaction('ClientAccountBalance');
			console.log('*** Balance de cuenta del usuario ' + clientIdentity + ': ' + result);

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

			console.log('\n--> Obteniendo el suministro total de tokens');
			result = await contract.evaluateTransaction('TotalSupply');
			console.log(`*** Suministro total de tokens: ${result}`);

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

			console.log('\n--> Obteniendo el historial de balance del usuario ' + clientIdentity);
			result = await contract.evaluateTransaction('GetBalanceHistory');
			console.log('*** Historial de balance del usuario ' + clientIdentity + ': ' + result);

		} finally {
			gateway.disconnect();
		}
	} catch (error) {
		console.error(`${error}`);
	}
}

//FUNCIONES CON ACTIVOS

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

			console.log('\n--> Obteniendo todos los activos del ledger');
			result = await contract.evaluateTransaction('GetAllAssets');
			console.log(`*** Resultado: ${prettyJSONString(result.toString())}`);

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

			console.log('\n--> Creando activo ' + assetID + ' de tipo ' + assetType + ', con valor ' + assetValue + ', y propietario ' + assetOwner);
			result = await contract.submitTransaction('CreateAsset', assetID, assetType, assetValue, assetOwner);
			console.log('*** Resultado: creado');
			if (`${result}` !== '') {
				console.log(`*** Resultado: ${prettyJSONString(result.toString())}`);
			}

		} finally {
			gateway.disconnect();
		}
	} catch (error) {
		console.error(`Error en la creación del activo: ${error}`);
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

			console.log('\n--> Leyendo información del activo: ' + assetId);
			result = await contract.evaluateTransaction('ReadAsset', assetId);
			console.log(`*** Resultado: ${prettyJSONString(result.toString())}`);

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

			console.log('\n--> Consultando si el activo: ' + assetId + ' existe');
			result = await contract.evaluateTransaction('AssetExists', assetId);
			console.log(`*** Resultado: ${prettyJSONString(result.toString())}`);

		} finally {
			gateway.disconnect();
		}
	} catch (error) {
		//console.error(`******** FAILED to run the application: ${error}`);
	}
}

async function exchange(clientIdentity, orgNum, assetId, assetType, tokenAmount) {
	console.log("El usuario " + clientIdentity + " está intercambiando " + tokenAmount + " tokens por " + assetType);
	await getClientAccountBalance(uibUser, uibUserNumber); // Obtener información para comprobar el correcto funcionamiento (prescindible)
	await getClientAccountBalance(clientIdentity, orgNum); // Obtener información para comprobar el correcto funcionamiento (prescindible)
	await transfer(clientIdentity, orgNum, tokenAmount, uibUser, uibUserAccount);
	await getClientAccountBalance(uibUser, uibUserNumber); // Obtener información para comprobar el correcto funcionamiento (prescindible)
	await getClientAccountBalance(clientIdentity, orgNum); // Obtener información para comprobar el correcto funcionamiento (prescindible)
	await createAsset(org3User, org3UserNumber, assetId, assetType, tokenAmount, clientIdentity);
	await readAsset(uibUser, uibUserNumber, assetId); // Obtener información para comprobar el correcto funcionamiento (prescindible)
	await getClientAccountBalance(uibUser, uibUserNumber); // Obtener información para comprobar el correcto funcionamiento (prescindible)
	await burn(uibUser, uibUserNumber, tokenAmount);
	await getClientAccountBalance(uibUser, uibUserNumber); // Obtener información para comprobar el correcto funcionamiento (prescindible)
}

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

