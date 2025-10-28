import React, { useState } from 'react';
import Fullcalender from '../../common/fullcalender';
import { TabContent, TabPane, Nav, NavLink, NavItem } from "reactstrap";
import classnames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile, changePassword } from '../../../slices/authSlice';
import toast from 'react-hot-toast';
import { User, Mail, Building, Save, Key, Lock, Calendar, Shield, Hash, Eye, EyeOff } from 'lucide-react';

const PageProfile = () => {
	const [activeTab, setActiveTab] = useState(1);
	const { user } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);

	// Password visibility states
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	// Sirf 3 fields - name, email, organization
	const [profileData, setProfileData] = useState({
		name: user?.name || '',
		email: user?.email || '',
		organization: user?.organization || '',
	});

	const [passwordData, setPasswordData] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});

	const handleProfileUpdate = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const result = await dispatch(updateProfile(profileData)).unwrap();
			toast.success('Profile updated successfully');
		} catch (error) {
			toast.error(error || 'Failed to update profile');
		} finally {
			setLoading(false);
		}
	};

	const handlePasswordChange = async (e) => {
		e.preventDefault();

		if (passwordData.newPassword !== passwordData.confirmPassword) {
			toast.error('New passwords do not match');
			return;
		}

		if (passwordData.newPassword.length < 6) {
			toast.error('Password must be at least 6 characters long');
			return;
		}

		setLoading(true);

		try {
			await dispatch(changePassword({
				currentPassword: passwordData.currentPassword,
				newPassword: passwordData.newPassword,
			})).unwrap();

			setPasswordData({
				currentPassword: '',
				newPassword: '',
				confirmPassword: '',
			});

			// Reset password visibility
			setShowCurrentPassword(false);
			setShowNewPassword(false);
			setShowConfirmPassword(false);

			toast.success('Password changed successfully');
		} catch (error) {
			toast.error(error || 'Failed to change password');
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div className="section-body">
				<div className="container-fluid">
					<div className="d-flex justify-content-between align-items-center ">
						<div className="header-action">
							<h1 className="page-title">My Profile</h1>
						</div>
						<Nav tabs className="page-header-tab">
							<NavItem>
								<NavLink
									className={classnames({ active: activeTab === 1 })}
									onClick={() => setActiveTab(1)}
									style={{ cursor: 'pointer' }}
								>
									<i className="fa fa-calendar mr-1"></i> Calendar
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink
									className={classnames({ active: activeTab === 3 })}
									onClick={() => setActiveTab(3)}
									style={{ cursor: 'pointer' }}
								>
									<User className="h-4 w-4 mr-1" />
									Profile
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink
									className={classnames({ active: activeTab === 4 })}
									onClick={() => setActiveTab(4)}
									style={{ cursor: 'pointer' }}
								>
									<Lock className="h-4 w-4 mr-1" />
									Security
								</NavLink>
							</NavItem>
						</Nav>
					</div>
				</div>
			</div>

			<div className="section-body mt-4">
				<div className="container-fluid">
					<div className="row clearfix">
						<div className="col-md-12">
							<TabContent activeTab={activeTab}>
								{/* Tab 1 - Calendar */}
								<TabPane tabId={1} className={classnames(['fade show'])}>
									<div className="card">
										<div className="card-body">
											<Fullcalender />
										</div>
									</div>
								</TabPane>

								{/* Tab 3 - Profile (Sirf 3 fields + Account Information) */}
								<TabPane tabId={3} className={classnames(['fade show'])}>
									{/* Profile Edit Form */}
									<div className="card btn-primary btn-simple rounded-lg ">
										<div className="card-header">
											<h3 className="card-title text-dark">
												<User className="h-5 w-5 inline mr-2" />
												Edit Profile
											</h3>
										</div>
										<div className="card-body form-horizontal">
											<form onSubmit={handleProfileUpdate}>
												<div className="form-group mb-4">
													<label className="text-dark mb-2 d-block text-title ">
														<User className="h-4 w-4 inline mr-1 btn-primary btn-simple rounded-lg" />
														Full Name <span className="text-danger">*</span>
													</label>
													<input
														type="text"
														className="form-control border-2 bg-light px-3 py-2 rounded  "
														value={profileData.name}
														onChange={(e) =>
															setProfileData((prev) => ({ ...prev, name: e.target.value }))
														}
														required
													/>
												</div>

												<div className="form-group mb-4">
													<label className="text-dark mb-2 d-block text-title">
														<Mail className="h-4 w-4 inline mr-1 btn-primary btn-simple rounded-lg" />
														Email Address <span className="text-danger">*</span>
													</label>
													<input
														type="email"
														className="form-control border-2 bg-light px-3 py-2 rounded"
														value={profileData.email}
														onChange={(e) =>
															setProfileData((prev) => ({ ...prev, email: e.target.value }))
														}
														required
													/>
												</div>

												<div className="form-group mb-4">
													<label className="text-dark mb-2 d-block text-title">
														<Building className="h-4 w-4 inline mr-1 btn-primary btn-simple rounded-lg" />
														Organization
													</label>
													<input
														type="text"
														className="form-control border-2 bg-light px-3 py-2 rounded"
														value={profileData.organization}
														onChange={(e) =>
															setProfileData((prev) => ({
																...prev,
																organization: e.target.value,
															}))
														}
													/>
												</div>

												<div className="card-footer text-right">
													<button type="submit" className="btn btn-outline-sucess text-white btn-primary" disabled={loading}>
														<Save className="h-4 w-4 mr-1" />
														{loading ? "Updating..." : "Update Profile"}
													</button>
												</div>
											</form>

										</div>
									</div>

									<div className="card mt-4 btn-primary btn-simple rounded-lg">
										<div className="card-header">
											<h3 className="card-title text-dark">
												<Shield className="h-5 w-5 inline mr-2" />
												Account Information
											</h3>
										</div>
										<div className="card-body ">
											<div className="row ">
												{/* Basic Information */}
												<div className="col-md-6 mb-4 ">
													<div className="d-flex align-items-center p-3 rounded-lg border btn-primary btn-simple rounded-lg shadow-md" style={{ borderColor: '#bae6fd' }}>
														<div className="mr-3">
															<div className="bg-primary rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
																<User className="h-5 w-5 text-white" />
															</div>
														</div>
														<div>
															<label className=" text-title mb-1 text-dark">Full Name</label>
															<p className="mb-0 font-semibold text-dark">
																{user?.name || 'N/A'}
															</p>
														</div>
													</div>
												</div>

												<div className="col-md-6 mb-4">
													<div className="d-flex align-items-center p-3 rounded-lg border btn-primary btn-simple rounded-lg shadow-md" style={{ borderColor: '#bae6fd' }}>
														<div className="mr-3">
															<div className="bg-info rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
																<Mail className="h-5 w-5 text-white" />
															</div>
														</div>
														<div>
															<label className="text-dark text-title mb-1">Email</label>
															<p className="mb-0 font-semibold text-dark">
																{user?.email || 'N/A'}
															</p>
														</div>
													</div>
												</div>

												<div className="col-md-6 mb-4">
													<div className="d-flex align-items-center p-3 rounded-lg border btn-primary btn-simple rounded-lg shadow-md" style={{ borderColor: '#bae6fd' }}>
														<div className="mr-3">
															<div className="bg-success rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
																<Shield className="h-5 w-5 text-white" />
															</div>
														</div>
														<div>
															<label className="text-title text-dark mb-1">Role</label>
															<p className="mb-0 font-semibold text-success capitalize">{user?.role || 'User'}</p>
														</div>
													</div>
												</div>

												<div className="col-md-6 mb-4">
													<div className="d-flex align-items-center p-3 rounded-lg border btn-primary btn-simple rounded-lg shadow-md" style={{ borderColor: '#bae6fd' }}>
														<div className="mr-3">
															<div className="bg-warning rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
																<Building className="h-5 w-5 text-white" />
															</div>
														</div>
														<div>
															<label className="text-title text-dark mb-1">Organization</label>
															<p className="mb-0 font-semibold text-dark">{user?.organization || 'N/A'}</p>
														</div>
													</div>
												</div>

												<div className="col-md-6 mb-4">
													<div className="d-flex align-items-center p-3 rounded-lg border btn-primary btn-simple rounded-lg shadow-md" style={{ borderColor: '#bae6fd' }}>
														<div className="mr-3">
															<div className="bg-purple rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
																<Calendar className="h-5 w-5 text-white" />
															</div>
														</div>
														<div>
															<label className="text-title text-dark mb-1">Last Login</label>
															<p className="mb-0 font-semibold text-dark">
																{user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}
															</p>
														</div>
													</div>
												</div>
											</div>

											{/* Key Permissions Summary */}
											<div className="mt-4 pt-4 border-top">
												<h5 className="font-semibold mb-3 text-dark">
													<Shield className="h-4 w-4 inline mr-2" />
													Key Permissions
												</h5>

												<div className="row">
													{/* AI Access */}
													{user?.permissions?.ai?.generate && (
														<div className="col-md-6 mb-3">
															<div className="d-flex align-items-center p-3 rounded-lg border btn-primary btn-simple rounded-lg shadow-md" style={{ borderColor: '#d1f2d1' }}>
																<div className="mr-3 ">
																	<div className="bg-success rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
																		<svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
																		</svg>
																	</div>
																</div>
																<div>
																	<label className="text-title text-dark mb-1">AI Generation</label>
																	<p className="mb-0 font-semibold text-success text-muted">
																		{user?.permissions?.ai?.dailyLimit || 0} daily credits
																	</p>
																</div>
															</div>
														</div>
													)}

													{/* Admin Access */}
													{user?.permissions?.admin?.dashboard && (
														<div className="col-md-6 mb-3">
															<div className="d-flex align-items-center p-3 rounded-lg border btn-primary btn-simple rounded-lg shadow-md" style={{ borderColor: '#fecaca' }}>
																<div className="mr-3">
																	<div className="bg-danger rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
																		<svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
																			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
																		</svg>
																	</div>
																</div>
																<div>
																	<label className="text-title text-dark mb-1">Admin Access</label>
																	<p className="mb-0 font-semibold text-danger text-muted">Full System Access</p>
																</div>
															</div>
														</div>
													)}

													{/* Templates Count */}
													{user?.permissions?.templates?.access && (
														<div className="col-md-6 mb-3">
															<div className="d-flex align-items-center p-3 rounded-lg border btn-primary btn-simple rounded-lg shadow-md" style={{ borderColor: '#bae6fd' }}>
																<div className="mr-3">
																	<div className="bg-info rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
																		<svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
																		</svg>
																	</div>
																</div>
																<div>
																	<label className="text-title text-dark mb-1">Template Access</label>
																	<p className="mb-0 font-semibold text-info text-muted">
																		{user.permissions.templates.access.length} templates
																	</p>
																</div>
															</div>
														</div>
													)}

													{/* Export Options */}
													{user?.permissions?.export && (
														<div className="col-md-6 mb-3">
															<div className="d-flex align-items-center p-3 rounded-lg border btn-primary btn-simple rounded-lg shadow-md" style={{  borderColor: '#fed7aa' }}>
																<div className="mr-3">
																	<div className="bg-warning rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
																		<svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
																		</svg>
																	</div>
																</div>
																<div>
																	<label className="text-title text-dark mb-1">Export Options</label>
																	<p className="mb-0 font-semibold text-warning text-muted">
																		{Object.values(user.permissions.export).filter(Boolean).length} formats
																	</p>
																</div>
															</div>
														</div>
													)}
												</div>
											</div>

											{/* Quick Stats */}
											<div className="mt-4 pt-4 border-top">
												<h5 className="font-semibold mb-3 text-dark">
													Quick Stats
												</h5>

												<div className="row text-center">
													<div className="col-4">
														<div className="p-2">
															<div className="bg-primary text-white rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
																<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																	<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
																</svg>
															</div>
															<label className="text-title text-dark">Templates</label>
															<p className="mb-0 font-semibold">{user?.permissions?.templates?.access?.length || 0}</p>
														</div>
													</div>
													<div className="col-4">
														<div className="p-2">
															<div className="bg-success text-white rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
																<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																	<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
																</svg>
															</div>
															<label className="text-title text-dark">AI Credits</label>
															<p className="mb-0 font-semibold">{user?.permissions?.ai?.dailyLimit || 0}</p>
														</div>
													</div>
													<div className="col-4">
														<div className="p-2">
															<div className="bg-info text-white rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
																<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																	<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
																</svg>
															</div>
															<label className="text-title text-dark">Export Formats</label>
															<p className="mb-0 font-semibold">
																{user?.permissions?.export ? Object.values(user.permissions.export).filter(Boolean).length : 0}
															</p>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</TabPane>

								{/* Tab 4 - Security */}
								<TabPane tabId={4} className={classnames(['fade show'])}>
									<div className="card">
										<div className="card-header">
											<h3 className="card-title">
												<Lock className="h-5 w-5 inline mr-2" />
												Change Password
											</h3>
										</div>
										<div className="card-body">
											<form onSubmit={handlePasswordChange}>
												<div className="form-group row">
													<label className="col-md-3 col-form-label">Current Password <span className="text-danger">*</span></label>
													<div className="col-md-7">
														<div className="input-group">
															<input
																type={showCurrentPassword ? "text" : "password"}
																className="form-control"
																value={passwordData.currentPassword}
																onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
																required
															/>
															<div className="input-group-append">
																<button
																	className="btn btn-outline-secondary"
																	type="button"
																	onClick={() => setShowCurrentPassword(!showCurrentPassword)}
																>
																	{showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
																</button>
															</div>
														</div>
													</div>
												</div>

												<div className="form-group row">
													<label className="col-md-3 col-form-label">New Password <span className="text-danger">*</span></label>
													<div className="col-md-7">
														<div className="input-group">
															<input
																type={showNewPassword ? "text" : "password"}
																className="form-control"
																value={passwordData.newPassword}
																onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
																required
																minLength={6}
															/>
															<div className="input-group-append">
																<button
																	className="btn btn-outline-secondary"
																	type="button"
																	onClick={() => setShowNewPassword(!showNewPassword)}
																>
																	{showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
																</button>
															</div>
														</div>
														<small className="text-muted">Password must be at least 6 characters long</small>
													</div>
												</div>

												<div className="form-group row">
													<label className="col-md-3 col-form-label">Confirm New Password <span className="text-danger">*</span></label>
													<div className="col-md-7">
														<div className="input-group">
															<input
																type={showConfirmPassword ? "text" : "password"}
																className="form-control"
																value={passwordData.confirmPassword}
																onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
																required
															/>
															<div className="input-group-append">
																<button
																	className="btn btn-outline-secondary"
																	type="button"
																	onClick={() => setShowConfirmPassword(!showConfirmPassword)}
																>
																	{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
																</button>
															</div>
														</div>
													</div>
												</div>

												<div className="card-footer text-right">
													<button
														type="submit"
														className="btn btn-primary"
														disabled={loading}
													>
														<Key className="h-4 w-4 mr-1" />
														{loading ? 'Changing...' : 'Change Password'}
													</button>
												</div>
											</form>
										</div>
									</div>
								</TabPane>
							</TabContent>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default PageProfile;