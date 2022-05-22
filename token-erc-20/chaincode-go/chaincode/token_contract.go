package chaincode

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"

	b64 "encoding/base64"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// Se define la clave para acceder al suministro total
const totalSupplyKey = "totalSupply"

// Se define el sufijo para la clave de acceso al balance de préstamo
const lending = "lendingBalance"

// Se define el límite para el balance de préstamo de los estudiantes
const lendingLimit = 200

// SmartContract proporciona las funciones para transefir tokens entre cuentas
type SmartContract struct {
	contractapi.Contract
}

// El struct event proporciona una estrucura organizada para emitir eventos
type event struct {
	from  string // Cuenta de origen
	to    string // Cuenta de destino
	value int    // Cantidad a transferir
}

// Mint crea nuevos tokens y los añade a la cuenta del minter
func (s *SmartContract) Mint(ctx contractapi.TransactionContextInterface, amount int) error {

	// Comprobar la identidad del minter

	// Obtener el certificado del cliente
	ident, err := ctx.GetClientIdentity().GetX509Certificate()
	if err != nil {
		return fmt.Errorf("failed to get client id: %v", err)
	}

	// Comprobar que el minter pertenece al departamento adecuado
	var mintDepart interface{} = "department1"
	if ident.Subject.Names[2].Value != mintDepart {
		return fmt.Errorf("This user has no mint permissions")
	}

	// Obtener el ID del cliente
	minter, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return fmt.Errorf("failed to get client id: %v", err)
	}

	if amount <= 0 {
		return fmt.Errorf("mint amount must be a positive integer")
	}

	currentBalanceBytes, err := ctx.GetStub().GetState(minter)
	if err != nil {
		return fmt.Errorf("failed to read minter account %s from world state: %v", minter, err)
	}

	var currentBalance int

	// Si el balance del minter todavía no existe se crea un nuevo balance con valor 0
	if currentBalanceBytes == nil {
		currentBalance = 0
	} else {
		currentBalance, _ = strconv.Atoi(string(currentBalanceBytes))
	}

	updatedBalance := currentBalance + amount

	err = ctx.GetStub().PutState(minter, []byte(strconv.Itoa(updatedBalance)))
	if err != nil {
		return err
	}

	// Actualizar el suministro total
	totalSupplyBytes, err := ctx.GetStub().GetState(totalSupplyKey)
	if err != nil {
		return fmt.Errorf("failed to retrieve total token supply: %v", err)
	}

	var totalSupply int

	// Si no se han minado tokens todavía, inicializar totalSupply
	if totalSupplyBytes == nil {
		totalSupply = 0
	} else {
		totalSupply, _ = strconv.Atoi(string(totalSupplyBytes))
	}

	// Añadir la cantidad de tokens creada al suministro total y actualizar el estado
	totalSupply += amount
	err = ctx.GetStub().PutState(totalSupplyKey, []byte(strconv.Itoa(totalSupply)))
	if err != nil {
		return err
	}

	// Emitir un evento Transfer
	transferEvent := event{"0x0", minter, amount}
	transferEventJSON, err := json.Marshal(transferEvent)
	if err != nil {
		return fmt.Errorf("failed to obtain JSON encoding: %v", err)
	}
	err = ctx.GetStub().SetEvent("Transfer", transferEventJSON)
	if err != nil {
		return fmt.Errorf("failed to set event: %v", err)
	}

	log.Printf("minter account %s balance updated from %d to %d", minter, currentBalance, updatedBalance)

	return nil
}

