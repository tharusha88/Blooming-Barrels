import React from 'react';
import './AdminTable.css';

const AdminTable = ({ 
  columns = [], 
  data = [], 
  onEdit, 
  onDelete, 
  onToggleStatus,
  loading = false,
  className = '' 
}) => {
  if (loading) {
    return (
      <div className="admin-table-loading">
        <p>Loading...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="admin-table-empty">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className={`admin-table-container ${className}`}>
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className={`column-${column.key}`}>
                {column.title}
              </th>
            ))}
            <th className="actions-column">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex} className={`column-${column.key}`}>
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
              <td className="actions-column">
                <div className="action-buttons">
                  {onEdit && (
                    <button 
                      className="btn btn-sm btn-primary" 
                      onClick={() => onEdit(row)}
                      title="Edit"
                    >
                      Edit
                    </button>
                  )}
                  {onToggleStatus && (
                    <button 
                      className={`btn btn-sm ${row.is_active ? 'btn-warning' : 'btn-success'}`}
                      onClick={() => onToggleStatus(row)}
                      title={row.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {row.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  )}
                  {onDelete && (
                    <button 
                      className="btn btn-sm btn-danger" 
                      onClick={() => onDelete(row)}
                      title="Delete"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
