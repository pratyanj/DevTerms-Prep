import type { TermEntry, QuizQuestion, TermCategory, RoadmapStageId } from '../types/atlas.ts';
import { TERMS_PART_1 } from './termsPart1.ts';
import { TERMS_PART_2 } from './termsPart2.ts';
import { TERMS_PART_3 } from './termsPart3.ts';

export const ALL_TERMS: TermEntry[] = [
  ...TERMS_PART_1,
  ...TERMS_PART_2,
  ...TERMS_PART_3,
];

export interface QuickAcronymRow {
  abbr: string;
  fullForm: string;
  meaning: string;
  category: TermCategory;
  stage: RoadmapStageId;
  isAcronym: boolean;
  deepDiveId: string;
}

export const QUICK_ACRONYM_INDEX: QuickAcronymRow[] = [
  // 1. Common Development Terms
  { abbr: 'API', fullForm: 'Application Programming Interface', meaning: 'Contract allowing software systems to communicate safely', category: 'Common Development', stage: 1, isAcronym: true, deepDiveId: 'api' },
  { abbr: 'JSON', fullForm: 'JavaScript Object Notation', meaning: 'Lightweight text format for exchanging structured data', category: 'Common Development', stage: 1, isAcronym: true, deepDiveId: 'json' },
  { abbr: 'XML', fullForm: 'Extensible Markup Language', meaning: 'Tag-based markup format for structured documents and SOAP APIs', category: 'Data Formats', stage: 1, isAcronym: true, deepDiveId: 'xml-soap-svg' },
  { abbr: 'REST', fullForm: 'Representational State Transfer', meaning: 'Stateless architectural style for designing networked APIs', category: 'Backend & APIs', stage: 1, isAcronym: true, deepDiveId: 'rest' },
  { abbr: 'HTTP', fullForm: 'Hypertext Transfer Protocol', meaning: 'Application-layer protocol for web requests and responses', category: 'Common Development', stage: 1, isAcronym: true, deepDiveId: 'http' },
  { abbr: 'HTTPS', fullForm: 'Hypertext Transfer Protocol Secure', meaning: 'HTTP encrypted using Transport Layer Security (TLS)', category: 'Common Development', stage: 1, isAcronym: true, deepDiveId: 'http' },
  { abbr: 'URL', fullForm: 'Uniform Resource Locator', meaning: 'Network address & protocol specifying where to locate a resource', category: 'Common Development', stage: 1, isAcronym: true, deepDiveId: 'url' },
  { abbr: 'URI', fullForm: 'Uniform Resource Identifier', meaning: 'String that unambiguously identifies a resource (includes URL & URN)', category: 'Common Development', stage: 1, isAcronym: true, deepDiveId: 'url' },
  { abbr: 'DNS', fullForm: 'Domain Name System', meaning: 'Translates human domain names into numerical IP addresses', category: 'Common Development', stage: 1, isAcronym: true, deepDiveId: 'dns' },
  { abbr: 'IP', fullForm: 'Internet Protocol', meaning: 'Handles addressing and routing packets across networks', category: 'Common Development', stage: 1, isAcronym: true, deepDiveId: 'tcp-udp' },
  { abbr: 'TCP', fullForm: 'Transmission Control Protocol', meaning: 'Connection-oriented, reliable, ordered byte-stream delivery', category: 'Common Development', stage: 1, isAcronym: true, deepDiveId: 'tcp-udp' },
  { abbr: 'UDP', fullForm: 'User Datagram Protocol', meaning: 'Connectionless, low-latency packet delivery without handshakes', category: 'Common Development', stage: 1, isAcronym: true, deepDiveId: 'tcp-udp' },
  { abbr: 'CRUD', fullForm: 'Create, Read, Update, Delete', meaning: 'The four fundamental persistent data lifecycle operations', category: 'Common Development', stage: 1, isAcronym: true, deepDiveId: 'crud' },
  { abbr: 'CLI', fullForm: 'Command-Line Interface', meaning: 'Text-based terminal interface for running commands and scripts', category: 'Common Development', stage: 1, isAcronym: true, deepDiveId: 'cli-gui-sdk-ide' },
  { abbr: 'GUI', fullForm: 'Graphical User Interface', meaning: 'Visual interface using windows, icons, and buttons', category: 'Common Development', stage: 1, isAcronym: true, deepDiveId: 'cli-gui-sdk-ide' },
  { abbr: 'SDK', fullForm: 'Software Development Kit', meaning: 'Installable client libraries and tools wrapping an API (e.g., boto3)', category: 'Common Development', stage: 1, isAcronym: true, deepDiveId: 'cli-gui-sdk-ide' },
  { abbr: 'IDE', fullForm: 'Integrated Development Environment', meaning: 'Code editor with integrated debugger, linter, and test runner', category: 'Common Development', stage: 1, isAcronym: true, deepDiveId: 'cli-gui-sdk-ide' },
  { abbr: 'UTF-8', fullForm: 'Unicode Transformation Format — 8-bit', meaning: 'Universal variable-width character encoding for the web', category: 'Common Development', stage: 1, isAcronym: true, deepDiveId: 'utf-8-mime' },
  { abbr: 'MIME', fullForm: 'Multipurpose Internet Mail Extensions', meaning: 'Standard format for HTTP Content-Type headers (e.g., application/json)', category: 'Common Development', stage: 1, isAcronym: true, deepDiveId: 'utf-8-mime' },

  // 2. Backend & APIs
  { abbr: 'DRF', fullForm: 'Django REST Framework', meaning: 'Premier Python toolkit for building Web APIs on top of Django', category: 'Backend & APIs', stage: 1, isAcronym: true, deepDiveId: 'drf' },
  { abbr: 'ORM', fullForm: 'Object-Relational Mapping', meaning: 'Maps relational database tables to Python classes and objects', category: 'Backend & APIs', stage: 1, isAcronym: true, deepDiveId: 'orm' },
  { abbr: 'MVC', fullForm: 'Model-View-Controller', meaning: 'Pattern separating data model, UI view, and control logic', category: 'Backend & APIs', stage: 2, isAcronym: true, deepDiveId: 'mvc-mvt-hateoas' },
  { abbr: 'MVT', fullForm: 'Model-View-Template', meaning: 'Django’s architectural pattern (Model + View controller + Template)', category: 'Backend & APIs', stage: 2, isAcronym: true, deepDiveId: 'mvc-mvt-hateoas' },
  { abbr: 'WSGI', fullForm: 'Web Server Gateway Interface', meaning: 'Standard synchronous interface between Python web servers (Gunicorn) and apps', category: 'Backend & APIs', stage: 4, isAcronym: true, deepDiveId: 'wsgi-asgi' },
  { abbr: 'ASGI', fullForm: 'Asynchronous Server Gateway Interface', meaning: 'Async Python server interface supporting FastAPI, WebSockets, and SSE', category: 'Backend & APIs', stage: 4, isAcronym: true, deepDiveId: 'wsgi-asgi' },
  { abbr: 'CORS', fullForm: 'Cross-Origin Resource Sharing', meaning: 'Browser HTTP header rules controlling cross-domain API access', category: 'Security & Auth', stage: 2, isAcronym: true, deepDiveId: 'cors' },
  { abbr: 'JWT', fullForm: 'JSON Web Token', meaning: 'Cryptographically signed stateless token (Header.Payload.Signature)', category: 'Security & Auth', stage: 2, isAcronym: true, deepDiveId: 'jwt' },
  { abbr: 'OAuth', fullForm: 'Open Authorization', meaning: 'Standard framework for delegated third-party token authorization', category: 'Security & Auth', stage: 2, isAcronym: true, deepDiveId: 'oauth' },
  { abbr: 'OIDC', fullForm: 'OpenID Connect', meaning: 'Authentication identity layer (id_token) built on top of OAuth 2.0', category: 'Security & Auth', stage: 2, isAcronym: true, deepDiveId: 'oauth' },
  { abbr: 'RPC / gRPC', fullForm: 'Remote Procedure Call / gRPC', meaning: 'High-performance binary HTTP/2 + Protobuf microservice communication', category: 'Backend & APIs', stage: 5, isAcronym: true, deepDiveId: 'grpc-rpc-ws-sse' },
  { abbr: 'WS', fullForm: 'WebSocket', meaning: 'Full-duplex persistent TCP protocol for two-way real-time messages', category: 'Backend & APIs', stage: 5, isAcronym: true, deepDiveId: 'grpc-rpc-ws-sse' },
  { abbr: 'SSE', fullForm: 'Server-Sent Events', meaning: 'Unidirectional server-to-client real-time event streaming over HTTP', category: 'Backend & APIs', stage: 5, isAcronym: true, deepDiveId: 'grpc-rpc-ws-sse' },
  { abbr: 'BFF', fullForm: 'Backend For Frontend', meaning: 'API aggregation layer customized for a specific client (e.g. mobile vs web)', category: 'Architecture & System Design', stage: 5, isAcronym: true, deepDiveId: 'cqrs-eda-soa' },
  { abbr: 'HATEOAS', fullForm: 'Hypermedia as the Engine of Application State', meaning: 'REST constraint where responses include action links for navigation', category: 'Backend & APIs', stage: 2, isAcronym: true, deepDiveId: 'mvc-mvt-hateoas' },

  // 3. Python Ecosystem
  { abbr: 'GIL', fullForm: 'Global Interpreter Lock', meaning: 'CPython mutex restricting bytecode execution to one thread per process', category: 'Python Ecosystem', stage: 4, isAcronym: true, deepDiveId: 'gil' },
  { abbr: 'PEP / PEP 8', fullForm: 'Python Enhancement Proposal (8)', meaning: 'Official Python design specification documents and style guide', category: 'Python Ecosystem', stage: 4, isAcronym: true, deepDiveId: 'pep-oop-fp' },
  { abbr: 'OOP', fullForm: 'Object-Oriented Programming', meaning: 'Programming with classes, objects, encapsulation, and polymorphism', category: 'Python Ecosystem', stage: 4, isAcronym: true, deepDiveId: 'pep-oop-fp' },
  { abbr: 'FP', fullForm: 'Functional Programming', meaning: 'Programming with pure functions, immutability, and transformations', category: 'Python Ecosystem', stage: 4, isAcronym: true, deepDiveId: 'pep-oop-fp' },
  { abbr: 'ABC', fullForm: 'Abstract Base Class', meaning: 'Python abc.ABC interface enforcing @abstractmethod implementation', category: 'Python Ecosystem', stage: 4, isAcronym: true, deepDiveId: 'pep-oop-fp' },
  { abbr: 'GC', fullForm: 'Garbage Collection', meaning: 'Automatic memory management via Reference Counting + Cyclic Collector', category: 'Python Ecosystem', stage: 4, isAcronym: true, deepDiveId: 'gc-jit-aot' },
  { abbr: 'JIT / AOT', fullForm: 'Just-In-Time / Ahead-Of-Time Compilation', meaning: 'Compiling hot code at runtime (JIT) vs compiling before execution (AOT)', category: 'Python Ecosystem', stage: 4, isAcronym: true, deepDiveId: 'gc-jit-aot' },
  { abbr: 'AST', fullForm: 'Abstract Syntax Tree', meaning: 'Tree representation of parsed Python source code structure', category: 'Python Ecosystem', stage: 4, isAcronym: true, deepDiveId: 'gc-jit-aot' },
  { abbr: 'REPL', fullForm: 'Read-Eval-Print Loop', meaning: 'Interactive Python shell environment', category: 'Python Ecosystem', stage: 4, isAcronym: true, deepDiveId: 'gc-jit-aot' },
  { abbr: 'PyPI / pip', fullForm: 'Python Package Index / Pip Installs Packages', meaning: 'Official Python package repository and package installer CLI', category: 'Python Ecosystem', stage: 1, isAcronym: true, deepDiveId: 'python-packaging-tools' },
  { abbr: 'Pydantic', fullForm: 'Not an Acronym (Python + Pedantic)', meaning: 'Type-hint driven data validation library powering FastAPI', category: 'Python Ecosystem', stage: 1, isAcronym: false, deepDiveId: 'python-packaging-tools' },

  // 4. Databases & SQL
  { abbr: 'SQL', fullForm: 'Structured Query Language', meaning: 'Declarative language for relational database queries and schemas', category: 'Databases & SQL', stage: 1, isAcronym: true, deepDiveId: 'sql' },
  { abbr: 'RDBMS / DBMS', fullForm: 'Relational Database Management System', meaning: 'Database engine organizing data into linked relational tables (PostgreSQL)', category: 'Databases & SQL', stage: 3, isAcronym: true, deepDiveId: 'rdbms-nosql' },
  { abbr: 'NoSQL', fullForm: 'Not Only SQL', meaning: 'Non-relational database engines (Key-Value, Document, Graph, Wide-Column)', category: 'Databases & SQL', stage: 3, isAcronym: true, deepDiveId: 'rdbms-nosql' },
  { abbr: 'ACID', fullForm: 'Atomicity, Consistency, Isolation, Durability', meaning: 'Four guarantees of safe, crash-resilient database transactions', category: 'Databases & SQL', stage: 3, isAcronym: true, deepDiveId: 'acid' },
  { abbr: 'PK / FK / ERD', fullForm: 'Primary Key, Foreign Key & Entity-Relationship Diagram', meaning: 'Unique row identifier (PK), cross-table link (FK), and schema diagram (ERD)', category: 'Databases & SQL', stage: 3, isAcronym: true, deepDiveId: 'pk-fk-erd' },
  { abbr: 'DDL / DML / DQL', fullForm: 'Data Definition / Manipulation / Query Language', meaning: 'SQL subsets for schemas (CREATE), writes (INSERT/UPDATE), and reads (SELECT)', category: 'Databases & SQL', stage: 3, isAcronym: true, deepDiveId: 'ddl-dml-dql' },
  { abbr: 'MVCC', fullForm: 'Multi-Version Concurrency Control', meaning: 'PostgreSQL concurrency engine where readers never block writers', category: 'Databases & SQL', stage: 3, isAcronym: true, deepDiveId: 'mvcc-wal' },
  { abbr: 'WAL', fullForm: 'Write-Ahead Logging', meaning: 'Append-only transaction log guaranteeing ACID Durability and replication', category: 'Databases & SQL', stage: 3, isAcronym: true, deepDiveId: 'mvcc-wal' },
  { abbr: 'OLTP / OLAP', fullForm: 'Online Transaction / Analytical Processing', meaning: 'Fast operational row DBs (OLTP) vs analytical columnar warehouses (OLAP)', category: 'Databases & SQL', stage: 3, isAcronym: true, deepDiveId: 'oltp-olap-etl-cdc' },
  { abbr: 'ETL / ELT / CDC', fullForm: 'Extract-Transform-Load & Change Data Capture', meaning: 'Data movement pipelines (ETL) and real-time DB event streaming (CDC)', category: 'Databases & SQL', stage: 3, isAcronym: true, deepDiveId: 'oltp-olap-etl-cdc' },

  // 5. Security & Auth
  { abbr: 'CSRF', fullForm: 'Cross-Site Request Forgery', meaning: 'Attack tricking an authenticated browser into submitting unwanted requests', category: 'Security & Auth', stage: 2, isAcronym: true, deepDiveId: 'csrf-xss-sqli' },
  { abbr: 'XSS', fullForm: 'Cross-Site Scripting', meaning: 'Attack injecting malicious executable JavaScript into web pages', category: 'Security & Auth', stage: 2, isAcronym: true, deepDiveId: 'csrf-xss-sqli' },
  { abbr: 'SQLi', fullForm: 'SQL Injection', meaning: 'Attack injecting malicious SQL commands via unsanitized input strings', category: 'Security & Auth', stage: 2, isAcronym: true, deepDiveId: 'csrf-xss-sqli' },
  { abbr: 'SSRF', fullForm: 'Server-Side Request Forgery', meaning: 'Attack tricking a backend server into fetching internal cloud/VPC URLs', category: 'Security & Auth', stage: 2, isAcronym: true, deepDiveId: 'ssrf-waf-dos' },
  { abbr: 'RBAC / ABAC / ACL', fullForm: 'Role-Based / Attribute-Based Access Control & Access Control List', meaning: 'Authorization patterns assigning permissions by Role, Attributes, or Resource List', category: 'Security & Auth', stage: 2, isAcronym: true, deepDiveId: 'rbac-abac-acl' },
  { abbr: 'HMAC / AES / RSA', fullForm: 'Hash-Based MAC, Advanced Encryption Standard & Rivest-Shamir-Adleman', meaning: 'Cryptographic integrity signature (HMAC), symmetric encryption (AES), and public-key crypto (RSA)', category: 'Security & Auth', stage: 2, isAcronym: true, deepDiveId: 'hmac-aes-rsa' },
  { abbr: 'SSO / MFA / OTP', fullForm: 'Single Sign-On, Multi-Factor Authentication & One-Time Password', meaning: 'Centralized identity login (SSO) and multi-step verification (MFA/OTP)', category: 'Security & Auth', stage: 2, isAcronym: true, deepDiveId: 'sso-mfa-otp-pii' },
  { abbr: 'PII / PHI', fullForm: 'Personally Identifiable Information / Protected Health Information', meaning: 'Sensitive personal or medical user data requiring strict privacy compliance', category: 'Security & Auth', stage: 2, isAcronym: true, deepDiveId: 'sso-mfa-otp-pii' },
  { abbr: 'PKI / CA / CSP', fullForm: 'Public Key Infrastructure, Certificate Authority & Content Security Policy', meaning: 'TLS certificate trust chain (PKI/CA) and browser XSS execution policy (CSP)', category: 'Security & Auth', stage: 2, isAcronym: true, deepDiveId: 'pki-ca-csp' },
  { abbr: 'WAF / DDoS', fullForm: 'Web Application Firewall & Distributed Denial of Service', meaning: 'Layer-7 HTTP traffic shield (WAF) protecting against botnet traffic floods (DDoS)', category: 'Security & Auth', stage: 2, isAcronym: true, deepDiveId: 'ssrf-waf-dos' },

  // 6. Caching, Messaging & Architecture
  { abbr: 'TTL / LRU / LFU', fullForm: 'Time To Live, Least Recently Used & Least Frequently Used', meaning: 'Cache expiration timer (TTL) and memory eviction algorithms (LRU/LFU)', category: 'Messaging & Caching', stage: 3, isAcronym: true, deepDiveId: 'ttl-lru-lfu' },
  { abbr: 'Idempotency', fullForm: 'Technical Term (Same Effect on Repeat)', meaning: 'Property where repeating a request produces no duplicate side effects', category: 'Backend & APIs', stage: 3, isAcronym: false, deepDiveId: 'idempotency' },
  { abbr: 'MQ / AMQP / DLQ', fullForm: 'Message Queue, Advanced Message Queuing Protocol & Dead-Letter Queue', meaning: 'Async task brokers (RabbitMQ/SQS) and failed message quarantine queues (DLQ)', category: 'Messaging & Caching', stage: 5, isAcronym: true, deepDiveId: 'mq-amqp-dlq' },
  { abbr: 'Pub/Sub & ACK', fullForm: 'Publish/Subscribe & Acknowledgment', meaning: 'One-to-many event broadcasting (Pub/Sub) and worker completion receipts (ACK)', category: 'Messaging & Caching', stage: 5, isAcronym: true, deepDiveId: 'mq-amqp-dlq' },
  { abbr: 'SOLID / DRY / KISS / YAGNI', fullForm: '5 OOP Design Principles + Don’t Repeat Yourself, Keep It Simple & You Aren’t Gonna Need It', meaning: 'Core software craftsmanship rules for modular, decoupled, maintainable code', category: 'Architecture & System Design', stage: 5, isAcronym: true, deepDiveId: 'solid' },
  { abbr: 'CAP / SPOF / HA', fullForm: 'Consistency-Availability-Partition Tolerance, Single Point of Failure & High Availability', meaning: 'Distributed system trade-offs during network partitions and fault-tolerant design', category: 'Architecture & System Design', stage: 5, isAcronym: true, deepDiveId: 'cap-sla-spof' },
  { abbr: 'SLI / SLO / SLA & MTTR', fullForm: 'Service Level Indicator / Objective / Agreement & Mean Time To Recover', meaning: 'Reliability metrics (SLI), engineering targets (SLO), contracts (SLA), and recovery speed (MTTR)', category: 'Architecture & System Design', stage: 5, isAcronym: true, deepDiveId: 'cap-sla-spof' },
  { abbr: 'CQRS / EDA / Saga', fullForm: 'Command Query Responsibility Segregation, Event-Driven Architecture & Saga', meaning: 'Splitting write/read models (CQRS) and coordinating distributed events (EDA/Saga)', category: 'Architecture & System Design', stage: 5, isAcronym: true, deepDiveId: 'cqrs-eda-soa' },
  { abbr: 'RPS / QPS / TPS / P99', fullForm: 'Requests / Queries / Transactions Per Second & 99th Percentile Latency', meaning: 'System throughput rates and worst-case 1% tail latency measurement', category: 'Messaging & Caching', stage: 5, isAcronym: true, deepDiveId: 'throughput-latency-metrics' },

  // 7. DevOps, Frontend, QA, Data Formats & Product
  { abbr: 'CI/CD / VCS / IaC', fullForm: 'Continuous Integration/Delivery, Version Control System & Infrastructure as Code', meaning: 'Automated testing/deployment pipelines, Git tracking, and Terraform cloud configs', category: 'DevOps & Cloud', stage: 4, isAcronym: true, deepDiveId: 'ci-cd-vcs-iac' },
  { abbr: 'Docker / K8s / OCI / VM', fullForm: 'Docker Containers, Kubernetes, Open Container Initiative & Virtual Machine', meaning: 'Container packaging (Docker/OCI), cluster orchestration (K8s), and virtual servers (VM)', category: 'DevOps & Cloud', stage: 4, isAcronym: true, deepDiveId: 'docker-k8s' },
  { abbr: 'VPC / IAM / CDN / TLS / SSH', fullForm: 'Virtual Private Cloud, Identity & Access Management, Content Delivery Network, TLS & SSH', meaning: 'Isolated cloud network (VPC), cloud roles (IAM), edge caching (CDN), and encrypted tunnels', category: 'DevOps & Cloud', stage: 4, isAcronym: true, deepDiveId: 'cloud-aws-terms' },
  { abbr: 'SMTP / SFTP / NTP', fullForm: 'Simple Mail Transfer Protocol, SSH File Transfer Protocol & Network Time Protocol', meaning: 'Sending emails (SMTP), encrypted file transfers (SFTP), and clock sync (NTP)', category: 'DevOps & Cloud', stage: 4, isAcronym: true, deepDiveId: 'network-protocols-smtp-sftp-ntp' },
  { abbr: 'DOM / SPA / SSR / CSR / PWA', fullForm: 'Document Object Model, Single-Page App, Server/Client-Side Rendering & Progressive Web App', meaning: 'Browser document tree, client-routed apps, server vs browser rendering, and installable web apps', category: 'Frontend & Web', stage: 5, isAcronym: true, deepDiveId: 'frontend-dom-spa-ssr-csr' },
  { abbr: 'TDD / UT / IT / E2E / SAST', fullForm: 'Test-Driven Development, Unit/Integration/End-to-End Testing & Static Security Testing', meaning: 'Writing tests first (TDD), testing pyramid layers (UT/IT/E2E), and automated security analysis', category: 'Testing & Quality', stage: 5, isAcronym: true, deepDiveId: 'tdd-bdd-ut-e2e' },
  { abbr: 'QA / UAT / RCA', fullForm: 'Quality Assurance, User Acceptance Testing & Root Cause Analysis', meaning: 'Quality processes (QA), stakeholder sign-off (UAT), and blameless post-mortems (RCA)', category: 'Testing & Quality', stage: 5, isAcronym: true, deepDiveId: 'qa-testing-metrics' },
  { abbr: 'YAML / TOML / CSV / Protobuf', fullForm: 'YAML Ain’t Markup Language, Tom’s Obvious Minimal Language, Comma-Separated Values & Protocol Buffers', meaning: 'DevOps configs (YAML), Python pyproject.toml (TOML), tabular exports (CSV), and binary schemas (Protobuf)', category: 'Data Formats', stage: 4, isAcronym: true, deepDiveId: 'protobuf-formats' },
  { abbr: 'SaaS / PaaS / IaaS / MVP / POC', fullForm: 'Software/Platform/Infrastructure as a Service, Minimum Viable Product & Proof of Concept', meaning: 'Cloud delivery models (IaaS/PaaS/SaaS) and lean product validation milestones (POC/MVP)', category: 'Product & Business', stage: 5, isAcronym: true, deepDiveId: 'saas-paas-iaas-mvp' },
  { abbr: 'PRD / SRS / ROI / MRR / ARR', fullForm: 'Product Requirements Document, Software Requirements Spec, Return on Investment & Recurring Revenue', meaning: 'Product engineering specifications (PRD/SRS) and subscription business metrics (MRR/ARR)', category: 'Product & Business', stage: 5, isAcronym: true, deepDiveId: 'product-docs-market-terms' },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    termId: 'orm',
    term: 'ORM',
    category: 'Backend & APIs',
    roadmapStage: 1,
    mode: 'full-form',
    prompt: 'What does ORM stand for, and what SQL problem happens if you access foreign-key objects inside a Python loop without prefetching?',
    options: [
      'Object-Relational Mapping — causes the N+1 Query Problem (solved with select_related / prefetch_related)',
      'Operational Request Middleware — causes HTTP 429 Too Many Requests',
      'Object Runtime Model — causes a Python Global Interpreter Lock (GIL) deadlock',
      'Ordered Relational Migration — causes a Foreign Key constraint failure',
    ],
    correctIndex: 0,
    explanation:
      'ORM stands for Object-Relational Mapping. Accessing a related foreign-key attribute inside a loop triggers 1 query for the parent list plus N individual queries for each item (the N+1 problem), solved via select_related (SQL JOIN) or prefetch_related.',
    realWorldTip: 'In interviews, always mention both select_related (for ForeignKey/OneToOne) and prefetch_related (for ManyToMany/reverse FK).',
  },
  {
    id: 'q2',
    termId: 'wsgi-asgi',
    term: 'ASGI vs WSGI',
    category: 'Backend & APIs',
    roadmapStage: 4,
    mode: 'interview',
    prompt: 'An interviewer asks: "What does ASGI stand for, and when MUST you use ASGI (Uvicorn) instead of WSGI (Gunicorn) in a Python backend?"',
    options: [
      'Asynchronous Server Gateway Interface — required for async/await concurrency, WebSockets, and Server-Sent Events (SSE)',
      'Advanced Server Gateway Integration — required whenever using PostgreSQL instead of SQLite',
      'Application Service Gateway Interface — required only when deploying to AWS Lambda',
      'Automated Synchronous Gateway Interface — required for rendering Django HTML templates',
    ],
    correctIndex: 0,
    explanation:
      'ASGI stands for Asynchronous Server Gateway Interface. Unlike synchronous WSGI, ASGI supports async/await coroutines and persistent multi-event connections like WebSockets and SSE.',
    realWorldTip: 'In production, teams often run Gunicorn as a process manager with Uvicorn ASGI worker classes: gunicorn app.asgi:application -k uvicorn.workers.UvicornWorker.',
  },
  {
    id: 'q3',
    termId: 'acid',
    term: 'ACID',
    category: 'Databases & SQL',
    roadmapStage: 3,
    mode: 'full-form',
    prompt: 'What do the four letters of ACID stand for in relational database transactions?',
    options: [
      'Atomicity, Consistency, Isolation, Durability',
      'Authentication, Caching, Indexing, Durability',
      'Availability, Consistency, Idempotency, Distribution',
      'Atomic Commit, Indexed Data, Isolated Reads, Disk Backup',
    ],
    correctIndex: 0,
    explanation:
      'ACID stands for Atomicity (all or nothing), Consistency (valid state invariants preserved), Isolation (concurrent transactions do not interfere), and Durability (committed writes survive power loss via WAL).',
    realWorldTip: 'Pair transaction.atomic() (Atomicity) with select_for_update() (Isolation) when updating account balances in Django.',
  },
  {
    id: 'q4',
    termId: 'jwt',
    term: 'JWT',
    category: 'Security & Auth',
    roadmapStage: 2,
    mode: 'scenario',
    prompt: 'A junior developer stores a user’s Social Security Number inside a JWT payload because "JWTs are signed with SECRET_KEY." Why is this a security bug?',
    options: [
      'JWT payloads are only Base64URL-encoded (not encrypted)—anyone with the token can decode and read the payload without the secret key',
      'JWTs can only store integers and timestamps, so string fields corrupt the signature',
      'Browsers automatically delete JWTs larger than 64 bytes',
      'HMAC-SHA256 signatures only protect the Header, not the Payload',
    ],
    correctIndex: 0,
    explanation:
      'A JSON Web Token (JWT) is signed (guaranteeing integrity so nobody can tamper with it), NOT encrypted. The Header and Payload are simple Base64URL strings that anyone can decode and read.',
    realWorldTip: 'Never confuse Encoding (Base64), Hashing (SHA-256/Argon2), and Encryption (AES-256).',
  },
  {
    id: 'q5',
    termId: 'cors',
    term: 'CORS',
    category: 'Security & Auth',
    roadmapStage: 2,
    mode: 'interview',
    prompt: 'What does CORS stand for, and why does an API endpoint work in Postman/curl but fail with a CORS error in a React browser app?',
    options: [
      'Cross-Origin Resource Sharing — browsers enforce the Same-Origin Policy and require Access-Control-Allow-Origin headers, whereas Postman/curl are not browsers',
      'Client-Origin Request Security — Postman automatically injects a hidden CSRF token that React lacks',
      'Cross-Object REST Serialization — React requires XML responses before converting to JSON',
      'Centralized Origin Routing Service — DNS blocks localhost ports outside Postman',
    ],
    correctIndex: 0,
    explanation:
      'CORS stands for Cross-Origin Resource Sharing. The Same-Origin Policy is a browser security defense; non-browser HTTP clients like curl, Postman, or Python requests do not enforce CORS.',
    realWorldTip: 'In Django, use django-cors-headers with explicit CORS_ALLOWED_ORIGINS rather than allowing all origins with credentials.',
  },
  {
    id: 'q6',
    termId: 'idempotency',
    term: 'Idempotency',
    category: 'Backend & APIs',
    roadmapStage: 3,
    mode: 'scenario',
    prompt: 'A customer on shaky mobile Wi-Fi taps "Pay $50" and their phone retries POST /api/payments/charge three times. How do you ensure their card is charged only once?',
    options: [
      'Implement Idempotency using a client-generated unique Idempotency-Key header stored atomically on the backend',
      'Switch the endpoint from HTTPS to UDP so duplicate packets are dropped automatically',
      'Enable CORS preflight caching for 60 seconds',
      'Increase the Gunicorn worker count so all three requests finish faster',
    ],
    correctIndex: 0,
    explanation:
      'HTTP POST is not naturally idempotent. By requiring a unique Idempotency-Key header per checkout intent and storing the key + result atomically in PostgreSQL/Redis, retries safely return the first receipt without double-charging.',
    realWorldTip: 'GET, PUT, and DELETE are naturally idempotent in HTTP; POST requires an explicit Idempotency-Key pattern.',
  },
  {
    id: 'q7',
    termId: 'gil',
    term: 'GIL',
    category: 'Python Ecosystem',
    roadmapStage: 4,
    mode: 'interview',
    prompt: 'What does GIL stand for in CPython, and when does Python release the GIL automatically?',
    options: [
      'Global Interpreter Lock — released automatically during blocking I/O operations (network requests, DB queries, disk reads)',
      'General Instruction Limiter — released automatically whenever a function uses recursion',
      'Global Instance Loader — released only when running inside a Docker container',
      'Garbage Isolation Lock — released whenever a list comprehension has more than 1,000 items',
    ],
    correctIndex: 0,
    explanation:
      'The Global Interpreter Lock (GIL) allows only one thread per process to execute Python bytecode at a time (impacting CPU-bound tasks), but CPython releases the GIL while waiting on network/disk I/O.',
    realWorldTip: 'Use asyncio/threading for I/O-bound workloads and multiprocessing/Celery/Gunicorn multi-workers for CPU-bound workloads.',
  },
  {
    id: 'q8',
    termId: 'cqrs-eda-soa',
    term: 'CQRS',
    category: 'Architecture & System Design',
    roadmapStage: 5,
    mode: 'full-form',
    prompt: 'What does CQRS stand for in system design?',
    options: [
      'Command Query Responsibility Segregation — separating state-mutating write operations from read-optimized query models',
      'Concurrent Query Replication Service — load balancing SQL SELECT queries across shards',
      'Centralized Queue Routing System — routing RabbitMQ messages to Dead-Letter Queues',
      'Cached Query Response Serialization — caching DRF Serializer output in Redis',
    ],
    correctIndex: 0,
    explanation:
      'CQRS stands for Command Query Responsibility Segregation. It separates Commands (writes that mutate state) from Queries (reads that return data), allowing each side to be optimized and scaled independently.',
    realWorldTip: 'Mention CQRS when designing systems with extreme read-to-write asymmetry (e.g., PostgreSQL for writes + Elasticsearch/Read-Replicas for complex reads).',
  },
  {
    id: 'q9',
    termId: 'rbac-abac-acl',
    term: 'RBAC vs ABAC',
    category: 'Security & Auth',
    roadmapStage: 2,
    mode: 'full-form',
    prompt: 'What do RBAC and ABAC stand for, and what HTTP status code should your API return when a logged-in user lacks permission for an action?',
    options: [
      'Role-Based Access Control & Attribute-Based Access Control — return HTTP 403 Forbidden',
      'Request-Based API Control & Account-Based Access Control — return HTTP 401 Unauthorized',
      'Resource Backend Access Config & Automated Bearer Auth Check — return HTTP 404 Not Found',
      'Role-Bound Auth Credential & Action-Bound Auth Check — return HTTP 400 Bad Request',
    ],
    correctIndex: 0,
    explanation:
      'RBAC = Role-Based Access Control; ABAC = Attribute-Based Access Control. When a user is authenticated (we know who they are) but lacks permission (Authorization failure), return HTTP 403 Forbidden (whereas 401 is for unauthenticated requests).',
    realWorldTip: 'Remember: 401 = Who are you? (Authentication failed); 403 = You aren’t allowed here! (Authorization failed).',
  },
  {
    id: 'q10',
    termId: 'mq-amqp-dlq',
    term: 'DLQ & MQ',
    category: 'Messaging & Caching',
    roadmapStage: 5,
    mode: 'scenario',
    prompt: 'In an asynchronous Celery + RabbitMQ/SQS architecture, what is a DLQ and why is it essential?',
    options: [
      'Dead-Letter Queue — isolates messages that repeatedly fail after max retries so poison-pill messages do not block the main queue forever',
      'Direct Latency Queue — prioritizes VIP customer requests ahead of standard background tasks',
      'Distributed Lock Queue — prevents two workers from reading the database at the same time',
      'Deferred Logging Queue — compresses application logs before shipping to S3',
    ],
    correctIndex: 0,
    explanation:
      'DLQ stands for Dead-Letter Queue. When a message fails processing repeatedly (e.g. after 3 retries), the broker moves it to a DLQ so engineers can inspect the root cause and replay it without clogging live workers.',
    realWorldTip: 'Always mention idempotency, exponential backoff retries, and a Dead-Letter Queue (DLQ) whenever discussing background queues in an interview.',
  },
  {
    id: 'q11',
    termId: 'ttl-lru-lfu',
    term: 'TTL & LRU',
    category: 'Messaging & Caching',
    roadmapStage: 3,
    mode: 'full-form',
    prompt: 'In Redis caching, what do TTL and LRU stand for?',
    options: [
      'Time To Live (key expiration duration) & Least Recently Used (evicts the item untouched for the longest time)',
      'Total Transaction Limit & Last Recorded Update',
      'Time To Load & Linear Resource Utilization',
      'Token Transfer Layer & Local Replica Update',
    ],
    correctIndex: 0,
    explanation:
      'TTL (Time To Live) sets an automatic expiration duration on a cached key, while LRU (Least Recently Used) evicts the least recently accessed item when cache memory fills up.',
    realWorldTip: 'An O(1) LRU cache is implemented using a Hash Map + Doubly Linked List (or collections.OrderedDict in Python).',
  },
  {
    id: 'q12',
    termId: 'cap-sla-spof',
    term: 'CAP & SLA/SLO/SLI',
    category: 'Architecture & System Design',
    roadmapStage: 5,
    mode: 'interview',
    prompt: 'What is the correct relationship between SLI, SLO, and SLA in Site Reliability Engineering (SRE)?',
    options: [
      'SLI is the measured metric (e.g. P99 latency/uptime), SLO is the internal target goal, and SLA is the external customer contract with penalties',
      'SLA is the internal metric, SLO is the database lock timeout, and SLI is the load balancer health check',
      'SLI, SLO, and SLA are three names for the exact same uptime percentage',
      'SLO is only for frontend SPAs while SLA is only for SQL databases',
    ],
    correctIndex: 0,
    explanation:
      'SLI (Service Level Indicator) is the actual measurement; SLO (Service Level Objective) is the internal target your team maintains (usually stricter than the SLA); SLA (Service Level Agreement) is the legal contract with clients.',
    realWorldTip: 'Set your internal SLO (e.g. 99.95% uptime) tighter than your external customer SLA (e.g. 99.9% uptime) so your team gets alerted before breaching the contract.',
  },
];
