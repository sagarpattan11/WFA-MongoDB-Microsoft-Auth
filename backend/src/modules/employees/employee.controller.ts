import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { sendError, sendSuccess } from '../../utils/api-response';
import { DepartmentModel } from '../departments/models/Department.model';
import { TeamModel } from '../teams/models/Team.model';
import { EmployeeModel, EmployeeStatus, EmploymentType, WorkLocation } from './models/Employee.model';

export const getEmployeesHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 10));
    const skip = (page - 1) * limit;

    const {
      q,
      departmentId,
      teamId,
      status,
      employmentType,
      location,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const filter: Record<string, unknown> = { isDeleted: false };

    // Support viewing archived/soft-deleted records
    if (status === 'archived') {
      filter.isDeleted = true;
    } else if (status && typeof status === 'string') {
      filter.status = status as EmployeeStatus;
    }

    // Search query across name, email, employeeId, jobTitle
    if (q && typeof q === 'string' && q.trim()) {
      const searchRegex = new RegExp(q.trim(), 'i');
      filter.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { employeeId: searchRegex },
        { jobTitle: searchRegex },
      ];
    }

    if (departmentId && typeof departmentId === 'string') {
      filter.departmentId = new Types.ObjectId(departmentId);
    }
    if (teamId && typeof teamId === 'string') {
      filter.teamId = new Types.ObjectId(teamId);
    }
    if (employmentType && typeof employmentType === 'string') filter.employmentType = employmentType as EmploymentType;
    if (location && typeof location === 'string') filter.location = location as WorkLocation;

    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    const sortOptions: Record<string, 1 | -1> = { [String(sortBy)]: sortDirection };

    const [employees, total] = await Promise.all([
      EmployeeModel.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate('departmentId', 'name code')
        .populate('teamId', 'name')
        .lean(),
      EmployeeModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    sendSuccess(res, {
      employees,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    sendError(res, 'Failed to fetch employees.', 500, 'EMPLOYEE_FETCH_ERROR', errMsg);
  }
};

export const getEmployeeByIdHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const employee = await EmployeeModel.findOne({ _id: id })
      .populate('departmentId', 'name code description')
      .populate('teamId', 'name')
      .lean();

    if (!employee) {
      sendError(res, 'Employee record not found.', 404, 'NOT_FOUND');
      return;
    }

    sendSuccess(res, employee);
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    sendError(res, 'Failed to retrieve employee record.', 500, 'EMPLOYEE_GET_ERROR', errMsg);
  }
};

export const createEmployeeHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      employeeId,
      firstName,
      lastName,
      email,
      phone,
      departmentId,
      teamId,
      jobTitle,
      employmentType = 'Full-Time',
      status = 'active',
      location = 'Headquarters',
      hireDate,
      experienceYears,
      salary,
    } = req.body;

    if (!employeeId || !firstName || !lastName || !email || !departmentId || !jobTitle) {
      sendError(res, 'employeeId, firstName, lastName, email, departmentId, and jobTitle are required.', 400);
      return;
    }

    // Verify department existence
    const dept = await DepartmentModel.findById(departmentId);
    if (!dept) {
      sendError(res, 'Invalid department ID. Department does not exist.', 400, 'INVALID_DEPARTMENT');
      return;
    }

    // Check unique employeeId & email
    const existingEmployee = await EmployeeModel.findOne({
      $or: [
        { employeeId: String(employeeId).toUpperCase().trim() },
        { email: String(email).toLowerCase().trim() },
      ],
    });

    if (existingEmployee) {
      const isDuplicateId = existingEmployee.employeeId === String(employeeId).toUpperCase().trim();
      const isDuplicateEmail = existingEmployee.email === String(email).toLowerCase().trim();
      if (isDuplicateEmail && isDuplicateId) {
        sendError(res, `Both Employee ID "${employeeId}" and Email "${email}" are already registered.`, 409, 'DUPLICATE_KEY');
      } else if (isDuplicateEmail) {
        sendError(res, `Email address "${email}" is already registered to employee "${existingEmployee.firstName} ${existingEmployee.lastName}" (${existingEmployee.employeeId}).`, 409, 'DUPLICATE_EMAIL');
      } else {
        sendError(res, `Employee ID "${employeeId}" is already assigned to employee "${existingEmployee.firstName} ${existingEmployee.lastName}".`, 409, 'DUPLICATE_ID');
      }
      return;
    }

    const employee = await EmployeeModel.create({
      employeeId: String(employeeId).toUpperCase().trim(),
      firstName: String(firstName).trim(),
      lastName: String(lastName).trim(),
      email: String(email).toLowerCase().trim(),
      phone: phone ? String(phone).trim() : '',
      departmentId,
      teamId: teamId || null,
      jobTitle: String(jobTitle).trim(),
      employmentType: employmentType as EmploymentType,
      status: status as EmployeeStatus,
      location: location as WorkLocation,
      hireDate: hireDate ? new Date(hireDate) : new Date(),
      experienceYears: experienceYears !== undefined && experienceYears !== null && experienceYears !== '' ? Number(experienceYears) : 0,
      salary: salary ? Number(salary) : 0,
      isDeleted: false,
    });

    const populated = await EmployeeModel.findById(employee._id)
      .populate('departmentId', 'name code')
      .populate('teamId', 'name');

    sendSuccess(res, populated, 'Employee created successfully.', 201);
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && (error as any).code === 11000) {
      const keyPattern = (error as any).keyPattern || {};
      const duplicateField = Object.keys(keyPattern)[0] || 'Field';
      sendError(
        res,
        `${duplicateField === 'email' ? 'Email address' : 'Employee ID'} is already in use by another record.`,
        409,
        'DUPLICATE_KEY'
      );
      return;
    }
    const errMsg = error instanceof Error ? error.message : String(error);
    sendError(res, 'Failed to create employee.', 500, 'EMPLOYEE_CREATE_ERROR', errMsg);
  }
};

