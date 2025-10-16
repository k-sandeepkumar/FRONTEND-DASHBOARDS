// src/pages/CustomizationPage.tsx
import axios from "axios";
import React, { useState, FormEvent, ChangeEvent } from "react";
import { 
  Users, 
  Briefcase, 
  Building2, 
  MapPin, 
  Plus, 
  X, 
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Api_EndPoints } from "@/Config/Api_Endpoints";

type FormType = "role" | "designation" | "department" | "branch" | null;

const CustomizationPage: React.FC = () => {
  const [activeForm, setActiveForm] = useState<FormType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Role fields
  const [roleName, setRoleName] = useState<string>("");
  const [roleDesc, setRoleDesc] = useState<string>("");

  // Designation fields
  const [designationTitle, setDesignationTitle] = useState<string>("");
  const [designationDesc, setDesignationDesc] = useState<string>("");

  // Department fields
  const [departmentName, setDepartmentName] = useState<string>("");
  const [departmentDesc, setDepartmentDesc] = useState<string>("");

  // Branch fields
  const [branchData, setBranchData] = useState({
    name: "",
    code: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    zipCode: "",
    contactNumber: "",
    email: "",
  });

  // ✅ Helper to get token
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token"); // token stored after login
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const handleSubmit = async (type: FormType) => {
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    
    try {
      if (type === "role") {
        await axios.post(
          Api_EndPoints.ROLES_CREATE_API,
          { name: roleName, description: roleDesc },
          getAuthHeaders()
        );
        setSuccessMessage("Role created successfully!");
        setRoleName("");
        setRoleDesc("");
      }

      if (type === "designation") {
        await axios.post(
          Api_EndPoints.DEPARTMENTS_CREATE_API,
          { title: designationTitle, description: designationDesc },
          getAuthHeaders()
        );
        setSuccessMessage("Designation created successfully!");
        setDesignationTitle("");
        setDesignationDesc("");
      }

      if (type === "department") {
        await axios.post(
          Api_EndPoints.DEPARTMENTS_CREATE_API,
          { name: departmentName, description: departmentDesc },
          getAuthHeaders()
        );
        setSuccessMessage("Department created successfully!");
        setDepartmentName("");
        setDepartmentDesc("");
      }

      if (type === "branch") {
        await axios.post(
          Api_EndPoints.BRANCHES_CREATE_API,
          branchData,
          getAuthHeaders()
        );
        setSuccessMessage("Branch created successfully!");
        setBranchData({
          name: "",
          code: "",
          address: "",
          city: "",
          state: "",
          country: "India",
          zipCode: "",
          contactNumber: "",
          email: "",
        });
      }

      setActiveForm(null);
    } catch (err: any) {
      console.error(err.response || err);
      setErrorMessage(
        `Error creating ${type}: ${
          err.response?.data?.message || "Unexpected error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl p-4 mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
           Customize Organization
          </h1>
        </div>

        {/* Status Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="text-green-600 w-5 h-5" />
            <p className="text-green-800">{successMessage}</p>
          </div>
        )}
        
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="text-red-600 w-5 h-5" />
            <p className="text-red-800">{errorMessage}</p>
          </div>
        )}

        {/* Card Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div
            className="group relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-1"
            onClick={() => setActiveForm("role")}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Roles</h2>
            <p className="text-sm text-gray-600">Create and manage user roles and permissions</p>
          </div>

          <div
            className="group relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300 border border-gray-100 hover:border-green-200 hover:-translate-y-1"
            onClick={() => setActiveForm("designation")}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                <Briefcase className="w-6 h-6 text-green-600" />
              </div>
              <Plus className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Designations</h2>
            <p className="text-sm text-gray-600">Add and edit job titles and positions</p>
          </div>

          <div
            className="group relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-1"
            onClick={() => setActiveForm("department")}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
              <Plus className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Departments</h2>
            <p className="text-sm text-gray-600">Manage company departments and divisions</p>
          </div>

          <div
            className="group relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300 border border-gray-100 hover:border-orange-200 hover:-translate-y-1"
            onClick={() => setActiveForm("branch")}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <Plus className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Branches</h2>
            <p className="text-sm text-gray-600">Manage company branches and locations</p>
          </div>
        </div>

        {/* Forms */}
        {activeForm && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {activeForm === "role" && (
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  )}
                  {activeForm === "designation" && (
                    <div className="p-3 bg-green-100 rounded-xl">
                      <Briefcase className="w-6 h-6 text-green-600" />
                    </div>
                  )}
                  {activeForm === "department" && (
                    <div className="p-3 bg-purple-100 rounded-xl">
                      <Building2 className="w-6 h-6 text-purple-600" />
                    </div>
                  )}
                  {activeForm === "branch" && (
                    <div className="p-3 bg-orange-100 rounded-xl">
                      <MapPin className="w-6 h-6 text-orange-600" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 capitalize">
                      Create {activeForm}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {activeForm === "role" && "Define user roles and permissions"}
                      {activeForm === "designation" && "Add job titles and positions"}
                      {activeForm === "department" && "Create organizational departments"}
                      {activeForm === "branch" && "Add company branches and locations"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveForm(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <form
              className="p-8"
              onSubmit={(e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                handleSubmit(activeForm);
              }}
            >
              {/* ROLE FORM */}
              {activeForm === "role" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter role name (e.g., Admin, Manager, Employee)"
                      value={roleName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setRoleName(e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role Description
                    </label>
                    <textarea
                      placeholder="Describe the role's responsibilities and permissions..."
                      value={roleDesc}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        setRoleDesc(e.target.value)
                      }
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>
                </div>
              )}

              {/* DESIGNATION FORM */}
              {activeForm === "designation" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Designation Title *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter job title (e.g., Senior Developer, Marketing Manager)"
                      value={designationTitle}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setDesignationTitle(e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Designation Description
                    </label>
                    <textarea
                      placeholder="Describe the job responsibilities and requirements..."
                      value={designationDesc}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        setDesignationDesc(e.target.value)
                      }
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                    />
                  </div>
                </div>
              )}

              {/* DEPARTMENT FORM */}
              {activeForm === "department" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter department name (e.g., Human Resources, Engineering)"
                      value={departmentName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setDepartmentName(e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department Description
                    </label>
                    <textarea
                      placeholder="Describe the department's purpose and functions..."
                      value={departmentDesc}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        setDepartmentDesc(e.target.value)
                      }
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
                    />
                  </div>
                </div>
              )}

              {/* BRANCH FORM */}
              {activeForm === "branch" && (
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Branch Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter branch name"
                        value={branchData.name}
                        onChange={(e) =>
                          setBranchData({ ...branchData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Branch Code *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter branch code (e.g., BR001)"
                        value={branchData.code}
                        onChange={(e) =>
                          setBranchData({ ...branchData, code: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Address Information */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      placeholder="Enter complete address"
                      value={branchData.address}
                      onChange={(e) =>
                        setBranchData({ ...branchData, address: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                    />
                  </div>

                  {/* Location Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        placeholder="Enter city"
                        value={branchData.city}
                        onChange={(e) =>
                          setBranchData({ ...branchData, city: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        placeholder="Enter state"
                        value={branchData.state}
                        onChange={(e) =>
                          setBranchData({ ...branchData, state: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        placeholder="Enter country"
                        value={branchData.country}
                        onChange={(e) =>
                          setBranchData({ ...branchData, country: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        placeholder="Enter zip code"
                        value={branchData.zipCode}
                        onChange={(e) =>
                          setBranchData({ ...branchData, zipCode: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        placeholder="Enter contact number"
                        value={branchData.contactNumber}
                        onChange={(e) =>
                          setBranchData({
                            ...branchData,
                            contactNumber: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="Enter email address"
                        value={branchData.email}
                        onChange={(e) =>
                          setBranchData({ ...branchData, email: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setActiveForm(null)}
                  className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-3 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                    activeForm === "role"
                      ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                      : activeForm === "designation"
                      ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                      : activeForm === "department"
                      ? "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
                      : "bg-orange-600 hover:bg-orange-700 focus:ring-orange-500"
                  } focus:ring-2 focus:ring-offset-2 ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create {activeForm}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomizationPage;
