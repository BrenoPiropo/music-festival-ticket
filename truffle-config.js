module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Endereço correto
      port: 7545,            // Porta correta
      network_id: 1337,      // ID da rede do Ganache
    },
  },
  compilers: {
    solc: {
      version: "0.8.0",      // Versão do compilador Solidity
    },
  },
};