export const updateEmployeeHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Prevent direct tampering of isDeleted or _id
    delete updateData._id;
    delete updateData.isDeleted;

    if (updateData.experienceYears !== undefined) {
      updateData.experienceYears =
        updateData.experienceYears !== '' && updateData.experienceYears !== null
          ? Number(updateData.experienceYears)
          : 0;
    }

    if (updateData.hireDate) {
      updateData.hireDate = new Date(updateData.hireDate);
    }

    if (updateData.departmentId) {
      const dept = await DepartmentModel.findById(updateData.departmentId);
      if (!dept) {
        sendError(res, 'Invalid department ID.', 400, 'INVALID_DEPARTMENT');
        return;
      }
    }

    if (updateData.email) {
      updateData.email = String(updateData.email).toLowerCase().trim();
      const existing = await EmployeeModel.findOne({ email: updateData.email, _id: { $ne: id } });
      if (existing) {
        sendError(res, `Email address "${updateData.email}" is already registered to employee "${existing.firstName} ${existing.lastName}" (${existing.employeeId}).`, 409, 'DUPLICATE_EMAIL');
        return;
      }
    }

    const employee = await EmployeeModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      updateData,
      { new: true, runValidators: true }
    )
      .populate('departmentId', 'name code')
      .populate('teamId', 'name');

    if (!employee) {
      sendError(res, 'Employee not found or has been deleted.', 404, 'NOT_FOUND');
      return;
    }

    sendSuccess(res, employee, 'Employee profile updated successfully.', 200);
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && (error as any).code === 11000) {
      const keyPattern = (error as any).keyPattern || {};
      const duplicateField = Object.keys(keyPattern)[0] || 'Field';
      sendError(
        res,
        `${duplicateField === 'email' ? 'Email address' : 'Employee ID'} is already registered in the system.`,
        409,
        'DUPLICATE_KEY'
      );
      return;
    }
    const errMsg = error instanceof Error ? error.message : String(error);
    sendError(res, 'Failed to update employee record.', 500, 'EMPLOYEE_UPDATE_ERROR', errMsg);
  }
};

export const updateEmployeeStatusHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'on-leave', 'probation', 'terminated'].includes(status)) {
      sendError(res, 'Invalid status value. Allowed: active, on-leave, probation, terminated', 400);
      return;
    }

    const employee = await EmployeeModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { status },
      { new: true }
    );

    if (!employee) {
      sendError(res, 'Employee not found.', 404, 'NOT_FOUND');
      return;
    }

    sendSuccess(res, employee, `Employee status changed to '${status}'.`, 200);
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    sendError(res, 'Failed to change employee status.', 500, 'STATUS_UPDATE_ERROR', errMsg);
  }
};

export const deleteEmployeeHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Soft delete
    const employee = await EmployeeModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!employee) {
      sendError(res, 'Employee not found or already deleted.', 404, 'NOT_FOUND');
      return;
    }

    sendSuccess(res, { id, isDeleted: true }, 'Employee soft-deleted successfully.', 200);
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    sendError(res, 'Failed to delete employee record.', 500, 'DELETE_ERROR', errMsg);
  }
};

/**
 * Restore a soft-deleted employee
 */
export const restoreEmployeeHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const employee = await EmployeeModel.findOneAndUpdate(
      { _id: id, isDeleted: true },
      { isDeleted: false, deletedAt: undefined },
      { new: true }
    )
      .populate('departmentId', 'name code')
      .populate('teamId', 'name');

    if (!employee) {
      sendError(res, 'Archived employee not found or already active.', 404, 'NOT_FOUND');
      return;
    }

    sendSuccess(res, employee, 'Employee record restored successfully.', 200);
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    sendError(res, 'Failed to restore employee record.', 500, 'RESTORE_ERROR', errMsg);
  }
};

/**
 * Bulk Import Employees from CSV Data Array
 */
