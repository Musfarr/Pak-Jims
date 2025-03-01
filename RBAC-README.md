# Role-Based Access Control (RBAC) Architecture

## Overview

This application implements a comprehensive Role-Based Access Control (RBAC) system that manages user access based on assigned roles. The system ensures that users can only access resources and perform actions appropriate for their role level.

## Role Hierarchy

The application defines a clear role hierarchy with increasing levels of access:

1. **Student** (lowest level)
   - Access to learning resources, courses, and grades

2. **Faculty**
   - Access to teaching resources, student management, and grading

3. **Admin**
   - Basic administrative functions and user management

4. **Super Admin**
   - Extended administrative capabilities with some limitations

5. **Master Admin** (highest level)
   - Complete access to all system functions and settings

## Key Components

### 1. Authentication Context (`AuthContext.jsx`)

The central component that manages authentication state and role-based permissions:

- Stores user authentication state and role
- Provides the `hasRole()` function that supports:
  - Exact role matching: `hasRole('admin')`
  - Minimum role level checking: `hasRole({ minLevel: 'admin' })`
- Manages login/logout functionality and role-specific redirects

### 2. Protected Routes (`ProtectedRoute.jsx`)

Controls access to routes based on user roles:

- Redirects unauthenticated users to the login page
- Checks if users have the required role to access a specific route
- Supports both exact role matching and minimum role level requirements
- Redirects unauthorized access to an error page

### 3. Role-Based Navigation (`RoleNavigation.jsx`)

Provides navigation links based on the user's role:

- Shows/hides navigation options based on role permissions
- Includes logout functionality
- Adapts UI elements to match role capabilities

### 4. Role-Specific Menu Lists

Separate menu configuration files for each role:

- Located in `src/utils/Newdata/RoleMenus/`
- Each role has its own menu list with appropriate options:
  - `MasterAdminMenuList.js` - Full access to all menu items
  - `SuperAdminMenuList.js` - Administrative functions with some limitations
  - `AdminMenuList.js` - Basic administrative functions
  - `FacultyMenuList.js` - Teaching-related functions
  - `StudentMenuList.js` - Learning-related functions

### 5. Dynamic Menu Rendering (`Menus.jsx`)

Renders the navigation menu based on the user's role:

- Retrieves the user's role from AuthContext
- Selects the appropriate menu list based on the role
- Renders menu items dynamically

## Implementation Flow

1. **Login Process**:
   - User selects their role from the dropdown in the login form
   - AuthContext stores the role and sets appropriate permissions
   - User is redirected to their role-specific dashboard

2. **Access Control**:
   - ProtectedRoute component checks if the user has the required role
   - Unauthorized access attempts are redirected to an error page

3. **UI Adaptation**:
   - Navigation menu displays only the options available to the user's role
   - Dashboard content is tailored to the user's role and responsibilities

## Security Considerations

- Role information is stored in localStorage for persistence across sessions
- The hasRole function enforces the role hierarchy for permission checks
- All protected routes verify user permissions before rendering content

## Future Enhancements

- Integration with a backend API for real authentication
- More granular permissions within each role
- Role assignment and management interface for administrators
