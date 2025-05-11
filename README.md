# URL Shortener

A robust URL shortening service built with Node.js, Express, TypeScript, and AWS DynamoDB. This project focuses on security, clean code, readability, and performance while implementing rate limiting and caching with Redis.

## 🚀 Features

- **URL Shortening**: Convert long URLs into short, manageable links
- **User Authentication**: Register and login system
- **Rate Limiting**: Different request limits for authenticated and anonymous users
- **Caching**: Redis implementation for frequently accessed URLs
- **Security Focused**: Built with security best practices

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: AWS DynamoDB
- **Caching & Rate Limiting**: Redis
- **Version Control**: GitHub
- **Code Quality Tools**: ESLint, Prettier

## 🔧 Setup and Installation

1. Clone the repository

```bash
git clone https://github.com/<username>/URLShortener.git
cd URLShortener
```

---

2. Install dependencies

```bash
npm install
```

---

### 3. AWS Configuration

Make sure you have valid AWS credentials saved on your system. Create or edit the file:

**Linux/macOS**
`~/.aws/credentials`

**Windows (cmd or PowerShell)**
`C:\Users\<YOUR_USERNAME>\.aws\credentials`

With the following content:

```
[<YOUR_AWS_PROFILE_NAME>]
aws_access_key_id = <YOUR_AWS_ACCESS_KEY_ID>
aws_secret_access_key = <YOUR_AWS_SECRET_ACCESS_KEY>
```

---

### 4. Redis Setup

Install Redis by following the [official installation guide](https://redis.io/docs/latest/operate/oss_and_stack/install/archive/install-redis/).

> 💡 It's **highly recommended** to secure your Redis instance with a strong password, especially in production environments.
> Once enabled, make sure to add it to the `.env` file under `REDIS_PASSWORD`.

---

### 5. Generate JWT Keys

This project uses JWT with the **ES256** algorithm, so you need to generate a private/public key pair.

Run the following commands (Linux/macOS/WSL or Git Bash on Windows):

```bash
mkdir -p ./config/keys

# generate private key
openssl ecparam -genkey -name prime256v1 -noout -out ./config/keys/private.pem

# generate public key from private key
openssl ec -in ./config/keys/private.pem -pubout -out ./config/keys/public.pem
```

---

### 6. Environment Configuration

Create a `.env` file in the root of the project and add the following variables (you can see an example in `.env.example` file):

```
ENVIRONMENT=development
PORT=3000

AWS_REGION=eu-south-1
AWS_PROFILE=shortener-url

JWT_ALGORITHM=ES256
JWT_ACCESS_EXPIRY=1day
JWT_REFRESH_EXPIRY=1week
JWT_PUBLIC_KEY_PATH=./config/keys/public.pem
JWT_PRIVATE_KEY_PATH=./config/keys/private.pem

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=

URLS_PER_DAY=5
URLS_PER_DAY_LOGGED=20
```

> 🔐 Update `REDIS_PASSWORD` if you secured your Redis instance.
> 📅 For production environments, you should create a separate `.env.production` file with the appropriate production values.

---

### 7. Start the project

```bash
npm run dev
```

You’re ready to start testing the API with Postman or any other client ⚡

---

### 8. Enable URL Cache

To enable caching of frequently accessed URLs, schedule the script `./scripts/cron/url-cache.ts` to run periodically using cron (e.g., once per day). This helps keep the cache warm and improves response performance.

### 📦 Upcoming Features

- Docker support for easier deployment
- Optional MongoDB compatibility alongside DynamoDB

## 💻 Development Tools

- **ESLint**: Enforces code quality and identifies problematic patterns
- **Prettier**: Ensures consistent code formatting throughout the project
- **TypeScript**: Provides static type checking and improved IDE support
- **Git Hooks**: Pre-commit hooks to ensure code quality before commits

## 🔒 Security Features

- JWT-based authentication
- Rate limiting to prevent abuse
- Input validation and sanitization
- Secure password hashing

## 📈 Performance Considerations

- Redis caching for frequently accessed URLs
- Efficient DynamoDB data modeling
- Optimized database queries
- Response compression

## 👨‍💻 Learning Goals

This project was created with the following learning objectives:

- Gaining experience with Node.js and Express framework
- Working with AWS services, particularly DynamoDB
- Implementing Redis for caching and rate limiting
- Strengthening TypeScript skills
- Applying security best practices
- Writing clean, maintainable code

## 📄 License

MIT License

---

Created by Michele Lorenzoni (https://github.com/mlorenzoni25) - Feel free to reach out with any questions!