// Burn elimina tokens de la cuenta del usuario
func (s *SmartContract) Burn(ctx contractapi.TransactionContextInterface, amount int) error {

	// Comprobar la identidad el burner
	clientMSPID, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return fmt.Errorf("failed to get MSPID: %v", err)
	}
	if clientMSPID != "Org1MSP" {
		return fmt.Errorf("client is not authorized to mint new tokens")
	}

	// Obtener el certificado del cliente
	ident, err := ctx.GetClientIdentity().GetX509Certificate()
	if err != nil {
		return fmt.Errorf("failed to get client id: %v", err)
	}
	if err != nil {
		log.Fatal(err)
	}

	// Comprobar que el burner pertenece al departamento correcto
	var mintDepart interface{} = "department1"
	if ident.Subject.Names[2].Value != mintDepart {
		return fmt.Errorf("This user has no burn permissions")
	}

	// Obtener el ID del cliente
	minter, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return fmt.Errorf("failed to get client id: %v", err)
	}

	if amount <= 0 {
		return errors.New("burn amount must be a positive integer")
	}

	currentBalanceBytes, err := ctx.GetStub().GetState(minter)
	if err != nil {
		return fmt.Errorf("failed to read minter account %s from world state: %v", minter, err)
	}

	var currentBalance int

	// Comprobar si la cuenta del cliente existe
	if currentBalanceBytes == nil {
		return errors.New("The balance does not exist")
	}

	currentBalance, _ = strconv.Atoi(string(currentBalanceBytes))
	updatedBalance := currentBalance - amount

	// Comprobar que la cantidad de tokens que se van a eliminar es menor que la cantidad de tokens existentes en la cuenta
	if updatedBalance < 0 {
		return errors.New("burn amount must be smaller than the account balance")
	}

	err = ctx.GetStub().PutState(minter, []byte(strconv.Itoa(updatedBalance)))
	if err != nil {
		return err
	}

	// Actualizar el suministro total
	totalSupplyBytes, err := ctx.GetStub().GetState(totalSupplyKey)
	if err != nil {
		return fmt.Errorf("failed to retrieve total token supply: %v", err)
	}

	// Si no se han creado tokens todavía se lanza un error
	if totalSupplyBytes == nil {
		return errors.New("totalSupply does not exist")
	}

	totalSupply, _ := strconv.Atoi(string(totalSupplyBytes))

	// Eliminar la cantidad de tokens eliminados del suministro total y actualizar el estado
	totalSupply -= amount
	err = ctx.GetStub().PutState(totalSupplyKey, []byte(strconv.Itoa(totalSupply)))
	if err != nil {
		return err
	}

	// Emitir un evento Transfer
	transferEvent := event{minter, "0x0", amount}
	transferEventJSON, err := json.Marshal(transferEvent)
	if err != nil {
		return fmt.Errorf("failed to obtain JSON encoding: %v", err)
	}
	err = ctx.GetStub().SetEvent("Transfer", transferEventJSON)
	if err != nil {
		return fmt.Errorf("failed to set event: %v", err)
	}

	log.Printf("minter account %s balance updated from %d to %d", minter, currentBalance, updatedBalance)

	return nil
}

