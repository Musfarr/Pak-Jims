import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "../layout/root";
import Home from "../pages/home";
import Analytics from "../pages/analytics";
import ReportsSales from "../pages/reports-sales";
import ReportsLeads from "../pages/reports-leads";
import ReportsProject from "../pages/reports-project";
import ReportsTimesheets from "../pages/reports-timesheets";
import LoginCover from "../pages/login-cover";
import Proposalist from "../pages/proposal-list";
import CustomersList from "../pages/customers-list";
import ProposalView from "../pages/proposal-view";
import ProposalEdit from "../pages/proposal-edit";
import LeadsList from "../pages/leadsList";
import CustomersView from "../pages/customers-view";
import CustomersCreate from "../pages/customers-create";
import ProposalCreate from "../pages/proposal-create";
import LeadsView from "../pages/leads-view";
import LeadsCreate from "../pages/leads-create";
import PaymentList from "../pages/payment-list";
import PaymentView from "../pages/payment-view/";
import PaymentCreate from "../pages/payment-create";
import ProjectsList from "../pages/projects-list";
import ProjectsView from "../pages/projects-view";
import ProjectsCreate from "../pages/projects-create";
import LayoutAuth from "../layout/layoutAuth";
import LoginMinimal from "../pages/login-minimal";
import RegisterMinimal from "../pages/register-minimal";
import ErrorMinimal from "../pages/error-minimal";
import OtpMinimal from "../pages/otp-minimal";
import MaintenanceMinimal from "../pages/maintenance-minimal";
import HelpKnowledgebase from "../pages/help-knowledgebase";
import WidgetsLists from "../pages/widgets-lists";
import WidgetsTables from "../pages/widgets-tables";
import WidgetsCharts from "../pages/widgets-charts";
import WidgetsStatistics from "../pages/widgets-statistics";
import WidgetsMiscellaneous from "../pages/widgets-miscellaneous";
import ProtectedRoute from "../components/ProtectedRoute";
import Unauthorized from "../pages/unauthorized";
import SuperAdminDashboard from "../pages/SuperAdmin/super-admin-dashboard";
import AdminDashboard from "../pages/Admin/admin-dashboard";
import FacultyDashboard from "../pages/faculty-dashboard";
import StudentDashboard from "../pages/student-dashboard";
import { AuthProvider } from '../context/AuthContext';
import Createfaculty from "../pages/Admin/Create-faculty";
import Createstudent from "../pages/Admin/Create-student";
import Facultylist from "../pages/Admin/Faculty-list";
import Studentlist from "../pages/Admin/Student-list";
import CourseList from "../pages/Admin/Course-list";
import CreateCourse from "../pages/Admin/Create-course";
import ProgramList from "../pages/Admin/Program-list";
import CreateProgram from "../pages/Admin/Create-program";
import DepartmentList from "../pages/Admin/Department-list";
import CreateDepartment from "../pages/Admin/Create-department";
import ClassList from "../pages/Admin/Class-list";
import CreateClass from "../pages/Admin/Create-class";
import AcademicYearList from "../pages/Admin/Academic-year-list";
import CreateAcademicYear from "../pages/Admin/Create-academic-year";
import BatchList from "../pages/Admin/Batch-list";
import CreateBatch from "../pages/Admin/Create-batch";
import StudentView from "../pages/Admin/Student-view";
import FacultyView from "../pages/Admin/Faculty-view";

// SuperAdmin pages
import MasterAdminDashboard from "../pages/MasterAdmin/Dashboard";
import InstituteList from "../pages/SuperAdmin/Institute-list";
import InstituteCreate from "../pages/SuperAdmin/Institute-create";
import InstituteEdit from "../pages/SuperAdmin/Institute-edit";
import InstituteCreateSuperAdmin from "../pages/SuperAdmin/Institute-create-super-admin";
import BranchCreate from "../pages/SuperAdmin/branch-create";
import BranchList from "../pages/SuperAdmin/branch-list";
import AdminList from "../pages/SuperAdmin/admin-list";




// Create a layout component that wraps children with AuthProvider
const AuthLayout = ({ children }) => {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
};

