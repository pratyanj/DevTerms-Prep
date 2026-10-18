import type { TermEntry } from '../types/atlas.ts';

export const TERMS_PART_3: TermEntry[] = [
  {
    id: 'xml-soap-svg',
    term: 'XML & SVG',
    fullForm: 'Extensible Markup Language & Scalable Vector Graphics',
    isAcronym: true,
    category: 'Data Formats',
    roadmapStage: 1,
    priority: 'Essential',
    shortSummary: 'Tag-based structured markup formats used in legacy enterprise SOAP APIs, banking integrations, RSS feeds, and vector icons (SVG).',
    detailedDefinition:
      '**XML (Extensible Markup Language)** is a strict, self-descriptive markup format that encodes documents using custom opening and closing tags (`<order id="101"><total>49.99</total></order>`). Before JSON became the web standard, enterprise APIs relied on XML via SOAP (Simple Object Access Protocol). **SVG (Scalable Vector Graphics)** is an XML-based vector image format for two-dimensional graphics that scales to any screen resolution without losing sharpness.',
    whereAndWhyUsed:
      'XML is still heavily used in banking systems, healthcare (HL7), government tax APIs, SAML 2.0 Enterprise Single Sign-On, and Sitemaps (`sitemap.xml`). SVG is used for crisp UI icons and interactive diagrams on web and mobile.',
    realWorldExample:
      'When integrating a Python backend with an enterprise SAML 2.0 SSO provider or legacy banking gateway, you parse XML safely using `defusedxml` (instead of standard `xml.etree`) to prevent **XXE (XML External Entity)** injection attacks.',
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What does XML stand for, and what security vulnerability must you guard against when parsing XML in Python?',
        answer:
          'XML stands for Extensible Markup Language. When parsing untrusted XML in Python, you must guard against **XXE (XML External Entity)** attacks—where a malicious XML payload defines an external entity pointing to `file:///etc/passwd` or an internal SSRF URL. Always use the `defusedxml` package in Python rather than the default `xml.etree.ElementTree` parser.',
      },
    ],
    relatedTerms: ['json', 'utf-8-mime', 'sso-mfa-otp-pii'],
  },
  {
    id: 'python-packaging-tools',
    term: 'PyPI, pip, venv, CPython & Pydantic',
    fullForm: 'Python Package Index, Package Installer for Python, Virtual Environment, C-Implementation of Python & Pydantic Validation',
    isAcronym: false,
    category: 'Python Ecosystem',
    roadmapStage: 1,
    priority: 'Critical',
    shortSummary: 'Essential Python ecosystem tools (mix of acronyms and technical names) for package management, isolated environments, runtime execution, and data validation.',
    detailedDefinition:
      'Interviewers often test if you know which Python ecosystem names are acronyms vs technical terms:\n' +
      '- **PyPI (Python Package Index)**: The official public repository (`pypi.org`) hosting third-party Python packages.\n' +
      '- **pip (Originally "Pip Installs Packages" — recursive acronym)**: Python’s default package installer (`pip install django fastapi`).\n' +
      '- **venv (Virtual Environment — shorthand)**: Standard library module (`python -m venv .venv`) that isolates project dependencies so Project A can use Django 4.2 while Project B uses Django 5.1 on the same machine.\n' +
      '- **CPython**: The default, reference implementation of the Python interpreter written in C (distinct from PyPy, Jython, or RustPython).\n' +
      '- **Pydantic (Not an acronym — derived from "Pedantic")**: The high-performance Python data validation library (powered by a Rust core in Pydantic v2) that uses Python type hints to validate and serialize JSON payloads in **FastAPI** and settings management.',
    whereAndWhyUsed:
      'Used in every single Python backend project from day one.',
    realWorldExample:
      'In FastAPI, defining a `class CreateUserRequest(BaseModel): email: EmailStr; age: int = Field(ge=18)` uses **Pydantic** to automatically validate incoming JSON, coerce types, and return a detailed 422 JSON error if `age < 18`.',
    codeSnippet: `from pydantic import BaseModel, EmailStr, Field

class OrderPayload(BaseModel):
    customer_email: EmailStr
    quantity: int = Field(gt=0, le=100)
    coupon_code: str | None = None`,
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'Which of PyPI, pip, venv, CPython, and Pydantic are acronyms, and why is venv mandatory in Python development?',
        answer:
          '`PyPI` stands for Python Package Index, and `pip` is a recursive acronym for "Pip Installs Packages". `venv` is shorthand for Virtual Environment, `CPython` means the C-language reference implementation of Python, and `Pydantic` is a portmanteau of "Python" + "Pedantic" (not an acronym). `venv` is mandatory because Python installs packages into a shared `site-packages` directory by default—without a virtual environment per project, upgrading a library for one app can break version compatibility for another app.',
      },
    ],
    relatedTerms: ['gil', 'pep-oop-fp', 'drf'],
  },
  {
    id: 'pki-ca-csp',
    term: 'PKI, CA & CSP',
    fullForm: 'Public Key Infrastructure, Certificate Authority & Content Security Policy',
    isAcronym: true,
    category: 'Security & Auth',
    roadmapStage: 2,
    priority: 'Essential',
    shortSummary: 'Web trust and browser defense systems: issuing and verifying HTTPS digital certificates (PKI & CA) and blocking unauthorized script execution in browsers (CSP).',
    detailedDefinition:
      '- **PKI (Public Key Infrastructure)** & **CA (Certificate Authority)**: The system of digital certificates, public-key cryptography, and trusted entities (CAs like Let’s Encrypt, DigiCert, AWS ACM) that verify `api.yourbank.com` actually belongs to your bank during an HTTPS/TLS handshake.\n' +
      '- **CSP (Content Security Policy)**: An HTTP response header (`Content-Security-Policy: default-src \'self\'`) sent by your backend that instructs the browser which domains are allowed to load executable scripts, styles, images, and frames—acting as the strongest second line of defense against **XSS (Cross-Site Scripting)**.',
    whereAndWhyUsed:
      'Used when configuring HTTPS certificates on Nginx/Cloudflare/Netlify and hardening security headers (`django-csp` or `helmet`).',
    realWorldExample:
      'Even if an attacker finds a way to inject `<script src="https://evil.com/steal.js"></script>` into a comment, a strict **CSP** header (`script-src \'self\'`) causes the browser to refuse to download or execute the script from `evil.com`.',
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What do PKI, CA, and CSP stand for, and how does CSP mitigate Cross-Site Scripting (XSS)?',
        answer:
          'PKI = Public Key Infrastructure; CA = Certificate Authority; CSP = Content Security Policy. A Content Security Policy (CSP) header tells the browser to block inline `<script>` tags and only execute JavaScript files loaded from explicitly allowlisted domains, preventing injected XSS payloads from executing or exfiltrating data to attacker domains.',
      },
    ],
    relatedTerms: ['http', 'csrf-xss-sqli', 'hmac-aes-rsa'],
  },
  {
    id: 'network-protocols-smtp-sftp-ntp',
    term: 'SMTP, FTP / SFTP & NTP',
    fullForm: 'Simple Mail Transfer Protocol, (SSH) File Transfer Protocol & Network Time Protocol',
    isAcronym: true,
    category: 'DevOps & Cloud',
    roadmapStage: 4,
    priority: 'Essential',
    shortSummary: 'Standard infrastructure network protocols for sending transactional emails (SMTP), transferring batch files securely (SFTP), and synchronizing server clocks (NTP).',
    detailedDefinition:
      '- **SMTP (Simple Mail Transfer Protocol)**: The standard internet protocol for sending outbound emails (password resets, order receipts) between mail servers (ports 587 TLS / 465 SSL).\n' +
      '- **FTP (File Transfer Protocol)** vs **SFTP (SSH File Transfer Protocol)**: FTP transfers files in cleartext (insecure); SFTP runs over an encrypted **SSH** connection (port 22) and is widely used in banking and enterprise B2B batch file exchanges.\n' +
      '- **NTP (Network Time Protocol)**: Synchronizes system clocks across distributed Linux servers to within milliseconds.',
    whereAndWhyUsed:
      'SMTP is configured in Django’s `EMAIL_BACKEND` (or SendGrid/AWS SES); SFTP is used with Python’s `paramiko` library for enterprise file ingestion; NTP is critical for JWT `exp` validation, TOTP 2FA codes, and distributed database timestamps.',
    realWorldExample:
      'If Server A’s clock drifts 2 minutes behind Server B because **NTP** is misconfigured, a newly issued JWT (`iat` timestamp) or 30-second **OTP** code generated on Server B may be rejected as invalid by Server A!',
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'Why does Network Time Protocol (NTP) matter for backend authentication and distributed systems?',
        answer:
          'NTP synchronizes clocks across servers. If a server’s clock drifts out of sync, time-sensitive security mechanisms like JWT expiration (`exp` / `nbf` claims), 30-second TOTP Multi-Factor Authentication codes, AWS SigV4 signed S3 URLs, and distributed log ordering will fail unexpectedly.',
      },
    ],
    relatedTerms: ['cloud-aws-terms', 'jwt', 'sso-mfa-otp-pii'],
  },
  {
    id: 'throughput-latency-metrics',
    term: 'RPS, QPS, TPS & P95 / P99',
    fullForm: 'Requests Per Second, Queries Per Second, Transactions Per Second & 95th / 99th Percentile Latency',
    isAcronym: true,
    category: 'Messaging & Caching',
    roadmapStage: 5,
    priority: 'High',
    shortSummary: 'The core load-testing and observability metrics used to size servers, benchmark APIs, and evaluate tail latency in system design interviews.',
    detailedDefinition:
      '- **RPS (Requests Per Second)**: Number of incoming HTTP/API requests hitting your load balancer or Gunicorn/Uvicorn servers each second.\n' +
      '- **QPS (Queries Per Second)**: Number of individual read/search queries executed against PostgreSQL, Redis, or Elasticsearch each second (1 HTTP request might trigger 4 database queries, so `QPS = 4 * RPS`).\n' +
      '- **TPS (Transactions Per Second)**: Number of atomic database transactions (`BEGIN ... COMMIT`, such as payment checkouts) completed per second.\n' +
      '- **P95 / P99 Latency (95th / 99th Percentile)**: Instead of looking at *average* response time (which hides slow outliers), `P99 = 240ms` means **99% of requests finish in under 240ms**, while the slowest 1% ("tail latency") take 240ms or longer.',
    whereAndWhyUsed:
      'Used in load testing (Locust, k6), capacity estimation in System Design interviews, and setting Datadog/Prometheus SLO alerts.',
    realWorldExample:
      'If an API has an average response time of 40ms, it sounds fast—until you check **P99 latency** and see `P99 = 4.2 seconds` because 1% of users with large order histories trigger an unindexed N+1 ORM query.',
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What do RPS, QPS, TPS, and P99 stand for, and why do senior engineers measure P95/P99 latency instead of Average latency?',
        answer:
          'RPS = Requests Per Second, QPS = Queries Per Second, TPS = Transactions Per Second, and P99 = 99th Percentile Latency. Average latency is misleading because if 99 requests take 10ms and 1 request takes 10,000ms (10s), the average looks like ~110ms even though your heaviest enterprise customers are experiencing 10-second freezes. P99 directly exposes those worst-case bottlenecks.',
      },
    ],
    relatedTerms: ['cap-sla-spof', 'ttl-lru-lfu', 'orm'],
  },
  {
    id: 'qa-testing-metrics',
    term: 'QA, QC, UAT, SUT, RCA & FMEA',
    fullForm: 'Quality Assurance, Quality Control, User Acceptance Testing, System Under Test, Root Cause Analysis & Failure Mode and Effects Analysis',
    isAcronym: true,
    category: 'Testing & Quality',
    roadmapStage: 5,
    priority: 'Essential',
    shortSummary: 'Engineering quality, incident post-mortem (RCA), and pre-release verification terminology used across software teams.',
    detailedDefinition:
      '- **QA (Quality Assurance)** vs **QC (Quality Control)**: QA is process-oriented (preventing defects via CI pipelines, code reviews, TDD); QC is product-oriented (finding defects in built software via manual/automated testing).\n' +
      '- **SUT (System Under Test)**: The specific module, API service, or application currently being tested.\n' +
      '- **UAT (User Acceptance Testing)**: The final staging verification phase where product owners or real clients verify the feature meets business requirements before production release.\n' +
      '- **RCA (Root Cause Analysis)**: A blameless post-mortem investigation after a production outage (often using the "5 Whys" technique) to find the underlying systemic cause and prevent recurrence.\n' +
      '- **FMEA (Failure Mode and Effects Analysis)**: Proactively analyzing how each component in a system could fail and designing fallbacks beforehand.',
    whereAndWhyUsed:
      'Used in behavioral and incident-response interview questions ("Tell me about a production bug you resolved and how you conducted the RCA").',
    realWorldExample:
      'After a 15-minute checkout outage caused by an exhausted PostgreSQL connection pool, you write a blameless **RCA** document identifying the missing connection pooler (`PgBouncer`) and add a CI regression test.',
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What does RCA stand for, and how do you structure a strong Root Cause Analysis after a production incident?',
        answer:
          'RCA stands for Root Cause Analysis. A strong engineering RCA is blameless and includes: (1) Incident Summary & Customer Impact duration, (2) Timeline of detection and mitigation (MTTR), (3) Root Cause ("5 Whys" tracing from symptom to underlying architectural gap), and (4) Concrete Action Items (automated tests, monitoring alerts, or circuit breakers) so the same class of failure cannot happen again.',
      },
    ],
    relatedTerms: ['tdd-bdd-ut-e2e', 'cap-sla-spof', 'ci-cd-vcs-iac'],
  },
  {
    id: 'frontend-dev-terms',
    term: 'HTML, CSS, JSX, TS, VDOM, HMR & AJAX',
    fullForm: 'HyperText Markup Language, Cascading Style Sheets, JavaScript XML, TypeScript, Virtual DOM, Hot Module Replacement & Asynchronous JavaScript and XML',
    isAcronym: true,
    category: 'Frontend & Web',
    roadmapStage: 5,
    priority: 'Essential',
    shortSummary: 'Frontend tooling and browser terms that come up when collaborating with frontend engineers or building full-stack Python + React apps.',
    detailedDefinition:
      '- **HTML (HyperText Markup Language)** & **CSS (Cascading Style Sheets)**: Structure and visual styling of web pages.\n' +
      '- **TS (TypeScript)** & **JSX (JavaScript XML)**: TypeScript adds static type checking to JavaScript; JSX allows writing HTML-like UI syntax directly inside React/TypeScript components (`.tsx`).\n' +
      '- **VDOM (Virtual Document Object Model)**: React’s lightweight in-memory tree representation of the UI; when state changes, React diffs the VDOM ("reconciliation") and updates only the changed DOM nodes.\n' +
      '- **HMR (Hot Module Replacement)**: Vite/Webpack feature that injects updated code modules into a running browser during development without losing component state.\n' +
      '- **AJAX (Asynchronous JavaScript and XML)**: The historical term for using `fetch()` or `XMLHttpRequest` in the browser to call backend JSON APIs in the background without reloading the page.',
    whereAndWhyUsed:
      'Used in full-stack development and API integration debugging.',
    realWorldExample:
      'When a user clicks "Bookmark Term" in a React app, an asynchronous `fetch()` (**AJAX**) call updates the backend while React updates its **VDOM** to toggle the button state without refreshing the page.',
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What does AJAX stand for, and why do we still call background fetch() requests AJAX even though we use JSON instead of XML?',
        answer:
          'AJAX stands for Asynchronous JavaScript and XML. When browsers first introduced `XMLHttpRequest` in the early 2000s, XML was the common payload format. Today, we use the modern `fetch()` API with **JSON** payloads, but the core concept—making asynchronous background HTTP requests from JavaScript without a full page reload—remains the foundation of every SPA.',
      },
    ],
    relatedTerms: ['frontend-dom-spa-ssr-csr', 'json', 'http', 'cors'],
  },
  {
    id: 'product-docs-market-terms',
    term: 'PRD, BRD, SRS, RFP, ROI, TAM/SAM/SOM & MRR/ARR',
    fullForm: 'Product/Business Requirements Document, Software Requirements Specification, Return on Investment, Total/Serviceable Addressable Market & Monthly/Annual Recurring Revenue',
    isAcronym: true,
    category: 'Product & Business',
    roadmapStage: 5,
    priority: 'Essential',
    shortSummary: 'Business, specification, and SaaS revenue acronyms that help backend engineers communicate fluently with Product Managers, CTOs, and founders.',
    detailedDefinition:
      '- **PRD (Product Requirements Document)**, **BRD (Business Requirements Document)** & **SRS (Software Requirements Specification)**: Documents written by Product Managers and Tech Leads defining user stories, acceptance criteria, API contracts, and non-functional requirements before coding starts.\n' +
      '- **RFP (Request for Proposal)** & **RFI (Request for Information)**: Formal enterprise procurement documents where a B2B client asks vendors how their software meets security, SLA, and compliance requirements.\n' +
      '- **ROI (Return on Investment)**: The business value gained relative to the engineering time and cloud cost spent.\n' +
      '- **TAM (Total Addressable Market)** -> **SAM (Serviceable Addressable Market)** -> **SOM (Serviceable Obtainable Market)**: Market sizing tiers from total global demand down to realistic near-term capture.\n' +
      '- **MRR (Monthly Recurring Revenue)** & **ARR (Annual Recurring Revenue)**: The lifeblood metrics of any subscription **B2B / B2C SaaS** company.',
    whereAndWhyUsed:
      'Used in product-minded engineering interviews ("How do you translate an ambiguous PRD into a concrete backend database schema and API spec?").',
    realWorldExample:
      'When reviewing a **PRD** for a new subscription billing tier, you identify that recurring webhooks must be idempotent so **MRR/ARR** financial reporting remains 100% accurate.',
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What do PRD, SRS, and ROI stand for, and what do you look for first when a Product Manager hands you a PRD?',
        answer:
          'PRD = Product Requirements Document; SRS = Software Requirements Specification; ROI = Return on Investment. When reviewing a PRD as a backend engineer, look first at: (1) Data model changes and edge cases, (2) API contract requirements for web/mobile clients, (3) Security & permission rules (RBAC), and (4) Non-functional scale expectations (expected RPS, latency, and failure handling).',
      },
    ],
    relatedTerms: ['saas-paas-iaas-mvp', 'cap-sla-spof'],
  },
];
