import mongoose from 'mongoose';
import { env } from '../config/env.config';
import { DepartmentModel } from '../modules/departments/models/Department.model';
import { EmployeeModel } from '../modules/employees/models/Employee.model';
import { TeamModel } from '../modules/teams/models/Team.model';

export const seedDatabase = async (): Promise<void> => {
  try {
    const count = await DepartmentModel.countDocuments();
    if (count > 0) {
      console.log('ℹ️ Database already seeded. Skipping initial seed.');
      return;
    }

    console.log('🌱 Seeding initial Enterprise Departments, Teams, and Employees...');

    // 1. Create Departments
    const engineering = await DepartmentModel.create({
      code: 'ENG',
      name: 'Engineering & Technology',
      description: 'Software development, cloud infrastructure, and data systems.',
    });

    const humanResources = await DepartmentModel.create({
      code: 'HR',
      name: 'Human Resources',
      description: 'People operations, talent acquisition, and compliance governance.',
    });

    const operations = await DepartmentModel.create({
      code: 'OPS',
      name: 'Operations & Logistics',
      description: 'Operational delivery, scheduling, and facilities coordination.',
    });

    const finance = await DepartmentModel.create({
      code: 'FIN',
      name: 'Finance & Accounting',
      description: 'Financial planning, payroll management, and corporate reporting.',
    });

    const sales = await DepartmentModel.create({
      code: 'SALES',
      name: 'Enterprise Sales',
      description: 'Client acquisition, partnership management, and business revenue.',
    });

    // 2. Create Teams
    const cloudTeam = await TeamModel.create({
      name: 'Cloud Infrastructure',
      departmentId: engineering._id,
    });

    const frontendTeam = await TeamModel.create({
      name: 'Frontend Core',
      departmentId: engineering._id,
    });

    const talentTeam = await TeamModel.create({
      name: 'Talent Acquisition',
      departmentId: humanResources._id,
    });

    const opsTeam = await TeamModel.create({
      name: 'Workforce Logistics',
      departmentId: operations._id,
    });

    const accountsTeam = await TeamModel.create({
      name: 'Financial Accounts',
      departmentId: finance._id,
    });

    // 3. Create Employees
    const sampleEmployees = [
      {
        employeeId: 'EMP-1001',
        firstName: 'Alexander',
        lastName: 'Wright',
        email: 'alexander.wright@enterprise.com',
        phone: '+1 (555) 234-5678',
        departmentId: engineering._id,
        teamId: cloudTeam._id,
        jobTitle: 'Principal Cloud Architect',
        employmentType: 'Full-Time',
        status: 'active',
        location: 'Headquarters',
        hireDate: new Date('2024-03-15'),
        salary: 145000,
      },
      {
        employeeId: 'EMP-1002',
        firstName: 'Sarah',
        lastName: 'Chen',
        email: 'sarah.chen@enterprise.com',
        phone: '+1 (555) 345-6789',
        departmentId: engineering._id,
        teamId: frontendTeam._id,
        jobTitle: 'Lead UI/UX Engineer',
        employmentType: 'Full-Time',
        status: 'active',
        location: 'Remote',
        hireDate: new Date('2024-06-01'),
        salary: 130000,
      },
      {
        employeeId: 'EMP-1003',
        firstName: 'Marcus',
        lastName: 'Johnson',
        email: 'marcus.johnson@enterprise.com',
        phone: '+1 (555) 456-7890',
        departmentId: humanResources._id,
        teamId: talentTeam._id,
        jobTitle: 'Senior HR Director',
        employmentType: 'Full-Time',
        status: 'active',
        location: 'Headquarters',
        hireDate: new Date('2023-11-10'),
        salary: 125000,
      },
      {
        employeeId: 'EMP-1004',
        firstName: 'Elena',
        lastName: 'Rostova',
        email: 'elena.rostova@enterprise.com',
        phone: '+1 (555) 567-8901',
        departmentId: operations._id,
        teamId: opsTeam._id,
        jobTitle: 'Operations Manager',
        employmentType: 'Full-Time',
        status: 'active',
        location: 'Regional Office',
        hireDate: new Date('2024-01-20'),
        salary: 110000,
      },
      {
        employeeId: 'EMP-1005',
        firstName: 'David',
        lastName: 'Kim',
        email: 'david.kim@enterprise.com',
        phone: '+1 (555) 678-9012',
        departmentId: finance._id,
        teamId: accountsTeam._id,
        jobTitle: 'Financial Controller',
        employmentType: 'Full-Time',
        status: 'active',
        location: 'Headquarters',
        hireDate: new Date('2024-04-10'),
        salary: 118000,
      },
      {
        employeeId: 'EMP-1006',
        firstName: 'Jessica',
        lastName: 'Taylor',
        email: 'jessica.taylor@enterprise.com',
        phone: '+1 (555) 789-0123',
        departmentId: sales._id,
        jobTitle: 'Enterprise Account Executive',
        employmentType: 'Full-Time',
        status: 'on-leave',
        location: 'Branch Office',
        hireDate: new Date('2024-02-14'),
        salary: 95000,
      },
      {
        employeeId: 'EMP-1007',
        firstName: 'Priya',
        lastName: 'Patel',
        email: 'priya.patel@enterprise.com',
        phone: '+1 (555) 890-1234',
        departmentId: engineering._id,
        teamId: frontendTeam._id,
        jobTitle: 'Full-Stack Developer',
        employmentType: 'Full-Time',
        status: 'active',
        location: 'Remote',
        hireDate: new Date('2025-01-10'),
        salary: 105000,
      },
      {
        employeeId: 'EMP-1008',
        firstName: 'Liam',
        lastName: 'O\'Connor',
        email: 'liam.oconnor@enterprise.com',
        phone: '+1 (555) 901-2345',
        departmentId: operations._id,
        teamId: opsTeam._id,
        jobTitle: 'Roster & Scheduling Specialist',
        employmentType: 'Full-Time',
        status: 'probation',
        location: 'Regional Office',
        hireDate: new Date('2026-01-15'),
        salary: 82000,
      },
      {
        employeeId: 'EMP-1009',
        firstName: 'Amara',
        lastName: 'Okafor',
        email: 'amara.okafor@enterprise.com',
        phone: '+1 (555) 012-3456',
        departmentId: engineering._id,
        teamId: cloudTeam._id,
        jobTitle: 'DevOps Security Specialist',
        employmentType: 'Contractor',
        status: 'active',
        location: 'Remote',
        hireDate: new Date('2025-08-01'),
        salary: 120000,
      },
      {
        employeeId: 'EMP-1010',
        firstName: 'Daniel',
        lastName: 'Vargas',
        email: 'daniel.vargas@enterprise.com',
        phone: '+1 (555) 123-4560',
        departmentId: humanResources._id,
        teamId: talentTeam._id,
        jobTitle: 'People & Culture Associate',
        employmentType: 'Intern',
        status: 'active',
        location: 'Headquarters',
        hireDate: new Date('2026-02-01'),
        salary: 45000,
      },
    ];

    await EmployeeModel.insertMany(sampleEmployees);

    console.log(`✅ Database seeded successfully with 5 departments, 5 teams, and ${sampleEmployees.length} employees.`);
  } catch (error) {
    console.error('❌ Seeding error:', error);
  }
};

// Direct script execution support
if (require.main === module) {
  mongoose
    .connect(env.MONGODB_URI)
    .then(async () => {
      await seedDatabase();
      await mongoose.disconnect();
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
