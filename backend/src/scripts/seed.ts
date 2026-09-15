import { DepartmentModel } from '../modules/departments/models/Department.model';
import { EmployeeModel, EmployeeStatus, EmploymentType, WorkLocation } from '../modules/employees/models/Employee.model';
import { LocationModel } from '../modules/locations/models/Location.model';
import { RoleModel } from '../modules/roles/models/Role.model';
import { SkillModel } from '../modules/skills/models/Skill.model';
import { TeamModel } from '../modules/teams/models/Team.model';
import { TrainingModel } from '../modules/training/models/Training.model';
import { RecruitmentModel } from '../modules/recruitment/models/Recruitment.model';

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
    await LocationModel.insertMany([
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
    ]);

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
        location: 'Headquarters',
        openPositions: 2,
        status: 'open',
        metrics: { applicationsCount: 45, shortlistedCount: 12, interviewedCount: 6, offeredCount: 1, hiredCount: 0, costPerHire: 6000, timeToHireDays: 45 },
      },
      {
        requisitionId: 'REQ-2026-002',
        jobTitle: 'Senior Full Stack Engineer',
        department: 'Engineering & Technology',
        location: 'San Francisco',
        openPositions: 4,
        status: 'interviewing',
        metrics: { applicationsCount: 120, shortlistedCount: 28, interviewedCount: 14, offeredCount: 3, hiredCount: 1, costPerHire: 4200, timeToHireDays: 30 },
      },
      {
        requisitionId: 'REQ-2026-003',
        jobTitle: 'Technical Recruiter',
        department: 'Human Resources',
        location: 'New York',
        openPositions: 1,
        status: 'open',
        metrics: { applicationsCount: 34, shortlistedCount: 8, interviewedCount: 4, offeredCount: 0, hiredCount: 0, costPerHire: 3500, timeToHireDays: 25 },
      },
      {
        requisitionId: 'REQ-2026-004',
        jobTitle: 'Senior Financial Analyst',
        department: 'Finance & Accounting',
        location: 'London',
        openPositions: 2,
        status: 'open',
        metrics: { applicationsCount: 28, shortlistedCount: 9, interviewedCount: 3, offeredCount: 1, hiredCount: 0, costPerHire: 4800, timeToHireDays: 32 },
      },
    ];
    await RecruitmentModel.insertMany(requisitions);

    console.log('✅ Enterprise seed successfully finished with 100 employees!');
  } catch (error) {
    console.error('❌ Failed to seed database:', error);
  }
};
