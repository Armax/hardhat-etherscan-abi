import { NomicLabsHardhatPluginError } from "hardhat/plugins";
import { EthereumProvider } from "hardhat/types";

const pluginName = "hardhat-etherscan-abi";

export interface EtherscanURLs {
  apiURL: string;
  browserURL: string;
}

type NetworkMap = {
  [networkID in NetworkID]: EtherscanURLs;
};

// See https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md#list-of-chain-ids
enum NetworkID {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 42,
  // Binance Smart Chain
  BSC = 56,
  BSC_TESTNET = 97,
  // Polygon
  POLYGON = 137,
  MUMBAI = 80001,
  // Arbitrum
  ARBITRUM = 42161,
  // Fantom Opera
  FANTOM = 250,
  // Snowtrace
  AVALANCHE = 43114,
  FUJI = 43113,
  // Optimism
  OPTIMISM = 10
}

const networkIDtoEndpoints: NetworkMap = {
  [NetworkID.MAINNET]: {
    apiURL: "https://api.etherscan.io/api",
    browserURL: "https://etherscan.io/",
  },
  [NetworkID.ROPSTEN]: {
    apiURL: "https://api-ropsten.etherscan.io/api",
    browserURL: "https://ropsten.etherscan.io",
  },
  [NetworkID.RINKEBY]: {
    apiURL: "https://api-rinkeby.etherscan.io/api",
    browserURL: "https://rinkeby.etherscan.io",
  },
  [NetworkID.GOERLI]: {
    apiURL: "https://api-goerli.etherscan.io/api",
    browserURL: "https://goerli.etherscan.io",
  },
  [NetworkID.KOVAN]: {
    apiURL: "https://api-kovan.etherscan.io/api",
    browserURL: "https://kovan.etherscan.io",
  },
  [NetworkID.BSC]: {
    apiURL: "https://api.bscscan.com/api",
    browserURL: "https://bscscan.com",
  },
  [NetworkID.BSC_TESTNET]: {
    apiURL: "https://api-testnet.bscscan.com/api",
    browserURL: "https://testnet.bscscan.com",
  },
  [NetworkID.POLYGON]: {
    apiURL: "https://api.polygonscan.com/api",
    browserURL: "https://polygonscan.com"
  },
  [NetworkID.MUMBAI]: {
    apiURL: "https://api-testnet.polygonscan.com/api",
    browserURL: "https://mumbai.polygonscan.com"
  },
  [NetworkID.ARBITRUM]: {
    apiURL: "https://api.arbiscan.io/api",
    browserURL: "https://arbiscan.io",
  },
  [NetworkID.FANTOM]: {
    apiURL: "https://api.ftmscan.com/api",
    browserURL: "https://ftmscan.com/",
  },
  [NetworkID.AVALANCHE]: {
    apiURL: "https://api.snowtrace.io/api",
    browserURL: "https://snowtrace.io/",
  },
  [NetworkID.FUJI]: {
    apiURL: "https://api-testnet.snowtrace.io/api",
    browserURL: "https://testnet.snowtrace.io/",
  },
  [NetworkID.OPTIMISM]: {
    apiURL: "https://api-optimistic.etherscan.io/api",
    browserURL: "https://optimistic.etherscan.io",
  }
};

export async function getEtherscanEndpoints(
  provider: EthereumProvider,
  networkName: string
): Promise<EtherscanURLs> {
  // Disable this check because ABI download can be useful in fork mode
  // if (networkName === HARDHAT_NETWORK_NAME) {
  //   throw new NomicLabsHardhatPluginError(
  //     pluginName,
  //     `The selected network is ${networkName}. Please select a network supported by Etherscan.`
  //   );
  // }

  const chainID = parseInt(await provider.send("eth_chainId"), 16) as NetworkID;

  const endpoints = networkIDtoEndpoints[chainID];

  if (endpoints === undefined) {
    throw new NomicLabsHardhatPluginError(
      pluginName,
      `An etherscan endpoint could not be found for this network. ChainID: ${chainID}. The selected network is ${networkName}.

Possible causes are:
  - The selected network (${networkName}) is wrong.
  - Faulty hardhat network config.

 If you use Mainnet fork mode try setting 'chainId: 1' in hardhat config`
    );
  }

  return endpoints;
}
