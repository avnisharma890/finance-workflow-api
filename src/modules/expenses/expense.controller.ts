import { Request, Response } from "express";
import * as service from "./expense.service";

export async function create(req: Request, res: Response) {
    if (!req.user) throw new Error("Unauthorized");
  const expense = await service.createExpense(req.body, req.user.id);
  res.json(expense);
}

export async function submit(req: Request, res: Response) {
  const expense = await service.submitExpense(req.params.id as string);
  res.json(expense);
}

export async function approve(req: Request, res: Response) {
  const expense = await service.approveExpense(
    req.params.id as string,
    req.user!.id
  );
  res.json(expense);
}

export async function pay(req: Request, res: Response) {
  const expense = await service.payExpense(req.params.id as string);
  res.json(expense);
}