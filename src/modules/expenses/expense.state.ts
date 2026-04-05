import { ExpenseStatus } from "./expense.types";

export function canTransition(
  current: ExpenseStatus,
  next: ExpenseStatus
): boolean {
  if (current === ExpenseStatus.DRAFT && next === ExpenseStatus.SUBMITTED)
    return true;

  if (current === ExpenseStatus.SUBMITTED && next === ExpenseStatus.APPROVED)
    return true;

  if (current === ExpenseStatus.SUBMITTED && next === ExpenseStatus.REJECTED)
    return true;

  if (current === ExpenseStatus.APPROVED && next === ExpenseStatus.PAID)
    return true;

  return false;
}