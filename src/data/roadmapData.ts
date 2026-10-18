import type { RoadmapStage, ArchitectureComparison, TermCategory } from '../types/atlas.ts';

export const ALL_CATEGORIES: TermCategory[] = [
  'Common Development',
  'Backend & APIs',
  'Python Ecosystem',
  'Databases & SQL',
  'Architecture & System Design',
  'DevOps & Cloud',
  'Frontend & Web',
  'Testing & Quality',
  'Security & Auth',
  'Messaging & Caching',
  'Data Formats',
  'Product & Business',
];

export const ROADMAP_STAGES: RoadmapStage[] = [
  {
    id: 1,
    title: 'Stage 01. Core Web, APIs & Python Foundations',
    subtitle: 'What to remember first: Request-response fundamentals, REST constraints, and Django/FastAPI building blocks',
    timeframe: 'Days 1–3 · Immediate Priority',
    focusSummary:
      'Every backend interview starts here. Before touching distributed systems or cloud infrastructure, you must effortlessly explain how a browser or mobile client resolves a domain, opens an HTTP/HTTPS connection, sends a JSON payload to a RESTful API built with DRF or FastAPI, and maps that payload to a relational database via an ORM.',
    whyThisOrder:
      'Interviewers use these foundational terms in the first 10 minutes as a baseline filter. If you hesitate on what REST stands for, why HTTP is stateless, or how an ORM translates Python objects into SQL CRUD queries, the interviewer will not advance to deeper system design questions.',
    interviewMilestone:
      'Explain end-to-end what happens when a client sends a POST /api/orders/ request with a JSON body to a Django REST Framework endpoint.',
    keyTermIds: ['api', 'rest', 'http', 'https', 'json', 'crud', 'sql', 'orm', 'drf', 'url', 'uri', 'dns', 'tcp', 'udp', 'utf-8', 'mime', 'cli', 'sdk', 'ide'],
  },
  {
    id: 2,
    title: 'Stage 02. Authentication, Security & Access Control',
    subtitle: 'Protecting APIs: Stateless tokens, delegated authorization, browser security policies, and OWASP defenses',
    timeframe: 'Days 4–6 · Security & Identity',
    focusSummary:
      'Once you can build an API, the next interview question is always: "How do you secure it?" This stage covers identity verification (Authentication) vs permission enforcement (Authorization), stateless JWT flows, OAuth 2.0 / OIDC login, browser CORS rules, and defending against CSRF, XSS, SQLi, and SSRF.',
    whyThisOrder:
      'Backend engineers are directly responsible for protecting PII and financial data. Knowing the difference between CORS and CSRF, or between encoding (Base64), hashing (SHA-256/HMAC), and encryption (AES/RSA), separates production-ready developers from beginners.',
    interviewMilestone:
      'Walk through a complete JWT access + refresh token lifecycle and explain how RBAC permissions and CORS headers protect a multi-role Python backend.',
    keyTermIds: ['jwt', 'oauth', 'oidc', 'cors', 'csrf', 'xss', 'sqli', 'ssrf', 'rbac', 'abac', 'acl', 'mfa', 'sso', 'otp', 'hmac', 'aes', 'rsa', 'pii', 'waf'],
  },
  {
    id: 3,
    title: 'Stage 03. Databases, Transactions, Caching & Data Integrity',
    subtitle: 'Reliable data storage: ACID guarantees, concurrency control, indexing, Redis eviction, and idempotency',
    timeframe: 'Days 7–10 · Data Layer Mastery',
    focusSummary:
      'Real-world backends spend 80% of their latency waiting on databases or caches. Stage 3 teaches you how RDBMS engines guarantee safe concurrent updates via ACID, MVCC, and WAL, how DDL/DML/DQL structure SQL, and how TTL, LRU/LFU caching, and Idempotency keys keep high-traffic payment and booking systems fast and bug-free.',
    whyThisOrder:
      'After verifying you can build and secure an API, interviewers probe how your code behaves when 500 users try to buy the last item simultaneously or when a network retry sends a payment request twice.',
    interviewMilestone:
      'Explain each letter of ACID with a banking transfer example, solve the ORM N+1 query problem, and design an idempotent payment endpoint with Redis TTL caching.',
    keyTermIds: ['acid', 'rdbms', 'nosql', 'pk', 'fk', 'ddl', 'dml', 'dql', 'oltp', 'olap', 'mvcc', 'wal', 'ttl', 'lru', 'lfu', 'idempotency', 'etl', 'cdc'],
  },
  {
    id: 4,
    title: 'Stage 04. Python Runtime, Servers, DevOps & Cloud',
    subtitle: 'From local code to production: WSGI vs ASGI, the Python GIL, Docker containers, CI/CD pipelines, and AWS/Cloud networking',
    timeframe: 'Days 11–14 · Production & Deployment',
    focusSummary:
      'Writing Python code on localhost is only half the job. This stage covers how Python actually executes code (CPython, GIL, GC, PEP 8), how web servers talk to Python apps (WSGI with Gunicorn vs ASGI with Uvicorn behind Nginx), and how code ships safely via CI/CD, Docker, Kubernetes (K8s), IaC, and VPC cloud environments.',
    whyThisOrder:
      'Python-specific interviews heavily test WSGI vs ASGI and the Global Interpreter Lock (GIL). Pairing runtime knowledge with Docker, Nginx, and CI/CD shows you can own a feature all the way to production.',
    interviewMilestone:
      'Trace a production request from Client -> DNS -> CDN -> Load Balancer / Nginx -> Gunicorn (WSGI) or Uvicorn (ASGI) -> Django/FastAPI -> Database.',
    keyTermIds: ['wsgi', 'asgi', 'gil', 'pep-8', 'oop', 'gc', 'jit', 'ci-cd', 'iac', 'docker', 'k8s', 'oci', 'vpc', 'iam', 'ssh', 'tls', 'nginx', 'cdn', 'yaml', 'toml'],
  },
  {
    id: 5,
    title: 'Stage 05. System Design, Distributed Messaging & Product Strategy',
    subtitle: 'Scaling & senior engineering: SOLID principles, CQRS, event queues, CAP theorem, SLAs, frontend rendering, and SaaS metrics',
    timeframe: 'Days 15–20 · Architecture & Leadership',
    focusSummary:
      'The final stage prepares you for system design rounds and cross-functional product discussions. You will master clean code principles (SOLID, DRY, KISS, YAGNI, TDD), asynchronous messaging (MQ, AMQP, Pub/Sub, DLQ, Saga), high-availability trade-offs (CAP, SPOF, SLA/SLO/SLI, P99 latency), frontend integration (DOM, SPA, SSR, CSR), and SaaS business vocabulary (MVP, POC, B2B).',
    whyThisOrder:
      'Once Stages 1–4 are solid, learning distributed architecture and product terminology lets you answer open-ended "How would you scale this to 1 million users?" questions with structured trade-offs.',
    interviewMilestone:
      'Design a resilient event-driven order processing pipeline using Pub/Sub, Dead-Letter Queues (DLQ), and CQRS while meeting a 99.9% SLA.',
    keyTermIds: ['solid', 'dry', 'kiss', 'yagni', 'cap', 'cqrs', 'eda', 'grpc', 'ws', 'sse', 'mq', 'amqp', 'dlq', 'pub-sub', 'saga', 'sla', 'slo', 'sli', 'spof', 'p99', 'tdd', 'e2e', 'ssr', 'csr', 'spa', 'dom', 'protobuf', 'saas', 'paas', 'iaas', 'mvp', 'poc'],
  },
];

