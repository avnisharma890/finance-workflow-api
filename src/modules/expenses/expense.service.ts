import { ExpenseModel } from "./expense.model";
import { ExpenseStatus } from "./expense.types";
import { canTransition } from "./expense.state";

export async function createExpense(data: any, userId: string) {
  return await ExpenseModel.create({
    ...data,
    createdBy: userId,
    status: ExpenseStatus.DRAFT,
  });
}

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

export async function approveExpense(id: string, adminId: string) {
  const expense = await ExpenseModel.findById(id);
  if (!expense) throw new Error("Expense not found");

  if (!canTransition(expense.status, ExpenseStatus.APPROVED)) {
    throw new Error("Invalid transition");
  }

  expense.status = ExpenseStatus.APPROVED;
  expense.approvedAt = new Date();
  expense.approvedBy = adminId;

  await expense.save();
  return expense;
}

export async function payExpense(id: string) {
  const expense = await ExpenseModel.findById(id);
  if (!expense) throw new Error("Expense not found");

  if (!canTransition(expense.status, ExpenseStatus.PAID)) {
    throw new Error("Invalid transition");
  }

  expense.status = ExpenseStatus.PAID;
  expense.paidAt = new Date();

  await expense.save();
  return expense;
}

