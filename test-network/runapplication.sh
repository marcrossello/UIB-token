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

./scripts/deployCC2.sh collaborationchannel assetschain ../asset-transfer/chaincode-go/ go


printf "${CYAN}------------------------------------------------------------------------------------${NC}\n"
printf "${CYAN}Executing aplication${NC}\n"
printf "${CYAN}------------------------------------------------------------------------------------${NC}\n"
node ../application/application-javascript/app.js

printf "${CYAN}Bringing network down${NC}\n"
./network.sh down

printf "${CYAN}Deleting wallets${NC}\n"
rm -r ../application/application-javascript/wallet
rm -r ../application/application-javascript/wallet2
rm -r ../application/application-javascript/wallet3

printf "${CYAN}Simulation completed${NC}\n"