export const ARCHITECTURE_COMPARISONS: ArchitectureComparison[] = [
  {
    id: 'auth-vs-authz',
    title: 'Authentication (AuthN) vs. Authorization (AuthZ)',
    subtitle: 'Identity Verification vs. Permission Enforcement',
    stage: 2,
    summary:
      'Interviewers frequently test if candidates confuse HTTP 401 (Unauthorized / Unauthenticated) with HTTP 403 (Forbidden / Unauthorized). Authentication always runs before Authorization.',
    items: [
      {
        name: 'Authentication (AuthN)',
        fullForm: 'Who are you? (Identity Verification)',
        role: 'Verifies user credentials (password, OTP, OIDC token, or JWT signature) to confirm the caller is who they claim to be.',
        whenToChoose: 'Every protected login flow, session middleware, or Bearer token verification step.',
        example: 'Django checks the Authorization: Bearer <JWT> signature. If expired or missing, return HTTP 401.',
      },
      {
        name: 'Authorization (AuthZ)',
        fullForm: 'What are you allowed to do? (Access Control)',
        role: 'Evaluates RBAC roles, ABAC policies, or object-level permissions after identity is already known.',
        whenToChoose: 'Restricting admin dashboards, verifying resource ownership, or enforcing tenant isolation.',
        example: 'A logged-in customer tries to DELETE /api/users/42/. DRF IsAdminUser permission returns HTTP 403 Forbidden.',
      },
    ],
    interviewTakeaway:
      'Always state: "Authentication verifies identity (401 on failure); Authorization verifies permissions (403 on failure)."',
  },
  {
    id: 'wsgi-vs-asgi',
    title: 'WSGI vs. ASGI in Python Production',
    subtitle: 'Synchronous vs. Asynchronous Python Web Server Interfaces',
    stage: 4,
    summary:
      'Python web frameworks (Django, Flask, FastAPI) do not speak raw TCP/HTTP directly in production; they rely on a gateway interface standard to communicate with application servers like Gunicorn or Uvicorn.',
    items: [
      {
        name: 'WSGI',
        fullForm: 'Web Server Gateway Interface (PEP 3333)',
        role: 'Synchronous, blocking callable interface: one request comes in, Python processes it sequentially, and returns one response.',
        whenToChoose: 'Traditional synchronous Django or Flask CRUD apps backed by standard blocking SQL queries.',
        example: 'Nginx -> Gunicorn (WSGI workers) -> Django wsgi.py -> PostgreSQL.',
      },
      {
        name: 'ASGI',
        fullForm: 'Asynchronous Server Gateway Interface',
        role: 'Async-native spiritual successor to WSGI supporting async/await coroutines, multiple incoming/outgoing events, WebSockets, and SSE.',
        whenToChoose: 'FastAPI apps, Django Channels, real-time WebSockets, long-polling, or high-concurrency I/O bound microservices calling external APIs.',
        example: 'Nginx -> Gunicorn with UvicornWorker (ASGI) -> FastAPI / Django asgi.py.',
      },
    ],
    interviewTakeaway:
      'ASGI is backward-compatible with WSGI (via wrappers) and is mandatory if your Python service needs WebSockets, Server-Sent Events (SSE), or native async/await I/O concurrency.',
  },
  {
    id: 'encoding-hashing-encryption',
    title: 'Encoding vs. Hashing vs. Encryption',
    subtitle: 'Data Representation vs. One-Way Integrity vs. Two-Way Confidentiality',
    stage: 2,
    summary:
      'A classic backend security trap question is: "Since JWT payloads are Base64 encoded, is it safe to store a user password or credit card inside a JWT?" The answer is a strict NO—Base64 is encoding, not encryption.',
    items: [
      {
        name: 'Encoding (e.g., UTF-8, Base64)',
        fullForm: 'Reversible Public Format Transformation (No Secret Key)',
        role: 'Transforms data from one format to another for safe transmission or readability. Anyone can decode it instantly.',
        whenToChoose: 'Sending binary images over JSON (Base64) or representing international text characters (UTF-8).',
        example: 'JWT header and payload segments are Base64URL-encoded—anyone can decode and read them without a key.',
      },
      {
        name: 'Hashing (e.g., SHA-256, Argon2, bcrypt, HMAC)',
        fullForm: 'One-Way Mathematical Fingerprint (Irreversible)',
        role: 'Maps arbitrary data to a fixed-length digest. You cannot reverse a hash back into the original input.',
        whenToChoose: 'Storing user passwords in a database (with salt via Argon2/PBKDF2) or verifying webhook payload integrity (HMAC).',
        example: 'Django hashes user passwords with PBKDF2/Argon2 so even if the DB is leaked, plaintext passwords are never exposed.',
      },
      {
        name: 'Encryption (e.g., AES-256, RSA, TLS)',
        fullForm: 'Two-Way Confidentiality Using Cryptographic Keys',
        role: 'Scrambles plaintext into ciphertext using a secret key so only authorized keyholders can decrypt it back.',
        whenToChoose: 'Protecting PII/PHI at rest in databases (AES) or securing HTTP traffic in transit (HTTPS/TLS).',
        example: 'Encrypting a customer bank account number with AES-256-GCM before saving it in PostgreSQL.',
      },
    ],
    interviewTakeaway:
      'Never say "Base64 encryption" in an interview. Encode for compatibility, Hash for password storage & integrity checks, and Encrypt for confidential data recovery.',
  },
  {
    id: 'put-vs-patch',
    title: 'HTTP PUT vs. HTTP PATCH vs. HTTP POST',
    subtitle: 'Full Replacement vs. Partial Update vs. Resource Creation',
    stage: 1,
    summary:
      'When designing REST APIs in Django REST Framework or FastAPI, interviewers frequently ask how update methods differ and which ones are idempotent.',
    items: [
      {
        name: 'HTTP PUT',
        fullForm: 'Idempotent Full Resource Replacement',
        role: 'Replaces the entire target resource with the request payload. Omitted fields are reset to null or default—so all required fields must be sent.',
        whenToChoose: 'Replacing a complete configuration document or updating an entire record where the client holds the full state.',
        example: 'PUT /api/books/10/ requires sending title, author, isbn, and published_date.',
      },
      {
        name: 'HTTP PATCH',
        fullForm: 'Partial Resource Modification',
        role: 'Applies a partial update to only the specific fields included in the JSON payload, leaving all other fields untouched.',
        whenToChoose: 'Updating a user profile email, toggling an order status, or saving a single edited field in DRF (partial=True).',
        example: 'PATCH /api/books/10/ with {"price": 19.99} updates only the price column.',
      },
    ],
    interviewTakeaway:
      'In DRF, ModelViewSet routes PUT to update() (full validation) and PATCH to partial_update() (sets partial=True on the Serializer). PUT is strictly idempotent.',
  },
];

