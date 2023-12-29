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
    "What is MEV burn?",
    "What is account abstraction?",
    "What is account abstraction (ERC-4337)?",
    "What is EIP-1559?",
    "How will account abstraction affect the MEV supply chain?",
    // "What is the difference between account abstraction and intents?",
    // "Is it bad that MEV is a centralizing force?",
    // "Tell me about MEV on Solana",
    // "Explain to me the differences between Uniswap v2, v3 and v4",  # NOTE 2023-12-27: somehow refuses to answer this one despite the context
    "What is Uniswap V4 and what are the differences with V3?",
    "What are commit/reveal schemes?",
    "What is the impact of latency in MEV?",
    "What is Protocol Enforced Proposer Commitments (PEPC)?",
    "Are roll-ups real?",
    "Are intents real?",
    // "What are relays?",
    // "How does MEV compare across chains for instance Ethereum, Solana, Arbitrum?",
    // "What are Payment For Order Flow (PFOF) in the context of MEV?",
    // "What is Anoma?",
    "What are shared sequencers?",
    "What is Trusted Execution Environment (TEE)?",
    "What is Multi Party Computation (MPC)?",
    "How does Trusted Execution Environment (TEE) and Multi Party Computation (MPC) relate to MEV?",
    "What is Ethereum alignment?",
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
    "How can auction theory be used to design a better MEV auction?",
    "What are all the subjects that are needed to understand MEV?",
    // "What are all the subjects you are an expert in?",
    // "What is MEV-Share?",
    // "What is MEV-Boost?",
    "What is a builder?",
    "What is a searcher?",
    "What is a proposer?",
    // "What is an attester?",
    "How do searchers, builders, relays and proposers interact with one another?",
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
    
    // "Give me videos about Trusted Execution Environment (TEE)",    // NOTE 2023-12-29: no longer works with reranking since we penalise youtube videos and we do not retrieve enough chunks
    // "Give me videos about Order Flow Auctions (OFAs)",    // NOTE 2023-12-29: no longer works with reranking since we penalise youtube videos and we do not retrieve enough chunks
    // "Give me videos about intents",   // NOTE 2023-12-29: no longer works with reranking since we penalise youtube videos and we do not retrieve enough chunks
    // "Give me videos discussing Uniswap v4",

    "What's an automated market maker (AMM)?",
    "What are the different types of AMMs?",
    "What are Uniswap v4 hooks? Illustrate with examples",
    "What is the mempool?",
    "How could private mempools influence MEV?",
    // "How does the design of a private mempool relate to traditional finance dark pools?",
    "What protections can we use against MEV?",

    "What is blockchain censorship?",
    // "What are bribes in the block-building supply chain?",
    // "Tell me more about the block construction market",
    "What is censorship resistance?",
    "What has social welfare to do in Ethereum?",
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
    "What is non-toxic orderflow?",
    "Tell me about optimal liquidity provision",
    "What is Just in Time (JIT) liquidity?",
    // "How does market microstructure and MEV supply chain relate to one another?",
    // "What is referred to as a 'strategy-proof' mechanism?",
    // "What are the liquidity provision mathematics on Uniswap v3?",
    // "How can we design smart contracts to shield against MEV?",
    // "Tell me more about optimal on-chain auction designs",
    "How do zero-knowledge proofs impact MEV?",
    "How does threshold encryption impact MEV?",
    "What is instant finality and how does it relate to MEV?",
    "What is Tendermint?",
    // "What is the Inter-Blockchain Communication (IBC) protocol?",
    // "What is Cosmos? How is Cosmos affected by MEV relative to Ethereum?",
    "What is delegated proof-of-stake (DPoS)?",
    "How can large staking protocols like LIDO and Rocket Pool influence MEV?",
    "What are different Byzantine Fault Tolerance (BFT) protocols?",
    // "What are the consensus-level differences of Ethereum and Solana?",
    // "What are consensus-level trade-offs to make to tackle MEV?",
    // "Tell me about MEV in the Cosmos ecosystem",
    // "What is sharding?",
    // "What is Vitalik Buterin's stance on MEV?",
    // "What is danksharding?",
    "What's Eigenlayer?",
    "Explain what is Eigenlayer's restaking in layman's terms",
    // "What are concrete applications of Eigenlayer's restaking system?",
    "How does Eigenlayer's restaking system differ from LIDO's value proposition?",
    // "What are credible commitments and middlewares referred to in the context of Eigenlayer's restaking?",
    "What is Sybil resistance in consensus protocols?",
    // "What is deplatforming?",
    // "What the foundational design principles in building crypto technology?",
    "What is fair ordering?",
    // "What is WASM?",
    "What are 'ZK circuits'?",
    // "What is Celestia?",
    "What do we refer to as: consensus, data availability layer, and execution layer respectively?",
    "What are merkle trees?",
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
    "Give me an exhaustive understanding of execution tickets and block proposal right market",
    "Tell me everything you know about timing games in Ethereum",
    "How does L2s, L3s and 'data availability layers' like Celestia relate to one another?",
    "What's an RPC? How does it relate to MEV?",
  ]
  

  