export const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <AuthLayout>
                <ProtectedRoute>
                    <RootLayout />
                </ProtectedRoute>
            </AuthLayout>
        ),
        children: [
            {
                path: "/",
                element: <Navigate to="/Authentication/login" replace />
            },
            {
                path: "/dashboard",
                element: <Home />
            },





            // Role-specific dashboards
            {
                path: "/master-admin-dashboard",
                element: (
                    <ProtectedRoute requiredRole="masteradmin">
                        <MasterAdminDashboard />
                    </ProtectedRoute>
                )
            },
            
            
            
            //////////////Super Admin  routes////////////////////////////////////////////////////////////////////////////////
            // 
            
            {
                path: "/super-admin-dashboard",
                element: (
                    <ProtectedRoute requiredRole="superadmin">
                        <SuperAdminDashboard />
                    </ProtectedRoute>
                )
            },
            {
                path: "/institutes",
                element: (
                    <ProtectedRoute minimumRole="superadmin">
                        <InstituteList />
                    </ProtectedRoute>
                )
            },

            {
                path: "/institutes/create",
                element: (
                    <ProtectedRoute requiredRole="superadmin">
                        <InstituteCreate />
                    </ProtectedRoute>
                )
            },
            
            
            {
                path: "/institutes/edit/:id",
                element: (
                    <ProtectedRoute requiredRole="superadmin">
                        <InstituteEdit />
                    </ProtectedRoute>
                )
            },
            {
                path: "/branch/create/:id",
                element: (
                    <ProtectedRoute requiredRole="superadmin">
                        <BranchCreate />
                    </ProtectedRoute>
                )
            },
            {
                path: "/branch/list",
                element: (
                    <ProtectedRoute requiredRole="superadmin">
                        <BranchList />
                    </ProtectedRoute>
                )
            },
            {
                path: "/branches/admins/list",
                element: (
                    <ProtectedRoute requiredRole="superadmin">
                        <AdminList />
                    </ProtectedRoute>
                )
            },
            {
                path: "/branch/create-admin/:id",
                element: (
                    <ProtectedRoute requiredRole="superadmin">
                        <InstituteCreateSuperAdmin />
                    </ProtectedRoute>
                )
            },

            //////////////////////////////////////////////////////////////////////////////////////////////
            









            //////////////////////////////////////////////////////////////////////////////////////////////







            //////////////////////////////////////////////////////////////////////////////////////////////

            // Admin dashboard
            {
                path: "/admin-dashboard",
                element: (
                    <ProtectedRoute requiredRole="admin">
                        <AdminDashboard />
                    </ProtectedRoute>
                )
            },
            {
                path: "/create-student",
                element: (
                    <ProtectedRoute requiredRole="admin">
                        <Createstudent />
                    </ProtectedRoute>
                )
            },
            {
                path: "/student-list",
                element: (
                    <ProtectedRoute requiredRole="admin">
                        <Studentlist />
                    </ProtectedRoute>
                )
            },
            {
                path: "/create-faculty",
                element: (
                    <ProtectedRoute requiredRole="admin">
                        <Createfaculty />
                    </ProtectedRoute>
                )
            },
            {
                path: "/faculty-list",
                element: (
                    <ProtectedRoute requiredRole="admin">
                        <Facultylist />
                    </ProtectedRoute>
                )
            },
            {
                path: "/courses/list",
                element: (
                    <ProtectedRoute requiredRole="admin">
                        <CourseList />
                    </ProtectedRoute>
                )
            },
            {
                path: "/courses/add",
                element: (
                    <ProtectedRoute requiredRole="admin">
                        <CreateCourse />
                    </ProtectedRoute>
                )
            },
            {
                path: "/programs/list",
                element: (
                    <ProtectedRoute requiredRole="admin">
                        <ProgramList />
                    </ProtectedRoute>
                )
            },
            {
                path: "/programs/add",
                element: (
                    <ProtectedRoute requiredRole="admin">
                        <CreateProgram />
                    </ProtectedRoute>
                )
            },
            {
                path: "/departments/list",
                element: (
                    <ProtectedRoute requiredRole="admin">
                        <DepartmentList />
                    </ProtectedRoute>
                )
            },
            {
                path: "/departments/add",
                element: (
                    <ProtectedRoute requiredRole="admin">
                        <CreateDepartment />
                    </ProtectedRoute>
                )
            },
            {
                path: "/classes/list",
                element: (
                    <ProtectedRoute requiredRole="admin">
                        <ClassList />
                    </ProtectedRoute>
                )
            },
            {
                path: "/classes/add",
                element: (
                    <ProtectedRoute requiredRole="admin">
                        <CreateClass />
                    </ProtectedRoute>
                )
            },
            {
                path: "/academic-years/list",
                element: (
                    <ProtectedRoute requiredRole="admin">
                        <AcademicYearList />
                    </ProtectedRoute>
                )
            },
            {
                path: "/academic-years/add",
                element: (
                    <ProtectedRoute requiredRole="admin">
                        <CreateAcademicYear />
                    </ProtectedRoute>
                )
            },
            {
                path: "/batches/list",
                element: (
                    <ProtectedRoute requiredRole="admin">
                        <BatchList />
                    </ProtectedRoute>
                )
            },
            {
                path: "/batches/add",
                element: (
                    <ProtectedRoute requiredRole="admin">
                        <CreateBatch />
                    </ProtectedRoute>
                )
            },
            {
                path: "/students/view/:id",
                element: (
                    <ProtectedRoute requiredRole={{ minLevel: "admin" }}>
                        <StudentView />
                    </ProtectedRoute>
                )
            },
            {
                path: "/faculty/view/:id",
                element: (
                    <ProtectedRoute requiredRole={{ minLevel: "admin" }}>
                        <FacultyView />
                    </ProtectedRoute>
                )
            },



            {
                path: "/faculty-dashboard",
                element: (
                    <ProtectedRoute requiredRole="faculty">
                        <FacultyDashboard />
                    </ProtectedRoute>
                )
            },
            {
                path: "/student-dashboard",
                element: (
                    <ProtectedRoute requiredRole="student">
                        <StudentDashboard />
                    </ProtectedRoute>
                )
            },
            // Example of a route that requires minimum role level
            {
                path: "/admin-area",
                element: (
                    <ProtectedRoute minimumRole="admin">
                        <Analytics />
                    </ProtectedRoute>
                )
            },
            // Unauthorized page
            {
                path: "/unauthorized",
                element: <Unauthorized />
            },
            {
                path: "/dashboards/analytics",
                element: <Analytics />
            },
            {
                path: "/reports/sales",
                element: <ReportsSales />
            },
            {
                path: "/reports/leads",
                element: <ReportsLeads />
            },
            {
                path: "/reports/project",
                element: <ReportsProject />
            },
            {
                path: "/reports/timesheets",
                element: <ReportsTimesheets />
            },
            {
                path: "/proposal/list",
                element: <Proposalist />
            },
            {
                path: "/proposal/view",
                element: <ProposalView />
            },
            {
                path: "/proposal/edit",
                element: <ProposalEdit />
            },
            {
                path: "/proposal/create",
                element: <ProposalCreate />
            },
            {
                path: "/payment/list",
                element: <PaymentList />
            },
            {
                path: "/payment/view",
                element: <PaymentView />
            },
            {
                path: "/payment/create",
                element: <PaymentCreate />
            },
            {
                path: "/customers/list",
                element: <CustomersList />
            },
            {
                path: "/customers/view",
                element: <CustomersView />
            },
            {
                path: "/customers/create",
                element: <CustomersCreate />
            },
            {
                path: "/leads/list",
                element: <LeadsList />
            },
            {
                path: "/leads/view",
                element: <LeadsView />
            },
            {
                path: "/leads/create",
                element: <LeadsCreate />
            },
            {
                path: "/projects/list",
                element: <ProjectsList />
            },
            {
                path: "/projects/view",
                element: <ProjectsView />
            },
            {
                path: "/projects/create",
                element: <ProjectsCreate />
            },
            {
                path: "/widgets/lists",
                element: <WidgetsLists />
            },
            {
                path: "/widgets/tables",
                element: <WidgetsTables />
            },
            {
                path: "/widgets/charts",
                element: <WidgetsCharts/>
            },
            {
                path: "/widgets/statistics",
                element: <WidgetsStatistics/>
            },
            {
                path: "/widgets/miscellaneous",
                element: <WidgetsMiscellaneous/>
            },
            {
                path: "/help/knowledgebase",
                element: <HelpKnowledgebase />
            },











            
        ]
    },

    {
        path: "/authentication",
        element: (
            <AuthLayout>
                <LayoutAuth />
            </AuthLayout>
        ),
        children: [
            {
                path: "/authentication",
                element: <Navigate to="/authentication/login" replace />
            },
            {
                path: "/authentication/login",
                element: <LoginCover />
            },
            {
                path: "/authentication/login/minimal",
                element: <LoginMinimal />
            },
            {
                path: "/authentication/register/minimal",
                element: <RegisterMinimal />
            },
            
            {
                path: "/authentication/404",
                element: <ErrorMinimal />
            },
           
            {
                path: "/authentication/verify/minimal",
                element: <OtpMinimal />
            },
            {
                path: "/authentication/maintenance/minimal",
                element: <MaintenanceMinimal />
            },
            
        ]
    },

    // For Unidentified Routes 
    {
        path : '*',
        element : <ErrorMinimal />
    }
]);