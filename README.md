# UIB-token
Hyperledger Fabric application to manage creation and transaction of tokens at the University of the Balearic Islands.
## Simulation
### Getting started
Fabric binaries and configuration files can be downloaded by executing:
```
curl -sSL https://bit.ly/2ysbOFE | bash -s -- <fabric_version> <fabric-ca_version>
```
For this project Hyperledger Fabric 2.2.5 and Fabric CA 1.5.2 have been used. Therefore, the command should be:
```
curl -sSL https://bit.ly/2ysbOFE | bash -s -- 2.2.5 1.5.2
```
Note that this command will download Fabric binaries, docker images, and samples. To download just the binaries you should use:
```
curl -sSL https://bit.ly/2ysbOFE | bash -s -- 2.2.5 1.5.2 -s -d
```
For more information on other patterns execute:
```
curl -sSL https://bit.ly/2ysbOFE | bash -s -- -h
```
More information on how to install Hyperledger Fabric can be found at [Fabric Documentation](https://hyperledger-fabric.readthedocs.io/en/release-2.2/install.html).

### Run simulation
You can run the default simulation for the project by executing the script `runapplication.sh`. To do so, open a command terminal and navigate to the test network directory. 
```
cd UIB-token/test-network/
```
Now you can run the following command to start the simualtion:
```
./runapplication.sh
```
## Chaincodes
There are two chaincodes that operate in different channels. The `token_contract.go` is the chaincode where the operations with tokens are defined and the `smarcontract.go` is the chaincode where the operations with assets are defined.

## Application
The application runs a sequence of operations to test the network and the operations in both chaincodes. There are two versions of the application, one in English and another one in Spanish. The Enghish applications is run by default when using the `runapplication.sh` script. To execute the Spanish version you should add `esp` as a parameter.
```
./runapplication.sh esp
```

## License
This project is available under the MIT License, located in the [LICENSE](LICENSE.md) file. Any files that come from the Hyperledger Fabric repository and have not been modified are available under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0) as established on the [fabric](https://github.com/hyperledger/fabric) and [fabric-samples](https://github.com/hyperledger/fabric-samples) repositories.
