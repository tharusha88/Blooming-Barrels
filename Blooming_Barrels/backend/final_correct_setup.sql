-- ==============================================
-- CORRECTED ROLE SETUP FOR YOUR EXISTING DATABASE
-- Works with your current role structure
-- ==============================================

-- Step 1: Clean up tables we control
DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS permissions;

-- Step 2: Work with existing roles (don't create duplicates)
-- Your current roles:
-- ID 1: administrator ✅ (keep as is)
-- ID 2: registered_customer (leave alone - for normal users)
-- ID 3: admin (leave alone - for admin users)  
-- ID 4: garden_expert ✅ (already correct)
-- ID 5: gardening_team_member ✅ (already correct)
-- ID 6: gardening_team_manager ✅ (already correct)

-- Just ensure our 4 main roles have correct descriptions
UPDATE roles SET description = 'Full system access' WHERE id = 1 AND name = 'administrator';
UPDATE roles SET description = 'Content creator for articles and guides' WHERE id = 4 AND name = 'garden_expert';
UPDATE roles SET description = 'Field worker for service requests' WHERE id = 5 AND name = 'gardening_team_member';
UPDATE roles SET description = 'Manage team members and assign tasks' WHERE id = 6 AND name = 'gardening_team_manager';

-- Step 3: Create permissions table
CREATE TABLE permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 4: Create role_permissions junction table
CREATE TABLE role_permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_role_permission (role_id, permission_id)
);

-- Step 5: Insert all 19 permissions
INSERT INTO permissions (name, description, category) VALUES
-- Administrator permissions (5)
('manage_users', 'Manage all user accounts and roles', 'user_management'),
('manage_roles', 'Configure user roles and permissions', 'user_management'),
('system_settings', 'Configure system settings', 'system'),
('data_backup', 'Oversee content backups and data integrity', 'system'),
('site_analytics', 'Monitor site-wide metrics', 'analytics'),

-- Garden Expert permissions (5)
('create_articles', 'Create gardening articles and guides', 'content'),
('edit_articles', 'Edit gardening articles and guides', 'content'),
('publish_articles', 'Publish gardening articles and guides', 'content'),
('respond_comments', 'Respond to reader comments', 'content'),
('view_content_analytics', 'View analytics on published content', 'analytics'),

-- Team Member permissions (4)
('view_tasks', 'View assigned service-request tasks', 'tasks'),
('accept_tasks', 'Accept assigned service-request tasks', 'tasks'),
('update_task_status', 'Update task status through stages', 'tasks'),
('log_task_notes', 'Log notes and upload photos for tasks', 'tasks'),

-- Team Manager permissions (5)
('manage_team_members', 'Onboard and manage team members', 'team_management'),
('assign_tasks', 'Assign service requests to team members', 'team_management'),
('set_schedules', 'Set schedules for team members', 'team_management'),
('monitor_progress', 'Monitor task progress and approve reports', 'team_management'),
('generate_payroll', 'Generate payroll reports', 'team_management');

-- Step 6: Assign permissions to roles (using correct IDs from your database)
-- Administrator (ID: 1) gets ALL 19 permissions
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 1, id FROM permissions;

-- Garden Expert (ID: 4) gets content permissions
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 4, id FROM permissions 
WHERE name IN ('create_articles', 'edit_articles', 'publish_articles', 'respond_comments', 'view_content_analytics');

-- Team Member (ID: 5) gets task permissions
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 5, id FROM permissions 
WHERE name IN ('view_tasks', 'accept_tasks', 'update_task_status', 'log_task_notes');

-- Team Manager (ID: 6) gets management + task permissions (9 total)
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 6, id FROM permissions 
WHERE name IN ('manage_team_members', 'assign_tasks', 'set_schedules', 'monitor_progress', 'generate_payroll', 'view_tasks', 'accept_tasks', 'update_task_status', 'log_task_notes');

-- Step 7: Final verification
SELECT '✅ SETUP COMPLETED!' as status;
SELECT id, name, description FROM roles ORDER BY id;
SELECT COUNT(*) as total_permissions FROM permissions;
SELECT r.name as role_name, COUNT(rp.permission_id) as permission_count
FROM roles r
LEFT JOIN role_permissions rp ON r.id = rp.role_id
WHERE r.id IN (1, 4, 5, 6)
GROUP BY r.id, r.name
ORDER BY r.id;
