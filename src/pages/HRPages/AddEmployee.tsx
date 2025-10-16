import { Api_EndPoints } from "@/Config/Api_Endpoints";
import api from "@/lib/axios";
import axios from "axios";
import { useEffect, useState } from "react";

function AddEmployee() {
  const initialFormState = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    passwordHash: "",
    roleId: "",
    departmentId: "",
    designationId: "",
    branchId: "",
    dob: "",
    doj: "",
    employmentType: "",
    workShift: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    aadhaarNumber: "",
    panNumber: "",
    licenseNumber: "",
    passportNumber: "",
    marrital_status: "",
    bloodGroup: "",
    gender: "",
    bank_name: "",
    accountNumber: "",
    ifsc_code: "",
    branch_name: "",
    emergency_contact_name: "",
    emergency_contact_relation: "",
    emergency_contact_number: "",
    Specification: "",
    stream: "",
    institution: "",
    yearOfPassing: "",
    CGPA: "",
    previouscompanyName: "",
    previousdesignation: "",
    startDate: "",
    endDate: "",
    experienceYears: "",
    responsibilities: "",
    skillsUsed: "",
  };

  const [employees, setEmployees] = useState<any[]>([]);
  const [form, setForm] = useState(initialFormState);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [viewEmployee, setViewEmployee] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);
  const [designations, setDesignations] = useState<{ id: number; title: string }[]>([]);
  const [branches, setBranches] = useState<{ id: number; name: string }[]>([]);
  const [employmentTypes, setEmploymentTypes] = useState<{ name: string }[]>([]);
  const [marritalStatus, setmarritalStatus] = useState<{ name: string }[]>([]);
  const [genders, setgenders] = useState<{ name: string }[]>([]);
  const [bloodGroups, setbloodGroups] = useState<{ name: string }[]>([]);
  const [workshifts, setWorkshifts] = useState<{ name: string }[]>([]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token") || "";
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees", getAuthHeaders());
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();

    axios
      .get(Api_EndPoints.ROLES_API, getAuthHeaders())
      .then((res) => setRoles(res.data.map((r: any) => ({ id: r.roleId, name: r.name }))))
      .catch(() => setRoles([{ id: 1, name: "Default Role" }]));

    axios
      .get(Api_EndPoints.DEPARTMENTS_API, getAuthHeaders())
      .then((res) => setDepartments(res.data.map((d: any) => ({ id: d.departmentId, name: d.name }))))
      .catch(() => setDepartments([{ id: 1, name: "Default Dept" }]));

    axios
      .get(Api_EndPoints.DESIGNATION_API, getAuthHeaders())
      .then((res) => setDesignations(res.data.map((desg: any) => ({ id: desg.designationId, title: desg.title }))))
      .catch(() => setDesignations([{ id: 1, title: "Employee" }]));

    axios
      .get(Api_EndPoints.BRANCHES_API, getAuthHeaders())
      .then((res) => setBranches(res.data.map((b: any) => ({ id: b.branchId, name: b.name }))))
      .catch(() => setBranches([{ id: 1, name: "Main Branch" }]));

    // ENUMs
    axios.get(Api_EndPoints.EMPLOYEMENTTYPES_API, getAuthHeaders())
      .then((res) => setEmploymentTypes(res.data))
      .catch(() => setEmploymentTypes([{ name: "FULL_TIME" }]));

    axios.get(Api_EndPoints.WORKSHIFT_API, getAuthHeaders())
      .then((res) => setWorkshifts(res.data))
      .catch(() => setWorkshifts([{ name: "DAY" }]));

    axios.get(Api_EndPoints.MARRIAGESTATUS_API, getAuthHeaders())
      .then((res) => setmarritalStatus(res.data))
      .catch(() => setmarritalStatus([{ name: "UNMARRIED" }]));

    axios.get(Api_EndPoints.BLOODGROUP_API, getAuthHeaders())
      .then((res) => setbloodGroups(res.data))
      .catch(() => setbloodGroups([{ name: "O+" }]));

    axios.get(Api_EndPoints.GENDER_API, getAuthHeaders())
      .then((res) => setgenders(res.data))
      .catch(() => setgenders([{ name: "MALE" }]));
  }, []);

  const handleAddEmployee = async (e: any) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.roleId) {
      return alert("Please fill all required fields!");
    }

    try {
      const payload = {
        ...form,
        roleId: Number(form.roleId),
        departmentId: Number(form.departmentId),
        designationId: Number(form.designationId),
        branchId: Number(form.branchId),
      };

      await axios.post(Api_EndPoints.CREATEEMPLOYEE_API, payload, getAuthHeaders());
      resetForm();
      fetchEmployees();
    } catch (err) {
      console.error("Error in registering Employee:", err);
    }
  };

  const handleUpdateEmployee = async (e: any) => {
    e.preventDefault();
    if (!selectedEmployee) return;
    try {
      const payload = {
        ...form,
        roleId: Number(form.roleId),
        departmentId: Number(form.departmentId),
        designationId: Number(form.designationId),
        branchId: Number(form.branchId),
      };

      await api.put(`/employees/${selectedEmployee.id}`, payload, getAuthHeaders());
      resetForm();
      fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await api.delete(`/employees/${id}`, getAuthHeaders());
      fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (emp: any) => {
    setSelectedEmployee(emp);
    setForm({
      ...emp,
      roleId: emp.roleId?.toString() || "",
      departmentId: emp.departmentId?.toString() || "",
      designationId: emp.designationId?.toString() || "",
      branchId: emp.branchId?.toString() || "",
    });
    setIsEditMode(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleView = (emp: any) => setViewEmployee(emp);

  const resetForm = () => {
    setForm(initialFormState);
    setSelectedEmployee(null);
    setIsEditMode(false);
  };

  const fieldLabels: Record<string, string> = {
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    phone: "Phone Number",
    passwordHash: "Password",
    roleId: "Role",
    departmentId: "Department",
    designationId: "Designation",
    branchId: "Branch",
    dob: "Date of Birth",
    doj: "Date of Joining",
    employmentType: "Employment Type",
    workShift: "Work Shift",
    address: "Address",
    city: "City",
    state: "State",
    country: "Country",
    pincode: "Pincode",
    aadhaarNumber: "Aadhaar Number",
    panNumber: "PAN Number",
    licenseNumber: "License Number",
    passportNumber: "Passport Number",
    marrital_status: "Marital Status",
    bloodGroup: "Blood Group",
    gender: "Gender",
    bank_name: "Bank Name",
    accountNumber: "Account Number",
    ifsc_code: "IFSC Code",
    branch_name: "Bank Branch Name",
    emergency_contact_name: "Emergency Contact Name",
    emergency_contact_relation: "Emergency Contact Relation",
    emergency_contact_number: "Emergency Contact Number",
    Specification: "Specification",
    stream: "Stream",
    institution: "Institution",
    yearOfPassing: "Year of Passing",
    CGPA: "CGPA",
    previouscompanyName: "Previous Company Name",
    previousdesignation: "Previous Designation",
    startDate: "Start Date",
    endDate: "End Date",
    experienceYears: "Years of Experience",
    responsibilities: "Responsibilities",
    skillsUsed: "Skills Used",
  };

  // ✅ RENDER INPUT FIELD
  const renderInputField = (key: string) => {
    if (["dob", "doj", "startDate", "endDate"].includes(key)) {
      return (
        <input
          type="date"
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      );
    }

    // 🔹 Foreign Key dropdowns (IDs)
    if (["roleId", "departmentId", "designationId", "branchId"].includes(key)) {
      const options =
        key === "roleId"
          ? roles
          : key === "departmentId"
          ? departments
          : key === "designationId"
          ? designations
          : branches;

      return (
        <select
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select {fieldLabels[key]}</option>
          {options.map((item: any) => (
            <option key={item.id} value={item.id}>
              {item.name || item.title}
            </option>
          ))}
        </select>
      );
    }

    // 🔹 ENUM dropdowns (String values)
    if (["employmentType", "workShift", "marrital_status", "bloodGroup", "gender"].includes(key)) {
      const options =
        key === "employmentType"
          ? employmentTypes
          : key === "workShift"
          ? workshifts
          : key === "marrital_status"
          ? marritalStatus
          : key === "bloodGroup"
          ? bloodGroups
          : genders;

      return (
        <select
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select {fieldLabels[key]}</option>
          {options.map((item: any) => (
            <option key={item.name} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      );
    }

    // Default input
    return (
      <input
        placeholder={`Enter ${fieldLabels[key] || key}`}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    );
  };

  return (
    <div className="max-w-6xl mx-auto mt-3 font-sans">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Employees</h1>

      {/* FORM */}
      <form
        onSubmit={isEditMode ? handleUpdateEmployee : handleAddEmployee}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-100 rounded-lg border border-gray-300 mb-10"
      >
        {Object.keys(form).map((key) => (
          <div key={key} className="flex flex-col">
            <label className="font-semibold mb-1 text-gray-700">{fieldLabels[key] || key}</label>
            {renderInputField(key)}
          </div>
        ))}
        <div className="col-span-1 md:col-span-3 flex gap-2 mt-2">
          <button
            type="submit"
            className={`flex-1 ${
              isEditMode ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-600 hover:bg-blue-700"
            } text-white font-bold py-2 px-4 rounded transition`}
          >
            {isEditMode ? "Update Employee" : "Add Employee"}
          </button>
          {isEditMode && (
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* EMPLOYEE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {employees.map((emp) => (
          <div key={emp.id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition flex flex-col">
            <div className="mb-2">
              <strong className="text-lg">
                {emp.firstName} {emp.lastName}
              </strong>
              <span className="text-sm text-gray-600 ml-2">({emp.roleName})</span>
            </div>
            <div className="text-sm text-gray-600 mb-1">Email: {emp.email}</div>
            <div className="text-sm text-gray-600 mb-1">
              Phone: {emp.phone} | Branch: {emp.branchName} | Dept: {emp.departmentName} | Desig:{" "}
              {emp.designationName}
            </div>
            <div className="text-sm text-gray-600 mb-2">Skills: {emp.skillsUsed}</div>
            <div className="flex gap-2 mt-auto">
              <button
                onClick={() => handleView(emp)}
                className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded"
              >
                👁 View
              </button>
              <button
                onClick={() => handleEdit(emp)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(emp.id)}
                className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
              >
                ❌ Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* VIEW MODAL */}
      {viewEmployee && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-4">
              {viewEmployee.firstName} {viewEmployee.lastName}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.keys(fieldLabels).map((key) => (
                <div key={key}>
                  <strong>{fieldLabels[key]}:</strong>{" "}
                  <span className="text-gray-700">{viewEmployee[key] || "N/A"}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setViewEmployee(null)}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddEmployee;