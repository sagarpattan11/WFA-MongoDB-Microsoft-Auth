import { Request, Response } from 'express';
import { sendError, sendSuccess } from '../../utils/api-response';
import { TeamModel } from './models/Team.model';

export const getTeamsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const departmentId = typeof req.query.departmentId === 'string' ? req.query.departmentId : undefined;
    const filter: Record<string, unknown> = {};
    if (departmentId) {
      filter.departmentId = departmentId;
    }

    const teams = await TeamModel.find(filter)
      .sort({ name: 1 })
      .populate('departmentId', 'name code')
      .populate('leadId', 'firstName lastName email');

    sendSuccess(res, teams);
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    sendError(res, 'Failed to fetch teams', 500, 'TEAM_FETCH_ERROR', errMsg);
  }
};

export const createTeamHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, departmentId, leadId } = req.body;

    if (!name || !departmentId) {
      sendError(res, 'Team name and departmentId are required.', 400);
      return;
    }

    const team = await TeamModel.create({
      name: name.trim(),
      departmentId,
      leadId: leadId || null,
    });

    sendSuccess(res, team, 'Team created successfully.', 201);
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    sendError(res, 'Failed to create team', 500, 'TEAM_CREATE_ERROR', errMsg);
  }
};
