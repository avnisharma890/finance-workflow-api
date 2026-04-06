# Finance API - Architecture Design

## 📋 Overview

The Finance API is a RESTful service built with Node.js, Express, and MongoDB that implements a state machine pattern for expense management workflows. The architecture follows a modular, feature-based structure with clear separation of concerns.

## 🏗️ Architecture Principles

### 1. Modular Design
- **Feature-based organization**: Each business domain (expenses) is a self-contained module
- **Separation of concerns**: Clear distinction between controllers, services, models, and routes
- **Single responsibility**: Each file has a focused, single purpose

### 2. State Machine Pattern
- **Controlled transitions**: Expense status changes follow strict business rules
- **Validation layer**: State transitions are validated before execution
- **Audit trail**: Timestamps capture each state change

### 3. Type Safety
- **TypeScript**: Full type coverage for better developer experience
- **Interface definitions**: Clear contracts between components
- **Schema validation**: Database-level validation with Mongoose

## 🔄 Request Flow

```
Client Request → Express Router → Controller → Service → Model → MongoDB
                      ↓                ↓           ↓
                Middleware    Business Logic  Data Access
                (Auth, etc.)   Validation     Operations
```

## 📁 Module Structure

Each module follows the same pattern:

### Core Files
- **`routes.ts`**: Express route definitions and HTTP method mapping
- **`controller.ts`**: Request/response handling and input validation
- **`service.ts`**: Business logic and state management
- **`model.ts`**: Mongoose schema and database interface
- **`types.ts`**: TypeScript interfaces and enums
- **`state.ts`**: State machine logic and transition rules

### Data Flow Example (Expense Submission)

1. **Controller** (`expense.controller.ts`)
   ```typescript
   export async function submit(req: Request, res: Response) {
     const expense = await service.submitExpense(req.params.id as string);
     res.json(expense);
   }
   ```

2. **Service** (`expense.service.ts`)
   ```typescript
   export async function submitExpense(id: string) {
     const expense = await ExpenseModel.findById(id);
     if (!expense) throw new Error("Expense not found");
     
     if (!canTransition(expense.status, ExpenseStatus.SUBMITTED)) {
       throw new Error("Invalid transition");
     }
     
     expense.status = ExpenseStatus.SUBMITTED;
     expense.submittedAt = new Date();
     await expense.save();
     return expense;
   }
   ```

3. **State Machine** (`expense.state.ts`)
   ```typescript
   export function canTransition(current: ExpenseStatus, next: ExpenseStatus): boolean {
     // Validates if transition is allowed
   }
   ```

## 🗄️ Database Design

### Expense Schema
```typescript
{
  title: String (required, trimmed)
  amount: Number (required, min: 0)
  currency: String (enum: ["INR", "USD"], default: "INR")
  category: String (required)
  status: String (enum: ExpenseStatus, default: "draft", indexed)
  createdBy: ObjectId (ref: "User", required, indexed)
  approvedBy: ObjectId (ref: "User", optional)
  submittedAt: Date (optional)
  approvedAt: Date (optional)
  paidAt: Date (optional)
  notes: String (optional)
  timestamps: true
}
```

### Indexes for Performance
- `createdBy`: Fast user-specific queries
- `status`: Efficient filtering by workflow state
- Compound indexes can be added for common query patterns

## 🔄 State Machine Design

### Expense Status Flow
```
DRAFT ──────→ SUBMITTED ─────→ APPROVED ─────→ PAID
                    │               │
                    └──────→ REJECTED
```

### Transition Rules
- **DRAFT → SUBMITTED**: User submits expense for review
- **SUBMITTED → APPROVED**: Admin approves expense
- **SUBMITTED → REJECTED**: Admin rejects expense
- **APPROVED → PAID**: Finance marks expense as paid

### Benefits
- **Business rule enforcement**: Prevents invalid state changes
- **Audit capability**: Each transition is timestamped
- **Extensibility**: Easy to add new states or transitions

## 🔐 Authentication Architecture

