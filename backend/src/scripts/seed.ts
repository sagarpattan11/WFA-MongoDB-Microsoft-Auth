import { AttritionRiskModel } from '../modules/attrition/models/AttritionRisk.model';
import { AuditLogModel } from '../modules/audit/models/AuditLog.model';
import { DepartmentModel } from '../modules/departments/models/Department.model';
import { EmployeeModel, EmployeeStatus, EmploymentType, WorkLocation } from '../modules/employees/models/Employee.model';
import { WorkforceAlertModel } from '../modules/executive/models/WorkforceAlert.model';
import { DemandForecastModel } from '../modules/forecasting/models/DemandForecast.model';
import { LocationModel } from '../modules/locations/models/Location.model';
import { PerformanceModel } from '../modules/performance/models/Performance.model';
import { PlacementModel } from '../modules/placement/models/Placement.model';
import { CandidateApplicationModel } from '../modules/recruitment/models/CandidateApplication.model';
import { RecruitmentModel } from '../modules/recruitment/models/Recruitment.model';
import { RoleModel } from '../modules/roles/models/Role.model';
import { SkillModel } from '../modules/skills/models/Skill.model';
import { TeamModel } from '../modules/teams/models/Team.model';
import { EnrollmentModel } from '../modules/training/models/Enrollment.model';
import { TrainingModel } from '../modules/training/models/Training.model';

const FIRST_NAMES = [
  'Alexander', 'Elena', 'Marcus', 'Sophia', 'David', 'Rachel', 'Jonathan', 'Priya', 'Liam', 'Amina',
  'Carlos', 'Kavita', 'Benjamin', 'Chloe', 'Daniel', 'Emma', 'Felix', 'Grace', 'Henry', 'Isabella',
  'James', 'Kira', 'Lucas', 'Maya', 'Nathan', 'Olivia', 'Patrick', 'Quinn', 'Ryan', 'Sarah',
  'Thomas', 'Victoria', 'William', 'Zoe', 'Adrian', 'Beatrice', 'Caleb', 'Diana', 'Ethan', 'Fiona',
  'Gabriel', 'Hannah', 'Ian', 'Julia', 'Kevin', 'Laura', 'Matthew', 'Nadia', 'Oliver', 'Penelope',
];

const LAST_NAMES = [
  'Wright', 'Rostova', 'Chen', 'Alvarez', 'Kim', 'Green', 'Vance', 'Patel', "O'Connor", 'Diallo',
  'Santana', 'Sharma', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson', 'Martinez', 'Anderson', 'Taylor',
  'Thomas', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White', 'Lopez', 'Lee', 'Gonzalez',
  'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Perez', 'Hall', 'Young', 'Allen', 'Sanchez',
  'King', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Adams', 'Nelson', 'Baker', 'Ramirez',
];

