import { Request, Response } from 'express';
import { policiesService } from '../services/policies.service';
import { asyncHandler } from '../utils/asyncHandler';
import type { CreatePolicyInput, UpdatePolicyInput } from '../validators/policies.validator';

export const getPublishedPolicies = asyncHandler(async (_req: Request, res: Response) => {
  const policies = await policiesService.getPublished();
  res.status(200).json(policies);
});

export const getAllPolicies = asyncHandler(async (_req: Request, res: Response) => {
  const policies = await policiesService.getAll();
  res.status(200).json(policies);
});

export const getPolicyById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const policy = await policiesService.getById(id);
  res.status(200).json(policy);
});

export const createPolicy = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as CreatePolicyInput;
  const policy = await policiesService.create(input);
  res.status(201).json(policy);
});

export const updatePolicy = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const input = req.body as UpdatePolicyInput;
  const policy = await policiesService.update(id, input);
  res.status(200).json(policy);
});

export const deletePolicy = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const policy = await policiesService.remove(id);
  res.status(200).json({ message: 'Policy deleted successfully.', item: policy });
});
