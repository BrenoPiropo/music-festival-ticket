const TicketSale = artifacts.require("TicketSale");

module.exports = async function(deployer) {
  // Implanta o contrato TicketSale
  await deployer.deploy(TicketSale);

  // Adiciona ingressos depois da implantação
  const ticketSaleInstance = await TicketSale.deployed();
  await ticketSaleInstance.addTicket("Evento 1", web3.utils.toWei("0.1", "ether"));
};
