# Finance API

A Node.js/Express REST API for managing expense workflows with approval states and multi-currency support.

## 🚀 Features

- **Expense Management**: Create, submit, approve, and track expenses
- **State Machine**: Controlled expense status transitions (Draft → Submitted → Approved → Paid/Rejected)
- **Multi-Currency**: Support for INR and USD currencies
- **User Authentication**: Mock authentication middleware (ready for real auth implementation)
- **MongoDB Integration**: Robust data persistence with Mongoose ODM
- **TypeScript**: Full type safety and better developer experience

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd finance-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your MongoDB URI
```

4. Start the development server:
```bash
npm run dev
```

The API will be running on `http://localhost:3000`

## 📁 Project Structure

```
src/
├── middleware/           # Express middleware
│   └── mockAuth.ts      # Mock authentication
├── modules/             # Feature modules
│   └── expenses/        # Expense management module
│       ├── expense.controller.ts  # Request handlers
│       ├── expense.model.ts       # Mongoose schema
│       ├── expense.routes.ts      # Express routes
│       ├── expense.service.ts     # Business logic
│       ├── expense.state.ts       # State machine logic
│       └── expense.types.ts       # TypeScript definitions
├── types/               # Global type definitions
│   └── express.d.ts     # Express type extensions
└── server.ts           # Application entry point
```

## 🔗 API Endpoints

### Expenses

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/expenses` | Create a new expense |
| POST | `/expenses/:id/submit` | Submit expense for approval |
| POST | `/expenses/:id/approve` | Approve submitted expense |
| POST | `/expenses/:id/pay` | Mark approved expense as paid |

## 💰 Expense Workflow

1. **Create**: Expense starts in `DRAFT` status
2. **Submit**: Transitions to `SUBMITTED` for review
3. **Approve/Reject**: Admin can approve or reject submitted expenses
4. **Pay**: Approved expenses can be marked as paid

### Valid State Transitions

- DRAFT → SUBMITTED
- SUBMITTED → APPROVED
- SUBMITTED → REJECTED
- APPROVED → PAID

## 📊 Data Models

### Expense

```typescript
{
  title: string;
  amount: number;
  currency: "INR" | "USD";
  category: string;
  status: "draft" | "submitted" | "approved" | "paid" | "rejected";
  createdBy: ObjectId;
  approvedBy?: ObjectId;
  submittedAt?: Date;
  approvedAt?: Date;
  paidAt?: Date;
  notes?: string;
}
```

## 🔧 Development

### Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Compile TypeScript to JavaScript
npm start        # Start production server
npm test         # Run tests (when implemented)
```

### Environment Variables

```env
MONGO_URI=mongodb://127.0.0.1:27017/finance
PORT=3000
NODE_ENV=development
```

## 🛡️ Authentication

Currently uses mock authentication that assigns a fixed user ID. In production, replace `mockAuth.ts` with proper JWT or OAuth middleware.

## 📝 Example Usage

### Create an Expense

```bash
curl -X POST http://localhost:3000/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Office Supplies",
    "amount": 1500,
    "currency": "INR",
    "category": "Office",
    "notes": "Pens, papers, and folders"
  }'
```

### Submit for Approval

```bash
curl -X POST http://localhost:3000/expenses/{expenseId}/submit
```

### Approve Expense

```bash
curl -X POST http://localhost:3000/expenses/{expenseId}/approve
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🔮 Future Enhancements

- Real authentication system (JWT/OAuth)
- User management endpoints
- Expense categories management
- Reporting and analytics
- File attachments for receipts
- Email notifications
- Role-based access control
- Audit logging