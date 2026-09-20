import { Request, Response } from 'express';
import { teamService } from '../services/team.service';
import { asyncHandler } from '../utils/asyncHandler';
import type { CreateTeamMemberInput, UpdateTeamMemberInput } from '../validators/team.validator';
import type { AuthenticatedRequest } from '../middleware/auth.middleware';

export const getActiveTeam = asyncHandler(async (req: Request, res: Response) => {
  const branchId = req.query.branch_id as string | undefined;
  const committee = req.query.committee as string | undefined;
  const team = await teamService.getActive(branchId, committee);
  res.status(200).json(team);
});

export const getAllTeam = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const isBranchManager = req.user?.role === 'branch_manager';
  const enforcedBranchId = isBranchManager ? req.user?.branch_id : null;
  const team = await teamService.getAll(enforcedBranchId);
  res.status(200).json(team);
});

export const getTeamMemberById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const member = await teamService.getById(id);
  res.status(200).json(member);
});

export const createTeamMember = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const input = req.body as CreateTeamMemberInput;
  const isBranchManager = req.user?.role === 'branch_manager';
  const enforcedBranchId = isBranchManager ? req.user?.branch_id : null;

  const member = await teamService.create(input, enforcedBranchId);
  res.status(201).json(member);
});

export const updateTeamMember = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const input = req.body as UpdateTeamMemberInput;
  const isBranchManager = req.user?.role === 'branch_manager';
  const enforcedBranchId = isBranchManager ? req.user?.branch_id : null;

  const updated = await teamService.update(id, input, enforcedBranchId);
  res.status(200).json(updated);
});

export const deleteTeamMember = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const isBranchManager = req.user?.role === 'branch_manager';
  const enforcedBranchId = isBranchManager ? req.user?.branch_id : null;

  const removed = await teamService.remove(id, enforcedBranchId);
  res.status(200).json({ message: 'Team member deleted successfully.', item: removed });
});
