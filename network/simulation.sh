#!/bin/bash

CYAN='\033[0;36m'
NC='\033[0m' # No Color

#Bring network up
printf "${CYAN}Bringing it up${NC}\n"
./network.sh up createChannel -ca
printf "${CYAN}Up and running${NC}\n"

#Deploy chaincode
printf "${CYAN}Deploying chaincode${NC}\n"
./network.sh deployCC -ccn token_erc20 -ccp ../token-erc-20/chaincode-go/ -ccl go



printf "${CYAN}Registring identities${NC}\n"

#Add binaries and configuration files to path
export PATH=${PWD}/../bin:${PWD}:$PATH
export FABRIC_CFG_PATH=$PWD/../config/

#Register organization1 minter
export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/org1.example.com/
fabric-ca-client register --caname ca-org1 --id.name minter --id.secret minterpw --id.type client --tls.certfiles "${PWD}/organizations/fabric-ca/org1/tls-cert.pem"
fabric-ca-client enroll -u https://minter:minterpw@localhost:7054 --caname ca-org1 -M "${PWD}/organizations/peerOrganizations/org1.example.com/users/minter@org1.example.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/org1/tls-cert.pem"
cp "${PWD}/organizations/peerOrganizations/org1.example.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/org1.example.com/users/minter@org1.example.com/msp/config.yaml"

#Set environment variables to operate the peer CLI as the minter from Org1
printf "${CYAN}Minting tokens${NC}\n"
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/minter@org1.example.com/msp
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_ADDRESS=localhost:7051
export TARGET_TLS_OPTIONS=(-o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt")

peer chaincode invoke "${TARGET_TLS_OPTIONS[@]}" -C mychannel -n token_erc20 -c '{"function":"Mint","Args":["5000"]}'
printf "${CYAN}Getting token balance${NC}\n"


sleep 5
peer chaincode query -C mychannel -n token_erc20 -c '{"function":"ClientAccountBalance","Args":[]}'


printf "${CYAN}Transfering 100 tokens${NC}\n"
export RECIPIENT="eDUwOTo6Q049VXNlcjEsT1U9Y2xpZW50LE89SHlwZXJsZWRnZXIsU1Q9Tm9ydGggQ2Fyb2xpbmEsQz1VUzo6Q049Y2Eub3JnMS5leGFtcGxlLmNvbSxPPW9yZzEuZXhhbXBsZS5jb20sTD1EdXJoYW0sU1Q9Tm9ydGggQ2Fyb2xpbmEsQz1VUw=="
peer chaincode invoke "${TARGET_TLS_OPTIONS[@]}" -C mychannel -n token_erc20 -c '{"function":"Transfer","Args":[ "'"$RECIPIENT"'","100"]}'

sleep 5
printf "${CYAN}Getting token balance${NC}\n"
peer chaincode query -C mychannel -n token_erc20 -c '{"function":"ClientAccountBalance","Args":[]}'

printf "${CYAN}You have 30 seconds to initialize user1${NC}\n"
sleep 30
printf "${CYAN}Transfering 1500 tokens${NC}\n"
peer chaincode invoke "${TARGET_TLS_OPTIONS[@]}" -C mychannel -n token_erc20 -c '{"function":"Transfer","Args":[ "'"$RECIPIENT"'","1500"]}'

sleep 5
printf "${CYAN}Getting token balance${NC}\n"
peer chaincode query -C mychannel -n token_erc20 -c '{"function":"ClientAccountBalance","Args":[]}'

if [ "$1" = "clean" ] ; then
  printf "${CYAN}Bringing network down${NC}\n"
  ./network.sh down
fi


