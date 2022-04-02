# UIB-token
Hyperledger Fabric application to manage creation and transaction of tokens at the University of the Balearic Islands
## Simulation
You can run the default simulation for the project by executing the script `runapplication.sh`. To do so open a command terminal and navigate to the test network directory. 
```
cd UIB-token/test-network/
```
Now you can run the following command to start the simualtion:
```
./runapplication.sh
```
## Chaincode

## Considerations

### Modified IBM files
The following files have been modified and adapted from IBM Hyperledger Fabric repository files.

- `app.js` which contains the application code that creates users and executes transactions among other things.
- `token_contract.go` which contains the chaincode for the usage of tokens.

## License
This project is available under the MIT License, located in the [LICENSE](LICENSE.md) file.
