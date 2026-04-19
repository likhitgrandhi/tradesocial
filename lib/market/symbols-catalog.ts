export type CatalogEntry = {
  symbol: string
  name: string
  exchange: string
  type: "stock" | "crypto" | "forex" | "fund" | "index"
}

// Curated list of ~250 most-searched tickers across asset classes.
// Users can type any symbol outside this list and submit directly — the chart
// widget will resolve the exchange. This catalog just powers the autocomplete.
export const SYMBOL_CATALOG: CatalogEntry[] = [
  // ── US Tech ────────────────────────────────────────────────────────────
  { symbol: "AAPL", name: "Apple Inc", exchange: "NASDAQ", type: "stock" },
  { symbol: "MSFT", name: "Microsoft Corp", exchange: "NASDAQ", type: "stock" },
  { symbol: "GOOGL", name: "Alphabet Inc (Class A)", exchange: "NASDAQ", type: "stock" },
  { symbol: "GOOG", name: "Alphabet Inc (Class C)", exchange: "NASDAQ", type: "stock" },
  { symbol: "AMZN", name: "Amazon.com Inc", exchange: "NASDAQ", type: "stock" },
  { symbol: "META", name: "Meta Platforms Inc", exchange: "NASDAQ", type: "stock" },
  { symbol: "NVDA", name: "NVIDIA Corp", exchange: "NASDAQ", type: "stock" },
  { symbol: "TSLA", name: "Tesla Inc", exchange: "NASDAQ", type: "stock" },
  { symbol: "NFLX", name: "Netflix Inc", exchange: "NASDAQ", type: "stock" },
  { symbol: "AMD", name: "Advanced Micro Devices", exchange: "NASDAQ", type: "stock" },
  { symbol: "INTC", name: "Intel Corp", exchange: "NASDAQ", type: "stock" },
  { symbol: "AVGO", name: "Broadcom Inc", exchange: "NASDAQ", type: "stock" },
  { symbol: "CRM", name: "Salesforce Inc", exchange: "NYSE", type: "stock" },
  { symbol: "ORCL", name: "Oracle Corp", exchange: "NYSE", type: "stock" },
  { symbol: "ADBE", name: "Adobe Inc", exchange: "NASDAQ", type: "stock" },
  { symbol: "CSCO", name: "Cisco Systems", exchange: "NASDAQ", type: "stock" },
  { symbol: "IBM", name: "IBM", exchange: "NYSE", type: "stock" },
  { symbol: "QCOM", name: "Qualcomm Inc", exchange: "NASDAQ", type: "stock" },
  { symbol: "TXN", name: "Texas Instruments", exchange: "NASDAQ", type: "stock" },
  { symbol: "MU", name: "Micron Technology", exchange: "NASDAQ", type: "stock" },
  { symbol: "PYPL", name: "PayPal Holdings", exchange: "NASDAQ", type: "stock" },
  { symbol: "SHOP", name: "Shopify Inc", exchange: "NYSE", type: "stock" },
  { symbol: "SQ", name: "Block Inc", exchange: "NYSE", type: "stock" },
  { symbol: "UBER", name: "Uber Technologies", exchange: "NYSE", type: "stock" },
  { symbol: "LYFT", name: "Lyft Inc", exchange: "NASDAQ", type: "stock" },
  { symbol: "ABNB", name: "Airbnb Inc", exchange: "NASDAQ", type: "stock" },
  { symbol: "SPOT", name: "Spotify Technology", exchange: "NYSE", type: "stock" },
  { symbol: "SNOW", name: "Snowflake Inc", exchange: "NYSE", type: "stock" },
  { symbol: "PLTR", name: "Palantir Technologies", exchange: "NYSE", type: "stock" },
  { symbol: "COIN", name: "Coinbase Global", exchange: "NASDAQ", type: "stock" },
  { symbol: "HOOD", name: "Robinhood Markets", exchange: "NASDAQ", type: "stock" },
  { symbol: "SOFI", name: "SoFi Technologies", exchange: "NASDAQ", type: "stock" },
  { symbol: "RBLX", name: "Roblox Corp", exchange: "NYSE", type: "stock" },
  { symbol: "U", name: "Unity Software", exchange: "NYSE", type: "stock" },
  { symbol: "NET", name: "Cloudflare Inc", exchange: "NYSE", type: "stock" },
  { symbol: "DDOG", name: "Datadog Inc", exchange: "NASDAQ", type: "stock" },
  { symbol: "CRWD", name: "CrowdStrike Holdings", exchange: "NASDAQ", type: "stock" },
  { symbol: "ZS", name: "Zscaler Inc", exchange: "NASDAQ", type: "stock" },
  { symbol: "OKTA", name: "Okta Inc", exchange: "NASDAQ", type: "stock" },
  { symbol: "TEAM", name: "Atlassian Corp", exchange: "NASDAQ", type: "stock" },
  { symbol: "NOW", name: "ServiceNow Inc", exchange: "NYSE", type: "stock" },
  { symbol: "INTU", name: "Intuit Inc", exchange: "NASDAQ", type: "stock" },
  { symbol: "WDAY", name: "Workday Inc", exchange: "NASDAQ", type: "stock" },
  { symbol: "DOCU", name: "DocuSign Inc", exchange: "NASDAQ", type: "stock" },
  { symbol: "TWLO", name: "Twilio Inc", exchange: "NYSE", type: "stock" },
  { symbol: "ZM", name: "Zoom Video Communications", exchange: "NASDAQ", type: "stock" },
  { symbol: "PINS", name: "Pinterest Inc", exchange: "NYSE", type: "stock" },
  { symbol: "SNAP", name: "Snap Inc", exchange: "NYSE", type: "stock" },

  // ── Financials / Blue Chips ───────────────────────────────────────────
  { symbol: "BRK.B", name: "Berkshire Hathaway (Class B)", exchange: "NYSE", type: "stock" },
  { symbol: "JPM", name: "JPMorgan Chase", exchange: "NYSE", type: "stock" },
  { symbol: "V", name: "Visa Inc", exchange: "NYSE", type: "stock" },
  { symbol: "MA", name: "Mastercard Inc", exchange: "NYSE", type: "stock" },
  { symbol: "BAC", name: "Bank of America", exchange: "NYSE", type: "stock" },
  { symbol: "WFC", name: "Wells Fargo", exchange: "NYSE", type: "stock" },
  { symbol: "GS", name: "Goldman Sachs", exchange: "NYSE", type: "stock" },
  { symbol: "MS", name: "Morgan Stanley", exchange: "NYSE", type: "stock" },
  { symbol: "C", name: "Citigroup Inc", exchange: "NYSE", type: "stock" },
  { symbol: "AXP", name: "American Express", exchange: "NYSE", type: "stock" },
  { symbol: "BLK", name: "BlackRock Inc", exchange: "NYSE", type: "stock" },
  { symbol: "SCHW", name: "Charles Schwab", exchange: "NYSE", type: "stock" },
  { symbol: "USB", name: "U.S. Bancorp", exchange: "NYSE", type: "stock" },
  { symbol: "PNC", name: "PNC Financial Services", exchange: "NYSE", type: "stock" },

  // ── Healthcare / Pharma ───────────────────────────────────────────────
  { symbol: "JNJ", name: "Johnson & Johnson", exchange: "NYSE", type: "stock" },
  { symbol: "PFE", name: "Pfizer Inc", exchange: "NYSE", type: "stock" },
  { symbol: "MRK", name: "Merck & Co", exchange: "NYSE", type: "stock" },
  { symbol: "MRNA", name: "Moderna Inc", exchange: "NASDAQ", type: "stock" },
  { symbol: "BNTX", name: "BioNTech SE", exchange: "NASDAQ", type: "stock" },
  { symbol: "LLY", name: "Eli Lilly and Co", exchange: "NYSE", type: "stock" },
  { symbol: "ABBV", name: "AbbVie Inc", exchange: "NYSE", type: "stock" },
  { symbol: "BMY", name: "Bristol-Myers Squibb", exchange: "NYSE", type: "stock" },
  { symbol: "GILD", name: "Gilead Sciences", exchange: "NASDAQ", type: "stock" },
  { symbol: "UNH", name: "UnitedHealth Group", exchange: "NYSE", type: "stock" },
  { symbol: "CVS", name: "CVS Health Corp", exchange: "NYSE", type: "stock" },
  { symbol: "AMGN", name: "Amgen Inc", exchange: "NASDAQ", type: "stock" },

  // ── Consumer / Retail ─────────────────────────────────────────────────
  { symbol: "WMT", name: "Walmart Inc", exchange: "NYSE", type: "stock" },
  { symbol: "COST", name: "Costco Wholesale", exchange: "NASDAQ", type: "stock" },
  { symbol: "TGT", name: "Target Corp", exchange: "NYSE", type: "stock" },
  { symbol: "HD", name: "Home Depot", exchange: "NYSE", type: "stock" },
  { symbol: "LOW", name: "Lowe's Companies", exchange: "NYSE", type: "stock" },
  { symbol: "KO", name: "Coca-Cola Co", exchange: "NYSE", type: "stock" },
  { symbol: "PEP", name: "PepsiCo Inc", exchange: "NASDAQ", type: "stock" },
  { symbol: "PG", name: "Procter & Gamble", exchange: "NYSE", type: "stock" },
  { symbol: "MCD", name: "McDonald's Corp", exchange: "NYSE", type: "stock" },
  { symbol: "SBUX", name: "Starbucks Corp", exchange: "NASDAQ", type: "stock" },
  { symbol: "NKE", name: "Nike Inc", exchange: "NYSE", type: "stock" },
  { symbol: "DIS", name: "Walt Disney Co", exchange: "NYSE", type: "stock" },
  { symbol: "EBAY", name: "eBay Inc", exchange: "NASDAQ", type: "stock" },
  { symbol: "ETSY", name: "Etsy Inc", exchange: "NASDAQ", type: "stock" },
  { symbol: "CMG", name: "Chipotle Mexican Grill", exchange: "NYSE", type: "stock" },
  { symbol: "YUM", name: "Yum! Brands", exchange: "NYSE", type: "stock" },

  // ── Industrial / Energy ───────────────────────────────────────────────
  { symbol: "XOM", name: "Exxon Mobil", exchange: "NYSE", type: "stock" },
  { symbol: "CVX", name: "Chevron Corp", exchange: "NYSE", type: "stock" },
  { symbol: "COP", name: "ConocoPhillips", exchange: "NYSE", type: "stock" },
  { symbol: "OXY", name: "Occidental Petroleum", exchange: "NYSE", type: "stock" },
  { symbol: "SLB", name: "Schlumberger NV", exchange: "NYSE", type: "stock" },
  { symbol: "BA", name: "Boeing Co", exchange: "NYSE", type: "stock" },
  { symbol: "LMT", name: "Lockheed Martin", exchange: "NYSE", type: "stock" },
  { symbol: "RTX", name: "RTX Corp", exchange: "NYSE", type: "stock" },
  { symbol: "CAT", name: "Caterpillar Inc", exchange: "NYSE", type: "stock" },
  { symbol: "DE", name: "Deere & Co", exchange: "NYSE", type: "stock" },
  { symbol: "GE", name: "General Electric", exchange: "NYSE", type: "stock" },
  { symbol: "HON", name: "Honeywell International", exchange: "NASDAQ", type: "stock" },
  { symbol: "UPS", name: "United Parcel Service", exchange: "NYSE", type: "stock" },
  { symbol: "FDX", name: "FedEx Corp", exchange: "NYSE", type: "stock" },

  // ── Autos / EV ────────────────────────────────────────────────────────
  { symbol: "F", name: "Ford Motor Co", exchange: "NYSE", type: "stock" },
  { symbol: "GM", name: "General Motors", exchange: "NYSE", type: "stock" },
  { symbol: "RIVN", name: "Rivian Automotive", exchange: "NASDAQ", type: "stock" },
  { symbol: "LCID", name: "Lucid Group", exchange: "NASDAQ", type: "stock" },
  { symbol: "NIO", name: "NIO Inc", exchange: "NYSE", type: "stock" },
  { symbol: "XPEV", name: "XPeng Inc", exchange: "NYSE", type: "stock" },
  { symbol: "LI", name: "Li Auto Inc", exchange: "NASDAQ", type: "stock" },

  // ── Telecom / Media ───────────────────────────────────────────────────
  { symbol: "T", name: "AT&T Inc", exchange: "NYSE", type: "stock" },
  { symbol: "VZ", name: "Verizon Communications", exchange: "NYSE", type: "stock" },
  { symbol: "TMUS", name: "T-Mobile US", exchange: "NASDAQ", type: "stock" },
  { symbol: "CMCSA", name: "Comcast Corp", exchange: "NASDAQ", type: "stock" },
  { symbol: "WBD", name: "Warner Bros. Discovery", exchange: "NASDAQ", type: "stock" },
  { symbol: "PARA", name: "Paramount Global", exchange: "NASDAQ", type: "stock" },

  // ── Meme / Retail Favorites ───────────────────────────────────────────
  { symbol: "GME", name: "GameStop Corp", exchange: "NYSE", type: "stock" },
  { symbol: "AMC", name: "AMC Entertainment", exchange: "NYSE", type: "stock" },
  { symbol: "BB", name: "BlackBerry Ltd", exchange: "NYSE", type: "stock" },
  { symbol: "BBBY", name: "Bed Bath & Beyond", exchange: "NASDAQ", type: "stock" },

  // ── ETFs / Indices ────────────────────────────────────────────────────
  { symbol: "SPY", name: "SPDR S&P 500 ETF", exchange: "AMEX", type: "fund" },
  { symbol: "QQQ", name: "Invesco QQQ Trust (Nasdaq 100)", exchange: "NASDAQ", type: "fund" },
  { symbol: "IWM", name: "iShares Russell 2000 ETF", exchange: "AMEX", type: "fund" },
  { symbol: "DIA", name: "SPDR Dow Jones ETF", exchange: "AMEX", type: "fund" },
  { symbol: "VTI", name: "Vanguard Total Stock Market ETF", exchange: "AMEX", type: "fund" },
  { symbol: "VOO", name: "Vanguard S&P 500 ETF", exchange: "AMEX", type: "fund" },
  { symbol: "VXUS", name: "Vanguard Total International Stock ETF", exchange: "NASDAQ", type: "fund" },
  { symbol: "VEA", name: "Vanguard FTSE Developed Markets ETF", exchange: "AMEX", type: "fund" },
  { symbol: "VWO", name: "Vanguard Emerging Markets ETF", exchange: "AMEX", type: "fund" },
  { symbol: "ARKK", name: "ARK Innovation ETF", exchange: "AMEX", type: "fund" },
  { symbol: "TQQQ", name: "ProShares UltraPro QQQ (3x)", exchange: "NASDAQ", type: "fund" },
  { symbol: "SQQQ", name: "ProShares UltraPro Short QQQ (-3x)", exchange: "NASDAQ", type: "fund" },
  { symbol: "UPRO", name: "ProShares UltraPro S&P 500 (3x)", exchange: "AMEX", type: "fund" },
  { symbol: "XLE", name: "Energy Select Sector SPDR", exchange: "AMEX", type: "fund" },
  { symbol: "XLF", name: "Financial Select Sector SPDR", exchange: "AMEX", type: "fund" },
  { symbol: "XLK", name: "Technology Select Sector SPDR", exchange: "AMEX", type: "fund" },
  { symbol: "XLV", name: "Health Care Select Sector SPDR", exchange: "AMEX", type: "fund" },
  { symbol: "XLY", name: "Consumer Discretionary SPDR", exchange: "AMEX", type: "fund" },
  { symbol: "GLD", name: "SPDR Gold Trust", exchange: "AMEX", type: "fund" },
  { symbol: "SLV", name: "iShares Silver Trust", exchange: "AMEX", type: "fund" },
  { symbol: "TLT", name: "iShares 20+ Year Treasury Bond ETF", exchange: "NASDAQ", type: "fund" },

  // ── Crypto (Binance USDT pairs match TradingView's default) ───────────
  { symbol: "BTCUSDT", name: "Bitcoin / USDT", exchange: "BINANCE", type: "crypto" },
  { symbol: "ETHUSDT", name: "Ethereum / USDT", exchange: "BINANCE", type: "crypto" },
  { symbol: "SOLUSDT", name: "Solana / USDT", exchange: "BINANCE", type: "crypto" },
  { symbol: "BNBUSDT", name: "BNB / USDT", exchange: "BINANCE", type: "crypto" },
  { symbol: "XRPUSDT", name: "XRP / USDT", exchange: "BINANCE", type: "crypto" },
  { symbol: "ADAUSDT", name: "Cardano / USDT", exchange: "BINANCE", type: "crypto" },
  { symbol: "DOGEUSDT", name: "Dogecoin / USDT", exchange: "BINANCE", type: "crypto" },
  { symbol: "AVAXUSDT", name: "Avalanche / USDT", exchange: "BINANCE", type: "crypto" },
  { symbol: "DOTUSDT", name: "Polkadot / USDT", exchange: "BINANCE", type: "crypto" },
  { symbol: "LINKUSDT", name: "Chainlink / USDT", exchange: "BINANCE", type: "crypto" },
  { symbol: "MATICUSDT", name: "Polygon / USDT", exchange: "BINANCE", type: "crypto" },
  { symbol: "LTCUSDT", name: "Litecoin / USDT", exchange: "BINANCE", type: "crypto" },
  { symbol: "TRXUSDT", name: "TRON / USDT", exchange: "BINANCE", type: "crypto" },
  { symbol: "UNIUSDT", name: "Uniswap / USDT", exchange: "BINANCE", type: "crypto" },
  { symbol: "ATOMUSDT", name: "Cosmos / USDT", exchange: "BINANCE", type: "crypto" },
  { symbol: "NEARUSDT", name: "NEAR Protocol / USDT", exchange: "BINANCE", type: "crypto" },
  { symbol: "ALGOUSDT", name: "Algorand / USDT", exchange: "BINANCE", type: "crypto" },
  { symbol: "SHIBUSDT", name: "Shiba Inu / USDT", exchange: "BINANCE", type: "crypto" },
  { symbol: "APTUSDT", name: "Aptos / USDT", exchange: "BINANCE", type: "crypto" },
  { symbol: "ARBUSDT", name: "Arbitrum / USDT", exchange: "BINANCE", type: "crypto" },
  { symbol: "OPUSDT", name: "Optimism / USDT", exchange: "BINANCE", type: "crypto" },
  { symbol: "SUIUSDT", name: "Sui / USDT", exchange: "BINANCE", type: "crypto" },

  // ── Forex (major pairs) ───────────────────────────────────────────────
  { symbol: "EURUSD", name: "Euro / US Dollar", exchange: "FX", type: "forex" },
  { symbol: "GBPUSD", name: "British Pound / US Dollar", exchange: "FX", type: "forex" },
  { symbol: "USDJPY", name: "US Dollar / Japanese Yen", exchange: "FX", type: "forex" },
  { symbol: "USDCHF", name: "US Dollar / Swiss Franc", exchange: "FX", type: "forex" },
  { symbol: "USDCAD", name: "US Dollar / Canadian Dollar", exchange: "FX", type: "forex" },
  { symbol: "AUDUSD", name: "Australian Dollar / US Dollar", exchange: "FX", type: "forex" },
  { symbol: "NZDUSD", name: "New Zealand Dollar / US Dollar", exchange: "FX", type: "forex" },
  { symbol: "EURGBP", name: "Euro / British Pound", exchange: "FX", type: "forex" },
  { symbol: "EURJPY", name: "Euro / Japanese Yen", exchange: "FX", type: "forex" },
  { symbol: "GBPJPY", name: "British Pound / Japanese Yen", exchange: "FX", type: "forex" },
]

export function searchCatalog(query: string, limit = 10): CatalogEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const scored = SYMBOL_CATALOG.map((entry) => {
    const sym = entry.symbol.toLowerCase()
    const name = entry.name.toLowerCase()

    let score = 0
    if (sym === q) score = 1000
    else if (sym.startsWith(q)) score = 500 - sym.length
    else if (sym.includes(q)) score = 200 - sym.length
    else if (name.startsWith(q)) score = 300 - name.length * 0.1
    else if (name.includes(q)) score = 100 - name.length * 0.1

    return { entry, score }
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.entry)

  return scored
}
