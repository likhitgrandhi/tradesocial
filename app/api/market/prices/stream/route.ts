import { getPriceCache } from "@/lib/market/prices/cache"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const HEARTBEAT_MS = 20_000

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const raw = searchParams.get("symbols")?.trim() ?? ""
  const symbols = raw
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean)

  if (symbols.length === 0) {
    return new Response("symbols param required", { status: 400 })
  }
  if (symbols.length > 100) {
    return new Response("too many symbols", { status: 400 })
  }

  const cache = getPriceCache()
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      let closed = false
      const send = (event: string, data: unknown) => {
        if (closed) return
        try {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`))
        } catch {
          closed = true
        }
      }

      send("ready", { symbols })

      const unsubscribe = cache.subscribe(symbols, (quote, userSymbol) => {
        send("quote", { ...quote, symbol: userSymbol })
      })

      const heartbeat = setInterval(() => {
        if (closed) return
        try {
          controller.enqueue(encoder.encode(`: heartbeat ${Date.now()}\n\n`))
        } catch {
          closed = true
        }
      }, HEARTBEAT_MS)

      const close = () => {
        if (closed) return
        closed = true
        clearInterval(heartbeat)
        unsubscribe()
        try { controller.close() } catch {}
      }

      request.signal.addEventListener("abort", close)
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  })
}
