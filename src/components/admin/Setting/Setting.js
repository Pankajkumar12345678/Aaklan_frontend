import React, { useState, useEffect } from 'react';
import { TabContent, TabPane, Nav, NavLink, NavItem } from "reactstrap";
import classnames from 'classnames';
import { Shield, Mail, Edit, Save, Users, FileText, Download, BarChart3, Settings, Eye, EyeOff, ArrowLeft, CloudDownload, CloudSnow } from 'lucide-react';
import { adminService } from '../../../services/api';
import toast from 'react-hot-toast';

const Setting = () => {
	const [activeTab, setActiveTab] = useState(1);
	
	// Permission Management State
	const [permissions, setPermissions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editingRole, setEditingRole] = useState(null);
	const [editedPermissions, setEditedPermissions] = useState({});

	// Fetch permissions on component mount
	useEffect(() => {
		fetchPermissions();
	}, []);

	console.log("permissions", permissions)
	const fetchPermissions = async () => {
		try {
			const response = await adminService.getPermissions();
			setPermissions(response.data.permissions || []);
		} catch (error) {
			toast.error('Failed to fetch permissions');
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = (role) => {
		setEditingRole(role);
		// Deep copy of permissions
		setEditedPermissions(JSON.parse(JSON.stringify(role.permissions || {})));
	};

	const handlePermissionChange = (category, action, value) => {
		setEditedPermissions(prev => ({
			...prev,
			[category]: {
				...prev[category],
				[action]: value
			}
		}));
	};

	const handleSave = async () => {
		try {
			await adminService.updatePermission(editingRole.role, {
				permissions: editedPermissions
			});
			toast.success('Permissions updated successfully');
			setEditingRole(null);
			fetchPermissions(); // Refresh data
		} catch (error) {
			toast.error('Failed to update permissions');
		}
	};

	const handleCancel = () => {
		setEditingRole(null);
		setEditedPermissions({});
	};

	// Permission Category Component - FIXED POSITIONING
	const PermissionCategory = ({ title, icon: Icon, category, permissions }) => (
		<div className="card mb-4 shadow-sm border-0 ">
			<div className="card-header bg-gradient-primary text-white py-3 btn-primary btn-simple">
				<div className="d-flex align-items-center">
					<Icon className="h-5 w-5 text-white mr-3" />
					<h5 className="mb-0 font-weight-bold">{title}</h5>
				</div>
			</div>
			<div className="card-body p-0">
				<div className="row g-0">
					{permissions && Object.entries(permissions).map(([action, value]) => (
						<div key={action} className="col-md-6">
							<div className="d-flex align-items-center justify-content-between p-3 border-bottom border-end hover-bg">
								<div className="flex-grow-1 me-3">
									<h6 className="mb-1 font-weight-semibold text-black text-title text-capitalize">
										{action.replace(/([A-Z])/g, ' $1').trim()}
									</h6>
									<small className="text-dark">
										{value ? 'Access granted' : 'Access denied'}
									</small>
								</div>
								<div className="flex-shrink-0">
									{editingRole ? (
										<div className="form-check form-switch mb-0">
											<input
												type="checkbox"
												className="form-check-input custom-switch"
												checked={value || false}
												onChange={(e) => handlePermissionChange(category, action, e.target.checked)}
												style={{ 
													width: '3rem', 
													height: '1.5rem',
													cursor: 'pointer'
												}}
											/>
										</div>
									) : (
										<span className={`badge ${value ? 'bg-success' : 'bg-danger'} badge-pill d-flex align-items-center`}>
											{value ? (
												<><Eye className="h-3 w-3 mr-1" /> Allowed</>
											) : (
												<><EyeOff className="h-3 w-3 mr-1" /> Denied</>
											)}
										</span>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);

	// Loading State (unchanged)
	if (loading) {
		return (
			<div className="section-body">
				<div className="container-fluid">
					<div className="d-flex justify-content-between align-items-center ">
						<div className="header-action">
							<h1 className="page-title">Settings</h1>
							<ol className="breadcrumb page-breadcrumb">
								<li className="breadcrumb-item"><a href="#">Ericsson</a></li>
								<li className="breadcrumb-item active" aria-current="page">Settings</li>
							</ol>
						</div>

						<Nav tabs className="page-header-tab">
							<NavItem>
								<NavLink className={classnames({ active: activeTab === 1 })}>
									<Shield className="h-4 w-4 mr-1" />
									Roles & Permissions
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink className={classnames({ active: activeTab === 2 })}>
									<Mail className="h-4 w-4 mr-1" />
									Email Settings
								</NavLink>
							</NavItem>
						</Nav>
					</div>
				</div>
				
				<div className="section-body mt-4">
					<div className="container-fluid">
						<div className="text-center py-5">
							<div className="spinner-border text-primary" role="status">
								<span className="sr-only">Loading...</span>
							</div>
							<p className="mt-3 text-muted">Loading permissions...</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="section-body">
				<div className="container-fluid">
					<div className="d-flex justify-content-between align-items-center ">
						<div className="header-action">
							<h1 className="page-title">Settings</h1>
							<ol className="breadcrumb page-breadcrumb">
								<li className="breadcrumb-item"><a href="#">Ericsson</a></li>
								<li className="breadcrumb-item active" aria-current="page">Settings</li>
							</ol>
						</div>

						<Nav tabs className="page-header-tab">
							<NavItem>
								<NavLink
									className={classnames({ active: activeTab === 1 })}
									onClick={() => setActiveTab(1)}
									style={{ cursor: 'pointer' }}
								>
									<Shield className="h-4 w-4 mr-1" />
									Roles & Permissions
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink
									className={classnames({ active: activeTab === 2 })}
									onClick={() => setActiveTab(2)}
									style={{ cursor: 'pointer' }}
								>
									<Mail className="h-4 w-4 mr-1" />
									Email Settings
								</NavLink>
							</NavItem>
						</Nav>
					</div>
				</div>
			</div>
			
			<div className="section-body mt-4">
				<div className="container-fluid">
					<TabContent activeTab={activeTab}>
						{/* Tab 1 - Roles & Permissions */}
						<TabPane tabId={1} className={classnames(['fade show'])}>
							<div className="row">
								<div className="col-12">
									{/* Header Section */}
									<div className="card mb-4 shadow-sm border-0">
										<div className="card-body py-4 btn-primary btn-simple rounded-lg">
											<div className="d-flex justify-content-between align-items-center flex-wrap ">
												<div className="mb-3 mb-md-0 ">
													<h2 className="card-title mb-1 text-dark">
														<Shield className="h-5 w-5 inline mr-2 btn-primary btn-simple rounded-lg" />
														Role Permissions Management
													</h2>
													<p className="text-muted mb-0">
														Manage and configure permissions for different user roles
													</p>
												</div>
												{editingRole && (
													<div className="d-flex gap-2 flex-wrap">
														<button
															onClick={handleCancel}
															className="btn btn-outline-secondary text-white btn-lg d-flex align-items-center mb-2"
														>
															<ArrowLeft className="h-4 w-4 mr-2" />
															Back to Roles
														</button>
														<button
															onClick={handleSave}
															className="btn btn-success btn-lg d-flex align-items-center mb-2 ml-4"
														>
															<Save className="h-4 w-4 mr-2" />
															Save Changes
														</button>
													</div>
												)}
											</div>
										</div>
									</div>

									{/* Role Selection Cards d-flex align-items-center p-3 rounded-lg border btn-primary btn-simple rounded-lg shadow-md" style={{ borderColor: '#bae6fd' }} */}
									{!editingRole && (
										<div className="card mb-4 shadow-md border-0  btn-primary btn-simple rounded-lg" >
											<div className="card-header py-3 btn-primary btn-simple rounded-lg">
												<h5 className="card-title mb-0 text-dark">Select Role to Manage</h5>
											</div>
											<div className="card-body">
												<div className="row "> {/*justify-content-center*/}
													{permissions.map((role) => (
														<div key={role.role} className="col-xl-3  col-lg-4 col-md-6 mb-4 ">
															{/*  d-flex align-items-center p-3 rounded-lg border btn-primary btn-simple rounded-lg shadow-md" style={{ borderColor: '#bae6fd' }}  */}
															<div className="card card-hover border shadow-sm h-100 transition-all " style={{ borderColor: '#bae6fd' }}>
																<div className="card-body text-center d-flex flex-column p-4">
																	<div className="avatar avatar-lg bg-gradient-primary text-white rounded-circle mb-3 mx-auto d-flex align-items-center justify-content-center" style={{width: '80px', height: '80px'}}>
																		<Shield className="h-8 w-8" />
																	</div>
																	<h4 className="card-title text-capitalize text-primary mb-2">{role.role}</h4>
																	<p className="text-muted mb-3 flex-grow-1">
																		Manage {role.role} permissions and access levels
																	</p>
																	<button
																		onClick={() => handleEdit(role)}
																		className="btn btn-primary border btn-block mt-auto py-2 d-flex align-items-center justify-content-center" 
																	>
																		<Edit className="h-4 w-4 mr-2" />
																		Edit Permissions
																	</button>
																</div>
															</div>
														</div>
													))}
												</div>
											</div>
										</div>
									)}

									{/* Editing Section - FIXED POSITIONING */}
									{editingRole && (
										<>
											{/* Role Info Banner */}
											<div className="card bg-gradient-primary text-white mb-4 shadow border-0">
												<div className="card-body py-4 btn-primary btn-simple rounded-lg">
													<div className="d-flex align-items-center flex-wrap ">
														<div className="flex-shrink-0 mb-2 mb-md-0">
															<div className=" bg-gradient-primary text-gradient-primary bg-opacity-20 rounded-circle p-3 mr-2">
																<Shield className="h-5 w-5 inline" />
															</div>
														</div>
														<div className="flex-grow-1 ms-md-4 ">
															<h4 className="mb-2">
																Editing Permissions for: <span className="text-warning text-capitalize">{editingRole.role}</span>
															</h4>
															{/* <p className="mb-0 opacity-90">
																Toggle switches to enable or disable specific permissions for this role. Changes will be applied immediately after saving.
															</p> */}
														</div>
													</div>
												</div>
											</div>

											{/* Permissions Grid - FIXED POSITIONING */}
											<div className="row">
												<div className="col-12">
													<div className="permissions-grid">
														{editedPermissions.templates && (
															<PermissionCategory
																title="Templates Management"
																icon={FileText}
																category="templates"
																permissions={editedPermissions.templates}
															/>
														)}
														
														{editedPermissions.content && (
															<PermissionCategory
																title="Content Management"
																icon={FileText}
																category="content"
																permissions={editedPermissions.content}
															/>
														)}
														
														{editedPermissions.ai && (
															<PermissionCategory
																title="AI Generation"
																icon={BarChart3}
																category="ai"
																permissions={editedPermissions.ai}
															/>
														)}
														
														{editedPermissions.export && (
															<PermissionCategory
																title="Export Options"
																icon={Download}
																category="export"
																permissions={editedPermissions.export}
															/>
														)}
														
														{editedPermissions.users && (
															<PermissionCategory
																title="User Management"
																icon={Users}
																category="users"
																permissions={editedPermissions.users}
															/>
														)}
														
														{editedPermissions.admin && (
															<PermissionCategory
																title="Admin Access"
																icon={Settings}
																category="admin"
																permissions={editedPermissions.admin}
															/>
														)}
													</div>
												</div>
											</div>

											{/* Action Buttons */}
											<div className="card mt-4 shadow-sm border-0">
												<div className="card-body text-center py-4 ">
													<div className="d-flex justify-content-center gap-3 flex-wrap ">
														<button
															onClick={handleCancel}
															className="btn btn-outline-secondary btn-lg px-5 d-flex align-items-center mb-2 btn-primary btn-simple text-white"
														>
															<ArrowLeft className="h-4 w-4 mr-2" />
															Cancel
														</button>
														<button
															onClick={handleSave}
															className="btn btn-success btn-lg px-5 d-flex align-items-center shadow mb-2 ml-4"
														>
															<Save className="h-4 w-4 mr-2" />
															Save All Changes
														</button>
													</div>
													<p className="text-dark mt-3 mb-0">
														Review all changes before saving. Changes will affect all users with the <span className="text-capitalize font-weight-bold text-primary">{editingRole.role}</span> role.
													</p>
												</div>
											</div>
										</>
									)}

									{/* Current Permissions Overview */}
									{!editingRole && permissions.length > 0 && (
										<div className="card shadow-sm border-0">
											<div className="card-header bg-light py-3 btn-primary btn-simple">
												<h5 className="card-title mb-0 text-dark">Current Permissions Overview</h5>
											</div>
											<div className="card-body btn-primary btn-simple">
												<div className="table-responsive btn-primary btn-simple">
													<table className="table table-bordered table-hover mb-0">
														<thead className="text-dark">
															<tr>
																<th className="align-middle text-dark">Role</th>
																<th className="align-middle text-center text-dark">Templates</th>
																<th className="align-middle text-center text-dark">Content</th>
																<th className="align-middle text-center text-dark">AI</th>
																<th className="align-middle text-center text-dark">Export</th>
																<th className="align-middle text-center text-dark">Users</th>
																<th className="align-middle text-center text-dark">Admin</th>
																<th className="align-middle text-center text-dark">Actions</th>
															</tr>
														</thead>
														<tbody>
															{permissions.map((role) => (
																<tr key={role.role}>
																	<td className="text-capitalize font-weight-semibold align-middle">{role.role}</td>
																	<td className="align-middle text-center">
																		<span className="badge bg-info">
																			{role.permissions.templates ? Object.values(role.permissions.templates).filter(Boolean).length : 0} allowed
																		</span>
																	</td>
																	<td className="align-middle text-center">
																		<span className="badge bg-info">
																			{role.permissions.content ? Object.values(role.permissions.content).filter(Boolean).length : 0} allowed
																		</span>
																	</td>
																	<td className="align-middle text-center">
																		<span className="badge bg-info">
																			{role.permissions.ai ? Object.values(role.permissions.ai).filter(Boolean).length : 0} allowed
																		</span>
																	</td>
																	<td className="align-middle text-center">
																		<span className="badge bg-info">
																			{role.permissions.export ? Object.values(role.permissions.export).filter(Boolean).length : 0} allowed
																		</span>
																	</td>
																	<td className="align-middle text-center">
																		<span className="badge bg-info">
																			{role.permissions.users ? Object.values(role.permissions.users).filter(Boolean).length : 0} allowed
																		</span>
																	</td>
																	<td className="align-middle text-center">
																		<span className="badge bg-info">
																			{role.permissions.admin ? Object.values(role.permissions.admin).filter(Boolean).length : 0} allowed
																		</span>
																	</td>
																	<td className="align-middle text-center">
																		<button
																			onClick={() => handleEdit(role)}
																			className="btn btn-primary btn-sm d-flex align-items-center mx-auto"
																		>
																			<Edit className="h-3 w-3 mr-1" />
																			Edit
																		</button>
																	</td>
																</tr>
															))}
														</tbody>
													</table>
												</div>
											</div>
										</div>
									)}
								</div>
							</div>
						</TabPane>

						{/* Tab 2 - SMTP Email Settings (unchanged) */}
						<TabPane tabId={2} className={classnames(['fade show'])}>
							<div className="row">
								<div className="col-12">
									<div className="card">
										<div className="card-header">
											<h3 className="card-title">
												<Mail className="h-5 w-5 inline mr-2 text-primary" />
												SMTP Email Settings
											</h3>
										</div>
										<div className="card-body">
											<form>
												<div className="row">
													<div className="col-md-6">
														<div className="form-group">
															<label className="form-label">SMTP Host <span className="text-danger">*</span></label>
															<input 
																className="form-control" 
																type="text" 
																placeholder="smtp.gmail.com" 
																required
															/>
														</div>
													</div>
													<div className="col-md-6">
														<div className="form-group">
															<label className="form-label">SMTP Port <span className="text-danger">*</span></label>
															<input 
																className="form-control" 
																type="number" 
																placeholder="587" 
																required
															/>
														</div>
													</div>
													<div className="col-md-6">
														<div className="form-group">
															<label className="form-label">SMTP Username <span className="text-danger">*</span></label>
															<input 
																className="form-control" 
																type="email" 
																placeholder="your-email@gmail.com" 
																required
															/>
														</div>
													</div>
													<div className="col-md-6">
														<div className="form-group">
															<label className="form-label">SMTP Password <span className="text-danger">*</span></label>
															<input 
																className="form-control" 
																type="password" 
																placeholder="••••••••" 
																required
															/>
														</div>
													</div>
													<div className="col-md-6">
														<div className="form-group">
															<label className="form-label">Security Type</label>
															<select className="form-control">
																<option value="TLS">TLS</option>
																<option value="SSL">SSL</option>
																<option value="NONE">None</option>
															</select>
														</div>
													</div>
													<div className="col-md-6">
														<div className="form-group">
															<label className="form-label">From Email <span className="text-danger">*</span></label>
															<input 
																className="form-control" 
																type="email" 
																placeholder="noreply@yourdomain.com" 
																required
															/>
														</div>
													</div>
												</div>
												<div className="mt-4 text-right">
													<button type="submit" className="btn btn-primary btn-lg">
														<Save className="h-4 w-4 mr-2" />
														Save SMTP Settings
													</button>
												</div>
											</form>
										</div>
									</div>
								</div>
							</div>
						</TabPane>
					</TabContent>
				</div>
			</div>

			{/* Improved CSS for better positioning */}
			<style jsx>{`
				.form-check-input.custom-switch:checked {
					background-color: #28a745;
					border-color: #28a745;
				}
				.form-check-input.custom-switch {
					background-color: #dc3545;
					border-color: #dc3545;
				}
				.card-hover:hover {
					transform: translateY(-5px);
					transition: all 0.3s ease;
					box-shadow: 0 8px 25px rgba(0,0,0,0.15);
				}
				.transition-all {
					transition: all 0.3s ease;
				}
				.hover-bg:hover {
					background-color: #f8f9fa;
				}
				.bg-gradient-primary {
					background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
				}
				.permissions-grid .card {
					border-radius: 10px;
					overflow: hidden;
				}
				.shadow-sm {
					box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
				}
				/* Fixed positioning for form elements */
				.form-check.form-switch {
					display: flex;
					align-items: center;
					justify-content: flex-end;
					min-height: auto;
				}
				.form-check-input {
					margin: 0;
				}
			`}</style>
		</>
	);
};

export default Setting;