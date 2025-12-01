# Social App - GraphQL Twitter Clone

A full-stack social media application built with GraphQL, Next.js, and PostgreSQL. Features include user authentication, tweet creation, and real-time feeds.

## 🚀 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **GraphQL** with **Apollo Server** - API layer
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Express.js** - Web framework

### Frontend
- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **GraphQL Codegen** - Type generation
- **React Query** - Data fetching
- **Google OAuth** - Social authentication

## 📁 Project Structure

```
social-app/
├── server/                 # Backend GraphQL API
│   ├── src/
│   │   ├── controller/     # GraphQL controllers
│   │   │   ├── user/       # User-related resolvers
│   │   │   └── tweet/      # Tweet-related resolvers
│   │   ├── utils/          # Utility functions
│   │   └── index.ts        # Server entry point
│   ├── prisma/             # Database schema & migrations
│   └── package.json
├── client/                 # Frontend Next.js app
│   ├── src/
│   │   ├── app/            # Next.js app router
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   └── graphql/        # GraphQL queries
│   └── package.json
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd social-app
```

### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
```

#### Environment Variables (.env)
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/social_app"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key"

# Server Port (optional)
PORT=8000
```

#### Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed database
npx prisma db seed
```

#### Start Backend Server
```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

### 3. Frontend Setup

```bash
cd ../client

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
```

#### Environment Variables (.env.local)
```env
# GraphQL API
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8000/graphql

# Google OAuth (get from Google Cloud Console)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

#### Start Frontend
```bash
# Development mode
npm run dev

# Build for production
npm run build
npm start
```

## 🗄️ Database Schema

### User Model
```prisma
model User {
  id           String   @id @default(cuid())
  firstName    String
  lastName     String?
  profileImage String?
  email        String   @unique
  tweets       Tweet[]  # One-to-many relation
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

### Tweet Model
```prisma
model Tweet {
  id        String   @id @default(cuid())
  content   String
  imageUrl  String?
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 📡 GraphQL API

### Queries
```graphql
# Get current authenticated user
query GetCurrentUser {
  getCurrentUser {
    id
    firstName
    lastName
    email
    profileImage
    tweets {
      id
      content
      imageUrl
      createdAt
    }
  }
}

# Get all tweets
query GetAllTweets {
  getAllTweets {
    id
    content
    imageUrl
    createdAt
    author {
      id
      firstName
      lastName
      profileImage
    }
  }
}

# Verify Google OAuth token
query VerifyGoogleToken($token: String!) {
  verifyGoogleToken(token: $token)
}
```

### Mutations
```graphql
# Create a new tweet
mutation CreateTweet($payload: CreateTweetInput!) {
  createTweet(payload: $payload) {
    id
    content
    imageUrl
    createdAt
    author {
      firstName
      lastName
    }
  }
}
```

### Input Types
```graphql
input CreateTweetInput {
  content: String!
  imageUrl: String
}
```

## 🔐 Authentication Flow

1. **Google OAuth Login**
   - User clicks "Sign in with Google"
   - Google OAuth returns ID token
   - Frontend sends token to `verifyGoogleToken` query

2. **Token Verification**
   - Backend verifies Google token
   - Creates/finds user in database
   - Returns JWT token

3. **Authenticated Requests**
   - Frontend stores JWT in localStorage
   - Sends JWT in Authorization header
   - Backend validates JWT and provides user context

## 🚦 API Endpoints

### GraphQL Endpoint
- **URL**: `http://localhost:8000/graphql`
- **Method**: POST
- **Headers**: 
  ```
  Content-Type: application/json
  Authorization: Bearer <jwt-token>
  ```

### GraphQL Playground
- **URL**: `http://localhost:8000/graphql`
- Available in development mode
- Interactive query explorer

## 🔨 Development Commands

### Backend (server/)
```bash
# Start development server
npm run dev

# Generate Prisma client
npx prisma generate

# Create new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio

# Build for production
npm run build

# Start production server
npm start
```

### Frontend (client/)
```bash
# Start development server
npm run dev

# Generate GraphQL types
npm run codegen

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📋 Features

### ✅ Implemented
- [x] User authentication with Google OAuth
- [x] JWT token-based authorization
- [x] Create and view tweets
- [x] User profiles with tweet lists
- [x] Responsive Twitter-like UI
- [x] GraphQL API with type safety
- [x] Database relationships (User ↔ Tweet)

### 🚧 Planned
- [ ] Tweet likes and retweets
- [ ] Follow/Unfollow users
- [ ] Real-time updates (WebSockets)
- [ ] Image upload for tweets
- [ ] Tweet comments/replies
- [ ] Search functionality
- [ ] Hashtag support

## 🎨 UI Components

### Main Layout
- **Sidebar**: Navigation menu with user profile
- **Main Feed**: Tweet composer and timeline
- **Right Panel**: Trending topics and suggestions

### Key Components
- `<FeedCard />` - Individual tweet display
- `<QueryProvider />` - React Query setup
- `<GoogleLogin />` - OAuth authentication

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Error
```bash
Error: P1001: Can't reach database server
```
**Solution**: Check PostgreSQL is running and connection string is correct

#### 2. JWT Token Error
```bash
Error: Please Authenticate First
```
**Solution**: Ensure JWT token is valid and sent in Authorization header

#### 3. GraphQL Schema Error
```bash
Error: Unknown type "User"
```
**Solution**: Regenerate GraphQL types with `npm run codegen`

#### 4. CORS Error
```bash
Error: Access blocked by CORS policy
```
**Solution**: Check CORS configuration in server/src/index.ts

### Reset Everything
```bash
# Backend
cd server
npx prisma migrate reset
npx prisma generate
npm run dev

# Frontend  
cd ../client
rm -rf .next
npm run codegen
npm run dev
```

## 📚 Learning Resources

- [GraphQL Documentation](https://graphql.org/learn/)
- [Apollo Server Docs](https://www.apollographql.com/docs/apollo-server/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 👥 Team

- **Developer**: [Your Name]
- **Email**: [your.email@example.com]
- **GitHub**: [your-username]

---

## 📞 Support

If you have any questions or issues, please:
1. Check the troubleshooting section above
2. Search existing issues on GitHub
3. Create a new issue with detailed description

**Happy Coding! 🚀**