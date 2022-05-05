#!/bin/bash

CYAN='\033[0;36m'
NC='\033[0m' # No Color


printf "${CYAN}Bringing network up with channel mychannel and certification authority${NC}\n"
./network.sh up createChannel -ca

printf "${CYAN}Creating channel collaborationchannel${NC}\n"
./scripts/createChannel2.sh

printf "${CYAN}Deploying chaincode in channel mychannel${NC}\n"
./network.sh deployCC -ccn token_erc20 -ccp ../token-erc-20/chaincode-go/ -ccl go

printf "${CYAN}Deploying chaincode in channel collaborationchannel${NC}\n"
./scripts/deployCC2.sh collaborationchannel assetschain ../asset-transfer/chaincode-go/ go


printf "${CYAN}------------------------------------------------------------------------------------${NC}\n"
printf "${CYAN}Executing aplication${NC}\n"
printf "${CYAN}------------------------------------------------------------------------------------${NC}\n"
if [ "$1" = "esp" ] ; then
  printf "${CYAN}Application language: Spanish${NC}\n"
  node ../application/application-javascript/app-esp.js
else
  printf "${CYAN}Application language: English${NC}\n"
  node ../application/application-javascript/app.js
fi


printf "${CYAN}Bringing network down${NC}\n"
./network.sh down

printf "${CYAN}Deleting wallets${NC}\n"
rm -r ../application/application-javascript/wallet
rm -r ../application/application-javascript/wallet2
rm -r ../application/application-javascript/wallet3

printf "${CYAN}Simulation completed${NC}\n"