export const PRODUCTION_REQUEST_PIPELINE = [
  {
    step: '01',
    node: 'Client Browser / Mobile App',
    acronyms: 'UI · SPA · CSR · HTTPS',
    detail: 'Initiates an HTTPS request (e.g. POST /api/v1/checkout) with a JSON body and Authorization: Bearer <JWT> header.',
  },
  {
    step: '02',
    node: 'DNS & CDN Edge',
    acronyms: 'DNS · CDN · TLS · WAF',
    detail: 'DNS resolves api.example.com to an IP address; Cloudflare/AWS CloudFront terminates TLS, blocks DDoS/SQLi via WAF, and serves static assets.',
  },
  {
    step: '03',
    node: 'Reverse Proxy & Load Balancer',
    acronyms: 'LB · Nginx · CORS',
    detail: 'Nginx / AWS ALB distributes traffic across healthy backend containers, handles rate-limiting, and forwards proxy headers.',
  },
  {
    step: '04',
    node: 'Python Gateway Server',
    acronyms: 'WSGI (Gunicorn) · ASGI (Uvicorn)',
    detail: 'Translates raw network bytes from Nginx into Python callable events (WSGI for sync Django, ASGI for async FastAPI/WebSockets).',
  },
  {
    step: '05',
    node: 'Application Framework (Django / DRF / FastAPI)',
    acronyms: 'DRF · RBAC · JWT · ORM',
    detail: 'Middleware checks CORS/CSRF, verifies JWT identity, enforces RBAC permissions, validates JSON via Serializer/Pydantic, and runs business logic.',
  },
  {
    step: '06',
    node: 'Data, Cache & Async Queue Layer',
    acronyms: 'RDBMS · ACID · TTL · MQ · DLQ',
    detail: 'Checks Redis cache (TTL/LRU), commits PostgreSQL transaction (ACID/MVCC/WAL), and publishes background events to RabbitMQ/SQS.',
  },
];