// Transfer transfiere tokens de la cuenta del cliente a la cuenta del destinatario
func (s *SmartContract) Transfer(ctx contractapi.TransactionContextInterface, recipient string, amount int) error {

	// Obtener el ID del cliente
	clientID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return fmt.Errorf("failed to get client id: %v", err)
	}

	//-----------------------------------------------------------
	// Si el destinatario es un estudiante se comprueba el balance de préstamo
	//-----------------------------------------------------------

	// Obtener el tipo de usuario cliente
	cert, err := ctx.GetClientIdentity().GetX509Certificate()
	if err != nil {
		return fmt.Errorf("failed to get client id: %v", err)
	}

	userType := fmt.Sprintf("%v", cert.Subject.Names[2].Value)

	// Obtener el tipo de usuario del destinatario
	decoded, _ := b64.StdEncoding.DecodeString(recipient)
	decodedString := string(decoded)
	slicedString := strings.Split(decodedString, "::")
	strs := strings.Split(slicedString[1], "=")
	recipientType := strs[len(strs)-1]

	// Comprobar si los dos son estudiantes
	if userType == "department2" && recipientType == "department2" {
		// Preparar la clave del balance de préstamo del usuario actual
		var userLendingBalance string
		userLendingBalance = clientID + lending

		// Obtener el balance de préstamo del usuario actual del world state
		lendingBalanceBytes, err := ctx.GetStub().GetState(userLendingBalance)

		// Convertir lendigBalance a integer
		lendingBalance, _ := strconv.Atoi(string(lendingBalanceBytes))

		newLendingBalance := lendingBalance - amount

		if newLendingBalance < -lendingLimit {
			return fmt.Errorf("This user would exceed the maximum lending balance with this transaction\nCurrent lending balance: " + strconv.Itoa(lendingBalance) + "\nLimit lending balance: -" + strconv.Itoa(lendingLimit) + "\nLending balance after transaction: " + strconv.Itoa(newLendingBalance))
		}

		var recipientLendingBalance string
		recipientLendingBalance = recipient + lending

		lendingBalanceBytesRecipient, err := ctx.GetStub().GetState(recipientLendingBalance)
		if err != nil {
			return fmt.Errorf("failed to read from world state: %v", err)
		}

		lendingBalanceRecipient, _ := strconv.Atoi(string(lendingBalanceBytesRecipient))
		newLendingBalanceRecipient := lendingBalanceRecipient + amount

		if newLendingBalanceRecipient > lendingLimit {
			return fmt.Errorf("Recipient would exceed maximum lending balance with this transaction, \nRecipient's current lending balance: " + strconv.Itoa(lendingBalanceRecipient) + "\nLimit lending balance: " + strconv.Itoa(lendingLimit) + "\nLending balance after transaction: " + strconv.Itoa(newLendingBalanceRecipient))
		}

		// Actualizar el nuevo valor de balance de préstamo para el cliente
		err = ctx.GetStub().PutState(userLendingBalance, []byte(strconv.Itoa(newLendingBalance)))
		if err != nil {
			return err
		}

		// Actualizar el nuevo valor de balance de préstamo para el destinatario
		err = ctx.GetStub().PutState(recipientLendingBalance, []byte(strconv.Itoa(newLendingBalanceRecipient)))
		if err != nil {
			return err
		}
	}

	err = transferHelper(ctx, clientID, recipient, amount)
	if err != nil {
		return fmt.Errorf("failed to transfer: %v", err)
	}

	// Emitir un evento Transfer
	transferEvent := event{clientID, recipient, amount}
	transferEventJSON, err := json.Marshal(transferEvent)
	if err != nil {
		return fmt.Errorf("failed to obtain JSON encoding: %v", err)
	}
	err = ctx.GetStub().SetEvent("Transfer", transferEventJSON)
	if err != nil {
		return fmt.Errorf("failed to set event: %v", err)
	}

	return nil
}

// BalanceOf devuelve el balance de la cuenta dada
func (s *SmartContract) BalanceOf(ctx contractapi.TransactionContextInterface, account string) (int, error) {
	balanceBytes, err := ctx.GetStub().GetState(account)
	if err != nil {
		return 0, fmt.Errorf("failed to read from world state: %v", err)
	}
	if balanceBytes == nil {
		return 0, fmt.Errorf("the account %s does not exist", account)
	}

	balance, _ := strconv.Atoi(string(balanceBytes))

	return balance, nil
}

// ClientAccountBalance devuelve el balance de la cuenta del cliente que ejecuta la función
func (s *SmartContract) ClientAccountBalance(ctx contractapi.TransactionContextInterface) (int, error) {

	// Obtener el ID del cliente que ejecuta la función
	clientID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return 0, fmt.Errorf("failed to get client id: %v", err)
	}

	balanceBytes, err := ctx.GetStub().GetState(clientID)
	if err != nil {
		return 0, fmt.Errorf("failed to read from world state: %v", err)
	}
	if balanceBytes == nil {
		return 0, fmt.Errorf("the account %s does not exist", clientID)
	}

	balance, _ := strconv.Atoi(string(balanceBytes))

	return balance, nil
}

// ClientAccountID devuelve el id del cliente que ejecuta la función
// Los usuarios pueden usar esta función para obtener su propio id de cuenta que pueden proporcionar a otros usuarios como dirección de pago
func (s *SmartContract) ClientAccountID(ctx contractapi.TransactionContextInterface) (string, error) {

	// Obtener el ID del cliente que ejecuta la función
	clientAccountID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return "", fmt.Errorf("failed to get client id: %v", err)
	}

	return clientAccountID, nil
}

