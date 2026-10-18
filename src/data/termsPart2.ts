import type { TermEntry } from '../types/atlas.ts';

export const TERMS_PART_2: TermEntry[] = [
  // ==========================================
  // STAGE 4: PYTHON RUNTIME, SERVERS, DEVOPS & CLOUD
  // ==========================================
  {
    id: 'wsgi-asgi',
    term: 'WSGI & ASGI',
    fullForm: 'Web Server Gateway Interface & Asynchronous Server Gateway Interface',
    isAcronym: true,
    category: 'Backend & APIs',
    roadmapStage: 4,
    priority: 'Critical',
    shortSummary: 'The standard communication specifications between Python web servers (Gunicorn/Uvicorn) and Python web frameworks (Django/Flask/FastAPI).',
    detailedDefinition:
      'In production, you never run `python manage.py runserver`. Instead, an application server runs your Python code using one of two gateway interface standards:\n' +
      '- **WSGI (Web Server Gateway Interface, PEP 3333)**: A synchronous, single-callable interface (`def application(environ, start_response)`). Each worker handles one request at a time in a blocking fashion. Ideal for traditional synchronous Django and Flask apps running under **Gunicorn** or **uWSGI**.\n' +
      '- **ASGI (Asynchronous Server Gateway Interface)**: The modern spiritual successor to WSGI built for `async`/`await` coroutines (`async def application(scope, receive, send)`). Unlike WSGI, ASGI handles multiple incoming and outgoing asynchronous events per connection, making it mandatory for **FastAPI**, **Django Channels**, **WebSockets**, and **Server-Sent Events (SSE)** running under **Uvicorn** or **Hypercorn**.',
    whereAndWhyUsed:
      'Used in every Python production deployment (`wsgi.py` and `asgi.py` in Django; `uvicorn main:app` in FastAPI) to decouple the web server process from the application framework.',
    realWorldExample:
      'In production for a high-concurrency FastAPI or async Django service, you run `gunicorn myproject.asgi:application -k uvicorn.workers.UvicornWorker -w 4` behind an Nginx reverse proxy.',
    codeSnippet: `# Production Process Architecture:
# [Client] -> HTTPS -> [Nginx Reverse Proxy] -> Unix Socket ->
#   ├─ Synchronous Django: Gunicorn (WSGI workers) -> wsgi.py
#   └─ Async FastAPI/Django: Gunicorn + UvicornWorker (ASGI) -> asgi.py`,
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What do WSGI and ASGI stand for, and why can’t WSGI handle WebSockets?',
        answer:
          'WSGI stands for Web Server Gateway Interface, and ASGI stands for Asynchronous Server Gateway Interface. WSGI is modeled strictly around a single synchronous HTTP request-in, single response-out function call (`environ, start_response`). Once that function returns, the interaction ends. WebSockets require a persistent, long-lived, bi-directional connection where messages can arrive or be sent asynchronously at any time—which ASGI supports via its `scope`, `receive`, and `send` coroutine channels.',
      },
      {
        questionType: 'Where & Why Used',
        question: 'Why do we put Nginx in front of Gunicorn (WSGI) or Uvicorn (ASGI) in production?',
        answer:
          'Gunicorn and Uvicorn are specialized for executing Python code, not dealing with slow/untrusted internet clients. Nginx sits in front as a Reverse Proxy to handle TLS/SSL termination, serve static/media files directly from disk without waking up Python workers, buffer slow mobile uploads ("Slowloris" protection), compress responses with Gzip/Brotli, and load-balance across multiple Python containers.',
      },
    ],
    relatedTerms: ['drf', 'gil', 'ws-sse', 'docker-k8s'],
  },
  {
    id: 'gil',
    term: 'GIL',
    fullForm: 'Global Interpreter Lock',
    isAcronym: true,
    category: 'Python Ecosystem',
    roadmapStage: 4,
    priority: 'Critical',
    shortSummary: 'A mutex lock in CPython that allows only one OS thread to execute Python bytecode at a time within a single Python process.',
    detailedDefinition:
      'The Global Interpreter Lock (GIL) is a mutex inside the standard **CPython** interpreter that protects Python’s internal memory management (specifically reference counting for Garbage Collection) from thread race conditions. Because of the GIL, spawning 8 threads via `threading.Thread` inside a single Python process will **not** run CPU-heavy calculations in parallel across 8 CPU cores—only 1 thread holds the GIL at any microsecond. However, CPython **automatically releases the GIL during blocking I/O operations** (waiting on PostgreSQL network sockets, Redis queries, HTTP calls, or disk reads).',
    whereAndWhyUsed:
      'Essential for choosing the right concurrency model in Python interviews: `asyncio` or `threading` for I/O-bound tasks (web scraping, API calls, DB queries) vs `multiprocessing` or Celery workers for CPU-bound tasks (image resizing, PDF generation, ML inference).',
    realWorldExample:
      'When your Gunicorn web server runs on a 4-core Linux VM, you configure `-w 4` (or `2 * CPU + 1` worker **processes**). Because each Gunicorn worker is a separate OS process with its own independent Python interpreter and its own GIL, your backend utilizes all 4 CPU cores in true parallel!',
    codeSnippet: `# Choosing Python Concurrency around the GIL:
# 1. I/O-Bound (Network / DB / API waits -> GIL is released!):
#    Use asyncio (FastAPI / aiohttp) or concurrent.futures.ThreadPoolExecutor
# 2. CPU-Bound (Number crunching / Image / PDF / Crypto -> GIL blocks threads!):
#    Use concurrent.futures.ProcessPoolExecutor or Celery Worker Processes`,
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What does GIL stand for, why does CPython have it, and how does it affect multi-threading?',
        answer:
          'GIL stands for Global Interpreter Lock. CPython uses reference counting (`ob_refcnt`) on every Python object for memory management; without a global lock, two threads incrementing/decrementing reference counts simultaneously could corrupt memory or leak objects. Because of the GIL, multi-threading in Python cannot speed up **CPU-bound** tasks, though it still works well for **I/O-bound** tasks because the GIL is released while waiting for network or disk I/O.',
      },
      {
        questionType: 'Where & Why Used',
        question: 'How do you bypass the GIL in a production Python backend?',
        answer:
          'Three main ways: (1) Run multiple worker **processes** via Gunicorn (`--workers 4`) or `multiprocessing.Pool` so each process has its own GIL on a separate CPU core; (2) Offload heavy tasks to background Celery workers; or (3) Use C/Rust-backed libraries like NumPy, Pandas, or Polars that release the GIL while executing vectorized C/Rust code.',
      },
    ],
    relatedTerms: ['wsgi-asgi', 'gc-jit-aot', 'pep-oop-fp'],
  },
  {
    id: 'pep-oop-fp',
    term: 'PEP, PEP 8, OOP, FP & ABC',
    fullForm: 'Python Enhancement Proposal, Object-Oriented Programming, Functional Programming & Abstract Base Class',
    isAcronym: true,
    category: 'Python Ecosystem',
    roadmapStage: 4,
    priority: 'High',
    shortSummary: 'Core Python language standards and paradigms: design documents (PEP), official code style (PEP 8), class/object modeling (OOP, ABC), and pure functions (FP).',
    detailedDefinition:
      '- **PEP (Python Enhancement Proposal)**: Official design documents providing information or proposing new features for Python (e.g., PEP 8 for style guide, PEP 20 for Zen of Python, PEP 484 for Type Hints, PEP 3333 for WSGI).\n' +
      '- **PEP 8**: Python’s official style guide (`snake_case` for functions/variables, `PascalCase` for classes, `UPPER_CASE` for constants, 4-space indentation), enforced automatically by tools like `ruff`, `flake8`, and `black`.\n' +
      '- **OOP (Object-Oriented Programming)**: Structuring software around Classes and Objects using the 4 pillars: **Encapsulation**, **Abstraction**, **Inheritance**, and **Polymorphism**.\n' +
      '- **ABC (Abstract Base Class)**: Python’s `abc.ABC` and `@abstractmethod` module used to define strict interface contracts that subclasses must implement.\n' +
      '- **FP (Functional Programming)**: Writing declarative, side-effect-free pure functions using immutability, higher-order functions (`map`, `filter`, decorators), and comprehensions.',
    whereAndWhyUsed:
      'Used daily in writing clean, maintainable Python code, enforcing CI lint checks (`ruff check`), and designing extensible payment or notification interfaces using `abc.ABC`.',
    realWorldExample:
      'When building a multi-provider payment service in Python, you define an Abstract Base Class `PaymentGateway(ABC)` with `@abstractmethod def charge(...)`, and implement concrete subclasses `StripeGateway` and `RazorpayGateway` (Polymorphism + Dependency Inversion).',
    codeSnippet: `from abc import ABC, abstractmethod

class NotificationProvider(ABC):
    @abstractmethod
    def send(self, recipient: str, message: str) -> bool:
        """All subclasses MUST implement send() or instantiation raises TypeError."""
        pass

class EmailProvider(NotificationProvider):
    def send(self, recipient: str, message: str) -> bool:
        return True`,
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What do PEP, OOP, and ABC stand for in Python, and what happens if a subclass forgets to implement an @abstractmethod?',
        answer:
          'PEP = Python Enhancement Proposal; OOP = Object-Oriented Programming; ABC = Abstract Base Class. If a class inherits from `abc.ABC` and fails to implement all `@abstractmethod` methods, Python immediately raises a `TypeError` at instantiation time rather than failing silently later at runtime.',
      },
    ],
    relatedTerms: ['gil', 'solid', 'gc-jit-aot'],
  },
  {
    id: 'gc-jit-aot',
    term: 'GC, JIT, AOT, AST & REPL',
    fullForm: 'Garbage Collection, Just-In-Time, Ahead-Of-Time, Abstract Syntax Tree & Read-Eval-Print Loop',
    isAcronym: true,
    category: 'Python Ecosystem',
    roadmapStage: 4,
    priority: 'Essential',
    shortSummary: 'Compiler and runtime internals: automatic memory reclamation (GC), runtime vs build-time compilation (JIT vs AOT), code tree parsing (AST), and interactive shell (REPL).',
    detailedDefinition:
      '- **GC (Garbage Collection)**: Python reclaims unused memory using two mechanisms together: (1) immediate **Reference Counting** (when an object’s reference count hits 0, it is freed immediately) plus (2) a cyclic **Generational Garbage Collector** (`gc` module with Generations 0, 1, 2) that detects and cleans up reference cycles (`a.ref = b; b.ref = a`).\n' +
      '- **JIT (Just-In-Time Compilation)** vs **AOT (Ahead-Of-Time Compilation)**: JIT (used in PyPy, Java JVM, V8, and modern Python 3.13+ experimental JIT) compiles hot bytecode paths into native machine code at *runtime*; AOT (used in C, Rust, Go) compiles source code into native machine binaries *before* execution.\n' +
      '- **AST (Abstract Syntax Tree)**: The tree representation of Python source code structure used by linters (`ruff`), formatters (`black`), and ORMs.\n' +
      '- **REPL (Read-Eval-Print Loop)**: The interactive shell (`python` or `python manage.py shell`) that reads an expression, evaluates it, prints the result, and loops.',
    whereAndWhyUsed:
      'Asked in Python deep-dive interviews to test whether you understand how Python manages memory and executes code.',
    realWorldExample:
      'When debugging a memory leak in a long-running Celery worker, you inspect reference cycles using Python’s built-in `gc` and `tracemalloc` modules.',
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'How does Garbage Collection (GC) work in Python? Is reference counting alone enough?',
        answer:
          'Python uses **Reference Counting** as its primary memory management technique (freeing an object the instant its reference count drops to zero). However, reference counting alone cannot free **circular references** (e.g., Object A references Object B and Object B references Object A, so neither count ever hits zero). To solve this, Python also runs a generational cyclic **Garbage Collector (`gc`)** that periodically scans container objects across 3 generations (`0, 1, 2`) to break and free isolated reference cycles.',
      },
    ],
    relatedTerms: ['gil', 'pep-oop-fp', 'cli-gui-sdk-ide'],
  },
  {
    id: 'ci-cd-vcs-iac',
    term: 'CI/CD, VCS / SCM & IaC',
    fullForm: 'Continuous Integration / Continuous Delivery (Deployment), Version Control System & Infrastructure as Code',
    isAcronym: true,
    category: 'DevOps & Cloud',
    roadmapStage: 4,
    priority: 'Critical',
    shortSummary: 'Modern DevOps automation: tracking code in Git (VCS/SCM), automatically testing/shipping every commit (CI/CD), and provisioning cloud servers via code files (IaC).',
    detailedDefinition:
      '- **VCS (Version Control System) / SCM (Source Code Management)**: Systems like Git (hosted on GitHub/GitLab) that track source code history, branches, and pull requests.\n' +
      '- **CI (Continuous Integration)**: Automatically building the app and running linters (`ruff`), type checks (`mypy`), and unit/integration tests (`pytest`) on every Git push or Pull Request so broken code never merges to `main`.\n' +
      '- **CD (Continuous Delivery vs Continuous Deployment)**: **Continuous Delivery** automatically packages and deploys tested code to staging, ready for a one-click human approval to production; **Continuous Deployment** automatically deploys every green `main` commit straight to production without manual intervention.\n' +
      '- **IaC (Infrastructure as Code)**: Provisioning cloud databases, VPC networks, load balancers, and Kubernetes clusters using declarative version-controlled files (Terraform, AWS CDK, CloudFormation, Ansible) instead of clicking manually in the AWS console.',
    whereAndWhyUsed:
      'Used in every professional engineering team via GitHub Actions, GitLab CI, Netlify auto-deploys, and Terraform.',
    realWorldExample:
      'When you push a commit to GitHub, a GitHub Actions **CI** workflow spins up PostgreSQL, runs `pytest` and `ruff`, builds a Docker image, pushes it to AWS ECR, and triggers **CD** to perform a zero-downtime rolling update on ECS/Kubernetes (provisioned via **IaC** in Terraform).',
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What do CI, CD, and IaC stand for, and what is the exact difference between Continuous Delivery and Continuous Deployment?',
        answer:
          'CI = Continuous Integration; CD = Continuous Delivery or Continuous Deployment; IaC = Infrastructure as Code. Both Continuous Delivery and Continuous Deployment automate building, testing, and packaging releases, but **Continuous Delivery** stops at a manual human approval gate before deploying to production, whereas **Continuous Deployment** pushes every change that passes automated tests directly to production automatically.',
      },
    ],
    relatedTerms: ['docker-k8s', 'tdd-bdd-ut-e2e', 'cloud-aws-terms'],
  },
  {
    id: 'docker-k8s',
    term: 'Docker, K8s, OCI & VM',
    fullForm: 'Docker Containers, Kubernetes (K + 8 letters + s), Open Container Initiative & Virtual Machine',
    isAcronym: true,
    category: 'DevOps & Cloud',
    roadmapStage: 4,
    priority: 'Critical',
    shortSummary: 'Packaging and orchestrating backends: Docker bundles your Python app and dependencies into an OCI container; Kubernetes (K8s) orchestrates, scales, and heals containers.',
    detailedDefinition:
      '- **VM (Virtual Machine)**: Emulates an entire physical computer including its own full guest Operating System kernel on top of a hypervisor—heavyweight (gigabytes of RAM, slow boot).\n' +
      '- **Docker (Not an acronym) & OCI (Open Container Initiative)**: Packages your Python code, system libraries (`libpq-dev`), and virtualenv into a lightweight, isolated container image that shares the host Linux OS kernel. Starts in milliseconds and eliminates "it works on my machine" bugs.\n' +
      '- **K8s (Numeronym for Kubernetes — "K" + 8 letters "ubernete" + "s")**: An open-source container orchestration platform that manages hundreds of containers across servers—handling auto-scaling (HPA), self-healing restarts, rolling zero-downtime deployments, service discovery, and secret injection.',
    whereAndWhyUsed:
      'Used to package Django/FastAPI apps via a `Dockerfile` and `docker-compose.yml` for local development and deploy them to AWS ECS, EKS (Kubernetes), Google Cloud Run, or Fly.io.',
    realWorldExample:
      'Your `Dockerfile` starts from `python:3.12-slim`, installs `requirements.txt`, runs as a non-root user, and executes `gunicorn`. Kubernetes (`K8s`) runs 4 replicas of this container and automatically spins up 6 more if CPU exceeds 70%.',
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'Why is Kubernetes abbreviated as K8s, and what is the architectural difference between a Docker Container and a Virtual Machine (VM)?',
        answer:
          '`K8s` is a numeronym formed by taking the first letter `K`, counting the 8 letters in `"ubernete"`, and adding the final letter `s` (just like `i18n` for internationalization). A **Virtual Machine (VM)** runs a full guest OS and kernel on virtualized hardware (taking GBs of disk/RAM and minutes to boot), whereas a **Docker Container** isolates processes at the OS level (using Linux namespaces and cgroups) while sharing the host OS kernel, making it lightweight and instant to start.',
      },
    ],
    relatedTerms: ['ci-cd-vcs-iac', 'cloud-aws-terms', 'wsgi-asgi'],
  },
  {
    id: 'cloud-aws-terms',
    term: 'VPC, IAM, EC2, ECR, CDN, SSH & TLS',
    fullForm: 'Virtual Private Cloud, Identity & Access Management, Elastic Compute Cloud, Content Delivery Network, Secure Shell & Transport Layer Security',
    isAcronym: true,
    category: 'DevOps & Cloud',
    roadmapStage: 4,
    priority: 'High',
    shortSummary: 'Core cloud infrastructure acronyms: isolated private networks (VPC), cloud permissions (IAM), virtual servers (EC2), container registries (ECR), edge caching (CDN), and encrypted access (SSH/TLS).',
    detailedDefinition:
      '- **VPC (Virtual Private Cloud)**: Your isolated private virtual network in the cloud where your PostgreSQL RDS database sits in a private subnet unreachable from the public internet, while only your Load Balancer sits in the public subnet.\n' +
      '- **IAM (Identity and Access Management)**: Cloud framework for managing service roles and least-privilege permissions (e.g., granting your Django container IAM permission to upload files only to a specific S3 bucket).\n' +
      '- **EC2 (Elastic Compute Cloud) & ECR (Elastic Container Registry)**: AWS virtual servers (EC2) and private Docker image storage (ECR).\n' +
      '- **CDN (Content Delivery Network)**: Geographically distributed edge servers (Cloudflare, CloudFront, Netlify Edge) that serve static files (JS, CSS, images) from the server closest to the user.\n' +
      '- **SSH (Secure Shell) & TLS (Transport Layer Security, successor to SSL)**: Cryptographic protocols for secure remote terminal administration (SSH port 22) and encrypted web/API traffic (TLS port 443).',
    whereAndWhyUsed:
      'Used when deploying any production web app or answering cloud deployment questions.',
    realWorldExample:
      'Static React files are served globally in <15ms from a **CDN**, API requests enter the **VPC** via an HTTPS (**TLS**) Load Balancer, and your Python app running on **EC2**/ECS uses an **IAM** Role to read secrets.',
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What do VPC, IAM, and CDN stand for, and why should a production database live in a private subnet of a VPC?',
        answer:
          'VPC = Virtual Private Cloud; IAM = Identity and Access Management; CDN = Content Delivery Network. Putting PostgreSQL or Redis inside a private VPC subnet ensures the database has no public IP address and cannot be reached directly from the internet—only your backend application containers inside the same VPC security group can connect to port 5432.',
      },
    ],
    relatedTerms: ['docker-k8s', 'ci-cd-vcs-iac', 'http', 'dns'],
  },

  // ==========================================
  // STAGE 5: SYSTEM DESIGN, MESSAGING, FRONTEND, QA & PRODUCT
  // ==========================================
  {
    id: 'solid',
    term: 'SOLID, DRY, KISS & YAGNI',
    fullForm: 'Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, Dependency Inversion + Don’t Repeat Yourself, Keep It Simple & You Aren’t Gonna Need It',
    isAcronym: true,
    category: 'Architecture & System Design',
    roadmapStage: 5,
    priority: 'Critical',
    shortSummary: 'The foundational software engineering principles for writing modular, testable, decoupled, and maintainable backend code.',
    detailedDefinition:
      '**SOLID** represents five object-oriented design principles introduced by Robert C. Martin:\n' +
      '- **S — Single Responsibility Principle**: A class/module should have only one reason to change (don’t put PDF rendering, SQL queries, and Stripe API calls all inside one giant Django View!).\n' +
      '- **O — Open/Closed Principle**: Software entities should be open for extension (adding new behavior via subclasses/plugins), but closed for modification (not editing existing tested if/elif chains).\n' +
      '- **L — Liskov Substitution Principle**: Subclasses must be substitutable for their base class without breaking caller expectations.\n' +
      '- **I — Interface Segregation Principle**: Clients should not be forced to depend on bloated interfaces they don’t use.\n' +
      '- **D — Dependency Inversion Principle**: High-level business logic should depend on abstractions (interfaces/ABCs), not concrete low-level details (making unit testing with mocks easy).\n' +
      'Alongside SOLID: **DRY (Don’t Repeat Yourself)** avoids duplicating business rules; **KISS (Keep It Simple, Stupid)** favors straightforward code over clever complexity; **YAGNI (You Aren’t Gonna Need It)** avoids building speculative features before they are actually required.',
    whereAndWhyUsed:
      'Asked in almost every mid-to-senior software engineering interview and code review to evaluate how you structure services, repositories, and views.',
    realWorldExample:
      'In a Django project, instead of writing a 300-line `OrderCreateAPIView.post()` method that validates inventory, charges Stripe, generates a PDF invoice, and sends an email, you apply **Single Responsibility (S)** and **Dependency Inversion (D)** by extracting an `OrderService` that accepts an abstract `PaymentGateway` interface.',
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What does each letter of SOLID stand for, and how do you apply Single Responsibility and Dependency Inversion in a Python backend?',
        answer:
          'S = Single Responsibility, O = Open-Closed, L = Liskov Substitution, I = Interface Segregation, D = Dependency Inversion. In Python, you apply Single Responsibility by keeping Views/Controllers thin (handling only HTTP request parsing and response status codes) and moving domain logic into dedicated Service functions/classes. You apply Dependency Inversion by passing external dependencies (like a payment client or email sender) into the service via dependency injection (like FastAPI’s `Depends()`) so you can easily swap in a Mock during unit tests.',
      },
    ],
    relatedTerms: ['pep-oop-fp', 'tdd-bdd-ut-e2e', 'cqrs-eda-soa'],
  },
  {
    id: 'cap-sla-spof',
    term: 'CAP, HA, SPOF, SLA / SLO / SLI & MTTR',
    fullForm: 'Consistency-Availability-Partition Tolerance, High Availability, Single Point of Failure, Service Level Agreement/Objective/Indicator & Mean Time To Recover',
    isAcronym: true,
    category: 'Architecture & System Design',
    roadmapStage: 5,
    priority: 'Critical',
    shortSummary: 'Distributed systems reliability vocabulary: trade-offs during network splits (CAP), eliminating single failure bottlenecks (SPOF/HA), and measuring uptime guarantees (SLI/SLO/SLA, P99, MTTR).',
    detailedDefinition:
      '- **CAP Theorem**: In a distributed data store experiencing a network **Partition (P)** (nodes cannot talk to each other), you must choose between **Consistency (C)** (every read receives the most recent write or returns an error) and **Availability (A)** (every request receives a non-error response, without guaranteeing it contains the latest write).\n' +
      '- **HA (High Availability) & SPOF (Single Point of Failure)**: A SPOF is any single server, database, or switch whose failure brings down the entire system. HA eliminates SPOFs using redundant load balancers, multi-AZ containers, and database failovers.\n' +
      '- **SLI (Service Level Indicator)** -> **SLO (Service Level Objective)** -> **SLA (Service Level Agreement)**: **SLI** is the actual measured metric (e.g., `P99 latency = 180ms` or `uptime = 99.95%`); **SLO** is the internal engineering target (`uptime >= 99.9%`); **SLA** is the external legal contract with customers that includes financial penalties/credits if breached.\n' +
      '- **MTTR (Mean Time To Recover/Repair)** & **P95/P99 Latency**: Average time to restore service after an outage (MTTR), and the response latency experienced by the slowest 5% or 1% of requests (P95/P99).',
    whereAndWhyUsed:
      'Essential for every System Design interview when discussing database replication, uptime targets ("four nines" = 99.99%), and incident response.',
    realWorldExample:
      'For a banking ledger, you choose **CP (Consistency + Partition Tolerance)** so a network split never allows two ATMs to withdraw the same money. For a social media feed cache, you choose **AP (Availability + Partition Tolerance)** with eventual consistency.',
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'Explain the CAP theorem and the difference between SLI, SLO, and SLA.',
        answer:
          'CAP stands for Consistency, Availability, and Partition Tolerance. Because network partitions (P) are inevitable in distributed networks, when a partition occurs a system must trade off between Consistency (C, rejecting requests if data cannot be verified as latest) and Availability (A, serving potentially stale data). For reliability metrics: **SLI** is the raw measurement (e.g., 99.92% successful HTTP 2xx responses), **SLO** is the internal goal your SRE/backend team aims for (99.9%), and **SLA** is the formal business promise made to paying customers (e.g., refunding 10% if monthly uptime drops below 99.5%).',
      },
    ],
    relatedTerms: ['acid', 'rdbms-nosql', 'mq-amqp-dlq'],
  },
  {
    id: 'cqrs-eda-soa',
    term: 'CQRS, EDA, SOA, BFF & Saga',
    fullForm: 'Command Query Responsibility Segregation, Event-Driven Architecture, Service-Oriented Architecture, Backend For Frontend & Saga Pattern',
    isAcronym: true,
    category: 'Architecture & System Design',
    roadmapStage: 5,
    priority: 'High',
    shortSummary: 'Advanced backend architecture patterns: separating write models from read models (CQRS), decoupling services via events (EDA/Saga), and tailoring API gateways per client (BFF).',
    detailedDefinition:
      '- **CQRS (Command Query Responsibility Segregation)**: Separates **Commands** (write operations that mutate state, validated against normalized PostgreSQL tables) from **Queries** (read operations optimized for fast viewing via denormalized read replicas, Elasticsearch, or Redis views).\n' +
      '- **EDA (Event-Driven Architecture)**: Services communicate asynchronously by emitting domain events (`OrderPlaced`, `PaymentFailed`) to a broker (Kafka, RabbitMQ, SNS/SQS) rather than chaining synchronous blocking HTTP calls.\n' +
      '- **Saga Pattern (Not an acronym)**: Manages distributed transactions across multiple microservices without two-phase locking by executing a sequence of local transactions; if step 3 fails, the Saga triggers compensating rollback events (`RefundPayment`, `ReleaseInventory`) for steps 1 and 2.\n' +
      '- **BFF (Backend For Frontend)**: A dedicated thin API aggregation layer tailored specifically to the needs of a mobile app vs a desktop web app.',
    whereAndWhyUsed:
      'Used in high-scale microservices or modular monoliths where read traffic is 50x higher than write traffic (CQRS) or where an order workflow spans multiple independent services (EDA + Saga).',
    realWorldExample:
      'In an e-commerce system with 100,000 reads/sec and 500 writes/sec, writes go through Django ORM to PostgreSQL (Command model), which emits an event to update an Elasticsearch index that serves ultra-fast product search and filtering queries (Query model = CQRS).',
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What do CQRS and EDA stand for, and when is CQRS actually worth the extra complexity?',
        answer:
          'CQRS stands for Command Query Responsibility Segregation, and EDA stands for Event-Driven Architecture. CQRS is overkill for simple CRUD apps, but becomes valuable when your read and write workloads have wildly asymmetric scaling needs or data shapes—for example, complex multi-table validation on writes versus fast denormalized search/analytics aggregations on reads.',
      },
    ],
    relatedTerms: ['mq-amqp-dlq', 'cap-sla-spof', 'grpc-rpc-ws-sse'],
  },
  {
    id: 'mq-amqp-dlq',
    term: 'MQ, AMQP, Pub/Sub, DLQ & ACK/NACK',
    fullForm: 'Message Queue, Advanced Message Queuing Protocol, Publish/Subscribe, Dead-Letter Queue & Acknowledgment',
    isAcronym: true,
    category: 'Messaging & Caching',
    roadmapStage: 5,
    priority: 'Critical',
    shortSummary: 'Asynchronous background processing & message broker vocabulary used with Celery, RabbitMQ, Kafka, and AWS SQS/SNS.',
    detailedDefinition:
      '- **MQ (Message Queue)**: An asynchronous buffer (RabbitMQ, AWS SQS, Redis) where a Producer (your Django HTTP view) pushes a task message and immediately returns `202 Accepted` to the user while a background Consumer (Celery worker) processes it.\n' +
      '- **AMQP (Advanced Message Queuing Protocol)**: The binary wire protocol used by RabbitMQ for routing messages via exchanges and queues.\n' +
      '- **Pub/Sub (Publish/Subscribe)**: A messaging pattern where a publisher emits an event (`user.registered`) to a topic once, and multiple independent subscribers (Email Service, Analytics Service, Billing Service) each receive a copy.\n' +
      '- **ACK / NACK (Acknowledgment / Negative Acknowledgment)**: The consumer tells the broker `ACK` only *after* finishing the job so the message is safely deleted; if the worker crashes or sends `NACK`, the broker re-queues the message.\n' +
      '- **DLQ (Dead-Letter Queue)**: A quarantine queue where messages that repeatedly fail after `max_retries` (e.g., 3 failed attempts due to a bug or malformed payload) are moved so they don’t block the main queue forever ("poison pill" messages) and engineers can inspect/replay them.',
    whereAndWhyUsed:
      'Used in Python backends with **Celery + RabbitMQ/Redis** or **AWS SNS + SQS** whenever an action takes >200ms (sending emails, generating PDF reports, resizing video, calling slow third-party webhooks).',
    realWorldExample:
      'When a user signs up, your FastAPI/Django endpoint saves the user in 15ms, publishes a `send_welcome_email` task to RabbitMQ (AMQP), and returns HTTP 201 immediately. A Celery worker picks up the task, sends the email via SMTP, and sends an `ACK`. If the SMTP server fails 3 times, the message routes to a **DLQ** and triggers a Slack alert.',
    codeSnippet: `# Celery task with automatic retry, exponential backoff, and acks_late
from celery import shared_task

@shared_task(
    bind=True,
    acks_late=True,          # Send ACK only AFTER task succeeds
    autoretry_for=(TimeoutError,),
    retry_backoff=True,      # Exponential backoff: 2s, 4s, 8s...
    max_retries=3            # Route to DLQ after 3 failed attempts
)
def send_invoice_pdf_task(self, order_id: int):
    generate_and_email_invoice(order_id)`,
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What do MQ, AMQP, Pub/Sub, ACK, and DLQ stand for, and why is a Dead-Letter Queue (DLQ) critical in production?',
        answer:
          'MQ = Message Queue; AMQP = Advanced Message Queuing Protocol; Pub/Sub = Publish/Subscribe; ACK = Acknowledgment; DLQ = Dead-Letter Queue. Without a DLQ, a single malformed message ("poison pill") that causes a worker to crash on every attempt would be infinitely re-queued, clogging the workers in an endless retry loop and starving healthy messages. A DLQ isolates failed messages after N retries for debugging and manual replay.',
      },
      {
        questionType: 'Where & Why Used',
        question: 'What is the difference between a Point-to-Point Message Queue (like SQS) and Pub/Sub (like SNS or Kafka consumer groups)?',
        answer:
          'In a Point-to-Point Queue, each message is processed by **exactly one** worker from a pool of competing consumers (used for distributing work like Celery tasks). In Pub/Sub, a single published event is broadcast ("fanned out") to **multiple independent subscriber services** so each service can react to the same event in parallel.',
      },
    ],
    relatedTerms: ['idempotency', 'cqrs-eda-soa', 'ttl-lru-lfu'],
  },
  {
    id: 'grpc-rpc-ws-sse',
    term: 'RPC, gRPC, WebSocket (WS) & SSE',
    fullForm: 'Remote Procedure Call, gRPC Remote Procedure Calls, WebSocket & Server-Sent Events',
    isAcronym: true,
    category: 'Backend & APIs',
    roadmapStage: 5,
    priority: 'High',
    shortSummary: 'Communication protocols beyond standard REST: ultra-fast binary microservice calls (gRPC), full-duplex real-time sockets (WS), and one-way server streaming over HTTP (SSE).',
    detailedDefinition:
      '- **RPC (Remote Procedure Call) & gRPC**: Instead of modeling resources as REST nouns, RPC lets a client call a function on a remote server as if it were a local function (` OrderService.CreateOrder(request)`). **gRPC** (created by Google) uses **HTTP/2** multiplexing and compact binary **Protocol Buffers (Protobuf)**, making internal microservice-to-microservice communication up to 5–10x faster and smaller than JSON REST.\n' +
      '- **WS (WebSocket)**: A persistent, full-duplex (two-way) TCP connection where both the client and the ASGI server can push messages to each other at any millisecond with minimal framing overhead.\n' +
      '- **SSE (Server-Sent Events)**: A lightweight, unidirectional (one-way: Server -> Client) streaming connection over standard HTTP (`Content-Type: text/event-stream`) with built-in automatic browser reconnection.',
    whereAndWhyUsed:
      'Use **REST** for public client-facing APIs; use **gRPC** for high-throughput internal microservice calls; use **WebSockets** for two-way chat/multiplayer rooms; use **SSE** for one-way live updates (AI token streaming, live stock tickers, order delivery status notifications).',
    realWorldExample:
      'When streaming real-time progress notifications from a FastAPI backend to a React dashboard where the browser only needs to *listen* (not send), **SSE** (`StreamingResponse(..., media_type="text/event-stream")`) is much simpler and more firewall-friendly than a full WebSocket.',
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'When an interviewer asks "Should we use WebSockets (WS) or Server-Sent Events (SSE) for real-time notifications?", how do you decide?',
        answer:
          'Ask whether communication is **bi-directional** or **uni-directional**. If both client and server need to continuously send low-latency messages back and forth (live chat room, collaborative whiteboard, multiplayer game), choose **WebSockets**. If only the server needs to push live updates to the client (live order tracking, notification feeds, stock prices, LLM text streaming), choose **SSE (Server-Sent Events)** because it works over standard HTTP, supports automatic reconnection out of the box, and passes through corporate proxies/load balancers easily.',
      },
    ],
    relatedTerms: ['rest', 'wsgi-asgi', 'protobuf-formats'],
  },
  {
    id: 'mvc-mvt-hateoas',
    term: 'MVC, MVT & HATEOAS',
    fullForm: 'Model-View-Controller, Model-View-Template & Hypermedia as the Engine of Application State',
    isAcronym: true,
    category: 'Backend & APIs',
    roadmapStage: 2,
    priority: 'High',
    shortSummary: 'Web architectural patterns: separating data, presentation, and control logic in general frameworks (MVC), Django’s specific pattern (MVT), and self-discoverable REST links (HATEOAS).',
    detailedDefinition:
      '- **MVC (Model-View-Controller)**: The classic software pattern separating **Model** (database schema and business logic), **View** (UI presentation), and **Controller** (request routing and orchestration).\n' +
      '- **MVT (Model-View-Template)**: Django’s architectural variation on MVC: the **Model** defines database tables via Django ORM, the **View** (Python function or class in `views.py`) acts like the Controller by deciding *which* data to fetch and process, and the **Template** (or DRF Serializer in APIs) handles formatting the presentation while Django’s URL router dispatches requests.\n' +
      '- **HATEOAS (Hypermedia as the Engine of Application State)**: The highest maturity level (Richardson Maturity Model Level 3) of REST, where API JSON responses include hypermedia links (`"links": {"cancel": "/api/orders/42/cancel"}`) telling the client what actions are currently valid.',
    whereAndWhyUsed:
      'Frequently asked in Django interviews ("Is Django MVC or MVT?") and REST maturity discussions.',
    realWorldExample:
      'In Django, `models.py` is the **Model**, `views.py` is the **View** (which contains the controller logic), and `templates/*.html` (or DRF `serializers.py`) is the presentation layer.',
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What do MVC and MVT stand for, and how does Django’s MVT map to traditional MVC?',
        answer:
          'MVC = Model-View-Controller, and MVT = Model-View-Template. In Django’s MVT, the **Model** is identical to MVC’s Model (`models.py`). However, what MVC calls the **Controller** is handled by Django’s URL dispatcher (`urls.py`) + **View** (`views.py`, which decides *what* data to return), and what MVC calls the **View** is Django’s **Template** (which decides *how* to display it).',
      },
    ],
    relatedTerms: ['drf', 'rest', 'orm'],
  },
  {
    id: 'frontend-dom-spa-ssr-csr',
    term: 'DOM, SPA, SSR, CSR & PWA',
    fullForm: 'Document Object Model, Single-Page Application, Server-Side Rendering, Client-Side Rendering & Progressive Web App',
    isAcronym: true,
    category: 'Frontend & Web',
    roadmapStage: 5,
    priority: 'Essential',
    shortSummary: 'Frontend rendering architecture terms every backend developer needs to know when integrating APIs, configuring CORS, and optimizing SEO.',
    detailedDefinition:
      '- **DOM (Document Object Model)**: The browser’s in-memory tree representation of an HTML document that JavaScript manipulates.\n' +
      '- **SPA (Single-Page Application)** & **CSR (Client-Side Rendering)**: Apps (built with React/Vite or Vue) where the server sends a minimal HTML shell + JavaScript bundle once, and the browser fetches JSON from your Python REST API to render and navigate between screens without full page reloads.\n' +
      '- **SSR (Server-Side Rendering)**: HTML is rendered on a server per request (via Django Templates or Next.js) before arriving at the browser, providing faster initial content paint and strong **SEO (Search Engine Optimization)**.\n' +
      '- **PWA (Progressive Web App)**: A web app enhanced with a `manifest.json` and Service Worker so users can install it on their phone home screen and use it offline.',
    whereAndWhyUsed:
      'Important when choosing whether a feature should be rendered via Django Templates (SSR) or exposed as a JSON endpoint for a React/Netlify SPA (CSR).',
    realWorldExample:
      'This very study guide is a responsive **SPA** using **CSR** that you can deploy directly to Netlify CDN and use on your phone like a **PWA**.',
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What do SPA, SSR, and CSR stand for, and how does choosing SSR vs CSR impact your Python backend?',
        answer:
          'SPA = Single-Page Application, SSR = Server-Side Rendering, CSR = Client-Side Rendering. With SSR (like traditional Django Templates), the backend renders full HTML pages and typically uses cookie-based session authentication + CSRF tokens. With CSR/SPA (React talking to FastAPI/DRF), the backend is purely a stateless JSON API requiring CORS headers, token authentication (JWT), and separate frontend CDN hosting.',
      },
    ],
    relatedTerms: ['cors', 'http', 'rest', 'cdn'],
  },
  {
    id: 'tdd-bdd-ut-e2e',
    term: 'TDD, BDD, UT, IT, E2E & SAST/DAST',
    fullForm: 'Test-Driven Development, Behavior-Driven Development, Unit Testing, Integration Testing, End-to-End & Static/Dynamic Security Testing',
    isAcronym: true,
    category: 'Testing & Quality',
    roadmapStage: 5,
    priority: 'High',
    shortSummary: 'The software testing pyramid and security scanning vocabulary: writing tests first (TDD), testing isolated functions (UT), database/API flows (IT), full browser journeys (E2E), and automated security scans (SAST/DAST).',
    detailedDefinition:
      '- **TDD (Test-Driven Development)**: The **Red -> Green -> Refactor** cycle: (1) Write a failing automated test for the requirement (**Red**), (2) Write the minimum production code to make the test pass (**Green**), (3) Clean up and optimize the code while keeping the test green (**Refactor**).\n' +
      '- **UT (Unit Testing)** vs **IT (Integration Testing)** vs **E2E (End-to-End Testing)**: Unit tests verify a single pure function or class in milliseconds (mocking external APIs/DBs); Integration tests verify that components work together (e.g., DRF `APIClient` + test PostgreSQL database); E2E tests drive a real headless browser (Playwright) through the entire frontend + backend flow.\n' +
      '- **SAST (Static Application Security Testing)** & **DAST (Dynamic Application Security Testing)**: SAST scans source code/dependencies at rest in CI (`bandit`, `pip-audit`, `semgrep`), while DAST probes a running staging app from the outside (`OWASP ZAP`).',
    whereAndWhyUsed:
      'Used in `pytest` and Django `TestCase` suites inside CI/CD pipelines to prevent regressions and prove edge cases work.',
    realWorldExample:
      'In a `pytest` suite for a FastAPI/Django payment endpoint, you write Unit Tests for the tax calculation logic, Integration Tests with `APIClient` + `unittest.mock.patch` (mocking Stripe’s HTTP call so tests don’t charge real cards), and SAST checks via `bandit` in GitHub Actions.',
    codeSnippet: `from unittest.mock import patch
from rest_framework.test import APITestCase

class CheckoutIntegrationTest(APITestCase):
    @patch("orders.services.stripe_client.charge")
    def test_checkout_creates_paid_order(self, mock_stripe_charge):
        mock_stripe_charge.return_value = {"status": "succeeded", "id": "ch_123"}
        res = self.client.post("/api/v1/checkout/", {"item_id": 1, "qty": 2})
        self.assertEqual(res.status_code, 201)`,
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What do TDD, UT, IT, and E2E stand for, and what is the difference between a Mock and a Stub in Python testing?',
        answer:
          'TDD = Test-Driven Development, UT = Unit Testing, IT = Integration Testing, E2E = End-to-End. In testing: a **Stub** provides canned, hardcoded responses to calls made during the test (e.g., returning a fixed dictionary from a weather API so the test can proceed), whereas a **Mock** (`unittest.mock.Mock`) also records how it was called so you can assert behavior (`mock_send_email.assert_called_once_with("user@example.com")`).',
      },
    ],
    relatedTerms: ['ci-cd-vcs-iac', 'solid', 'drf'],
  },
  {
    id: 'cli-gui-sdk-ide',
    term: 'CLI, GUI, SDK & IDE',
    fullForm: 'Command-Line Interface, Graphical User Interface, Software Development Kit & Integrated Development Environment',
    isAcronym: true,
    category: 'Common Development',
    roadmapStage: 1,
    priority: 'Essential',
    shortSummary: 'Core developer tooling acronyms: terminal command tools (CLI), visual interfaces (GUI), pre-built client libraries (SDK), and code editors (IDE).',
    detailedDefinition:
      '- **CLI (Command-Line Interface)**: Text-based terminal programs (`git`, `docker`, `python manage.py`, `pytest`, or custom Python CLIs built with `click` / `typer` / `argparse`).\n' +
      '- **GUI (Graphical User Interface)**: Visual windows, buttons, and menus designed for mouse/touch interaction.\n' +
      '- **SDK (Software Development Kit)**: A bundle of libraries, type definitions, code samples, and documentation that wraps raw HTTP APIs into convenient native functions (e.g., `boto3` is the official AWS SDK for Python; `stripe-python` is the Stripe SDK).\n' +
      '- **IDE (Integrated Development Environment)**: Software combining a source code editor, debugger, test runner, and linter (PyCharm, VS Code). *(Note: in legacy computer hardware, IDE also stood for Integrated Drive Electronics).*',
    whereAndWhyUsed:
      'Used daily when integrating cloud services via Python SDKs (`boto3`) or writing custom Django management CLI commands (`python manage.py sync_orders`).',
    realWorldExample:
      'Instead of manually crafting AWS SigV4 cryptographic HTTP headers to upload a file to S3, you import the AWS Python **SDK** (`import boto3`) and call `s3_client.upload_file(...)` in one line.',
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What is the difference between an API and an SDK?',
        answer:
          'An **API (Application Programming Interface)** is the network contract/endpoints exposed by a server (e.g., Stripe’s `POST https://api.stripe.com/v1/charges` endpoint). An **SDK (Software Development Kit)** is the installable code library (`pip install stripe`) that wraps those HTTP API calls into convenient Python classes, handles retries and authentication headers automatically, and provides IDE autocomplete.',
      },
    ],
    relatedTerms: ['api', 'rest', 'pep-oop-fp'],
  },
  {
    id: 'protobuf-formats',
    term: 'YAML, TOML, CSV, BSON & Protobuf',
    fullForm: 'YAML Ain’t Markup Language, Tom’s Obvious Minimal Language, Comma-Separated Values, Binary JSON & Protocol Buffers',
    isAcronym: true,
    category: 'Data Formats',
    roadmapStage: 4,
    priority: 'Essential',
    shortSummary: 'Configuration and serialization formats across the stack: DevOps configs (YAML), Python packaging (`pyproject.toml`), tabular exports (CSV), and binary formats (BSON, Protobuf).',
    detailedDefinition:
      '- **YAML (YAML Ain’t Markup Language — a recursive acronym)**: Indentation-based human-readable format used for Docker Compose (`docker-compose.yml`), Kubernetes manifests, and GitHub Actions workflows.\n' +
      '- **TOML (Tom’s Obvious, Minimal Language)**: The standard configuration format adopted by modern Python packaging (`pyproject.toml` per PEP 518/621, used by Poetry, uv, Ruff, and Pytest).\n' +
      '- **CSV (Comma-Separated Values)**: Plain-text tabular data format streamed from backend reporting endpoints using Python’s `csv` module and Django’s `StreamingHttpResponse`.\n' +
      '- **BSON (Binary JSON)** & **Protobuf (Protocol Buffers)**: Binary-encoded serialization formats used by MongoDB (BSON) and gRPC (Protobuf) for compact size and fast parsing speed.',
    whereAndWhyUsed:
      'Used in `pyproject.toml`, CI/CD YAML files, streaming large CSV downloads without running out of RAM, and gRPC schemas.',
    realWorldExample:
      'When a user exports 200,000 order rows as a **CSV** in Django, loading all 200k rows into memory at once would crash the Gunicorn worker (`MemoryError`). Instead, you use a Python generator (`yield`) with `QuerySet.iterator(chunk_size=2000)` and `StreamingHttpResponse` to stream CSV chunks smoothly.',
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What do YAML, TOML, and CSV stand for, and how do you export a 1GB CSV file from Django/FastAPI without exhausting server RAM?',
        answer:
          'YAML = YAML Ain’t Markup Language; TOML = Tom’s Obvious, Minimal Language; CSV = Comma-Separated Values. To export a massive CSV without exhausting server RAM, use a database server-side cursor (`QuerySet.iterator(chunk_size=2000)` in Django) combined with a Python generator function (`yield`) inside a `StreamingHttpResponse(content_type="text/csv")` so only a small chunk of rows is held in memory at any moment.',
      },
    ],
    relatedTerms: ['json', 'grpc-rpc-ws-sse', 'ci-cd-vcs-iac'],
  },
  {
    id: 'saas-paas-iaas-mvp',
    term: 'SaaS, PaaS, IaaS, FaaS, MVP, POC & KPI/OKR',
    fullForm: 'Software / Platform / Infrastructure / Function as a Service, Minimum Viable Product, Proof of Concept & Key Performance Indicator',
    isAcronym: true,
    category: 'Product & Business',
    roadmapStage: 5,
    priority: 'Essential',
    shortSummary: 'Cloud service models and product engineering vocabulary used in managerial, startup, and system design interviews.',
    detailedDefinition:
      '**Cloud Service Pyramid**:\n' +
      '- **IaaS (Infrastructure as a Service)**: Cloud provider manages physical servers/networking; you manage OS, Docker, runtime, and code (AWS EC2, Google Compute Engine).\n' +
      '- **PaaS (Platform as a Service)**: Provider manages the OS, runtime, and scaling; you just push your code or container (Netlify, Render, Fly.io, Heroku, Google Cloud Run).\n' +
      '- **FaaS (Function as a Service / Serverless)**: You deploy individual event-triggered Python functions that scale to zero when idle (AWS Lambda).\n' +
      '- **SaaS (Software as a Service)**: Complete end-user software delivered over the web via subscription (Slack, Stripe Dashboard, GitHub, Notion), measured by **MRR/ARR** (Monthly/Annual Recurring Revenue) in **B2B** (Business-to-Business) or **B2C** (Business-to-Consumer) markets.\n' +
      '**Product Lifecycle**:\n' +
      '- **POC (Proof of Concept)**: Small internal prototype to verify if a technical idea is feasible.\n' +
      '- **MVP (Minimum Viable Product)**: The smallest working version of a product shipped to real users to validate core business value and track **KPIs (Key Performance Indicators)** and **OKRs (Objectives and Key Results)**.',
    whereAndWhyUsed:
      'Used in hiring manager interviews, product scoping discussions (PRD = Product Requirements Document), and choosing how to host a project (e.g., deploying a frontend SPA on Netlify PaaS/CDN and a Python API on Render/Cloud Run PaaS).',
    realWorldExample:
      'Before building a 6-month custom microservices platform, a pragmatic backend engineer builds a **POC** to verify third-party API latency, then ships a clean Django/FastAPI **MVP** hosted on a **PaaS** to validate user demand.',
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'Compare IaaS, PaaS, FaaS, and SaaS with real-world examples, and explain the difference between a POC and an MVP.',
        answer:
          'IaaS (Infrastructure as a Service, e.g. AWS EC2) gives you raw virtual machines; PaaS (Platform as a Service, e.g. Netlify, Cloud Run, Render) runs your application code/containers without you managing Linux updates; FaaS (Function as a Service, e.g. AWS Lambda) executes single functions on demand; SaaS (Software as a Service, e.g. Gmail, Slack, Jira) is finished software used by end customers. A **POC (Proof of Concept)** is an internal technical experiment answering *"Can this be built?"*, whereas an **MVP (Minimum Viable Product)** is the leanest production-ready product shipped to real customers answering *"Should this be built and will users adopt it?"*',
      },
    ],
    relatedTerms: ['cloud-aws-terms', 'docker-k8s', 'ci-cd-vcs-iac'],
  },
];
