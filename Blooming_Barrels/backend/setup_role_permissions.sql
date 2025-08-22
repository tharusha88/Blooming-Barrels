-- Role Management System Database Schema

-- Update roles table with proper structure
DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS permissions;

-- Create permissions table
CREATE TABLE permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create role_permissions junction table
CREATE TABLE role_permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_role_permission (role_id, permission_id)
);

-- Insert permissions based on the requirements
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

-- First, let's handle the roles carefully
-- Check if we need to create role types instead of updating existing roles

-- Insert role types if they don't exist (avoid duplicates)
INSERT IGNORE INTO roles (name, description) VALUES 
('administrator', 'Full system access'),
('garden_expert', 'Content creator for articles and guides'),
('gardening_team_member', 'Field worker for service requests'),
('gardening_team_manager', 'Manage team members and assign tasks');

-- Assign permissions to roles using role names (more reliable than IDs)
-- Administrator gets all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'administrator'), 
    id 
FROM permissions
ON DUPLICATE KEY UPDATE role_id = role_id;

-- Garden Expert permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'garden_expert'), 
    id 
FROM permissions 
WHERE name IN ('create_articles', 'edit_articles', 'publish_articles', 'respond_comments', 'view_content_analytics')
ON DUPLICATE KEY UPDATE role_id = role_id;

-- Gardening Team Member permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'gardening_team_member'), 
    id 
FROM permissions 
WHERE name IN ('view_tasks', 'accept_tasks', 'update_task_status', 'log_task_notes')
ON DUPLICATE KEY UPDATE role_id = role_id;

-- Gardening Team Manager permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'gardening_team_manager'), 
    id 
FROM permissions 
WHERE name IN ('manage_team_members', 'assign_tasks', 'set_schedules', 'monitor_progress', 'generate_payroll', 'view_tasks', 'accept_tasks', 'update_task_status', 'log_task_notes')
ON DUPLICATE KEY UPDATE role_id = role_id;
