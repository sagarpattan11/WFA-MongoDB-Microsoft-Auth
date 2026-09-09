import { Request, Response } from 'express';
import { LocationModel } from './models/Location.model';
import { sendError, sendSuccess } from '../../utils/api-response';

export const getLocationsHandler = async (_req: Request, res: Response): Promise<void> => {
  try {
    const locations = await LocationModel.find({ isActive: true }).sort({ name: 1 });
    sendSuccess(res, locations, 'Locations retrieved successfully.');
  } catch (error) {
    sendError(res, 'Failed to retrieve locations.', 500, 'SERVER_ERROR', error);
  }
};

export const createLocationHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, code, city, state, country, capacity, timezone } = req.body;
    if (!name || !code || !city || !country) {
      sendError(res, 'Name, code, city, and country are required.', 400);
      return;
    }
    const location = await LocationModel.create({
      name,
      code,
      city,
      state,
      country,
      capacity: capacity || 100,
      timezone: timezone || 'UTC',
    });
    sendSuccess(res, location, 'Location created successfully.', 201);
  } catch (error) {
    sendError(res, 'Failed to create location.', 500, 'SERVER_ERROR', error);
  }
};
