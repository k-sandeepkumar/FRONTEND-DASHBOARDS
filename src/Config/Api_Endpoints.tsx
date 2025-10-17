// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD 
    ? 'https://oms-backend-camelq.up.railway.app' 
    : 'https://oms-backend-camelq.up.railway.app'); // Always use backend URL

// Helper function to get full API URL
export const getApiUrl = (path) => {
  if (path.startsWith('http')) return path; // Already full URL
  return `${API_BASE_URL}${path.startsWith('/') ? path : '/' + path}`;
};

export const Api_EndPoints = {
  LOGIN: getApiUrl('/auth/login'),
  FORGOT_PASSWORD: getApiUrl('/auth/forgot-password'),
  SEND_OTP: getApiUrl('/auth/send-otp'),
  RESET_PASSWORD_OTP: getApiUrl('/auth/reset-password-otp'),
  PROFILE_API: getApiUrl('employees/getMyProfile'),
  CREATEEMPLOYEE_API: getApiUrl('/employees/createEmp'),
  UPDATEEMPLOYEE_API: getApiUrl('/employees'),
  DELETEEMPLOYEE_API: getApiUrl('/employees'),
  EMPLOYEES_API: getApiUrl('/employees/getAll'),
  EMPLOYEMENTTYPES_API: getApiUrl('/enums/employment_type'),
  DEPARTMENTS_API: getApiUrl('/department/get_dept'),
  DESIGNATION_API: getApiUrl('/designation/getDesg'),
  ROLES_API: getApiUrl('/roles/get_Roles'),
  BRANCHES_API: getApiUrl('/branches/getAllBranches'),
  WORKSHIFT_API: getApiUrl('/enums/work_shift'),
  MARRIAGESTATUS_API: getApiUrl('/enums/marriageStatus'),
  BLOODGROUP_API: getApiUrl('/enums/blood_group'),
  GENDER_API: getApiUrl('/enums/gender'),
  // Bug Management APIs
  BUGS_API: getApiUrl('/bugs'),
  PRODUCTS_API: getApiUrl('/products'),
  // HR Management APIs
  HR_POLICIES_API: getApiUrl('/hr-policies'),
  EMPLOYEE_PROMOTIONS_API: getApiUrl('/employee-promotions'),
  RESIGNATIONS_API: getApiUrl('/resignations'),
  EMPLOYEE_TRANSFERS_API: getApiUrl('/employee-transfers'),
  ROLES_CREATE_API: getApiUrl('/roles/create_Roles'),
  DEPARTMENTS_CREATE_API: getApiUrl('/department/create_dept'),
  DESIGNATION_CREATE_API: getApiUrl('/designation/create_Designation'),
  BRANCHES_CREATE_API: getApiUrl('/branches/create_branch'),
  EMPLOYEMENTTYPES_CREATE_API: getApiUrl('/enums/employment_type'),
  WORKSHIFT_CREATE_API: getApiUrl('/enums/work_shift'),
  MARRIAGESTATUS_CREATE_API: getApiUrl('/enums/marriageStatus'),
  BLOODGROUP_CREATE_API: getApiUrl('/enums/blood_group'),
  GENDER_CREATE_API: getApiUrl('/enums/gender'),
};

export const FrontendRoutes = {
  PROFILE: '/ceo/profile',
};
export default API_BASE_URL;


