#!/bin/bash

CYAN='\033[0;36m'
NC='\033[0m' # No Color


printf "${CYAN}Bringing network up with channel mychannel and certification authority${NC}\n"
./network.sh up createChannel -ca

printf "${CYAN}Creating channel uibcollaborationchannel${NC}\n"
./network.sh createChannel -c uibcollaborationchannel

printf "${CYAN}Deploying chaincode in channel mychannel${NC}\n"
./network.sh deployCC -ccn token_erc20 -ccp ../token-erc-20/chaincode-go/ -ccl go

printf "${CYAN}Deploying chaincode in channel uibcollaborationchannel${NC}\n"
./network.sh deployCC -ccn token_erc20col -ccp ../token-erc-20/chaincode-go/ -ccl go -c uibcollaborationchannel

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
