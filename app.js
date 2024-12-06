// Conectar ao Web3.js
if (window.ethereum) {
    var web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // Solicita acesso à conta do usuário
} else {
    alert('MetaMask não está instalado!');
}

// Endereço do contrato e ABI (a ABI é gerada após a compilação do contrato)
const contractAddress = "0xD1C780F1aec2EeA739356dc1B0e58e1Ea217C398"; // Endereço do contrato
const contractABI =  [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "ticketId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "quantity",
          "type": "uint256"
        }
      ],
      "name": "TicketPurchased",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "tickets",
      "outputs": [
        {
          "internalType": "string",
          "name": "eventName",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "quantityAvailable",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_eventName",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_price",
          "type": "uint256"
        }
      ],
      "name": "addTicket",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllTickets",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "eventName",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "quantityAvailable",
              "type": "uint256"
            }
          ],
          "internalType": "struct TicketSale.Ticket[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_ticketId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_quantity",
          "type": "uint256"
        }
      ],
      "name": "purchaseTicket",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function",
      "payable": true
    }
  ]

const ticketSaleContract = new web3.eth.Contract(contractABI, contractAddress);

async function loadTickets() {
    try {
        const tickets = await ticketSaleContract.methods.getAllTickets().call();
        console.log("Ingressos retornados:", tickets);

        const ticketsDiv = document.getElementById('tickets');
        ticketsDiv.innerHTML = ''; // Limpa a lista existente

        tickets.forEach((ticket, index) => {
            // Validações para evitar dados inválidos
            if (!ticket.price || isNaN(ticket.price)) {
                console.error(`Preço inválido para o ticket ${index}:`, ticket.price);
                return;
            }

            const ticketElement = document.createElement('div');
            ticketElement.innerHTML = `
                <h3>${ticket.eventName}</h3>
                <p>Preço: ${web3.utils.fromWei(ticket.price, 'ether')} ETH</p>
                <p>Quantidade disponível: ${ticket.quantityAvailable}</p>
                <input type="number" id="quantity-${index}" min="1" max="${ticket.quantityAvailable}" value="1" />
                <button onclick="buyTicket(${index})">Comprar ingressos</button>
            `;
            ticketsDiv.appendChild(ticketElement);
        });
    } catch (error) {
        console.error("Erro ao carregar ingressos:", error);
        alert("Erro ao carregar ingressos. Tente novamente mais tarde.");
    }
}

// Função para comprar ingresso
async function buyTicket(ticketId) {
    try {
        const accounts = await web3.eth.getAccounts();

        // Pegue os ingressos do contrato com base no ticketId
        const tickets = await ticketSaleContract.methods.getAllTickets().call();
        const selectedTicket = tickets[ticketId]; // Seleciona o ingresso com base no índice

        if (!selectedTicket || !selectedTicket.price) {
            throw new Error("Ticket inválido ou não encontrado.");
        }

        // Obtém a quantidade selecionada pelo usuário
        const quantityInput = document.getElementById(`quantity-${ticketId}`);
        const quantity = parseInt(quantityInput.value);

        if (isNaN(quantity) || quantity < 1) {
            alert("Quantidade inválida!");
            return;
        }

        const ticketPriceInWei = selectedTicket.price; // Obtém o preço em Wei
        const totalPriceInWei = BigInt(ticketPriceInWei) * BigInt(quantity); // Calcula o preço total para os ingressos

        // Enviar a transação para comprar os ingressos
        const tx = await ticketSaleContract.methods.purchaseTicket(ticketId, quantity).send({
            from: accounts[0],
            value: totalPriceInWei.toString(), // Passa o valor total em Wei
        });

        console.log("Compra bem-sucedida", tx);
        alert("Ingresso(s) comprado(s) com sucesso!");
        loadTickets(); // Atualiza a lista de ingressos após a compra
    } catch (error) {
        console.error("Erro ao comprar ingresso:", error);
        alert("Erro ao tentar comprar o ingresso. Por favor, tente novamente.");
    }
}
// Carregar os ingressos na inicialização
loadTickets();
