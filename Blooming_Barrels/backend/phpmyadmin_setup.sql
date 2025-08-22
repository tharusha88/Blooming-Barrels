-- ==============================================
-- ROLE MANAGEMENT SYSTEM SETUP FOR PHPMYADMIN
-- Copy and paste this entire script into phpMyAdmin SQL tab
-- ==============================================

-- Step 1: Clean up existing structures
DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS permissions;

-- Step 2: Update the roles table structure
-- Remove conflicting columns if they exist
ALTER TABLE roles 
DROP COLUMN IF EXISTS display_name,
DROP COLUMN IF EXISTS permissions,
DROP COLUMN IF EXISTS is_active;

-- Ensure roles table has correct structure
ALTER TABLE roles 
MODIFY COLUMN id INT AUTO_INCREMENT,
MODIFY COLUMN name VARCHAR(50) NOT NULL,
MODIFY COLUMN description TEXT NULL;

-- Add created_at column if it doesn't exist
ALTER TABLE roles ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Step 3: Clear existing roles and insert our 4 role types
DELETE FROM roles;
INSERT INTO roles (id, name, description) VALUES 
(1, 'administrator', 'Full system access'),
(2, 'garden_expert', 'Content creator for articles and guides'),
(3, 'gardening_team_member', 'Field worker for service requests'),
(4, 'gardening_team_manager', 'Manage team members and assign tasks');

-- Step 4: Create permissions table
CREATE TABLE permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 5: Create role_permissions junction table
CREATE TABLE role_permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_role_permission (role_id, permission_id)
);

-- Step 6: Insert all permissions
INSERT INTO permissions (name, description, category) VALUES
-- Administrator permissions
('manage_users', 'Manage all user accounts and roles (add/edit/delete)', 'user_management'),
('manage_roles', 'Configure user roles and permissions', 'user_management'),
('system_settings', 'Configure system settings (including AI-API keys and usage limits)', 'system'),
('data_backup', 'Oversee content backups and data integrity', 'system'),
('site_analytics', 'Monitor site-wide metrics (orders, requests, uptime)', 'analytics'),

-- Garden Expert permissions
('create_articles', 'Create gardening articles and how-to guides', 'content'),
('edit_articles', 'Edit gardening articles and how-to guides', 'content'),
('publish_articles', 'Publish gardening articles and how-to guides', 'content'),
('respond_comments', 'Respond to reader comments and questions', 'content'),
('view_content_analytics', 'View ratings and analytics on published content', 'analytics'),

-- Gardening Team Member permissions
('view_tasks', 'View assigned service-request tasks', 'tasks'),
('accept_tasks', 'Accept assigned service-request tasks', 'tasks'),
('update_task_status', 'Update task status through stages', 'tasks'),
('log_task_notes', 'Log notes and upload photos for tasks', 'tasks'),

-- Gardening Team Manager permissions
('manage_team_members', 'Onboard and manage Gardening Team Members', 'team_management'),
('assign_tasks', 'Assign service requests to team members', 'team_management'),
('set_schedules', 'Set schedules for team members', 'team_management'),
('monitor_progress', 'Monitor task progress and approve completion reports', 'team_management'),
('generate_payroll', 'Generate payroll reports based on completed tasks', 'team_management');

-- Step 7: Assign permissions to roles
-- Administrator gets all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, id FROM permissions;

-- Garden Expert permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 2, id FROM permissions 
WHERE name IN ('create_articles', 'edit_articles', 'publish_articles', 'respond_comments', 'view_content_analytics');

-- Gardening Team Member permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 3, id FROM permissions 
WHERE name IN ('view_tasks', 'accept_tasks', 'update_task_status', 'log_task_notes');

-- Gardening Team Manager permissions (includes team member permissions)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 4, id FROM permissions 
WHERE name IN ('manage_team_members', 'assign_tasks', 'set_schedules', 'monitor_progress', 'generate_payroll', 'view_tasks', 'accept_tasks', 'update_task_status', 'log_task_notes');

-- Step 8: Verification queries
SELECT 'ROLES:' as info;
SELECT id, name, description FROM roles ORDER BY id;

SELECT 'PERMISSIONS:' as info;
SELECT COUNT(*) as total_permissions FROM permissions;

SELECT 'ROLE-PERMISSION ASSIGNMENTS:' as info;
SELECT r.name as role_name, COUNT(rp.permission_id) as permission_count
FROM roles r
LEFT JOIN role_permissions rp ON r.id = rp.role_id
GROUP BY r.id, r.name
ORDER BY r.id;
