// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TicketSale {
    struct Ticket {
        string eventName;
        uint256 price; // preço em Wei
        uint256 quantityAvailable;
    }

    Ticket[] public tickets;

    event TicketPurchased(uint256 ticketId, address buyer, uint256 quantity);

    // Adiciona ingressos ao contrato
    function addTicket(string memory _eventName, uint256 _price) public {
        uint256 initialQuantity = 200;  // Inicializa com 200 ingressos

        // Verifica se o preço é maior que zero
        require(_price > 0, "Price should be greater than zero");

        // Adiciona um ingresso com quantidade inicial de 200
        tickets.push(Ticket(_eventName, _price, initialQuantity));
    }

    // Retorna todos os ingressos
    function getAllTickets() public view returns (Ticket[] memory) {
        return tickets;
    }

    // Função para comprar ingressos
    function purchaseTicket(uint256 _ticketId, uint256 _quantity) public payable {
        require(_ticketId < tickets.length, "Invalid ticket");
        Ticket storage ticket = tickets[_ticketId];
        require(ticket.quantityAvailable >= _quantity, "Not enough tickets available");
        require(msg.value >= ticket.price * _quantity, "Insufficient payment");

        // Subtrai a quantidade de ingressos comprados
        ticket.quantityAvailable -= _quantity;

        emit TicketPurchased(_ticketId, msg.sender, _quantity);
    }
}
