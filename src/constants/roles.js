// constants/roles.js

export const ROLES = {
  ADMIN: 'Administrator',
  MANAGER: 'Manager',
  DRIVER: 'Driver',
  USER: 'User',
  GUEST: 'Guest',
};

export const PERMISSIONS = {
  MANAGE_USERS: 'Manage Users',
  MANAGE_WASTE_COLLECTION: 'Manage Waste Collection',
  VIEW_REPORTS: 'View Reports',
  VIEW_DASHBOARD: 'View Dashboard',
  MANAGE_SETTINGS: 'Manage Settings',
  MANAGE_BINS: 'Manage Bins',
  VIEW_SERVICES: 'View Services',
};

// Mapping roles to their permissions
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_WASTE_COLLECTION,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.MANAGE_SETTINGS,
    PERMISSIONS.MANAGE_BINS,
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.MANAGE_WASTE_COLLECTION,
    PERMISSIONS.VIEW_SERVICES,  // Corrected this line
  ],
  [ROLES.MANAGER]: [
    PERMISSIONS.MANAGE_WASTE_COLLECTION,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.MANAGE_BINS,
  ],
  [ROLES.DRIVER]: [
    PERMISSIONS.MANAGE_WASTE_COLLECTION,
    PERMISSIONS.MANAGE_BINS,
  ],
  [ROLES.USER]: [], // No permissions for regular users

  [ROLES.GUEST]: [
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.VIEW_SERVICES, // Guests can only view reports and apply for services
  ],
};
