export const questions = [
    "Tell me about loss-versus-rebalancing (LVR)",
    "How do L2 sequencers work?",
    "Do an exhaustive breakdown of the MEV supply chain",
    "What is enshrined Proposer Builder Separation (ePBS)?",
    "What is SUAVE?",
    // "Give me the most exhaustive definition of loss-versus-rebalancing (LVR)",
    "What are intents?",
    // "What are the papers that deal with LVR?",
    "What are solutions to mitigate front-running and sandwich attacks?",
    // "Give me several sources about L2 sequencing",
    // "Give me several sources about SUAVE",
    "Tell me about transaction ordering on L2s",
    "What are Order Flow Auctions (OFAs)?",
    // "Can you tell me how the definition of MEV evolved over the years?",
    "What is MEV-Burn?",
    "What is account abstraction and ERC-4337?",
    "What is EIP-1559?",
    // "How will account abstraction affect the MEV supply chain?",  // NOTE 2024-01-28: since it can't find it resources it won't state about it, which is side-effect of prompt-tuning which state to not respond if it cant find info".
    // What is the difference between account abstraction and intents?",
    // Is it bad that MEV is a centralizing force?",
    // Tell me about MEV on Solana",
    // Explain to me the differences between Uniswap v2, v3 and v4",  # NOTE 2023-12-27: somehow refuses to answer this one despite the contex"t
    "Explain Uniswap V4 and the differences compared to V3",
    "What are commit/reveal schemes?",
    "What is the impact of latency in MEV?",
    "What is Protocol Enforced Proposer Commitments (PEPC)?",
    // "Are roll-ups real?",  // NOTE 2024-01-27: this doesnt really work anymore, it gets weird because it continues the text from the "rollups arent real" dba article
    "Are intents real?",
    // "What are relays?",
    // "How does MEV compare across chains for instance Ethereum, Solana, Arbitrum?",
    // "What are Payment For Order Flow (PFOF) in the context of MEV?",
    // "What is Anoma?",
    "What are shared sequencers?",
    "What is Trusted Execution Environment (TEE)?",
    "What is Multi Party Computation (MPC)?",
    // "How does Trusted Execution Environment (TEE) and Multi Party Computation (MPC) relate to MEV?", // 2023-12-30: does not do well on those
    // "What is Ethereum alignment?",  // note longer working as of 2024-02-25
    // "Return a selection of papers and videos that will introduce me to MEV",
    // "What is the role of the Ethereum Foundation?",
    // "How does Flashbots contribute to the MEV space?",
    "What is atomic composability?",
    // "What are the main advantages and challenges that decentralised finance face relative to traditional finance?",
    // "What is the number one thing which makes decentralised finance better than traditional finance and why?",
    // "What is referred to as good versus bad MEV? How would you explain that to a layman?",
    // "What are the consensus trade-offs that a protocol must make between MEV and decentralization?",
    // "What are the consensus trade-offs that a protocol must make to obtain a higher transaction throughput?",
    "What are credible commitments?",
    // "What is at the intersection of AI and crypto?",
    // "Would a spot ETH ETF be good for the crypto ecosystem? Would that be a centralising force?",
    "How can auction theory be used to design better MEV protocols?",
    // "What are all the subjects you are an expert in?",
    // "What is MEV-Share?",
    // "What is MEV-Boost?",
    "What is a builder in Ethereum?",
    "What is a searcher in Ethereum?",
    "What is a proposer in Ethereum?",
    // "What is an attester?",
    // "How do searchers, builders, relays and proposers interact with one another?",  // NOTE 2023-12-30: somehow not working anymore ..".
    // "How can the user initiating a transaction get shielded from MEV?",
    // "Give me lectures links about mechanism design",
    // "Give me videos links with Hasu",
    // "Give me videos links with Robert Miller",
    // "Give me videos links with Jon Charbonneau",
    // "Give me videos links with Barnabe Monnot",
    // "Give me content from Tarun Chitra",
    // "Give me videos links with Dan Robinson",
    // "What are the contributions of Jason Milionis to research?",
    // "What are the contributions of Ciamac Moallemi to LVR and MEV?",
    // "Give me videos about Trusted Execution Environment (TEE)",    // NOTE 2023-12-29: no longer works with reranking since we penalise youtube videos and we do not retrieve enough chunk"s
    // "Give me videos about Order Flow Auctions (OFAs)",    // NOTE 2023-12-29: no longer works with reranking since we penalise youtube videos and we do not retrieve enough chunk"s
    // "Give me videos about intents",   // NOTE 2023-12-29: no longer works with reranking since we penalise youtube videos and we do not retrieve enough chunk"s
    // "Give me videos discussing Uniswap v4",
    "What's an automated market maker (AMM)?",
    "What are the different types of AMMs?",
    "What are Uniswap v4 hooks? Illustrate with examples",
    "Explain the Ethereum mempool",
    "How could private mempools influence MEV?",
    // How does the design of a private mempool relate to traditional finance dark pools?",
    "How can I protect myself against MEV?",
    "Explain blockchain censorship",
    // "What are bribes in the block-building supply chain?",
    // "Tell me more about the block construction market",
    "What is censorship resistance?",
    // "What has social welfare to do in Ethereum?",  // NOTE 2024-01-17: deprecated
    "What are the links between game theory and the MEV supply chain?",
    "What is referred to as 'sequencing rules'?",
    // "What is referred to as the 'blockchain fee markets'?",
    "What is the importance of flash loans in MEV?",
    // "How to prevent sandwich attacks in Ethereum?",
    "What are private transactions on Ethereum?",
    // "What is EIP-4844?",
    // "How does MEV relate to oracles?",
    // "What is FLAIR?",
    // "How can rebate mechanisms help alleviate MEV?",
    //"What are denial-of-service attacks on Ethereum?",
    "What is multi-block MEV?",
    "What is cross-domain MEV?",
    // "What are integrated builders?",
    "How does ETH staking relate to MEV?",
    // "How does ETH staking relate to blockchain centralization?",
    // "How can I mathematically compute MEV?",
    "How do 'frontrunning' and 'backrunning' relate to MEV?",
    "What is toxic and non-toxic orderflow?",
    "Tell me about optimal liquidity provision",
    "What is Just in Time (JIT) liquidity?",
    // "How does market microstructure and MEV supply chain relate to one another?",
    // "What is referred to as a 'strategy-proof' mechanism?",
    // "What are the liquidity provision mathematics on Uniswap v3?",
    // "How can we design smart contracts to shield against MEV?",
    // "Tell me more about optimal on-chain auction designs",
    "How do zero-knowledge proofs impact MEV?",
    "How does threshold encryption impact MEV?",
    // "What is instant finality and how does it relate to MEV?",  // NOTE 2024-01-11: no longer works as of dat"e
    "What is Comet (formerly Tendermint)?",
    // "What is the Inter-Blockchain Communication (IBC) protocol?",
    // "What is Cosmos? How is Cosmos affected by MEV relative to Ethereum?",
    "How can large staking protocols like LIDO and Rocket Pool influence MEV?",
    "What are different Byzantine Fault Tolerance (BFT) protocols?",
    // "What are the consensus-level differences of Ethereum and Solana?",
    // "What are consensus-level trade-offs to make to tackle MEV?",
    // "Tell me about MEV in the Cosmos ecosystem",
    // "What is sharding?",
    // "What is Vitalik Buterin's stance on MEV?",
    // "What is danksharding?",
    // "What's Eigenlayer?",
    // "Explain what is Eigenlayer's restaking and how it secures other protocols in layman's terms",
    // "What are concrete applications of Eigenlayer's restaking system?",
    // "How does Eigenlayer's restaking system differ from LIDO's value proposition?", // NOTE 2024-01-28: doesn't know as side effect of prompt-tuning where it refuses to answer if it cant find it in sources".
    // "What are credible commitments and middlewares referred to in the context of Eigenlayer's restaking?",
    "How does consensus mechanism achieve sybil resistance?",
    // "What is deplatforming?",
    // "What the foundational design principles in building crypto technology?",
    "What is fair ordering?",
    // What is WASM?",
    "What are 'ZK circuits'?",
    // What is Celestia?",
    "What is a Modular blockchain?",
    "What are the definitions of the following layers: consensus, data availability, settlement, and execution?",
    "What is a Merkle tree?",
    // "Who is developing Gnosis chain and what is its value proposition relative to other chains?",
    // "What is Gnosis Safe?",
    // "What are governance attacks?",
    // "What happens when 'bidders are DAOs'?",
    // "What elements in auction theory can help me understand MEV?",
    "What is auction theory?",
    // "What is the equivalent of MEV in traditional finance?",
    // "What are other forms of MEV beyond transaction ordering?",
    // "How does DeFi lending liquidation relate to MEV?",
    // "Give me an exhaustive definition of the MEV supply chain in numbered bullet points",
    "What are batch auctions?",
    // "What is CowSwap?",
    // "What is 1Inch Fusion?",
    // "What are the innovations used by 1Inch Fusion and Cowswap?",
    // "What is Balancer?",
    // "How can MPC be used to improve blockchain infrastructure beyond wallets?",
    // "What is ERC-7265?",
    // "What are Verkle trees?",
    // "What are the trade-offs for DeFi protocols to build on an L2 versus their on own app-chain on Cosmos?"
    "What are execution tickets and block proposal right market?",
    "What are timing games in Ethereum?",
    "How do L2s, L3s and 'data availability layers' like Celestia relate to one another?",
    "What's an RPC? How does it relate to MEV?",
    // "Explain what are relays in Ethereum",
    "How does relays relate to Proposer/Builder Separation (PBS)?",
    "What is the difference between a validator, a proposer, and an attester?",
    "Give me the full composition of an Ethereum block and how it relates to the consensus, data availability, settlement, and execution layer",
    "Give me the full composition of an Ethereum proof-of-stake block with a schema",
    "What are inclusion lists?",
    // "Return in a markdown table the differences in implementation in ePBS",  // NOTE 2024-01-17: no longer works as of date :(
    "Return in a markdown table the differences between ETH proof of work and ETH proof of stake",
    // "Return in a markdown table the differences between Eigenlayer and LIDO",  // NOTE 2024-01-21: no longer works as of date :(
    "What will Proto-Danksharding (EIP-4844) enable?",
    "What is PEPC, what does it resolve with respect to ePBS? Is PEPC a solution to the current centralized relay market or is it independent?",
    "What are the following layers: Ethereum base, data availability, settlement, execution? How are they related to EVMs and 'almost-EVMs'?",
    "Why is data availability needed?",
    "What is Data Sampling Availability (DAS)?",
    "What are verkle trees?",
    "What is the ZK EVM and what does it solve?",
    "Return a markdown table which does an exhaustive comparison between Optimism and ZK-rollups",
    "What is a rollup?",
    "What will proto-danksharding (EIP-4844) enable from a business standpoint?",
    "What are the effects of MEV?",
    "What are consensus mechanisms in Ethereum?",
    "Return in markdown table the differences between a based- and a sovereign-rollup",
    "Give me a very exhaustive step by step bullet point list of how to spin off an Ethereum node",
    "what is the difference between 'incentive compatible' mechanism and 'strategyproof mechanism'?",
    "What do we refer to as Direct Acyclic Graph (DAG) protocols?",
    "How to decentralise zero-knowledge provers and what are the trade-offs?",
    "Tell me about the Espresso shared sequencer",
    "What are 'slot vs. block auctions' and what are the trade-offs of either auction type?",
    "Give me a thorough overview of cryptoeconomics",
    "What are forward inclusion lists and how do they help censorship resistance?",
    "What are base L2 chains?",
    "What are sovereign rollup chains?",
    "How do sovereign and base rollup differ?",
    // "Tell me everything you know about token engineering",
    "Detail to me the transaction supply chain from the point where the sequencer gives the pre-confirmation to the user to having the ZK prover's proof posted on ETH L1",
    "What are preconfirmations?",
    "Make a very exhaustive breakdown of the ZK prover proof creation",
    "How is the concept of rollup-as-a-service, for instance provided by Altlayer, different from the appchain e.g. built on Cosmos SDK?",
    "What is a 'validium'? What is Plasma?",
    "What is proof-of-work (PoW)?",
    "What is proof-of-stake (PoS)?",
    "What are other consensus mechanisms for blockchain besides proof-of-work and proof-of-stake?",
    "What is a consensus mechanism?",
    "What are blockchain systems?",
    "What are dApps?",
    "What is the Solidity programming language?",
    "What is the difference between an ERC and an EIP?",
    "What are the risks for Ethereum to enshrine more items to its protocol?",
]



