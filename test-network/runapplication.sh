#!/bin/bash

CYAN='\033[0;36m'
NC='\033[0m' # No Color


printf "${CYAN}Bringing network up with channel mychannel and certification authority${NC}\n"
./network.sh up createChannel -ca

printf "${CYAN}Creating channel collaborationchannel${NC}\n"
#./network.sh createChannel -c collaborationchannel
./scripts/createChannel2.sh

printf "${CYAN}Deploying chaincode in channel mychannel${NC}\n"
./network.sh deployCC -ccn token_erc20 -ccp ../token-erc-20/chaincode-go/ -ccl go

printf "${CYAN}Deploying chaincode in channel collaborationchannel${NC}\n"
#./network.sh deployCC -ccn token_erc20col -ccp ../token-erc-20/chaincode-go/ -ccl go -c collaborationchannel
#./scripts/deployCC.sh $CHANNEL_NAME $CC_NAME $CC_SRC_PATH $CC_SRC_LANGUAGE $CC_VERSION $CC_SEQUENCE $CC_INIT_FCN $CC_END_POLICY $CC_COLL_CONFIG $CLI_DELAY $MAX_RETRY $VERBOSE

#Continuar aquí
#./scripts/deployCC2.sh collaborationchannel token_erc20col ../token-erc-20/chaincode-go/ go


printf "${CYAN}------------------------------------------------------------------------------------${NC}\n"
printf "${CYAN}Executing aplication${NC}\n"
printf "${CYAN}------------------------------------------------------------------------------------${NC}\n"
node ../token-erc-20/application-javascript/app.js
node ../token-erc-20/application-javascript/app2.js
node ../token-erc-20/application-javascript/app3.js

printf "${CYAN}Bringing network down${NC}\n"
./network.sh down

printf "${CYAN}Deleting wallet file${NC}\n"
rm -r ../token-erc-20/application-javascript/wallet
rm -r ../token-erc-20/application-javascript/wallet2

printf "${CYAN}Simulation completed${NC}\n"
