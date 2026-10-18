import type { RoadmapStageId } from '../types/atlas.ts';

export interface VisualRoadmapNode {
  id: string;
  label: string;
  subLabel: string;
  termId: string;
  variant?: 'tan' | 'indigo' | 'yellow';
}

export interface VisualRoadmapGroup {
  groupTitle?: string;
  connectorStyle?: 'dashed' | 'solid';
  calloutNote?: {
    text: string;
    actionLabel: string;
    targetSectionId: string;
  };
  nodes: VisualRoadmapNode[];
  columns?: 1 | 2;
}

export interface VisualRoadmapRow {
  id: string;
  stage: RoadmapStageId;
  spineTitle: string;
  spineSubtitle?: string;
  spineTermId: string;
  sectionDividerLabel?: string;
  leftBranch?: VisualRoadmapGroup;
  rightBranch?: VisualRoadmapGroup;
}

export const VISUAL_ROADMAP_ROWS: VisualRoadmapRow[] = [
  {
    id: 'row-intro-web',
    stage: 1,
    spineTitle: 'Introduction & Web Fundamentals',
    spineSubtitle: 'Stage 01 · Start Here',
    spineTermId: 'http',
    leftBranch: {
      groupTitle: 'Frontend & Browser Basics',
      connectorStyle: 'dashed',
      columns: 2,
      nodes: [
        {
          id: 'vn-html-css',
          label: 'HTML, CSS & SEO',
          subLabel: 'Markup, Styling & Web Vitals',
          termId: 'frontend-dev-terms',
        },
        {
          id: 'vn-dom-spa',
          label: 'DOM & SPA',
          subLabel: 'Document Object Model',
          termId: 'frontend-dom-spa-ssr-csr',
        },
        {
          id: 'vn-csr-ssr',
          label: 'SSR vs CSR & PWA',
          subLabel: 'Server vs Client Render',
          termId: 'frontend-dom-spa-ssr-csr',
        },
        {
          id: 'vn-json-format',
          label: 'JSON Serialization',
          subLabel: 'JavaScript Object Notation',
          termId: 'json',
        },
      ],
    },
    rightBranch: {
      connectorStyle: 'dashed',
      columns: 1,
      nodes: [
        {
          id: 'vn-how-internet',
          label: 'How does the Internet work? (TCP/IP & UDP)',
          subLabel: 'Transmission Control & User Datagram Protocols',
          termId: 'tcp-udp',
        },
        {
          id: 'vn-what-is-http',
          label: 'What is HTTP & HTTPS?',
          subLabel: 'Hypertext Transfer Protocol (Secure)',
          termId: 'http',
        },
        {
          id: 'vn-what-is-url',
          label: 'What is a Domain Name, URL & URI?',
          subLabel: 'Uniform Resource Locator & Identifier',
          termId: 'url',
        },
        {
          id: 'vn-what-is-dns',
          label: 'DNS and how it works?',
          subLabel: 'Domain Name System Resolution',
          termId: 'dns',
        },
      ],
    },
  },
  {
    id: 'row-backend-language',
    stage: 1,
    spineTitle: 'Pick a Backend Language (Python)',
    spineSubtitle: 'Runtime, Typing & Packaging',
    spineTermId: 'gil',
    leftBranch: {
      groupTitle: 'Python Core & Ecosystem',
      connectorStyle: 'solid',
      columns: 2,
      nodes: [
        {
          id: 'vn-python-gil',
          label: 'Python & GIL',
          subLabel: 'Global Interpreter Lock',
          termId: 'gil',
        },
        {
          id: 'vn-pep8-oop',
          label: 'PEP 8, OOP & ABC',
          subLabel: 'Classes & Interfaces',
          termId: 'pep-oop-fp',
        },
        {
          id: 'vn-pypi-venv',
          label: 'PyPI, venv & Poetry',
          subLabel: 'Packaging & Virtual Envs',
          termId: 'python-packaging-tools',
        },
        {
          id: 'vn-pydantic',
          label: 'Pydantic & Typing',
          subLabel: 'Data Parsing & Validation',
          termId: 'python-packaging-tools',
        },
        {
          id: 'vn-gc-memory',
          label: 'GC, JIT & Bytecode',
          subLabel: 'Garbage Collection',
          termId: 'gc-jit-aot',
        },
        {
          id: 'vn-sdk-cli',
          label: 'SDK, CLI & IDE',
          subLabel: 'Developer Tooling',
          termId: 'cli-gui-sdk-ide',
        },
      ],
      calloutNote: {
        text: 'Learn Python internals (especially the GIL, virtual environments, and type hints) and build small CLI/API projects before moving on.',
        actionLabel: 'Drill Stage 01 Flashcards',
        targetSectionId: 'flashcards',
      },
    },
    rightBranch: {
      groupTitle: 'Version Control & Core Formats',
      connectorStyle: 'dashed',
      columns: 2,
      nodes: [
        {
          id: 'vn-git-vcs',
          label: 'Git (VCS / SCM)',
          subLabel: 'Version Control System',
          termId: 'ci-cd-vcs-iac',
        },
        {
          id: 'vn-github-gitlab',
          label: 'GitHub & GitLab PRs',
          subLabel: 'Code Review & Branches',
          termId: 'ci-cd-vcs-iac',
        },
        {
          id: 'vn-utf8-mime',
          label: 'UTF-8, ASCII & MIME',
          subLabel: 'Encoding & Media Types',
          termId: 'utf-8-mime',
        },
        {
          id: 'vn-smtp-ssh',
          label: 'SSH, SFTP & SMTP',
          subLabel: 'Network & Mail Protocols',
          termId: 'network-protocols-smtp-sftp-ntp',
        },
      ],
    },
  },
  {
    id: 'row-relational-databases',
    stage: 3,
    spineTitle: 'Relational Databases (SQL)',
    spineSubtitle: 'Stage 03 · Data Integrity',
    spineTermId: 'rdbms-nosql',
    leftBranch: {
      groupTitle: 'RDBMS & SQL Sub-Languages',
      connectorStyle: 'dashed',
      columns: 2,
      nodes: [
        {
          id: 'vn-postgres',
          label: 'PostgreSQL & RDBMS',
          subLabel: 'Relational DB Management',
          termId: 'rdbms-nosql',
        },
        {
          id: 'vn-sql-ddl-dml',
          label: 'SQL (DDL / DML / DQL)',
          subLabel: 'Structured Query Language',
          termId: 'ddl-dml-dql',
        },
        {
          id: 'vn-acid',
          label: 'ACID Transactions',
          subLabel: 'Atomicity, Consistency, Isolation, Durability',
          termId: 'acid',
        },
        {
          id: 'vn-crud-ops',
          label: 'CRUD Operations',
          subLabel: 'Create, Read, Update, Delete',
          termId: 'crud',
        },
      ],
    },
    rightBranch: {
      connectorStyle: 'dashed',
      columns: 1,
      nodes: [
        {
          id: 'vn-migrations-norm',
          label: 'PK, FK, ERD & Normalization (1NF–3NF)',
          subLabel: 'Schema Design & Eliminating Redundancy',
          termId: 'pk-fk-erd',
        },
        {
          id: 'vn-orm',
          label: 'ORMs (Django ORM & SQLAlchemy)',
          subLabel: 'Object-Relational Mapping',
          termId: 'orm',
        },
        {
          id: 'vn-n-plus-one',
          label: 'N+1 Query Problem (select_related / prefetch_related)',
          subLabel: 'Top Backend Interview Performance Bottleneck',
          termId: 'orm',
        },
      ],
    },
  },
  {
    id: 'row-learn-apis',
    stage: 1,
    spineTitle: 'Learn about APIs',
    spineSubtitle: 'REST, DRF, FastAPI & Specs',
    spineTermId: 'api',
    leftBranch: {
      connectorStyle: 'solid',
      columns: 1,
      nodes: [
        {
          id: 'vn-api-core',
          label: 'What is an API?',
          subLabel: 'Application Programming Interface',
          termId: 'api',
        },
        {
          id: 'vn-idempotency',
          label: 'Idempotency & Safe Retries',
          subLabel: 'Idempotency-Key in Payments',
          termId: 'idempotency',
        },
      ],
      calloutNote: {
        text: 'At this point, you know enough to build production APIs. Make sure you can explain every HTTP status code (200, 201, 400, 401, 403, 404, 422, 429, 500, 502) in interviews.',
        actionLabel: 'Try Live Request Simulator',
        targetSectionId: 'home-lab',
      },
    },
    rightBranch: {
      groupTitle: 'API Styles & Python Frameworks',
      connectorStyle: 'dashed',
      columns: 2,
      nodes: [
        {
          id: 'vn-rest',
          label: 'REST / RESTful',
          subLabel: 'Representational State Transfer',
          termId: 'rest',
        },
        {
          id: 'vn-drf',
          label: 'DRF (Django REST)',
          subLabel: 'Serializers & ViewSets',
          termId: 'drf',
        },
        {
          id: 'vn-hateoas-mvc',
          label: 'HATEOAS, DTO & DAO',
          subLabel: 'API Maturity & Data Layers',
          termId: 'mvc-mvt-hateoas',
        },
        {
          id: 'vn-grpc',
          label: 'gRPC & Protobuf',
          subLabel: 'HTTP/2 Binary RPC',
          termId: 'grpc-rpc-ws-sse',
        },
        {
          id: 'vn-soap-xml',
          label: 'SOAP & XML',
          subLabel: 'Legacy Enterprise Envelopes',
          termId: 'xml-soap-svg',
        },
        {
          id: 'vn-yaml-toml',
          label: 'YAML, TOML & CSV',
          subLabel: 'Config & Data Formats',
          termId: 'protobuf-formats',
        },
      ],
    },
  },
  {
    id: 'row-auth-security',
    stage: 2,
    spineTitle: 'Authentication & Web Security',
    spineSubtitle: 'Stage 02 · Identity & Defense',
    spineTermId: 'jwt',
    leftBranch: {
      groupTitle: 'Authentication & Access Control',
      connectorStyle: 'solid',
      columns: 2,
      nodes: [
        {
          id: 'vn-jwt',
          label: 'JWT (JSON Web Token)',
          subLabel: 'Stateless Access + Refresh',
          termId: 'jwt',
        },
        {
          id: 'vn-oauth',
          label: 'OAuth 2.0 & OIDC',
          subLabel: 'Delegated Auth & SSO',
          termId: 'oauth',
        },
        {
          id: 'vn-rbac',
          label: 'RBAC, ABAC & ACL',
          subLabel: 'Role & Attribute Access Control',
          termId: 'rbac-abac-acl',
        },
        {
          id: 'vn-sso-mfa',
          label: 'SSO, MFA, TOTP & PII',
          subLabel: 'Multi-Factor & Data Privacy',
          termId: 'sso-mfa-otp-pii',
        },
      ],
    },
    rightBranch: {
      groupTitle: 'Web Security & Cryptography',
      connectorStyle: 'solid',
      columns: 2,
      nodes: [
        {
          id: 'vn-cors',
          label: 'CORS Preflight',
          subLabel: 'Cross-Origin Resource Sharing',
          termId: 'cors',
        },
        {
          id: 'vn-tls-ssl',
          label: 'HMAC, AES, RSA & SHA',
          subLabel: 'Hashing & Encryption',
          termId: 'hmac-aes-rsa',
        },
        {
          id: 'vn-csrf-xss',
          label: 'CSRF, XSS & SQLi',
          subLabel: 'Injection & Forgery Defense',
          termId: 'csrf-xss-sqli',
        },
        {
          id: 'vn-waf-ddos',
          label: 'SSRF, WAF & DDoS',
          subLabel: 'Firewall & Rate Limiting',
          termId: 'ssrf-waf-dos',
        },
        {
          id: 'vn-pki-csp',
          label: 'PKI, CA, CSP & HSTS',
          subLabel: 'Certificates & Security Headers',
          termId: 'pki-ca-csp',
          variant: 'indigo',
        },
      ],
    },
  },
  {
    id: 'row-caching-webservers',
    stage: 4,
    spineTitle: 'Caching & Web Servers',
    spineSubtitle: 'Stage 04 · WSGI, ASGI & Redis',
    spineTermId: 'wsgi-asgi',
    leftBranch: {
      groupTitle: 'Learn about Web & App Servers',
      connectorStyle: 'solid',
      columns: 2,
      nodes: [
        {
          id: 'vn-wsgi-gunicorn',
          label: 'WSGI (Gunicorn)',
          subLabel: 'Synchronous Python Gateway',
          termId: 'wsgi-asgi',
        },
        {
          id: 'vn-asgi-uvicorn',
          label: 'ASGI (Uvicorn)',
          subLabel: 'Async Python Gateway',
          termId: 'wsgi-asgi',
        },
        {
          id: 'vn-nginx-lb',
          label: 'VPC, ALB, CDN & IAM',
          subLabel: 'Load Balancing & Cloud Edge',
          termId: 'cloud-aws-terms',
        },
        {
          id: 'vn-rps-qps',
          label: 'RPS, QPS & P99 Latency',
          subLabel: 'Throughput & Tail Latency',
          termId: 'throughput-latency-metrics',
        },
      ],
    },
    rightBranch: {
      groupTitle: 'Server-Side & HTTP Caching',
      connectorStyle: 'dashed',
      columns: 2,
      nodes: [
        {
          id: 'vn-redis-cache',
          label: 'Redis & Memcached',
          subLabel: 'In-Memory Cache-Aside',
          termId: 'ttl-lru-lfu',
        },
        {
          id: 'vn-ttl-lru',
          label: 'TTL, LRU & LFU',
          subLabel: 'Expiration & Eviction Policies',
          termId: 'ttl-lru-lfu',
        },
      ],
    },
  },
  {
    id: 'row-cicd-testing',
    stage: 4,
    spineTitle: 'CI / CD & Automated Testing',
    spineSubtitle: 'Pipelines, Pytest & Quality Gates',
    spineTermId: 'ci-cd-vcs-iac',
    sectionDividerLabel: 'Production Engineering & Advanced Backend',
    leftBranch: {
      groupTitle: 'CI / CD & Release Engineering',
      connectorStyle: 'solid',
      columns: 1,
      nodes: [
        {
          id: 'vn-cicd-pipe',
          label: 'CI / CD Pipelines & IaC',
          subLabel: 'Continuous Integration, Deployment & Terraform',
          termId: 'ci-cd-vcs-iac',
        },
        {
          id: 'vn-kpi-okr',
          label: 'RFC, ADR, SemVer, LTS, KPI & OKR',
          subLabel: 'Engineering Architecture Docs & Versioning',
          termId: 'product-docs-market-terms',
        },
      ],
    },
    rightBranch: {
      groupTitle: 'Testing & Security Scanning',
      connectorStyle: 'dashed',
      columns: 1,
      nodes: [
        {
          id: 'vn-unit-int-test',
          label: 'TDD, BDD, Unit, Integration & E2E (Pytest)',
          subLabel: 'Testing Pyramid & Fixtures',
          termId: 'tdd-bdd-ut-e2e',
        },
        {
          id: 'vn-tdd-sast',
          label: 'UAT, SIT, SAST, DAST & CVE',
          subLabel: 'Security Scans & Vulnerability Tracking',
          termId: 'qa-testing-metrics',
        },
      ],
    },
  },
  {
    id: 'row-db-internals-containers',
    stage: 4,
    spineTitle: 'DB Internals & Containerization',
    spineSubtitle: 'MVCC, Indexing, Docker & K8s',
    spineTermId: 'docker-k8s',
    leftBranch: {
      groupTitle: 'More about Databases',
      connectorStyle: 'solid',
      columns: 2,
      nodes: [
        {
          id: 'vn-mvcc-wal',
          label: 'MVCC & WAL Log',
          subLabel: 'Multi-Version Concurrency',
          termId: 'mvcc-wal',
        },
        {
          id: 'vn-oltp-olap',
          label: 'OLTP, OLAP, ETL & CDC',
          subLabel: 'Transactions vs Analytics',
          termId: 'oltp-olap-etl-cdc',
        },
        {
          id: 'vn-isolation-levels',
          label: 'Isolation Levels',
          subLabel: 'Read Committed vs Serializable',
          termId: 'acid',
        },
        {
          id: 'vn-sql-tuning',
          label: 'SQL Indexing & EXPLAIN',
          subLabel: 'B-Tree & Query Plans',
          termId: 'sql',
        },
      ],
    },
    rightBranch: {
      groupTitle: 'Containerization & Orchestration',
      connectorStyle: 'solid',
      columns: 1,
      nodes: [
        {
          id: 'vn-docker',
          label: 'Docker (Containers & Multi-Stage Builds)',
          subLabel: 'Immutable Application Packaging',
          termId: 'docker-k8s',
          variant: 'indigo',
        },
        {
          id: 'vn-k8s',
          label: 'Kubernetes (K8s — Numeronym for 8 Letters)',
          subLabel: 'Pods, Deployments, Services & HPA',
          termId: 'docker-k8s',
          variant: 'indigo',
        },
        {
          id: 'vn-iac-terraform',
          label: 'Cloud Models (SaaS, PaaS, IaaS & FaaS)',
          subLabel: 'Serverless vs Managed vs Bare-Metal',
          termId: 'saas-paas-iaas-mvp',
        },
      ],
    },
  },
  {
    id: 'row-arch-queues',
    stage: 5,
    spineTitle: 'Architectural Patterns & Queues',
    spineSubtitle: 'Stage 05 · Distributed Systems',
    spineTermId: 'cqrs-eda-soa',
    leftBranch: {
      groupTitle: 'Architectural & Design Patterns',
      connectorStyle: 'dashed',
      columns: 2,
      nodes: [
        {
          id: 'vn-mvc-mvt',
          label: 'MVC vs Django MVT',
          subLabel: 'Model-View-Template',
          termId: 'mvc-mvt-hateoas',
        },
        {
          id: 'vn-solid-dry',
          label: 'SOLID, DRY, KISS & YAGNI',
          subLabel: 'Clean OOP Principles',
          termId: 'solid',
        },
        {
          id: 'vn-cqrs-eda',
          label: 'CQRS & Event-Driven',
          subLabel: 'Read/Write Split & EDA',
          termId: 'cqrs-eda-soa',
        },
        {
          id: 'vn-saga-pattern',
          label: 'Saga Pattern & DDD',
          subLabel: 'Distributed Rollbacks',
          termId: 'cqrs-eda-soa',
        },
      ],
    },
    rightBranch: {
      groupTitle: 'Message Brokers & Background Tasks',
      connectorStyle: 'solid',
      columns: 2,
      nodes: [
        {
          id: 'vn-rabbitmq-celery',
          label: 'RabbitMQ & Celery',
          subLabel: 'AMQP Task Workers',
          termId: 'mq-amqp-dlq',
        },
        {
          id: 'vn-kafka-stream',
          label: 'Apache Kafka & Pub/Sub',
          subLabel: 'Event Log Streaming',
          termId: 'mq-amqp-dlq',
        },
        {
          id: 'vn-dlq-retry',
          label: 'DLQ (Dead-Letter Queue)',
          subLabel: 'Poison Message Recovery',
          termId: 'mq-amqp-dlq',
        },
        {
          id: 'vn-bson-protobuf',
          label: 'Protobuf, Avro & BSON',
          subLabel: 'Binary Event Schemas',
          termId: 'protobuf-formats',
        },
      ],
    },
  },
  {
    id: 'row-scaling-realtime',
    stage: 5,
    spineTitle: 'Scaling, NoSQL & Real-Time Data',
    spineSubtitle: 'CAP Theorem, WebSockets & Reliability',
    spineTermId: 'cap-sla-spof',
    leftBranch: {
      groupTitle: 'NoSQL & Scaling Databases',
      connectorStyle: 'dashed',
      columns: 2,
      nodes: [
        {
          id: 'vn-cap-theorem',
          label: 'CAP Theorem',
          subLabel: 'Consistency vs Availability',
          termId: 'cap-sla-spof',
        },
        {
          id: 'vn-nosql-types',
          label: 'NoSQL (MongoDB / DynamoDB)',
          subLabel: 'Document & Key-Value DBs',
          termId: 'rdbms-nosql',
        },
        {
          id: 'vn-sharding-replicas',
          label: 'Sharding & Read Replicas',
          subLabel: 'Horizontal DB Scaling',
          termId: 'cap-sla-spof',
        },
        {
          id: 'vn-spof-ha',
          label: 'HA & Eliminating SPOF',
          subLabel: 'Single Point of Failure',
          termId: 'cap-sla-spof',
        },
      ],
    },
    rightBranch: {
      groupTitle: 'Real-Time Data & Observability',
      connectorStyle: 'dashed',
      columns: 2,
      nodes: [
        {
          id: 'vn-websockets',
          label: 'WebSockets (WS)',
          subLabel: 'Bi-Directional Full-Duplex',
          termId: 'grpc-rpc-ws-sse',
        },
        {
          id: 'vn-sse-events',
          label: 'Server-Sent Events (SSE)',
          subLabel: 'One-Way HTTP Streaming',
          termId: 'grpc-rpc-ws-sse',
        },
        {
          id: 'vn-sla-slo-sli',
          label: 'SLA, SLO, SLI, MTTR & RPO',
          subLabel: 'Reliability & Recovery Metrics',
          termId: 'cap-sla-spof',
        },
        {
          id: 'vn-rate-limit-cb',
          label: 'Throttling & Backpressure',
          subLabel: 'Graceful Degradation',
          termId: 'ssrf-waf-dos',
          variant: 'indigo',
        },
      ],
    },
  },
];