export const importEmployeesHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { employees: importedList } = req.body;
    if (!Array.isArray(importedList) || importedList.length === 0) {
      sendError(res, 'Invalid payload. "employees" must be a non-empty array of employee objects.', 400);
      return;
    }

    // Preload departments and teams for fast mapping
    const [allDepartments, allTeams] = await Promise.all([
      DepartmentModel.find().lean(),
      TeamModel.find().lean(),
    ]);

    const deptMap = new Map<string, Types.ObjectId>();
    for (const d of allDepartments) {
      deptMap.set(d.name.toLowerCase().trim(), d._id);
      deptMap.set(d.code.toLowerCase().trim(), d._id);
      deptMap.set(String(d._id), d._id);
    }

    const teamMap = new Map<string, Types.ObjectId>();
    for (const t of allTeams) {
      teamMap.set(t.name.toLowerCase().trim(), t._id);
      teamMap.set(String(t._id), t._id);
    }

    const defaultDeptId = allDepartments[0]?._id;
    if (!defaultDeptId) {
      sendError(res, 'No departments found in the system to assign employees to.', 400);
      return;
    }

    let insertedCount = 0;
    let skippedCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < importedList.length; i++) {
      const item = importedList[i];
      const rowNum = i + 1;

      const employeeId = item.employeeId
        ? String(item.employeeId).toUpperCase().trim()
        : `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
      const firstName = item.firstName ? String(item.firstName).trim() : '';
      const lastName = item.lastName ? String(item.lastName).trim() : '';
      const email = item.email ? String(item.email).toLowerCase().trim() : '';
      const jobTitle = item.jobTitle ? String(item.jobTitle).trim() : 'Software Engineer';

      if (!firstName || !lastName || !email) {
        skippedCount++;
        errors.push(`Row ${rowNum}: Missing required fields (First Name, Last Name, or Email).`);
        continue;
      }

      // Check duplicate
      const existing = await EmployeeModel.findOne({
        $or: [{ employeeId }, { email }],
      });

      if (existing) {
        skippedCount++;
        errors.push(`Row ${rowNum}: Employee ID "${employeeId}" or Email "${email}" already exists.`);
        continue;
      }

      // Resolve department
      let deptId = defaultDeptId;
      if (item.department) {
        const key = String(item.department).toLowerCase().trim();
        if (deptMap.has(key)) deptId = deptMap.get(key)!;
      } else if (item.departmentId) {
        const key = String(item.departmentId).toLowerCase().trim();
        if (deptMap.has(key)) deptId = deptMap.get(key)!;
      }

      // Resolve team
      let teamId: Types.ObjectId | null = null;
      if (item.team) {
        const key = String(item.team).toLowerCase().trim();
        if (teamMap.has(key)) teamId = teamMap.get(key)!;
      } else if (item.teamId) {
        const key = String(item.teamId).toLowerCase().trim();
        if (teamMap.has(key)) teamId = teamMap.get(key)!;
      }

      const experienceYears =
        item.experienceYears !== undefined && item.experienceYears !== '' && !isNaN(Number(item.experienceYears))
          ? Number(item.experienceYears)
          : 0;

      const salary = item.salary && !isNaN(Number(item.salary)) ? Number(item.salary) : 0;
      const validEmpTypes = ['Full-Time', 'Part-Time', 'Contractor', 'Intern'];
      const employmentType = validEmpTypes.includes(item.employmentType) ? item.employmentType : 'Full-Time';
      const validStatuses = ['active', 'on-leave', 'probation', 'terminated'];
      const status = validStatuses.includes(item.status) ? item.status : 'active';
      const validLocations = ['Headquarters', 'Remote', 'Regional Office', 'Branch Office'];
      const location = validLocations.includes(item.location) ? item.location : 'Headquarters';

      await EmployeeModel.create({
        employeeId,
        firstName,
        lastName,
        email,
        phone: item.phone ? String(item.phone).trim() : '',
        departmentId: deptId,
        teamId,
        jobTitle,
        employmentType: employmentType as EmploymentType,
        status: status as EmployeeStatus,
        location: location as WorkLocation,
        experienceYears,
        salary,
        hireDate: item.hireDate ? new Date(item.hireDate) : new Date(),
        isDeleted: false,
      });

      insertedCount++;
    }

    sendSuccess(
      res,
      {
        totalProcessed: importedList.length,
        insertedCount,
        skippedCount,
        errors,
      },
      `Bulk import completed: ${insertedCount} inserted, ${skippedCount} skipped.`,
      201
    );
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    sendError(res, 'Failed to import employee CSV dataset.', 500, 'EMPLOYEE_IMPORT_ERROR', errMsg);
  }
};

/**
 * Export all active employees for CSV / Reporting
 */
export const exportEmployeesHandler = async (_req: Request, res: Response): Promise<void> => {
  try {
    const employees = await EmployeeModel.find({ isDeleted: false })
      .sort({ employeeId: 1 })
      .populate('departmentId', 'name code')
      .populate('teamId', 'name')
      .lean();

    sendSuccess(res, employees, 'Active employees retrieved for export.', 200);
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    sendError(res, 'Failed to export employee dataset.', 500, 'EMPLOYEE_EXPORT_ERROR', errMsg);
  }
};
