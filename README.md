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
- **Testing**: Postman (API testing)
- **Code Quality Tools**: ESLint, Prettier

## 💻 Development Tools

- **ESLint**: Enforces code quality and identifies problematic patterns
- **Prettier**: Ensures consistent code formatting throughout the project
- **TypeScript**: Provides static type checking and improved IDE support
- **Git Hooks**: Pre-commit hooks to ensure code quality before commits

## 🔧 Setup and Installation

1. Clone the repository

```bash
git clone https://github.com/<username>/URLShortener.git
cd URLShortener
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

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
