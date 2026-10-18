import React, { useState, useMemo } from 'react';
import {
  Play,
  ArrowRight,
  CheckCircle2,
  Circle,
  ExternalLink,
  Calendar,
  Terminal,
  Compass,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import type {
  TermEntry,
  TermCategory,
  RoadmapStageId,
} from '../types/atlas.ts';
import { ALL_CATEGORIES } from '../data/roadmapData.ts';
import {
  calculateCategoryBreakdown,
  generateStudySchedule,
  type StudyTrackId,
} from '../utils/studyLogic.ts';

interface HomeInteractiveSectionProps {
  terms: TermEntry[];
  masteredIds: string[];
  onInspectTerm: (term: TermEntry) => void;
  onToggleMastered: (termId: string) => void;
  onSelectCategoryFilter: (category: TermCategory) => void;
  onSelectStageFilter: (stage: RoadmapStageId) => void;
}

interface SimulatorScenario {
  id: string;
  label: string;
  methodAndPath: string;
  summary: string;
  steps: {
    stepNumber: string;
    layerName: string;
    acronyms: string[];
    linkedTermId: string;
    whatHappens: string;
    livePayload: string;
    interviewerQuestion: string;
    interviewerAnswer: string;
  }[];
}

const SIMULATOR_SCENARIOS: SimulatorScenario[] = [
  {
    id: 'checkout-drf',
    label: '01. DRF Checkout (ACID)',
    methodAndPath: 'POST /api/v1/checkout/',
    summary:
      'Trace how a payment request travels from a React SPA through Nginx and Gunicorn (WSGI) into Django REST Framework and a locked PostgreSQL transaction.',
    steps: [
      {
        stepNumber: '01',
        layerName: 'Browser SPA (HTTPS + CORS + Idempotency)',
        acronyms: ['HTTPS', 'CORS', 'JSON', 'JWT', 'Idempotency'],
        linkedTermId: 'cors',
        whatHappens:
          'React SPA sends a preflight OPTIONS check (CORS), then transmits an encrypted HTTPS POST with a Bearer JWT and a unique Idempotency-Key header so network retries never double-charge.',
        livePayload: `POST /api/v1/checkout/ HTTP/1.1
Host: api.store.com
Origin: https://store.netlify.app
Authorization: Bearer eyJhbGciOiJIUzI1Ni...
Idempotency-Key: idem_9f82a1c4-77b1
Content-Type: application/json

{"cart_id": 884, "payment_method": "pm_card_visa"}`,
        interviewerQuestion:
          'Why did the browser send an OPTIONS request before this POST /api/v1/checkout/ request?',
        interviewerAnswer:
          'Because the request is cross-origin and includes custom headers (Authorization, Idempotency-Key) and Content-Type: application/json, triggering a browser CORS Preflight check.',
      },
      {
        stepNumber: '02',
        layerName: 'DNS, CDN Edge & WAF Shield',
        acronyms: ['DNS', 'CDN', 'TLS', 'WAF', 'DDoS'],
        linkedTermId: 'ssrf-waf-dos',
        whatHappens:
          'DNS resolves api.store.com to the Cloudflare/CloudFront edge IP. The edge terminates TLS 1.3 and inspects the payload via the WAF (Web Application Firewall) to block SQLi/XSS or DDoS floods.',
        livePayload: `# DNS Lookup: api.store.com -> A 104.21.44.12 (TTL 300s)
# TLS 1.3 Handshake: ECDHE-RSA + AES-256-GCM
# WAF Inspection: SQLi=PASS | XSS=PASS | RateLimit=14/100 RPS`,
        interviewerQuestion:
          'How does HTTPS/TLS combine both asymmetric (RSA/ECDHE) and symmetric (AES) cryptography?',
        interviewerAnswer:
          'Asymmetric cryptography verifies the server certificate and securely exchanges a shared session key during the handshake; fast symmetric AES encryption then encrypts the actual HTTP traffic.',
      },
      {
        stepNumber: '03',
        layerName: 'Nginx Reverse Proxy & Load Balancer',
        acronyms: ['LB', 'Nginx', 'TCP'],
        linkedTermId: 'wsgi-asgi',
        whatHappens:
          'Nginx buffers the client request, strips slow-client latency, adds X-Forwarded-For headers, and routes the request over a local socket to a healthy Gunicorn worker container.',
        livePayload: `upstream django_backend {
    least_conn;
    server 10.0.1.14:8000;
    server 10.0.1.15:8000;
}
proxy_set_header X-Forwarded-Proto $scheme;
proxy_pass http://django_backend;`,
        interviewerQuestion:
          'Why shouldn’t you expose Gunicorn directly to the public internet without Nginx or an ALB in front?',
        interviewerAnswer:
          'Gunicorn is designed to execute Python workers on fast local networks; without Nginx buffering slow mobile connections ("Slowloris" attacks), slow clients would tie up all synchronous Python workers.',
      },
      {
        stepNumber: '04',
        layerName: 'Gunicorn WSGI Server & Python GIL',
        acronyms: ['WSGI', 'GIL', 'CPython'],
        linkedTermId: 'gil',
        whatHappens:
          'Gunicorn’s synchronous WSGI worker translates raw HTTP bytes into a Python environ dict and invokes Django’s wsgi.py callable across multi-process workers (bypassing the single-process GIL).',
        livePayload: `# Command running inside Docker container:
gunicorn store.wsgi:application \\
  --workers 4 \\
  --bind 0.0.0.0:8000 \\
  --timeout 30`,
        interviewerQuestion:
          'If Python has a Global Interpreter Lock (GIL), how does Gunicorn utilize all 4 CPU cores?',
        interviewerAnswer:
          'Gunicorn spawns 4 separate OS worker processes (--workers 4). Each process has its own independent Python interpreter and its own GIL, running across all 4 CPU cores in parallel.',
      },
      {
        stepNumber: '05',
        layerName: 'Django REST Framework (JWT + RBAC + Serializer)',
        acronyms: ['DRF', 'JWT', 'RBAC', 'ORM'],
        linkedTermId: 'drf',
        whatHappens:
          'DRF authenticates the JWT signature (401 if invalid), checks RBAC permissions (403 if forbidden), and validates the JSON body via CheckoutSerializer (400 if malformed).',
        livePayload: `class CheckoutView(APIView):
    permission_classes = [IsAuthenticated, IsVerifiedCustomer]

    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return OrderService.execute_checkout(request.user, serializer.validated_data)`,
        interviewerQuestion:
          'What is the exact difference between returning HTTP 401 and HTTP 403 in DRF?',
        interviewerAnswer:
          'HTTP 401 (Unauthenticated) means the request lacks valid authentication credentials (missing/expired JWT). HTTP 403 (Forbidden) means the user is authenticated, but their role/permissions forbid the action.',
      },
      {
        stepNumber: '06',
        layerName: 'PostgreSQL ACID Transaction & Celery Queue',
        acronyms: ['ACID', 'MVCC', 'WAL', 'MQ', 'DLQ'],
        linkedTermId: 'acid',
        whatHappens:
          'Inside transaction.atomic(), PostgreSQL locks the inventory row (SELECT FOR UPDATE), writes to the WAL log for Durability, commits the order, and pushes an async invoice email task to RabbitMQ/Celery.',
        livePayload: `with transaction.atomic():
    item = Inventory.objects.select_for_update().get(id=item_id)
    item.stock -= quantity
    item.save()
    order = Order.objects.create(user=user, status="PAID")
    transaction.on_commit(lambda: send_receipt_task.delay(order.id))`,
        interviewerQuestion:
          'Why do we wrap send_receipt_task.delay(order.id) inside transaction.on_commit()?',
        interviewerAnswer:
          'If Celery picks up the task in 2ms before the PostgreSQL transaction finishes committing, the worker will query the DB and raise Order.DoesNotExist—or send an email for a transaction that later rolled back!',
      },
    ],
  },
  {
    id: 'catalog-cache',
    label: '02. FastAPI + Redis Cache',
    methodAndPath: 'GET /api/v1/products/?category=books',
    summary:
      'See how high-read APIs achieve <5ms P99 latency using Redis Cache-Aside (TTL + LRU eviction) and optimized SQL JOINs that eliminate the N+1 query problem.',
    steps: [
      {
        stepNumber: '01',
        layerName: 'Client GET Request with Query Params',
        acronyms: ['HTTP', 'URI', 'URL', 'REST'],
        linkedTermId: 'url',
        whatHappens:
          'Client requests a filtered, paginated resource collection using REST query parameters (?category=books&page=1) over a persistent HTTP/2 connection.',
        livePayload: `GET /api/v1/products?category=books&page=1 HTTP/2
Host: api.catalog.io
Accept: application/json`,
        interviewerQuestion:
          'Is HTTP GET idempotent, and why should GET never mutate server state?',
        interviewerAnswer:
          'Yes, GET is strictly safe and idempotent—browsers, CDNs, and proxies freely prefetch, cache, and retry GET requests assuming zero side effects.',
      },
      {
        stepNumber: '02',
        layerName: 'ASGI Uvicorn Event Loop & Pydantic',
        acronyms: ['ASGI', 'Pydantic', 'JSON'],
        linkedTermId: 'python-packaging-tools',
        whatHappens:
          'Uvicorn (ASGI) dispatches the request into an async def endpoint. FastAPI uses Pydantic type hints to validate query parameters and serialize the response.',
        livePayload: `@app.get("/api/v1/products", response_model= list[ProductOut])
async def list_products(category: str, page: int = Query(1, ge=1)):
    return await CatalogService.get_products(category, page)`,
        interviewerQuestion:
          'How does Pydantic v2 make FastAPI serialization so fast?',
        interviewerAnswer:
          'Pydantic v2 validates incoming types and serializes objects to JSON using a compiled Rust core (pydantic-core) rather than slow pure-Python loops.',
      },
      {
        stepNumber: '03',
        layerName: 'Redis Cache Lookup (TTL & LRU Eviction)',
        acronyms: ['NoSQL', 'TTL', 'LRU', 'P99'],
        linkedTermId: 'ttl-lru-lfu',
        whatHappens:
          'Backend checks Redis first (`GET catalog:books:p1`). On a cache hit (1.2ms), it returns immediately; on a cache miss, it queries PostgreSQL and stores the result with a 300s TTL.',
        livePayload: `cache_key = f"catalog:{category}:p{page}"
cached = await redis.get(cache_key)
if cached:
    return json.loads(cached)  # 1.2ms Cache Hit!
# On miss -> query DB, then SETEX with 300s TTL`,
        interviewerQuestion:
          'What happens when Redis reaches maximum RAM capacity?',
        interviewerAnswer:
          'With `allkeys-lru` configured, Redis evicts the Least Recently Used keys to free memory for hot keys.',
      },
      {
        stepNumber: '04',
        layerName: 'ORM Query Optimization (Solving N+1)',
        acronyms: ['ORM', 'SQL', 'RDBMS', 'DQL'],
        linkedTermId: 'orm',
        whatHappens:
          'On a cache miss, the ORM executes a single optimized SELECT with INNER JOIN (`select_related("author")`) using a composite B-Tree index instead of firing N+1 queries.',
        livePayload: `# Single SQL Query with JOIN (Zero N+1 Bottleneck):
SELECT p.id, p.title, p.price, a.name
FROM products p
INNER JOIN authors a ON p.author_id = a.id
WHERE p.category = 'books'
LIMIT 20 OFFSET 0;`,
        interviewerQuestion:
          'How do you verify in PostgreSQL whether your query is using an Index Scan vs a Sequential Table Scan?',
        interviewerAnswer:
          'Prefix the SQL query with `EXPLAIN ANALYZE SELECT ...` to inspect the query execution plan, index usage, and actual millisecond cost.',
      },
    ],
  },
  {
    id: 'realtime-ws',
    label: '03. ASGI WebSockets + Pub/Sub',
    methodAndPath: 'GET /ws/orders/live (101 Switching Protocols)',
    summary:
      'Explore why real-time bi-directional features require ASGI (Uvicorn/Django Channels), WebSockets or SSE, and Redis Pub/Sub fan-out.',
    steps: [
      {
        stepNumber: '01',
        layerName: 'HTTP Upgrade to WebSocket (WS)',
        acronyms: ['WS', 'SSE', 'TCP', 'ASGI'],
        linkedTermId: 'grpc-rpc-ws-sse',
        whatHappens:
          'Client sends an HTTP request with `Upgrade: websocket`. The ASGI server responds with `HTTP/1.1 101 Switching Protocols`, keeping the TCP socket open for full-duplex messages.',
        livePayload: `GET /ws/orders/live HTTP/1.1
Host: stream.store.com
Upgrade: websocket
Connection: Upgrade`,
        interviewerQuestion:
          'When should you choose Server-Sent Events (SSE) instead of WebSockets (WS)?',
        interviewerAnswer:
          'Choose SSE when data only flows one way (Server -> Client, like live order status or AI text streaming) because SSE runs over standard HTTP with automatic reconnection.',
      },
      {
        stepNumber: '02',
        layerName: 'Redis Pub/Sub Multi-Node Fan-Out',
        acronyms: ['Pub/Sub', 'EDA', 'CQRS'],
        linkedTermId: 'mq-amqp-dlq',
        whatHappens:
          'When an order status changes in PostgreSQL, the API publishes an event to a Redis Pub/Sub channel so all connected ASGI Uvicorn containers can push the update to subscribed browsers.',
        livePayload: `# Publisher (Order Service):
await redis.publish("orders:user_42", json.dumps({"order_id": 99, "status": "OUT_FOR_DELIVERY"}))

# Subscriber (ASGI WebSocket Handler):
await websocket.send_json(event_payload)`,
        interviewerQuestion:
          'Why can’t a single ASGI server just hold WebSocket connections in a Python list in memory when scaling horizontally?',
        interviewerAnswer:
          'When you run 5 container instances behind a Load Balancer, User A might be connected to Container 1 while the webhook hits Container 4. A shared Redis Pub/Sub broker broadcasts the event across all containers.',
      },
    ],
  },
];

const NON_ACRONYM_TRAPS = [
  {
    term: 'Idempotency',
    myth: 'Often mistaken for an acronym',
    truth: 'From Latin "idem + potens" (same effect). Repeating an API call produces the exact same state as calling it once.',
    deepDiveId: 'idempotency',
  },
  {
    term: 'Pydantic',
    myth: 'Often mistaken for "PY-D-A-N-T-I-C"',
    truth: 'Playful blend of "Python" + "Pedantic"—the strict type-hint validation library powering FastAPI.',
    deepDiveId: 'python-packaging-tools',
  },
  {
    term: 'K8s (Kubernetes)',
    myth: 'Often mistaken for an acronym',
    truth: 'It is a Numeronym: "K" + the 8 letters ("ubernete") + "s", from the Greek word for helmsman/pilot.',
    deepDiveId: 'docker-k8s',
  },
  {
    term: 'Saga',
    myth: 'Often written as SAGA in caps',
    truth: 'Named after long Norse stories: coordinates distributed microservice transactions via local steps + compensating rollbacks.',
    deepDiveId: 'cqrs-eda-soa',
  },
];

export const HomeInteractiveSection: React.FC<HomeInteractiveSectionProps> = ({
  terms,
  masteredIds,
  onInspectTerm,
  onToggleMastered,
  onSelectCategoryFilter,
  onSelectStageFilter,
}) => {
  // 1. Request Simulator State
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    SIMULATOR_SCENARIOS[0].id
  );
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [showSimAnswer, setShowSimAnswer] = useState<boolean>(false);

  // 2. Speed Decoder State
  const speedDeck = useMemo(
    () =>
      terms.filter((t) =>
        ['drf', 'acid', 'wsgi-asgi', 'cors', 'jwt', 'orm', 'gil', 'cqrs-eda-soa', 'ttl-lru-lfu', 'cap-sla-spof'].includes(
          t.id
        )
      ),
    [terms]
  );
  const [speedIdx, setSpeedIdx] = useState<number>(0);
  const [speedRevealed, setSpeedRevealed] = useState<boolean>(false);

  // 3. Custom Study Schedule Calculator State
  const [daysUntilInterview, setDaysUntilInterview] = useState<number>(7);
  const [selectedTrack, setSelectedTrack] = useState<StudyTrackId>('django-drf');

  const activeScenario =
    SIMULATOR_SCENARIOS.find((s) => s.id === selectedScenarioId) ??
    SIMULATOR_SCENARIOS[0];
  const safeStepIdx = Math.min(activeStepIdx, activeScenario.steps.length - 1);
  const currentSimStep = activeScenario.steps[safeStepIdx];

  const categoryStats = useMemo(
    () => calculateCategoryBreakdown(terms, ALL_CATEGORIES, masteredIds),
    [terms, masteredIds]
  );

  const customSchedule = useMemo(
    () =>
      generateStudySchedule(
        terms,
        masteredIds,
        daysUntilInterview,
        selectedTrack
      ),
    [terms, masteredIds, daysUntilInterview, selectedTrack]
  );

  const currentSpeedTerm = speedDeck[speedIdx % speedDeck.length] ?? terms[0];
  const masteredSet = new Set(masteredIds);

  const handleOpenTermById = (id: string) => {
    const found = terms.find((t) => t.id === id);
    if (found) {
      onInspectTerm(found);
    }
  };

  return (
    <section id="home-lab" className="scroll-mt-24 space-y-14">
      {/* =================================================================== */}
      {/* INTERACTIVE LAB 1: LIVE BACKEND REQUEST & ACRONYM SIMULATOR         */}
      {/* =================================================================== */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-medium text-sky-700">
              <Terminal className="w-3.5 h-3.5" />
              <span>Interactive Architecture Sandbox</span>
              <span aria-hidden="true">·</span>
              <span>See Where Every Acronym Lives</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Interactive Request Simulator — Trace Acronyms in Real Time
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Interviewers don’t just ask what an acronym stands for in isolation—they ask how a request flows through your stack. Pick a production scenario below and click each layer to inspect the active acronyms, wire payload, and interview question.
            </p>
          </div>

          {/* Scenario Selector Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {SIMULATOR_SCENARIOS.map((scen) => {
              const active = scen.id === activeScenario.id;
              return (
                <button
                  key={scen.id}
                  type="button"
                  onClick={() => {
                    setSelectedScenarioId(scen.id);
                    setActiveStepIdx(0);
                    setShowSimAnswer(false);
                  }}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {scen.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Nodes Selector Bar */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
            <div>
              <span className="font-mono font-bold text-sky-700">
                {activeScenario.methodAndPath}
              </span>{' '}
              — {activeScenario.summary}
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveStepIdx((prev) => (prev + 1) % activeScenario.steps.length);
                setShowSimAnswer(false);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Play className="w-3 h-3" />
              <span>Step to Next Layer ({safeStepIdx + 1}/{activeScenario.steps.length})</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {activeScenario.steps.map((st, idx) => {
              const isCurrent = idx === safeStepIdx;
              return (
                <button
                  key={st.stepNumber}
                  type="button"
                  onClick={() => {
                    setActiveStepIdx(idx);
                    setShowSimAnswer(false);
                  }}
                  className={`p-3 rounded-lg border text-left transition-colors cursor-pointer flex flex-col justify-between gap-1.5 ${
                    isCurrent
                      ? 'bg-sky-50/80 border-sky-600 ring-1 ring-sky-600 text-slate-900'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className={isCurrent ? 'font-bold text-sky-700' : 'text-slate-500'}>
                      Hop {st.stepNumber}
                    </span>
                    <span className="text-slate-400">{st.acronyms[0]}</span>
                  </div>
                  <div className="text-xs font-bold leading-snug line-clamp-2">
                    {st.layerName}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Layer Inspector Split */}
        {currentSimStep && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
            {/* Left: Explanation + Interview Question for this Hop (7 cols) */}
            <div className="min-w-0 lg:col-span-7 bg-slate-50 border border-slate-200/90 rounded-xl p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-mono text-sky-700 font-semibold">
                    Layer {currentSimStep.stepNumber} · Active Acronyms:{' '}
                    {currentSimStep.acronyms.join(' · ')}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenTermById(currentSimStep.linkedTermId)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-900 cursor-pointer"
                  >
                    <span>Open Deep-Dive Sheet</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {currentSimStep.layerName}
                </h3>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {currentSimStep.whatHappens}
                </p>
              </div>

              {/* Layer Interview Question Interactive Reveal */}
              <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-2.5">
                <div className="text-xs font-mono font-semibold text-slate-500">
                  Interviewer Follow-Up at Layer {currentSimStep.stepNumber}:
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  "{currentSimStep.interviewerQuestion}"
                </p>
                {showSimAnswer ? (
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-2 border-t border-slate-100">
                    <strong className="text-emerald-800">Model Answer: </strong>
                    {currentSimStep.interviewerAnswer}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowSimAnswer(true)}
                    className="text-xs font-semibold text-sky-700 hover:text-sky-900 underline underline-offset-4 cursor-pointer"
                  >
                    Reveal Interviewer Answer
                  </button>
                )}
              </div>
            </div>

            {/* Right: Live Wire / Code Payload at this Hop (5 cols) */}
            <div className="min-w-0 lg:col-span-5 bg-slate-900 text-slate-100 rounded-xl p-5 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono border-b border-slate-800 pb-2.5">
                <span>Live Wire / Code Snapshot</span>
                <span>Hop {currentSimStep.stepNumber}</span>
              </div>
              <pre className="text-xs font-mono leading-relaxed overflow-x-auto text-sky-200 flex-1">
                <code>{currentSimStep.livePayload}</code>
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* INTERACTIVE LAB 2: ASYMMETRIC BENTO (PLANNER + ACRONYM TRAPS)       */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Bento (7 cols): Custom Interview Countdown & Study Schedule Generator */}
        <div className="min-w-0 lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 sm:p-7 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-sky-700">
                <Calendar className="w-3.5 h-3.5" />
                <span>Personalized Study Pacing</span>
                <span aria-hidden="true">·</span>
                <span>Adaptive Daily Quota</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Interview Countdown & Daily Study Planner
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Select how many days you have before your backend interview and your target stack. Your daily study target adjusts automatically based on your remaining unmastered modules.
              </p>
            </div>

            {/* Interactive Controls: Days + Track */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Time Until Interview:
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[3, 7, 14, 21].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDaysUntilInterview(d)}
                      className={`py-2 px-2 text-xs font-mono font-semibold rounded-lg border transition-colors cursor-pointer tabular-nums ${
                        daysUntilInterview === d
                          ? 'bg-sky-600 border-sky-600 text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="study-track-select"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Target Role Focus:
                </label>
                <select
                  id="study-track-select"
                  value={selectedTrack}
                  onChange={(e) => setSelectedTrack(e.target.value as StudyTrackId)}
                  className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-sky-600"
                >
                  <option value="django-drf">Python + Django REST Framework (DRF)</option>
                  <option value="fastapi-async">FastAPI + Async ASGI & Microservices</option>
                  <option value="system-design">Backend System Design & Databases</option>
                </select>
              </div>
            </div>

            {/* Calculated Daily Quota Strip */}
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
              <div>
                <div className="text-xs text-slate-500">Remaining Modules</div>
                <div className="text-lg font-bold font-mono text-slate-900 tabular-nums mt-0.5">
                  {customSchedule.remainingModules}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Daily Target</div>
                <div className="text-lg font-bold font-mono text-sky-700 tabular-nums mt-0.5">
                  {customSchedule.modulesPerDay} / day
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Interview Q&As / Day</div>
                <div className="text-lg font-bold font-mono text-slate-900 tabular-nums mt-0.5">
                  {customSchedule.questionsPerDay} Q&As
                </div>
              </div>
            </div>

            {/* Track Strategy Note */}
            <div className="p-3 rounded-lg bg-sky-50/70 border border-sky-200/70 text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900">Track Strategy: </strong>
              {selectedTrack === 'django-drf' &&
                'Prioritizes Stage 01 (HTTP/REST/DRF) and Stage 02 (JWT/RBAC/CORS) before SQL ACID & WSGI deployment.'}
              {selectedTrack === 'fastapi-async' &&
                'Prioritizes Stage 01 (REST/JSON) and Stage 04 (ASGI Uvicorn, GIL, Pydantic, Docker) for high-concurrency roles.'}
              {selectedTrack === 'system-design' &&
                'Prioritizes Stage 01 (APIs), Stage 03 (SQL ACID/MVCC/Indexing), and Stage 05 (CAP, Caching, Queues, Sagas).'}
            </div>
          </div>

          {/* Today's Priority Study Queue */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">
                Today’s Priority Queue (Stage Order:{' '}
                {customSchedule.priorityStages.map((s) => `0${s}`).join(' → ')})
              </span>
              <button
                type="button"
                onClick={() => onSelectStageFilter(customSchedule.priorityStages[0])}
                className="font-semibold text-sky-700 hover:text-sky-900 cursor-pointer"
              >
                Open Stage 0{customSchedule.priorityStages[0]} →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {customSchedule.recommendedToday.map((item) => {
                const isDone = masteredSet.has(item.id);
                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2"
                  >
                    <button
                      type="button"
                      onClick={() => onInspectTerm(item)}
                      className="text-left min-w-0 flex-1 cursor-pointer group"
                    >
                      <div className="font-mono text-xs font-bold text-slate-900 group-hover:text-sky-700 truncate">
                        {item.term} · Stage 0{item.roadmapStage}
                      </div>
                      <div className="text-xs text-slate-600 truncate">
                        {item.fullForm}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleMastered(item.id)}
                      aria-label={`Toggle mastered for ${item.term}`}
                      className="p-1.5 text-slate-400 hover:text-emerald-700 transition-colors cursor-pointer shrink-0"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Bento (5 cols): Rapid Acronym Decoder & "Not an Acronym" Interview Traps */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 sm:p-7 flex flex-col justify-between space-y-6">
          {/* Top Half: Quick Spot-Check Decoder */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-sky-700 inline-flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                Rapid Acronym Spot-Check
              </span>
              <span className="font-mono tabular-nums">
                {(speedIdx % speedDeck.length) + 1} / {speedDeck.length}
              </span>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900">
                  {currentSpeedTerm.term}
                </span>
                <span className="text-xs text-slate-500">
                  Stage 0{currentSpeedTerm.roadmapStage} · {currentSpeedTerm.category}
                </span>
              </div>

              {speedRevealed ? (
                <div className="space-y-1.5 pt-2 border-t border-slate-200/80">
                  <div className="text-sm font-bold text-sky-800">
                    {currentSpeedTerm.fullForm}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {currentSpeedTerm.shortSummary}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-600">
                  Can you state the full form and a real Python backend use case before clicking reveal?
                </p>
              )}

              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSpeedRevealed((prev) => !prev)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                >
                  {speedRevealed ? 'Hide Expansion' : 'Reveal Full Form'}
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onInspectTerm(currentSpeedTerm)}
                    className="px-2.5 py-1.5 text-xs font-semibold text-sky-700 hover:bg-sky-50 rounded-md transition-colors cursor-pointer"
                  >
                    Full Q&A
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSpeedRevealed(false);
                      setSpeedIdx((prev) => prev + 1);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Next Term</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Half: "Wait—That's Not an Acronym!" Interview Traps */}
          <div className="space-y-2.5 pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900">
              Interview Trap Alert — Terms That Are NOT Acronyms:
            </h4>
            <div className="space-y-2">
              {NON_ACRONYM_TRAPS.map((trap) => (
                <button
                  key={trap.term}
                  type="button"
                  onClick={() => handleOpenTermById(trap.deepDiveId)}
                  className="w-full text-left p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/70 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-slate-900">
                      {trap.term}
                    </span>
                    <span className="text-[11px] text-sky-700 font-medium">
                      Inspect →
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-snug mt-0.5">
                    {trap.truth}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* INTERACTIVE LAB 3: 12-DOMAIN ENGINEERING ATLAS RADAR                */}
      {/* =================================================================== */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-sky-700">
              <Compass className="w-3.5 h-3.5" />
              <span>12-Domain Mastery Radar</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Explore All 12 Software Engineering Categories
            </h3>
          </div>
          <p className="text-xs text-slate-600">
            Click any domain card to filter the Deep-Dive Encyclopedia directly to that category.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryStats.map((item) => (
            <button
              key={item.category}
              type="button"
              onClick={() => onSelectCategoryFilter(item.category)}
              className="bg-white border border-slate-200 hover:border-sky-600 rounded-xl p-4 text-left transition-colors flex flex-col justify-between space-y-3 cursor-pointer group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono font-semibold text-slate-700 tabular-nums">
                    {item.mastered}/{item.total} Mastered
                  </span>
                  <span className="font-mono text-sky-700 font-bold tabular-nums">
                    {item.percentage}%
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                  {item.category}
                </h4>
                <div className="text-xs font-mono text-slate-500 truncate">
                  {item.sampleTerms.join(' · ')}
                </div>
              </div>

              <div className="space-y-2">
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-600 transition-all duration-200"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <div className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700">
                  <span>Study {item.category}</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
