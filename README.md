# ProScribe

**A modern, block-based content management system with drag-and-drop editing, role-based access control, and real-time form validation and intuitive block management.**

![ProScribe](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)

## Key Features

### **Block-Based Editor**
- **Heterogeneous Content Blocks**: Support for text, headings, and code blocks
- **Drag-and-Drop Reordering**: Intuitive block management with @dnd-kit
- **Real-time Validation**: Form validation with Zod schemas
- **Auto-save**: Draft persistence with status management

### **Advanced User Management**
- **Role-Based Access Control (RBAC)**: Admin, Writer, and Guest roles
- **JWT Cookie Authentication**: Secure, stateless authentication
- **Permission-Based Routing**: Protected routes with role validation
- **User Profiles**: Personalized dashboards and content management

### **Content Management**
- **Draft & Published States**: Content lifecycle management
- **Public Feed**: Discover and engage with published content
- **Search & Filtering**: Advanced content discovery
- **Real-time Statistics**: Dashboard analytics and insights

### **Modern UI/UX**
- **Mobile-Responsive Design**: Optimized for all devices
- **Smooth Animations**: Framer Motion powered interactions
- **Toast Notifications**: Non-blocking user feedback
- **Dark Mode Support**: Eye-friendly viewing experience

## Tech Stack

### Frontend
- **Framework**: React 19.2.4 with TypeScript
- **State Management**: React Hook Form + Zod validation
- **Styling**: Tailwind CSS 4.2.2 with PostCSS
- **Animations**: Framer Motion 12.38.0
- **Routing**: React Router DOM 7.14.1
- **Drag & Drop**: @dnd-kit ecosystem
- **HTTP Client**: Axios 1.15.0
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express 5.2.1
- **Database**: MongoDB with Mongoose 9.4.1
- **Authentication**: JWT with cookie-parser
- **Validation**: Zod schemas
- **Security**: bcryptjs for password hashing
- **Development**: nodemon with tsx

### Database
- **Database**: MongoDB
- **ODM**: Mongoose
- **Schema Designs**: User and Post models with relationships

## Architecture Highlights

### Block Editor Architecture
ProScribe uses a **heterogeneous block system** where content is stored as an array of typed blocks:

```typescript
interface IBlock {
  id?: string;
  type: 'heading' | 'text' | 'code';
  content: string;
  metadata?: {
    language?: string; // For code blocks
    level?: number;    // For headings
  };
}
```

### State Management Flow
1. **React Hook Form** manages the entire form state
2. **@dnd-kit** handles drag-and-drop interactions
3. **Zod** validates form data before submission
4. **MongoDB** stores blocks as a single document field

### Authentication Flow
1. **JWT Cookie**: Secure token storage in HTTP-only cookies
2. **Middleware Protection**: Route-level authentication checks
3. **Role Validation**: Permission-based access control
4. **User Context**: Global authentication state management

## Database Schema

### User Model
```typescript
interface IUser {
  name: string;
  email: string;
  password: string; // Hashed with bcrypt
  avatar?: string;
  role: 'admin' | 'writer';
}
```

### Post Model
```typescript
interface IPost {
  title: string;
  description?: string;
  author: mongoose.Types.ObjectId; // Reference to User
  blocks: IBlock[]; // Array of content blocks
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}
```

### Relationship Diagram
```
User (1) -----> (N) Post
  - author     - author (ObjectId)
  - role       - blocks (Array<IBlock>)
  - email      - status (draft|published)
```

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- MongoDB 5.0+
- npm or yarn

### Environment Setup
1. **Clone the repository**
```bash
git clone https://github.com/SouravDaroch/proscribe
cd proscribe
```

2. **Install dependencies**
```bash
# Frontend
cd frontend
npm install

# Backend  
cd ../server
npm install
```

3. **Environment Variables**
Create `.env` file in the server directory:
```env
MONGODB_URI=mongodb://localhost:27017/proscribe
JWT_ACCESS_SECRET=your-super-secret-jwt-key
NODE_ENV=development
PORT=5000
```

4. **Start the application**
```bash
# Start backend server (terminal 1)
cd server
npm run dev

# Start frontend dev server (terminal 2)  
cd frontend
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- MongoDB: mongodb://localhost:27017/proscribe

## 🚀 Live Deployment

- **Frontend (Live Demo)**: Hosted on **Vercel** *([https://proscribe-z4eg.vercel.app/](https://proscribe-z4eg.vercel.app/))
- **Backend API**: Hosted on **Render** (`https://proscribe-backend.onrender.com`)

### Demo Credentials
- **Writer**: demo.writer@test.com / DemoWriter123

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/logout` - User logout

### Posts
- `GET /api/posts` - Get user posts (with status filter)
- `GET /api/posts/public` - Get published posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **React Hook Form** - For excellent form management
- **@dnd-kit** - For intuitive drag-and-drop functionality
- **Tailwind CSS** - For rapid UI development
- **Framer Motion** - For beautiful animations
- **MongoDB** - For flexible document storage

---

**Built with passion for modern web development** | [Sourav Daroch](https://github.com/SouravDaroch/)