// TotalSupply devuelve el suministro total de tokens
func (s *SmartContract) TotalSupply(ctx contractapi.TransactionContextInterface) (int, error) {

	// Obtener el suministro total de tokens del estado del smart contract
	totalSupplyBytes, err := ctx.GetStub().GetState(totalSupplyKey)
	if err != nil {
		return 0, fmt.Errorf("failed to retrieve total token supply: %v", err)
	}

	var totalSupply int

	// Si no se han creado tokens todavía se devuelve 0
	if totalSupplyBytes == nil {
		totalSupply = 0
	} else {
		totalSupply, _ = strconv.Atoi(string(totalSupplyBytes))
	}

	log.Printf("TotalSupply: %d tokens", totalSupply)

	return totalSupply, nil
}

// GetBalanceHistory devuelve el historial de balances la cuenta que ejecuta la función
func (s *SmartContract) GetBalanceHistory(ctx contractapi.TransactionContextInterface) (string, error) {

	// Obtener el ID del cliente que ejecuta la función
	client, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return "", fmt.Errorf("failed to get client id: %v", err)
	}

	resultsIterator, err := ctx.GetStub().GetHistoryForKey(client)
	if err != nil {
		return "", fmt.Errorf("failed to retrieve transaction history: %v", err)
	}
	defer resultsIterator.Close()

	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return "", fmt.Errorf("failed to retrieve transaction history: %v", err)
		}
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"TxId\":")
		buffer.WriteString("\"")
		buffer.WriteString(response.TxId)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Value\":")
		if response.IsDelete {
			buffer.WriteString("null")
		} else {
			buffer.WriteString(string(response.Value))
		}

		buffer.WriteString(", \"Timestamp\":")
		buffer.WriteString("\"")
		buffer.WriteString(time.Unix(response.Timestamp.Seconds, int64(response.Timestamp.Nanos)).String())
		buffer.WriteString("\"")

		buffer.WriteString(", \"IsDelete\":")
		buffer.WriteString("\"")
		buffer.WriteString(strconv.FormatBool(response.IsDelete))
		buffer.WriteString("\"")

		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	return buffer.String(), nil
}

// Funciones de apoyo

// transferHelper es una función de apoyo que transfiere toknes de la dirección "from" a la dirección "to"
func transferHelper(ctx contractapi.TransactionContextInterface, from string, to string, value int) error {

	if value < 0 { // transferencias de 0 estan permitidas en ERC-20 de modo que sólo se comprueba si la cantidad es positiva
		return fmt.Errorf("transfer amount cannot be negative")
	}

	fromCurrentBalanceBytes, err := ctx.GetStub().GetState(from)
	if err != nil {
		return fmt.Errorf("failed to read client account %s from world state: %v", from, err)
	}

	if fromCurrentBalanceBytes == nil {
		return fmt.Errorf("client account %s has no balance", from)
	}

	fromCurrentBalance, _ := strconv.Atoi(string(fromCurrentBalanceBytes))

	if fromCurrentBalance < value {
		return fmt.Errorf("client account %s has insufficient funds", from)
	}

	toCurrentBalanceBytes, err := ctx.GetStub().GetState(to)
	if err != nil {
		return fmt.Errorf("failed to read recipient account %s from world state: %v", to, err)
	}

	var toCurrentBalance int
	// Si el balance del destinatario todavía no existe se crea con un valor de 0
	if toCurrentBalanceBytes == nil {
		toCurrentBalance = 0
	} else {
		toCurrentBalance, _ = strconv.Atoi(string(toCurrentBalanceBytes))
	}

	fromUpdatedBalance := fromCurrentBalance - value
	toUpdatedBalance := toCurrentBalance + value

	err = ctx.GetStub().PutState(from, []byte(strconv.Itoa(fromUpdatedBalance)))
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(to, []byte(strconv.Itoa(toUpdatedBalance)))
	if err != nil {
		return err
	}

	log.Printf("client %s balance updated from %d to %d", from, fromCurrentBalance, fromUpdatedBalance)
	log.Printf("recipient %s balance updated from %d to %d", to, toCurrentBalance, toUpdatedBalance)

	return nil
}