export const seedDatabase = async (force: boolean = false): Promise<void> => {
  try {
    const existingEmployeesCount = await EmployeeModel.countDocuments();
    if (existingEmployeesCount >= 100 && !force) {
      console.log(`ℹ️ Database already contains ${existingEmployeesCount} employees. Skipping seed.`);
      return;
    }

    console.log('🌱 Seeding Enterprise Departments, Locations, Roles, Skills, and 100 Employees...');

    // 1. Departments
    const departmentsConfig = [
      { code: 'ENG', name: 'Engineering & Technology', description: 'Software development, cloud infrastructure, and data systems.' },
      { code: 'HR', name: 'Human Resources', description: 'People operations, talent acquisition, and compliance governance.' },
      { code: 'OPS', name: 'Operations & Logistics', description: 'Operational delivery, scheduling, and facilities coordination.' },
      { code: 'FIN', name: 'Finance & Accounting', description: 'Financial planning, payroll management, and corporate reporting.' },
      { code: 'SALES', name: 'Enterprise Sales', description: 'Client acquisition, partnership management, and business revenue.' },
    ];

    const departmentMap: Record<string, any> = {};
    for (const d of departmentsConfig) {
      departmentMap[d.code] = await DepartmentModel.findOneAndUpdate(
        { code: d.code },
        { ...d },
        { upsert: true, new: true }
      );
    }

    const engineering = departmentMap['ENG'];
    const humanResources = departmentMap['HR'];
    const operations = departmentMap['OPS'];
    const finance = departmentMap['FIN'];
    const sales = departmentMap['SALES'];

    // 2. Teams
    const cloudTeam = await TeamModel.findOneAndUpdate(
      { name: 'Cloud Infrastructure' },
      { name: 'Cloud Infrastructure', departmentId: engineering._id },
      { upsert: true, new: true }
    );

    const frontendTeam = await TeamModel.findOneAndUpdate(
      { name: 'Frontend Core' },
      { name: 'Frontend Core', departmentId: engineering._id },
      { upsert: true, new: true }
    );

    const dataTeam = await TeamModel.findOneAndUpdate(
      { name: 'Data & AI Systems' },
      { name: 'Data & AI Systems', departmentId: engineering._id },
      { upsert: true, new: true }
    );

    const talentTeam = await TeamModel.findOneAndUpdate(
      { name: 'Talent Acquisition' },
      { name: 'Talent Acquisition', departmentId: humanResources._id },
      { upsert: true, new: true }
    );

    const opsDeliveryTeam = await TeamModel.findOneAndUpdate(
      { name: 'Service Delivery' },
      { name: 'Service Delivery', departmentId: operations._id },
      { upsert: true, new: true }
    );

    const fpAndATeam = await TeamModel.findOneAndUpdate(
      { name: 'FP&A Team' },
      { name: 'FP&A Team', departmentId: finance._id },
      { upsert: true, new: true }
    );

    const salesEnterpriseTeam = await TeamModel.findOneAndUpdate(
      { name: 'Major Accounts' },
      { name: 'Major Accounts', departmentId: sales._id },
      { upsert: true, new: true }
    );

    // 3. Locations
    await LocationModel.deleteMany({});
    const locationsConfig = [
      {
        name: 'Global Headquarters',
        code: 'HQ-NYC',
        city: 'New York',
        state: 'NY',
        country: 'United States',
        address: '100 Enterprise Plaza, Suite 400',
        timezone: 'America/New_York',
        capacity: 250,
        currentHeadcount: 42,
      },
      {
        name: 'West Coast Innovation Hub',
        code: 'HUB-SFO',
        city: 'San Francisco',
        state: 'CA',
        country: 'United States',
        address: '450 Tech Way',
        timezone: 'America/Los_Angeles',
        capacity: 150,
        currentHeadcount: 26,
      },
      {
        name: 'EMEA Regional Office',
        code: 'BR-LDN',
        city: 'London',
        country: 'United Kingdom',
        address: '25 Finsbury Square',
        timezone: 'Europe/London',
        capacity: 100,
        currentHeadcount: 16,
      },
      {
        name: 'APAC Tech Center',
        code: 'BR-BLR',
        city: 'Bangalore',
        country: 'India',
        address: 'Outer Ring Road Tech Park',
        timezone: 'Asia/Kolkata',
        capacity: 300,
        currentHeadcount: 12,
      },
      {
        name: 'Global Remote Workforce',
        code: 'REM-GLB',
        city: 'Remote',
        country: 'Global',
        capacity: 1000,
        currentHeadcount: 4,
      },
    ];
    await LocationModel.insertMany(locationsConfig);

    // 4. Skills Inventory
    await SkillModel.deleteMany({});
    const skillsList = [
      {
        name: 'TypeScript & JavaScript',
        category: 'technical',
        department: 'Engineering & Technology',
        criticality: 'critical',
        industryBenchmarkLevel: 4,
        requiredCertifications: ['Microsoft Certified: TS Specialist'],
        recommendedCourses: [
          { courseTitle: 'Advanced TypeScript & Design Patterns', provider: 'Enterprise Academy', durationHours: 25 },
        ],
      },
      {
        name: 'React 18 & State Architecture',
        category: 'technical',
        department: 'Engineering & Technology',
        criticality: 'critical',
        industryBenchmarkLevel: 4,
        requiredCertifications: ['React Certified Enterprise Developer'],
        recommendedCourses: [
          { courseTitle: 'React Concurrent & High Performance UI', provider: 'Frontend Masters', durationHours: 20 },
        ],
      },
      {
        name: 'Node.js & Microservices',
        category: 'technical',
        department: 'Engineering & Technology',
        criticality: 'critical',
        industryBenchmarkLevel: 4,
        recommendedCourses: [
          { courseTitle: 'Node.js Production Microservices Architecture', provider: 'Linux Foundation', durationHours: 30 },
        ],
      },
      {
        name: 'MongoDB Atlas & Aggregation',
        category: 'technical',
        department: 'Engineering & Technology',
        criticality: 'critical',
        industryBenchmarkLevel: 4,
        requiredCertifications: ['MongoDB Certified Developer Associate'],
        recommendedCourses: [
          { courseTitle: 'Advanced Mongoose Data Modeling & Indexing', provider: 'MongoDB University', durationHours: 18 },
        ],
      },
      {
        name: 'Cloud & Kubernetes (AWS/Azure)',
        category: 'technical',
        department: 'Engineering & Technology',
        criticality: 'critical',
        industryBenchmarkLevel: 4,
        requiredCertifications: ['CKA: Certified Kubernetes Administrator', 'AWS Solutions Architect'],
        recommendedCourses: [
          { courseTitle: 'Enterprise Kubernetes & Service Mesh', provider: 'Cloud Native Org', durationHours: 40 },
        ],
      },
      {
        name: 'AI & Attrition Predictive Modeling',
        category: 'technical',
        department: 'Engineering & Technology',
        criticality: 'high',
        industryBenchmarkLevel: 4,
        recommendedCourses: [
          { courseTitle: 'Explainable Machine Learning in Production', provider: 'DeepLearning.AI', durationHours: 35 },
        ],
      },
      {
        name: 'WebAuthn / FIDO2 Passkey Security',
        category: 'technical',
        department: 'Engineering & Technology',
        criticality: 'critical',
        industryBenchmarkLevel: 5,
        requiredCertifications: ['FIDO Certified Security Specialist'],
        recommendedCourses: [
          { courseTitle: 'Zero-Trust WebAuthn Implementation', provider: 'FIDO Alliance', durationHours: 15 },
        ],
      },
      {
        name: 'Talent Acquisition & Sourcing',
        category: 'domain',
        department: 'Human Resources',
        criticality: 'high',
        industryBenchmarkLevel: 4,
        requiredCertifications: ['SHRM-CP', 'AIRS Certified Internet Recruiter'],
        recommendedCourses: [
          { courseTitle: 'Modern Technical Sourcing & Talent Funnels', provider: 'LinkedIn Learning', durationHours: 15 },
        ],
      },
      {
        name: 'HR Analytics & Workforce Reporting',
        category: 'domain',
        department: 'Human Resources',
        criticality: 'high',
        industryBenchmarkLevel: 3,
        recommendedCourses: [
          { courseTitle: 'People Analytics & Strategic Metrics', provider: 'Wharton Executive Education', durationHours: 20 },
        ],
      },
      {
        name: 'Labor Law & SOC2 Compliance',
        category: 'compliance',
        department: 'Human Resources',
        criticality: 'critical',
        industryBenchmarkLevel: 4,
        requiredCertifications: ['Certified Compliance & Ethics Professional (CCEP)'],
        recommendedCourses: [
          { courseTitle: 'Enterprise HR Compliance & Audit Readiness', provider: 'Compliance Online', durationHours: 12 },
        ],
      },
      {
        name: 'Financial Modeling & Budget Forecasting',
        category: 'domain',
        department: 'Finance & Accounting',
        criticality: 'high',
        industryBenchmarkLevel: 4,
        requiredCertifications: ['CFA / CPA'],
        recommendedCourses: [
          { courseTitle: 'Strategic Corporate Financial Modeling', provider: 'CFI Institute', durationHours: 30 },
        ],
      },
      {
        name: 'Enterprise Solution Selling',
        category: 'domain',
        department: 'Enterprise Sales',
        criticality: 'high',
        industryBenchmarkLevel: 4,
        requiredCertifications: ['MEDDPICC Master Certification'],
        recommendedCourses: [
          { courseTitle: 'Strategic Enterprise Sales Execution', provider: 'Sales Impact Academy', durationHours: 24 },
        ],
      },
      {
        name: 'Agile Team Leadership & Scrum',
        category: 'leadership',
        department: 'Operations & Logistics',
        criticality: 'medium',
        industryBenchmarkLevel: 3,
        requiredCertifications: ['Certified ScrumMaster (CSM)'],
        recommendedCourses: [
          { courseTitle: 'High-Performance Agile Engineering Leadership', provider: 'Scrum Alliance', durationHours: 16 },
        ],
      },
    ];

    await SkillModel.insertMany(skillsList);

    // 5. Job Roles
    await RoleModel.deleteMany({});
    const rolesList = [
      {
        title: 'Principal Software Architect',
        code: 'ENG-ARCH-01',
        departmentId: engineering._id,
        level: 'lead',
        minSalary: 160000,
        maxSalary: 220000,
        openPositionsCount: 2,
        requiredSkills: [
          { skillName: 'TypeScript & JavaScript', minimumProficiency: 5, criticality: 'must-have' },
          { skillName: 'Cloud & Kubernetes (AWS/Azure)', minimumProficiency: 5, criticality: 'must-have' },
          { skillName: 'WebAuthn / FIDO2 Passkey Security', minimumProficiency: 4, criticality: 'must-have' },
        ],
      },
      {
        title: 'Senior Full Stack Engineer',
        code: 'ENG-FS-02',
        departmentId: engineering._id,
        level: 'senior',
        minSalary: 125000,
        maxSalary: 165000,
        openPositionsCount: 4,
        requiredSkills: [
          { skillName: 'React 18 & State Architecture', minimumProficiency: 4, criticality: 'must-have' },
          { skillName: 'Node.js & Microservices', minimumProficiency: 4, criticality: 'must-have' },
          { skillName: 'MongoDB Atlas & Aggregation', minimumProficiency: 4, criticality: 'must-have' },
        ],
      },
      {
        title: 'Lead DevOps & Cloud Engineer',
        code: 'ENG-OPS-03',
        departmentId: engineering._id,
        level: 'lead',
        minSalary: 135000,
        maxSalary: 175000,
        openPositionsCount: 1,
        requiredSkills: [
          { skillName: 'Cloud & Kubernetes (AWS/Azure)', minimumProficiency: 5, criticality: 'must-have' },
          { skillName: 'Labor Law & SOC2 Compliance', minimumProficiency: 3, criticality: 'good-to-have' },
        ],
      },
      {
        title: 'People Operations & HR Manager',
        code: 'HR-MGR-01',
        departmentId: humanResources._id,
        level: 'lead',
        minSalary: 105000,
        maxSalary: 140000,
        openPositionsCount: 1,
        requiredSkills: [
          { skillName: 'Talent Acquisition & Sourcing', minimumProficiency: 5, criticality: 'must-have' },
          { skillName: 'HR Analytics & Workforce Reporting', minimumProficiency: 4, criticality: 'must-have' },
          { skillName: 'Labor Law & SOC2 Compliance', minimumProficiency: 4, criticality: 'must-have' },
        ],
      },
      {
        title: 'Senior Financial Analyst',
        code: 'FIN-ANL-01',
        departmentId: finance._id,
        level: 'senior',
        minSalary: 110000,
        maxSalary: 145000,
        openPositionsCount: 2,
        requiredSkills: [
          { skillName: 'Financial Modeling & Budget Forecasting', minimumProficiency: 5, criticality: 'must-have' },
        ],
      },
      {
        title: 'Enterprise Account Executive',
        code: 'SAL-AE-01',
        departmentId: sales._id,
        level: 'mid',
        minSalary: 95000,
        maxSalary: 165000,
        openPositionsCount: 3,
        requiredSkills: [
          { skillName: 'Enterprise Solution Selling', minimumProficiency: 4, criticality: 'must-have' },
        ],
      },
    ];

    await RoleModel.insertMany(rolesList);

    // 6. Generate Exactly 100 Employees with Diverse Real Data
    await EmployeeModel.deleteMany({});

    const jobProfiles = [
      // Engineering (40 employees)
      { dept: engineering, team: cloudTeam, title: 'Principal Software Architect', salary: [165000, 210000], exp: [9, 15], skills: ['TypeScript & JavaScript', 'Cloud & Kubernetes (AWS/Azure)', 'WebAuthn / FIDO2 Passkey Security'], certs: ['AWS Solutions Architect Professional'] },
      { dept: engineering, team: frontendTeam, title: 'Staff Frontend Engineer', salary: [145000, 180000], exp: [7, 12], skills: ['React 18 & State Architecture', 'TypeScript & JavaScript'], certs: ['React Certified Enterprise Developer'] },
      { dept: engineering, team: frontendTeam, title: 'Senior Full Stack Engineer', salary: [130000, 160000], exp: [5, 9], skills: ['React 18 & State Architecture', 'Node.js & Microservices', 'MongoDB Atlas & Aggregation'], certs: ['MongoDB Certified Developer'] },
      { dept: engineering, team: frontendTeam, title: 'Full Stack Developer', salary: [100000, 130000], exp: [3, 6], skills: ['TypeScript & JavaScript', 'React 18 & State Architecture', 'Node.js & Microservices'], certs: [] },
      { dept: engineering, team: frontendTeam, title: 'Junior UI Engineer', salary: [75000, 95000], exp: [1, 3], skills: ['React 18 & State Architecture', 'TypeScript & JavaScript'], certs: [] },
      { dept: engineering, team: cloudTeam, title: 'Lead DevOps & Cloud Engineer', salary: [140000, 175000], exp: [7, 12], skills: ['Cloud & Kubernetes (AWS/Azure)', 'TypeScript & JavaScript'], certs: ['CKA: Certified Kubernetes Administrator'] },
      { dept: engineering, team: cloudTeam, title: 'Cloud Security Engineer', salary: [120000, 150000], exp: [4, 8], skills: ['Cloud & Kubernetes (AWS/Azure)', 'Labor Law & SOC2 Compliance'], certs: ['CompTIA Security+'] },
      { dept: engineering, team: dataTeam, title: 'AI & Data Research Engineer', salary: [135000, 170000], exp: [4, 9], skills: ['AI & Attrition Predictive Modeling', 'TypeScript & JavaScript'], certs: ['DeepLearning.AI Spec'] },
      { dept: engineering, team: dataTeam, title: 'Data Platform Engineer', salary: [115000, 145000], exp: [3, 7], skills: ['MongoDB Atlas & Aggregation', 'Cloud & Kubernetes (AWS/Azure)'], certs: [] },
      { dept: engineering, team: cloudTeam, title: 'Site Reliability Engineer', salary: [125000, 155000], exp: [4, 8], skills: ['Cloud & Kubernetes (AWS/Azure)', 'Node.js & Microservices'], certs: ['AWS Certified SysOps'] },

      // HR (18 employees)
      { dept: humanResources, team: talentTeam, title: 'People Operations & HR Manager', salary: [110000, 140000], exp: [6, 12], skills: ['Talent Acquisition & Sourcing', 'HR Analytics & Workforce Reporting', 'Labor Law & SOC2 Compliance'], certs: ['SHRM-CP', 'SHRM-SCP'] },
      { dept: humanResources, team: talentTeam, title: 'Senior Talent Acquisition Partner', salary: [95000, 120000], exp: [5, 8], skills: ['Talent Acquisition & Sourcing', 'HR Analytics & Workforce Reporting'], certs: ['AIRS Certified Recruiter'] },
      { dept: humanResources, team: talentTeam, title: 'Technical Recruiter', salary: [80000, 100000], exp: [2, 5], skills: ['Talent Acquisition & Sourcing'], certs: [] },
      { dept: humanResources, team: talentTeam, title: 'HR Analytics & Comp Specialist', salary: [90000, 115000], exp: [3, 7], skills: ['HR Analytics & Workforce Reporting', 'Financial Modeling & Budget Forecasting'], certs: ['People Analytics Wharton'] },
      { dept: humanResources, team: talentTeam, title: 'HR Coordinator & Onboarding Lead', salary: [65000, 85000], exp: [1, 4], skills: ['Talent Acquisition & Sourcing', 'Labor Law & SOC2 Compliance'], certs: [] },

      // Operations (16 employees)
      { dept: operations, team: opsDeliveryTeam, title: 'Director of Service Delivery', salary: [135000, 165000], exp: [8, 14], skills: ['Agile Team Leadership & Scrum', 'Labor Law & SOC2 Compliance'], certs: ['Certified ScrumMaster (CSM)', 'PMP'] },
      { dept: operations, team: opsDeliveryTeam, title: 'Senior Operations Coordinator', salary: [85000, 110000], exp: [4, 8], skills: ['Agile Team Leadership & Scrum'], certs: ['CSM'] },
      { dept: operations, team: opsDeliveryTeam, title: 'Agile Delivery Lead / Scrum Master', salary: [105000, 135000], exp: [5, 9], skills: ['Agile Team Leadership & Scrum', 'TypeScript & JavaScript'], certs: ['Scrum Alliance CSP'] },
      { dept: operations, team: opsDeliveryTeam, title: 'Logistics & Facilities Specialist', salary: [70000, 90000], exp: [2, 5], skills: ['Agile Team Leadership & Scrum'], certs: [] },

      // Finance (14 employees)
      { dept: finance, team: fpAndATeam, title: 'Director of FP&A and Budgeting', salary: [145000, 185000], exp: [8, 15], skills: ['Financial Modeling & Budget Forecasting', 'Labor Law & SOC2 Compliance'], certs: ['CPA', 'CFA'] },
      { dept: finance, team: fpAndATeam, title: 'Senior Financial Analyst', salary: [110000, 135000], exp: [4, 8], skills: ['Financial Modeling & Budget Forecasting'], certs: ['CFA Level 2'] },
      { dept: finance, team: fpAndATeam, title: 'Corporate Staff Accountant', salary: [80000, 100000], exp: [2, 5], skills: ['Financial Modeling & Budget Forecasting'], certs: [] },
      { dept: finance, team: fpAndATeam, title: 'Payroll & Treasury Specialist', salary: [75000, 95000], exp: [2, 6], skills: ['Financial Modeling & Budget Forecasting', 'Labor Law & SOC2 Compliance'], certs: ['Certified Payroll Professional'] },

      // Sales (12 employees)
      { dept: sales, team: salesEnterpriseTeam, title: 'VP of Enterprise Accounts', salary: [150000, 200000], exp: [9, 15], skills: ['Enterprise Solution Selling', 'Financial Modeling & Budget Forecasting'], certs: ['MEDDPICC Master'] },
      { dept: sales, team: salesEnterpriseTeam, title: 'Enterprise Account Executive', salary: [100000, 140000], exp: [4, 8], skills: ['Enterprise Solution Selling'], certs: ['MEDDPICC Certified'] },
      { dept: sales, team: salesEnterpriseTeam, title: 'Sales Solutions Consultant', salary: [95000, 130000], exp: [3, 7], skills: ['Enterprise Solution Selling', 'TypeScript & JavaScript'], certs: [] },
      { dept: sales, team: salesEnterpriseTeam, title: 'Business Development Representative', salary: [68000, 88000], exp: [1, 3], skills: ['Enterprise Solution Selling'], certs: [] },
    ];

    const locations: WorkLocation[] = ['Headquarters', 'Remote', 'Regional Office', 'Branch Office'];
    const empTypes: EmploymentType[] = ['Full-Time', 'Full-Time', 'Full-Time', 'Full-Time', 'Contractor', 'Part-Time', 'Intern'];
    const statuses: EmployeeStatus[] = ['active', 'active', 'active', 'active', 'active', 'active', 'on-leave', 'probation'];

    const employeesData: any[] = [];
    const usedEmails = new Set<string>();

    for (let i = 1; i <= 100; i++) {
      const empNum = 100 + i;
      const empId = `EMP-${String(empNum).padStart(5, '0')}`;
      
      const firstName = FIRST_NAMES[(i - 1) % FIRST_NAMES.length] ?? 'Employee';
      const lastName = LAST_NAMES[(i - 1 + Math.floor(i / FIRST_NAMES.length)) % LAST_NAMES.length] ?? 'User';
      
      let baseEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@workforce.internal`;
      if (usedEmails.has(baseEmail)) {
        baseEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@workforce.internal`;
      }
      usedEmails.add(baseEmail);

      const profile = jobProfiles[(i - 1) % jobProfiles.length]!;
      const location = locations[(i - 1) % locations.length] ?? 'Headquarters';
      const empType = empTypes[(i - 1) % empTypes.length] ?? 'Full-Time';
      
      // Keep first 85 active, some on-leave, some probation, 2 terminated
      let status: EmployeeStatus = statuses[(i - 1) % statuses.length] ?? 'active';
      if (i === 98 || i === 99) status = 'terminated';

      const expMin = profile.exp[0] ?? 2;
      const expMax = profile.exp[1] ?? 6;
      const experienceYears = Math.floor(expMin + Math.random() * (expMax - expMin + 1));

      const salMin = profile.salary[0] ?? 75000;
      const salMax = profile.salary[1] ?? 120000;
      const salary = Math.floor(salMin + Math.random() * (salMax - salMin));

      // Random hire date between 2020 and 2025
      const hireYear = 2020 + (i % 6);
      const hireMonth = (i % 12) + 1;
      const hireDay = ((i * 3) % 28) + 1;
      const hireDate = new Date(`${hireYear}-${String(hireMonth).padStart(2, '0')}-${String(hireDay).padStart(2, '0')}`);

      const skills = profile.skills.map((s, idx) => ({
        skillName: s,
        proficiencyLevel: Math.min(5, Math.max(2, 3 + ((i + idx) % 3))),
      }));

      employeesData.push({
        employeeId: empId,
        firstName,
        lastName,
        email: baseEmail,
        phone: `+1 (555) ${String(100 + (i * 7) % 900)}-${String(1000 + (i * 37) % 9000)}`,
        departmentId: profile.dept._id,
        teamId: profile.team?._id || null,
        jobTitle: profile.title,
        employmentType: empType,
        status,
        location,
        hireDate,
        exitDate: status === 'terminated' ? new Date('2026-01-15') : undefined,
        experienceYears,
        skills,
        certifications: profile.certs,
        salary,
        isDeleted: false,
      });
    }

    await EmployeeModel.insertMany(employeesData);
    console.log(`✅ Seeded ${employeesData.length} employees successfully!`);

    // 7. Training Courses
    await TrainingModel.deleteMany({});
    const trainingCourses = [
      {
        title: 'Advanced TypeScript & Production Architecture',
        courseCode: 'TRN-TS-401',
        targetSkillName: 'TypeScript & JavaScript',
        category: 'technical',
        provider: 'Enterprise Tech Academy',
        durationHours: 25,
        enrolledCount: 38,
        completionRate: 88,
        averageAssessmentScore: 92,
        status: 'active',
        description: 'Deep dive into TypeScript 5 generics, utility types, AST, and strict runtime validators.',
      },
      {
        title: 'Kubernetes & Service Mesh Operations',
        courseCode: 'TRN-K8S-501',
        targetSkillName: 'Cloud & Kubernetes (AWS/Azure)',
        category: 'technical',
        provider: 'Cloud Native Org',
        durationHours: 40,
        enrolledCount: 24,
        completionRate: 80,
        averageAssessmentScore: 88,
        status: 'active',
        description: 'Hands-on enterprise cluster scaling, multi-region failover, and zero-trust mesh.',
      },
      {
        title: 'People Analytics & Strategic HR Metrics',
        courseCode: 'TRN-HR-302',
        targetSkillName: 'HR Analytics & Workforce Reporting',
        category: 'leadership',
        provider: 'Wharton Exec Ed',
        durationHours: 20,
        enrolledCount: 16,
        completionRate: 92,
        averageAssessmentScore: 95,
        status: 'active',
        description: 'Connecting retention KPIs, attrition modeling, and headcount forecasting.',
      },
      {
        title: 'SOC2 Type II Audit & Enterprise Compliance',
        courseCode: 'TRN-CMP-201',
        targetSkillName: 'Labor Law & SOC2 Compliance',
        category: 'compliance',
        provider: 'Compliance Online',
        durationHours: 12,
        enrolledCount: 65,
        completionRate: 100,
        averageAssessmentScore: 98,
        status: 'active',
        description: 'Mandatory annual enterprise data governance, access controls, and security policies.',
      },
      {
        title: 'Modern React 18 Architecture & UI Optimization',
        courseCode: 'TRN-RCT-305',
        targetSkillName: 'React 18 & State Architecture',
        category: 'technical',
        provider: 'Frontend Masters',
        durationHours: 22,
        enrolledCount: 32,
        completionRate: 85,
        averageAssessmentScore: 90,
        status: 'active',
        description: 'Component architecture, concurrent rendering, and performance profiling.',
      },
    ];
    await TrainingModel.insertMany(trainingCourses);

    // 8. Open Requisitions
    await RecruitmentModel.deleteMany({});
    const requisitions = [
      {
        requisitionId: 'REQ-2026-001',
        jobTitle: 'Principal Software Architect',
        department: 'Engineering & Technology',
        location: 'Global Headquarters',
        openPositions: 2,
        status: 'open',
        metrics: { applicationsCount: 45, shortlistedCount: 12, interviewedCount: 6, offeredCount: 1, hiredCount: 0, costPerHire: 6000, timeToHireDays: 45 },
      },
      {
        requisitionId: 'REQ-2026-002',
        jobTitle: 'Senior Full Stack Engineer',
        department: 'Engineering & Technology',
        location: 'West Coast Innovation Hub',
        openPositions: 4,
        status: 'interviewing',
        metrics: { applicationsCount: 120, shortlistedCount: 28, interviewedCount: 14, offeredCount: 3, hiredCount: 1, costPerHire: 4200, timeToHireDays: 30 },
      },
      {
        requisitionId: 'REQ-2026-003',
        jobTitle: 'Technical Recruiter',
        department: 'Human Resources',
        location: 'Global Headquarters',
        openPositions: 1,
        status: 'open',
        metrics: { applicationsCount: 34, shortlistedCount: 8, interviewedCount: 4, offeredCount: 0, hiredCount: 0, costPerHire: 3500, timeToHireDays: 25 },
      },
      {
        requisitionId: 'REQ-2026-004',
        jobTitle: 'Senior Financial Analyst',
        department: 'Finance & Accounting',
        location: 'EMEA Regional Office',
        openPositions: 2,
        status: 'open',
        metrics: { applicationsCount: 28, shortlistedCount: 9, interviewedCount: 3, offeredCount: 1, hiredCount: 0, costPerHire: 4800, timeToHireDays: 32 },
      },
    ];
    await RecruitmentModel.insertMany(requisitions);

    // 9. Placement Analytics Records (35 records)
    await PlacementModel.deleteMany({});
    const placementEmployers = [
      'TechCorp Global', 'Apex Data Systems', 'NexaCloud Platforms', 
      'Metro Financial Group', 'Sterling Global Logistics', 'CyberGuard Enterprise', 
      'OmniHealth Solutions', 'Pinnacle Systems Tech'
    ];
    const placementDomains = [
      { domain: 'Cloud & DevOps', role: 'Cloud Solutions Engineer', dept: 'Engineering & Technology', sal: 115000 },
      { domain: 'Full Stack Development', role: 'Senior React Developer', dept: 'Engineering & Technology', sal: 120000 },
      { domain: 'Data Science & AI', role: 'Machine Learning Engineer', dept: 'Engineering & Technology', sal: 135000 },
      { domain: 'Cyber Security', role: 'Information Security Analyst', dept: 'Engineering & Technology', sal: 110000 },
      { domain: 'People Analytics', role: 'HR Operations Partner', dept: 'Human Resources', sal: 88000 },
      { domain: 'Financial Modeling', role: 'Financial Systems Analyst', dept: 'Finance & Accounting', sal: 95000 },
      { domain: 'Operations Architecture', role: 'Logistics Project Specialist', dept: 'Operations & Logistics', sal: 85000 },
      { domain: 'Enterprise SaaS Sales', role: 'Enterprise Account Executive', dept: 'Enterprise Sales', sal: 125000 },
    ];
    const placementStatuses: Array<'placed' | 'in-training' | 'interviewing' | 'retained' | 'opted-out'> = [
      'placed', 'placed', 'placed', 'placed', 'placed', 'placed', 'placed', 'placed', 'placed', 'placed',
      'placed', 'placed', 'placed', 'placed', 'placed', 'placed', 'placed', 'placed', 'placed', 'placed',
      'in-training', 'in-training', 'in-training', 'in-training', 'in-training', 'in-training', 'in-training', 'in-training',
      'interviewing', 'interviewing', 'interviewing', 'interviewing',
      'retained', 'retained',
      'opted-out'
    ];

    const placementsData = [];
    for (let i = 0; i < 35; i++) {
      const fName = FIRST_NAMES[(i * 3 + 7) % FIRST_NAMES.length] || 'Alex';
      const lName = LAST_NAMES[(i * 5 + 11) % LAST_NAMES.length] || 'Taylor';
      const domainObj = placementDomains[i % placementDomains.length] || placementDomains[0]!;
      const status = placementStatuses[i] || 'placed';
      const days = 20 + ((i * 7) % 45);
      const employer = placementEmployers[i % placementEmployers.length] || 'TechCorp Global';
      const loc = locationsConfig[i % locationsConfig.length]?.name || 'Global Headquarters';
      const pDate = new Date(Date.now() - (i * 9 + 5) * 24 * 60 * 60 * 1000);

      placementsData.push({
        candidateId: `PLC-2026-${String(i + 1).padStart(3, '0')}`,
        candidateName: `${fName} ${lName}`,
        email: `${fName.toLowerCase()}.${lName.toLowerCase()}@talentplacement.io`,
        department: domainObj.dept,
        skillDomain: domainObj.domain,
        targetRole: domainObj.role,
        location: loc,
        offeredSalary: domainObj.sal + ((i % 5) * 3500),
        status,
        placementDate: ['placed', 'retained'].includes(status) ? pDate : undefined,
        placementDurationDays: days,
        employerName: employer,
        notes: `Candidate verified through ${domainObj.domain} technical track assessment.`,
      });
    }
    await PlacementModel.insertMany(placementsData);
    console.log(`✅ Seeded ${placementsData.length} placement records successfully!`);

    // 10. Candidate Applications (60 records)
    await CandidateApplicationModel.deleteMany({});
    const sourceChannels: Array<'LinkedIn' | 'Referral' | 'Career Portal' | 'Agency' | 'Campus' | 'Direct Outreach'> = [
      'LinkedIn', 'Referral', 'Career Portal', 'Agency', 'Campus', 'Direct Outreach',
      'LinkedIn', 'Referral', 'Career Portal', 'LinkedIn', 'Referral', 'LinkedIn'
    ];
    const stages: Array<'applied' | 'shortlisted' | 'interviewing' | 'offered' | 'hired' | 'rejected' | 'withdrawn'> = [
      'applied', 'applied', 'applied', 'applied', 'shortlisted', 'shortlisted', 'shortlisted',
      'interviewing', 'interviewing', 'interviewing', 'offered', 'offered', 'hired', 'rejected', 'withdrawn'
    ];

    const candidateApplicationsData = [];
    for (let i = 0; i < 60; i++) {
      const fName = FIRST_NAMES[(i * 4 + 3) % FIRST_NAMES.length] || 'Jordan';
      const lName = LAST_NAMES[(i * 6 + 9) % LAST_NAMES.length] || 'Smith';
      const req = requisitions[i % requisitions.length] || requisitions[0]!;
      const source = sourceChannels[i % sourceChannels.length] || 'LinkedIn';
      const stage = stages[i % stages.length] || 'applied';
      const appDate = new Date(Date.now() - (i * 3 + 2) * 24 * 60 * 60 * 1000);
      const daysInPipeline = 5 + ((i * 3) % 35);
      const score = Number((7.0 + ((i % 30) * 0.1)).toFixed(1));
      const sourceCost = 800 + ((i * 120) % 3000);

      candidateApplicationsData.push({
        candidateId: `APP-2026-${String(i + 1).padStart(3, '0')}`,
        candidateName: `${fName} ${lName}`,
        email: `${fName.toLowerCase()}.${lName.toLowerCase()}@candidate-inbox.com`,
        phone: `+1 (555) 780-${String(1000 + i * 17).slice(0, 4)}`,
        requisitionId: req.requisitionId,
        jobTitle: req.jobTitle,
        department: req.department,
        location: req.location,
        sourceChannel: source,
        stage,
        appliedDate: appDate,
        shortlistedDate: ['shortlisted', 'interviewing', 'offered', 'hired'].includes(stage) ? new Date(appDate.getTime() + 4 * 86400000) : undefined,
        interviewDate: ['interviewing', 'offered', 'hired'].includes(stage) ? new Date(appDate.getTime() + 10 * 86400000) : undefined,
        offerDate: ['offered', 'hired'].includes(stage) ? new Date(appDate.getTime() + 18 * 86400000) : undefined,
        hireDate: stage === 'hired' ? new Date(appDate.getTime() + 25 * 86400000) : undefined,
        rejectionReason: stage === 'rejected' ? 'Candidate experience didn\'t meet minimum senior requirements' : undefined,
        offeredSalary: ['offered', 'hired'].includes(stage) ? 120000 + (i * 2000) : undefined,
        acceptedOffer: stage === 'hired' ? true : stage === 'offered' ? undefined : false,
        interviewScore: score,
        timeInPipelineDays: daysInPipeline,
        costToSource: sourceCost,
      });
    }
    await CandidateApplicationModel.insertMany(candidateApplicationsData);
    console.log(`✅ Seeded ${candidateApplicationsData.length} candidate applications successfully!`);

    // 11. Employee Training Enrollments (75 records)
    await EnrollmentModel.deleteMany({});
    const allEmployees = await EmployeeModel.find({ isDeleted: false }).limit(60);
    const allCourses = await TrainingModel.find({});

    const enrollmentsData = [];
    const enrollmentStatuses: Array<'enrolled' | 'in-progress' | 'completed' | 'dropped'> = [
      'completed', 'completed', 'completed', 'completed', 'completed', 'completed',
      'in-progress', 'in-progress', 'in-progress', 'enrolled', 'dropped'
    ];

    let count = 0;
    for (let i = 0; i < allEmployees.length && count < 75; i++) {
      const emp = allEmployees[i];
      if (!emp) continue;
      // assign 1 to 2 courses per employee
      const courseA = allCourses[i % allCourses.length] || allCourses[0];
      const courseB = allCourses[(i + 2) % allCourses.length] || allCourses[1] || allCourses[0];
      const coursesToAssign = [courseA, courseB].filter(Boolean);

      for (const course of coursesToAssign) {
        if (!course || count >= 75) break;
        const status = enrollmentStatuses[count % enrollmentStatuses.length] || 'completed';
        const progress = status === 'completed' ? 100 : status === 'in-progress' ? 35 + ((count * 9) % 55) : status === 'enrolled' ? 5 : 20;
        const preScore = 52 + ((count * 3) % 24);
        const postScore = status === 'completed' ? 82 + ((count * 2) % 17) : undefined;
        const skillGain = status === 'completed' ? Number((1.1 + ((count % 10) * 0.15)).toFixed(1)) : 0.4;
        const certIssued = status === 'completed';
        const certId = certIssued ? `CERT-2026-${String(1000 + count)}` : undefined;
        const rating = status === 'completed' ? (4 + (count % 2)) : undefined;

        const deptName = (emp.departmentId as any)?.name || 'Engineering & Technology';

        enrollmentsData.push({
          employeeId: emp._id,
          employeeName: `${emp.firstName} ${emp.lastName}`,
          department: deptName,
          courseId: course._id,
          courseTitle: course.title,
          courseCode: course.courseCode,
          targetSkillName: course.targetSkillName,
          category: course.category,
          enrollmentDate: new Date(Date.now() - (count * 4 + 10) * 86400000),
          completionDate: status === 'completed' ? new Date(Date.now() - (count * 2 + 1) * 86400000) : undefined,
          status,
          progressPercentage: progress,
          assessmentScore: postScore,
          preAssessmentScore: preScore,
          skillGainPoints: skillGain,
          certificateIssued: certIssued,
          certificateId: certId,
          feedbackRating: rating,
        });
        count++;
      }
    }
    await EnrollmentModel.insertMany(enrollmentsData);
    console.log(`✅ Seeded ${enrollmentsData.length} employee training enrollments successfully!`);

    // 12. Sprint 3: Attrition Flight Risk Telemetry (for 100 employees)
    await AttritionRiskModel.deleteMany({});
    const all100Employees = await EmployeeModel.find({ isDeleted: false });
    const attritionData = [];

    const driverPool = [
      { factor: 'Below-Market Compensation', impact: 'critical' as const, description: 'Base pay is 18% below P75 industry benchmark for senior tier' },
      { factor: 'Elevated Overtime & Burnout', impact: 'high' as const, description: 'Consistent >28 hours overtime logged per month over past 2 quarters' },
      { factor: 'Stagnant Career Trajectory', impact: 'high' as const, description: 'No level advancement or role mobility in 34 months' },
      { factor: 'Limited Upskilling Pathway', impact: 'moderate' as const, description: 'Completed fewer than 2 professional certifications in 18 months' },
      { factor: 'Commute & Remote Friction', impact: 'moderate' as const, description: 'Relocation distance >35 miles with high in-office mandate' },
      { factor: 'Peer Skill Density Gap', impact: 'low' as const, description: 'Skill disparity compared to cohort average' },
    ];

    const recommendationPool = [
      'Conduct retention stay interview and executive 1-on-1 within 14 days',
      'Accelerate compensation review against P75 market rate',
      'Allocate $3,500 specialized certification stipend & conference pass',
      'Offer flexible hybrid schedule (3 days remote)',
      'Assign cross-functional tech lead mentorship track',
      'Enroll in accelerated managerial leadership pathway',
    ];

    for (let i = 0; i < all100Employees.length; i++) {
      const emp = all100Employees[i];
      if (!emp) continue;
      const salary = emp.salary || 95000;
      const deptName = (emp.departmentId as any)?.name || 'Engineering & Technology';
      const roleTitle = emp.jobTitle || 'Software Engineer';
      const locName = emp.location || 'New York HQ';

      // Distribute realistic flight risks:
      // ~6% Critical (75-95), ~14% High (50-74), ~25% Medium (30-49), ~55% Low (5-29)
      let score: number;
      if (i % 16 === 0) {
        score = 75 + ((i * 3) % 21); // Critical: 75-95
      } else if (i % 7 === 0) {
        score = 52 + ((i * 5) % 21); // High: 52-72
      } else if (i % 3 === 0) {
        score = 30 + ((i * 4) % 19); // Medium: 30-48
      } else {
        score = 8 + ((i * 3) % 21); // Low: 8-28
      }

      let riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
      let timeframe: '0-3 Months' | '3-6 Months' | '6-12 Months' | 'Low Risk';

      if (score >= 75) {
        riskLevel = 'Critical';
        timeframe = '0-3 Months';
      } else if (score >= 50) {
        riskLevel = 'High';
        timeframe = '3-6 Months';
      } else if (score >= 30) {
        riskLevel = 'Medium';
        timeframe = '6-12 Months';
      } else {
        riskLevel = 'Low';
        timeframe = 'Low Risk';
      }

      const hireDate = emp.hireDate ? new Date(emp.hireDate) : new Date(Date.now() - (12 + (i * 2)) * 30 * 86400000);
      const tenureMonths = isNaN(hireDate.getTime()) ? 18 : Math.max(6, Math.floor((Date.now() - hireDate.getTime()) / (30 * 86400000)));
      const marketSalaryMedian = Math.round(salary * (1 + ((score > 50 ? (score - 40) * 0.4 : 5) / 100)));
      const salaryGapPct = Number((((marketSalaryMedian - salary) / marketSalaryMedian) * 100).toFixed(1));

      const selectedDrivers = [];
      if (riskLevel === 'Critical' || riskLevel === 'High') {
        selectedDrivers.push({
          ...driverPool[0],
          weight: 40 + ((i * 2) % 15),
        });
        selectedDrivers.push({
          ...driverPool[1 + (i % 2)],
          weight: 30 + ((i * 3) % 15),
        });
        if (riskLevel === 'Critical') {
          selectedDrivers.push({
            ...driverPool[3 + (i % 3)],
            weight: 20 + ((i * 2) % 10),
          });
        }
      } else if (riskLevel === 'Medium') {
        selectedDrivers.push({
          ...driverPool[3 + (i % 3)],
          weight: 35 + ((i * 2) % 15),
        });
        selectedDrivers.push({
          ...driverPool[4 + (i % 2)],
          weight: 25 + ((i * 3) % 10),
        });
      } else {
        selectedDrivers.push({
          ...driverPool[5],
          weight: 15,
        });
      }

      const selectedRecs = [
        recommendationPool[i % recommendationPool.length],
        recommendationPool[(i + 2) % recommendationPool.length],
      ];
      if (riskLevel === 'Critical') {
        selectedRecs.push(recommendationPool[(i + 4) % recommendationPool.length]);
      }

      const replacementCost = Math.round(salary * 1.25);
      const retentionCost = Math.round(salary * 0.12);
      const retentionRoi = replacementCost - retentionCost;

      attritionData.push({
        employeeId: emp._id,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        department: deptName,
        role: roleTitle,
        location: locName,
        tenureMonths,
        currentSalary: salary,
        marketSalaryMedian,
        salaryGapPercentage: salaryGapPct,
        performanceScore: Number((3.0 + ((i % 20) * 0.1)).toFixed(1)),
        overtimeHoursMonthly: riskLevel === 'Critical' ? 32 + (i % 12) : riskLevel === 'High' ? 22 + (i % 10) : 6 + (i % 8),
        riskScore: score,
        riskLevel,
        predictedTimeframe: timeframe,
        keyDrivers: selectedDrivers,
        recommendations: selectedRecs,
        replacementCost,
        retentionCost,
        retentionRoi,
        lastAssessmentDate: new Date(),
        status: (riskLevel === 'Critical' && i % 2 === 0 ? 'mitigating' : 'active') as 'active' | 'mitigating' | 'resolved' | 'departed',
      });
    }
    await AttritionRiskModel.insertMany(attritionData);
    console.log(`✅ Seeded ${attritionData.length} employee attrition risk records successfully!`);

    // 13. Sprint 3: Workforce Demand Forecasts (30 records across horizons & scenarios)
    await DemandForecastModel.deleteMany({});
    const forecastConfigs = [
      // Engineering
      { dept: 'Engineering & Technology', role: 'Senior Cloud & DevOps Architect', cur: 14, p6: 18, p12: 24, p24: 32, skills: ['Kubernetes & Service Mesh', 'Terraform & IaC', 'Multi-Cloud Architecture', 'eBPF Observability'], shrink: ['Manual Server Configuration', 'Legacy Shell Scripting'] },
      { dept: 'Engineering & Technology', role: 'Full-Stack Software Engineer', cur: 28, p6: 32, p12: 38, p24: 46, skills: ['React 19 & Next.js', 'Node.js & TypeScript', 'GraphQL & REST', 'Docker'], shrink: ['jQuery & Monolith Templates', 'Legacy JSP'] },
      { dept: 'Engineering & Technology', role: 'Data & AI Systems Engineer', cur: 10, p6: 15, p12: 22, p24: 30, skills: ['Generative AI & LLM Systems', 'PyTorch & Transformers', 'Vector DBs (Pinecone/Milvus)', 'Data Pipeline Architecture'], shrink: ['Traditional ETL Tooling', 'Basic SQL Scripting'] },
      
      // Sales
      { dept: 'Enterprise Sales', role: 'Enterprise Account Executive', cur: 12, p6: 15, p12: 19, p24: 26, skills: ['SaaS Value Selling', 'Executive C-Suite Pitching', 'Multi-Year Contract Negotiation', 'MEDDPICC Framework'], shrink: ['Cold Outreach List Generation', 'Standard Collateral Presenting'] },
      { dept: 'Enterprise Sales', role: 'Solutions Sales Engineer', cur: 6, p6: 8, p12: 11, p24: 15, skills: ['Technical Architecture Demos', 'Security & SOC2 Objection Handling', 'API Integration Scoping'], shrink: ['Generic Slide Presentations'] },

      // Human Resources
      { dept: 'Human Resources', role: 'Talent Acquisition Partner', cur: 8, p6: 10, p12: 12, p24: 14, skills: ['AI-Driven Talent Sourcing', 'Technical Candidate Assessment', 'Global Mobility & Visa Compliance'], shrink: ['Manual Resume Screening', 'Paper-based HR Records'] },
      { dept: 'Human Resources', role: 'People Analytics Specialist', cur: 4, p6: 6, p12: 8, p24: 10, skills: ['Predictive Attrition Modeling', 'Workforce Capability Planning', 'PowerBI & SQL Analytics'], shrink: ['Static Excel Spreadsheets'] },

      // Finance
      { dept: 'Finance & Accounting', role: 'FP&A Manager & Financial Modeler', cur: 6, p6: 7, p12: 9, p24: 12, skills: ['SaaS Unit Economics & LTV/CAC', 'Automated Rolling Forecasts', 'Capital Allocation Modeling'], shrink: ['Manual Spreadsheet Ledger Entries'] },

      // Operations
      { dept: 'Operations & Logistics', role: 'Service Delivery Coordinator', cur: 12, p6: 14, p12: 16, p24: 18, skills: ['SLA & Service Incident Governance', 'Agile Operations Frameworks', 'Vendor SLA Auditing'], shrink: ['Manual Dispatch Logging'] },
    ];

    const demandForecastData = [];
    const horizons: Array<'6M' | '12M' | '24M'> = ['6M', '12M', '24M'];
    const scenarios: Array<'baseline' | 'expansion' | 'conservative'> = ['baseline', 'expansion', 'conservative'];

    for (const fc of forecastConfigs) {
      for (const scenario of scenarios) {
        const scenarioMultiplier = scenario === 'expansion' ? 1.25 : scenario === 'conservative' ? 0.85 : 1.0;
        for (const hz of horizons) {
          const rawTarget = hz === '6M' ? fc.p6 : hz === '12M' ? fc.p12 : fc.p24;
          const projectedDemand = Math.round(rawTarget * scenarioMultiplier);
          const gap = Math.max(0, projectedDemand - fc.cur);
          const upskillingReq = Math.round(gap * 0.55);
          const hiringReq = gap - upskillingReq;
          const hiringBudget = hiringReq * 14000;
          const upskillingBudget = upskillingReq * 3500;
          const totalBudget = hiringBudget + upskillingBudget;

          demandForecastData.push({
            department: fc.dept,
            targetRole: fc.role,
            timeHorizon: hz,
            currentHeadcount: fc.cur,
            projectedDemand,
            gap,
            hiringRequirement: hiringReq,
            upskillingRequirement: upskillingReq,
            criticalSkills: fc.skills,
            shrinkingSkills: fc.shrink,
            confidenceScore: scenario === 'baseline' ? 88 : scenario === 'conservative' ? 92 : 82,
            scenario,
            estimatedHiringBudget: hiringBudget,
            estimatedUpskillingBudget: upskillingBudget,
            totalBudgetImpact: totalBudget,
            notes: `Forecast calculated using past 18 months growth trajectory, hiring velocity, and product line expansion plans.`,
          });
        }
      }
    }
    await DemandForecastModel.insertMany(demandForecastData);
    console.log(`✅ Seeded ${demandForecastData.length} demand forecast records successfully!`);

    // 14. Sprint 3: Executive Real-Time Workforce Alerts (12 records)
    await WorkforceAlertModel.deleteMany({});
    const alertsData = [
      {
        title: 'Critical Flight Risk: Cloud & DevOps Engineering',
        severity: 'critical' as const,
        category: 'attrition' as const,
        message: '4 Senior Cloud Architects have high flight risk (>80 score) due to a 22% salary gap vs market P75.',
        department: 'Engineering & Technology',
        metrics: { affectedEmployees: 4, replacementExposure: 780000, avgRiskScore: 84 },
        isRead: false,
        isResolved: false,
        actionUrl: '/attrition?department=Engineering%20%26%20Technology&riskLevel=Critical',
        actionLabel: 'View Critical Roster',
        createdAt: new Date(Date.now() - 2 * 3600000), // 2 hours ago
      },
      {
        title: 'Projected Talent Deficit: AI & Data Engineering (12M)',
        severity: 'critical' as const,
        category: 'capacity' as const,
        message: 'Talent supply will be 12 heads short of Q4 project delivery demand unless upskilling is accelerated.',
        department: 'Engineering & Technology',
        metrics: { projectedGap: 12, targetUpskilling: 7, hiringNeeded: 5 },
        isRead: false,
        isResolved: false,
        actionUrl: '/forecasting?department=Engineering%20%26%20Technology',
        actionLabel: 'Launch Simulator',
        createdAt: new Date(Date.now() - 5 * 3600000), // 5 hours ago
      },
      {
        title: 'Elevated Overtime & Burnout Index in Operations',
        severity: 'warning' as const,
        category: 'compliance' as const,
        message: 'Operations & Logistics logged >26 avg overtime hours per employee this month, increasing turnover probability by 18%.',
        department: 'Operations & Logistics',
        metrics: { avgOvertimeHours: 26.4, burnoutRisk: 'Elevated' },
        isRead: false,
        isResolved: false,
        actionUrl: '/attrition?department=Operations%20%26%20Logistics',
        actionLabel: 'Review Workload',
        createdAt: new Date(Date.now() - 14 * 3600000),
      },
      {
        title: 'Recruitment Bottleneck: Enterprise Account Executive',
        severity: 'warning' as const,
        category: 'recruitment' as const,
        message: 'Requisition REQ-2026-SALES-02 has been open for 48 days with 3 offers declined due to equity structure.',
        department: 'Enterprise Sales',
        metrics: { openDays: 48, offersDeclined: 3 },
        isRead: true,
        isResolved: false,
        actionUrl: '/recruitment',
        actionLabel: 'Inspect Pipeline',
        createdAt: new Date(Date.now() - 28 * 3600000),
      },
      {
        title: 'Skill Matrix Milestone: 80% Certified in Cloud DevOps',
        severity: 'info' as const,
        category: 'skill_gap' as const,
        message: 'Engineering department has successfully reached the 80% certification milestone in Kubernetes and IaC infrastructure.',
        department: 'Engineering & Technology',
        metrics: { certifiedCount: 22, avgSkillGain: 1.8 },
        isRead: true,
        isResolved: true,
        resolvedAt: new Date(Date.now() - 48 * 3600000),
        actionUrl: '/learning',
        actionLabel: 'View Course Metrics',
        createdAt: new Date(Date.now() - 72 * 3600000),
      },
      {
        title: 'Quarterly Executive Review Pack Ready',
        severity: 'info' as const,
        category: 'capacity' as const,
        message: 'Consolidated workforce health index, retention ROI savings ($1.98M) and 24M hiring projections generated.',
        department: 'Human Resources',
        metrics: { overallHealthIndex: 91, retentionRoiSavings: 1980000 },
        isRead: false,
        isResolved: false,
        actionUrl: '/executive',
        actionLabel: 'Open Cockpit',
        createdAt: new Date(Date.now() - 1 * 3600000),
      },
    ];
    await WorkforceAlertModel.insertMany(alertsData);
    console.log(`✅ Seeded ${alertsData.length} real-time workforce alerts successfully!`);

    // 15. Performance Reviews (200 records across 2026-Q1 & 2026-Q2)
    await PerformanceModel.deleteMany({});
    const performanceData = [];
    const strengthsPool = [
      'System Architecture & Scalability',
      'Cross-Functional Agile Collaboration',
      'Mentorship & Knowledge Sharing',
      'Rapid Incident Triage & Resolution',
      'Code Quality & Testing Discipline',
      'Strategic Product Alignment',
      'Client Relationship Management',
      'Budget & Financial Accuracy',
    ];
    const improvementPool = [
      'Public Technical Documentation',
      'Delegation & Multi-Project Prioritization',
      'Executive Stakeholder Presenting',
      'Proactive Cross-Department Sync',
      'Expanding Cloud Cost Governance Skills',
    ];

    const cycles = ['2026-Q1', '2026-Q2'];
    for (const cycle of cycles) {
      const evalDate = cycle === '2026-Q1' ? new Date('2026-03-31') : new Date('2026-06-30');
      for (let i = 0; i < all100Employees.length; i++) {
        const emp = all100Employees[i];
        if (!emp) continue;

        const quarterBoost = cycle === '2026-Q2' ? ((i % 5) * 0.1) : 0;
        let score = Number((3.2 + ((i * 7) % 18) * 0.1 + quarterBoost).toFixed(1));
        if (score > 5.0) score = 5.0;
        if (score < 2.0) score = 2.5;

        const goalCompletion = Math.min(100, Math.max(65, 75 + ((i * 11) % 25) + (cycle === '2026-Q2' ? 3 : 0)));

        let readiness: 'ready-now' | 'ready-in-1-year' | 'not-ready' | 'needs-development';
        if (score >= 4.4) readiness = 'ready-now';
        else if (score >= 3.6) readiness = 'ready-in-1-year';
        else if (score >= 3.0) readiness = 'not-ready';
        else readiness = 'needs-development';

        const empStrengths = [
          strengthsPool[i % strengthsPool.length]!,
          strengthsPool[(i + 3) % strengthsPool.length]!,
        ];
        const empImprovements = [
          improvementPool[i % improvementPool.length]!,
        ];

        performanceData.push({
          employeeId: emp._id,
          reviewCycle: cycle,
          performanceScore: score,
          goalCompletionRate: goalCompletion,
          strengths: empStrengths,
          areasOfImprovement: empImprovements,
          promotionReadiness: readiness,
          feedbackNotes: `Demonstrated strong commitment during ${cycle} deliverables with a ${goalCompletion}% milestone completion rate.`,
          evaluatedAt: evalDate,
        });
      }
    }
    await PerformanceModel.insertMany(performanceData);
    console.log(`✅ Seeded ${performanceData.length} employee performance review records successfully!`);

    // 16. Audit & Compliance Logs (30 records)
    await AuditLogModel.deleteMany({});
    const auditActions: Array<{ action: any; desc: string; entity: string; role: string; user: string; email: string }> = [
      { action: 'AUTH_LOGIN', desc: 'Secure WebAuthn passkey authentication successful', entity: 'User', role: 'admin', user: 'Alexander Wright', email: 'alexander.wright@workforce.internal' },
      { action: 'PREDICTION_VIEW', desc: 'Accessed Enterprise Attrition Risk & Flight Telemetry Roster', entity: 'AttritionRisk', role: 'hr_manager', user: 'Elena Rostova', email: 'elena.rostova@workforce.internal' },
      { action: 'SCENARIO_SIMULATE', desc: 'Executed 24M Expansion What-If Headcount Simulation (Budget: $2.4M)', entity: 'DemandForecast', role: 'executive', user: 'Marcus Chen', email: 'marcus.chen@workforce.internal' },
      { action: 'REPORT_EXPORT', desc: 'Exported Executive Summary Report (Format: XLSX)', entity: 'Reports', role: 'executive', user: 'Sophia Alvarez', email: 'sophia.alvarez@workforce.internal' },
      { action: 'ATTRITION_STATUS_UPDATE', desc: 'Updated EMP-00104 status to MITIGATING with retention package', entity: 'AttritionRisk', role: 'hr_manager', user: 'Elena Rostova', email: 'elena.rostova@workforce.internal' },
      { action: 'EMPLOYEE_UPDATE', desc: 'Updated department transfer and compensation level for EMP-00112', entity: 'Employee', role: 'admin', user: 'Alexander Wright', email: 'alexander.wright@workforce.internal' },
      { action: 'REPORT_EXPORT', desc: 'Exported Skill Gap Matrix Report (Format: CSV)', entity: 'Reports', role: 'dept_manager', user: 'David Kim', email: 'david.kim@workforce.internal' },
      { action: 'AUTH_LOGIN', desc: 'Standard password login with MFA verification', entity: 'User', role: 'employee', user: 'Jonathan Vance', email: 'jonathan.vance@workforce.internal' },
      { action: 'SCENARIO_SIMULATE', desc: 'Executed Conservative Cost Reduction Simulation (Headcount: -5%)', entity: 'DemandForecast', role: 'dept_manager', user: 'Rachel Green', email: 'rachel.green@workforce.internal' },
      { action: 'ROLE_PERMISSION_CHANGE', desc: 'Granted talent pipeline view permission to Team Lead cohort', entity: 'Role', role: 'admin', user: 'Alexander Wright', email: 'alexander.wright@workforce.internal' },
    ];

    const auditData = [];
    for (let i = 0; i < 30; i++) {
      const template = auditActions[i % auditActions.length]!;
      const timeOffsetMs = (i * 3.5 + 0.5) * 3600000;
      auditData.push({
        actorName: template.user,
        actorEmail: template.email,
        actorRole: template.role,
        action: template.action,
        entityType: template.entity,
        entityId: `ENT-2026-${String(100 + i)}`,
        description: template.desc,
        ipAddress: `192.168.1.${10 + (i % 40)}`,
        status: i === 7 ? 'WARNING' : 'SUCCESS',
        createdAt: new Date(Date.now() - timeOffsetMs),
      });
    }
    await AuditLogModel.insertMany(auditData);
    console.log(`✅ Seeded ${auditData.length} compliance audit log entries successfully!`);

    console.log('✅ Enterprise seed successfully finished with 100 employees and Sprint 1, 2 & 3 analytics data!');
  } catch (error) {
    console.error('❌ Failed to seed database:', error);
  }
};


