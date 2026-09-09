import { Request, Response } from 'express';
import { RoleModel } from './models/Role.model';
import { sendError, sendSuccess } from '../../utils/api-response';

export const getRolesHandler = async (_req: Request, res: Response): Promise<void> => {
  try {
    const roles = await RoleModel.find({ isActive: true })
      .populate('departmentId', 'name code')
      .sort({ title: 1 });
    sendSuccess(res, roles, 'Roles retrieved successfully.');
  } catch (error) {
    sendError(res, 'Failed to retrieve job roles.', 500, 'SERVER_ERROR', error);
  }
};

export const createRoleHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, code, departmentId, level, requiredSkills, minSalary, maxSalary, openPositionsCount } = req.body;
    if (!title || !code || !departmentId) {
      sendError(res, 'Title, code, and departmentId are required.', 400);
      return;
    }
    const role = await RoleModel.create({
      title,
      code,
      departmentId,
      level: level || 'mid',
      requiredSkills: requiredSkills || [],
      minSalary,
      maxSalary,
      openPositionsCount: openPositionsCount || 0,
    });
    sendSuccess(res, role, 'Role created successfully.', 201);
  } catch (error) {
    sendError(res, 'Failed to create job role.', 500, 'SERVER_ERROR', error);
  }
};
