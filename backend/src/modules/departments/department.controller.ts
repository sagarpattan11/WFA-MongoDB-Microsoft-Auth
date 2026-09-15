import { Request, Response } from 'express';
import { sendError, sendSuccess } from '../../utils/api-response';
import { DepartmentModel } from './models/Department.model';

export const getDepartmentsHandler = async (_req: Request, res: Response): Promise<void> => {
  try {
    const departments = await DepartmentModel.find().sort({ name: 1 }).populate('managerId', 'firstName lastName email');
    sendSuccess(res, departments);
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    sendError(res, 'Failed to fetch departments', 500, 'DEPT_FETCH_ERROR', errMsg);
  }
};

export const createDepartmentHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, name, description, managerId } = req.body;

    if (!code || !name) {
      sendError(res, 'Department code and name are required.', 400);
      return;
    }

    const existing = await DepartmentModel.findOne({ code: code.toUpperCase() });
    if (existing) {
      sendError(res, `Department code '${code.toUpperCase()}' already exists.`, 409, 'DUPLICATE_CODE');
      return;
    }

    const department = await DepartmentModel.create({
      code: code.toUpperCase().trim(),
      name: name.trim(),
      description: description || '',
      managerId: managerId || null,
    });

    sendSuccess(res, department, 'Department created successfully.', 201);
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    sendError(res, 'Failed to create department', 500, 'DEPT_CREATE_ERROR', errMsg);
  }
};

export const updateDepartmentHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, managerId } = req.body;

    const department = await DepartmentModel.findByIdAndUpdate(
      id,
      { name, description, managerId },
      { new: true, runValidators: true }
    );

    if (!department) {
      sendError(res, 'Department not found.', 404);
      return;
    }

    sendSuccess(res, department, 'Department updated successfully.');
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    sendError(res, 'Failed to update department', 500, 'DEPT_UPDATE_ERROR', errMsg);
  }
};