### Current Implementation
- **Mock Authentication**: `mockAuth.ts` provides a fixed user ID
- **Type Extensions**: `express.d.ts` extends Express Request interface
- **Middleware Pattern**: Authentication runs before route handlers

### Production Ready Design
```typescript
// Future JWT implementation
interface AuthMiddleware {
  verifyToken(req: Request, res: Response, next: NextFunction): void;
  extractUser(payload: any): UserPayload;
}
```

## 🛡️ Error Handling Strategy

### Current Approach
- **Service layer**: Throws errors for business logic violations
- **Controller layer**: Passes errors to Express error handler
- **Global handler**: Can be added for consistent error responses

### Recommended Enhancements
```typescript
// Custom error classes
class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
  }
}

class StateTransitionError extends Error {
  constructor(current: string, target: string) {
    super(`Cannot transition from ${current} to ${target}`);
  }
}
```

## 🚀 Scalability Considerations

### Database Scaling
- **Connection pooling**: Mongoose handles this automatically
- **Read replicas**: For reporting-heavy workloads
- **Sharding**: Based on user ID or date ranges

### Application Scaling
- **Horizontal scaling**: Stateless design enables multiple instances
- **Load balancing**: Can be placed behind nginx or cloud load balancer
- **Caching**: Redis for frequently accessed data

### Performance Optimizations
- **Query optimization**: Proper indexing and selective field queries
- **Pagination**: For list endpoints
- **Compression**: Gzip middleware for response compression

## 🔍 Monitoring & Observability

### Recommended Additions
```typescript
// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

## 🧪 Testing Strategy

### Unit Tests
- **Service layer**: Test business logic and state transitions
- **Controller layer**: Test request/response handling
- **State machine**: Test all valid/invalid transitions

### Integration Tests
- **API endpoints**: Test full request flow
- **Database operations**: Test model interactions
- **Middleware**: Test authentication and validation

### Test Structure
```
tests/
├── unit/
│   ├── services/
│   ├── controllers/
│   └── state/
├── integration/
│   ├── routes/
│   └── database/
└── fixtures/
    └── expenses.json
```

## 🔮 Future Architecture Enhancements

### 1. Microservices Transition
- **Service decomposition**: Split expenses, users, notifications
- **API Gateway**: Central routing and authentication
- **Event-driven architecture**: Use message queues for async operations

### 2. Advanced Features
- **File storage**: Receipt attachments using S3 or similar
- **Notifications**: Email/SMS for status changes
- **Reporting**: Analytics and expense insights
- **Approval workflows**: Multi-level approval chains

### 3. Security Enhancements
- **Rate limiting**: Prevent API abuse
- **Input validation**: Comprehensive request validation
- **Audit logging**: Track all data changes
- **RBAC**: Role-based access control

## 📊 Technology Stack Rationale

### Backend Framework: Express.js
- **Mature ecosystem**: Large community and middleware support
- **Flexibility**: Unopinionated structure allows custom architecture
- **Performance**: Proven in production at scale

### Database: MongoDB with Mongoose
- **Schema flexibility**: Easy to evolve data structure
- **Rich queries**: Powerful aggregation for reporting
- **Type safety**: Mongoose provides TypeScript support

### Language: TypeScript
- **Type safety**: Catch errors at compile time
- **Better IDE support**: Improved autocomplete and refactoring
- **Documentation**: Types serve as living documentation

## 🎯 Architectural Decisions & Trade-offs

### Decision: Feature-based modules
**Pros**: Clear organization, easy to find related code, promotes cohesion
**Cons**: Can lead to code duplication if not careful

### Decision: State machine pattern
**Pros**: Business rule enforcement, clear workflow, easy to extend
**Cons**: Additional complexity, requires careful state design

### Decision: Mock authentication
**Pros**: Simplifies development, focuses on core functionality
**Cons**: Not production-ready, needs replacement

## 📝 Conclusion

The Finance API architecture emphasizes modularity, type safety, and business rule enforcement through the state machine pattern. The design is scalable, maintainable, and ready for production enhancements while keeping the current implementation simple and focused on core functionality.