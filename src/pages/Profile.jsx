import React, { useState } from 'react';
import {
  User,
  Shield,
  Building2,
  Lock,
  Mail,
  Phone,
  FileCheck2,
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();

  // Profile Edit State
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [mobileNumber, setMobileNumber] = useState(user?.mobile_number || '');
  const [position, setPosition] = useState(user?.position || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');

  // Password Change State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passSuccessMsg, setPassSuccessMsg] = useState('');
  const [passErrorMsg, setPassErrorMsg] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileSuccessMsg('');
    setProfileErrorMsg('');

    setIsUpdatingProfile(true);
    try {
      const res = await updateProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        mobile_number: mobileNumber.replace(/\D/g, ''),
        position: position.trim(),
      });
      if (res.success) {
        setProfileSuccessMsg('Officer profile details updated successfully.');
      } else {
        setProfileErrorMsg(res.error || 'Failed to update profile.');
      }
    } catch (err) {
      setProfileErrorMsg('An error occurred while updating profile.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassSuccessMsg('');
    setPassErrorMsg('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPassErrorMsg('All password fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassErrorMsg('New password and confirmation do not match.');
      return;
    }

    setIsChangingPass(true);
    try {
      const res = await changePassword(oldPassword, newPassword, confirmPassword);
      if (res.success) {
        setPassSuccessMsg('Security credentials updated successfully.');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPassErrorMsg(res.error || 'Failed to change password.');
      }
    } catch (err) {
      setPassErrorMsg('An error occurred while updating password.');
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-gov-100 text-gov-800 text-xs font-bold font-mono">
              OFFICIAL CREDENTIALS
            </span>
            <span className="text-xs text-slate-500">• Identity Verified</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Officer Profile & Security Settings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your statutory profile credentials, jurisdiction parameters, and access security keys.
          </p>
        </div>

        {/* Authority Pill */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm self-start">
          <div className="w-8 h-8 rounded-lg bg-gov-700 text-white flex items-center justify-center font-bold text-sm">
            {user?.authority_type === 'CENTRAL_AUTHORITY' ? '🇮🇳' : '🏛️'}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">
              {user?.authority_type === 'CENTRAL_AUTHORITY' ? 'Central Authority' : 'State Authority'}
            </div>
            <div className="text-[10px] text-slate-500 font-medium">
              {user?.authority_type === 'CENTRAL_AUTHORITY' ? 'National Portfolio' : user?.state || 'State Scoped'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Officer Badge Card + Right Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Official Identity Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-gov-900 via-gov-800 to-sky-900 relative p-4 flex items-end">
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/40 backdrop-blur-md text-[10px] font-mono font-bold text-white border border-white/20">
                DRISHTI-SEC-ID
              </div>
            </div>

            <div className="px-5 pb-5 pt-0 relative">
              <div className="-mt-10 mb-3 flex items-end justify-between">
                <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-md border border-slate-200 overflow-hidden">
                  {user?.profile_photo_url ? (
                    <img src={user.profile_photo_url} alt="Officer" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-gov-700 text-white flex items-center justify-center text-xl font-bold">
                      {user?.first_name?.[0] || 'O'}{user?.last_name?.[0] || 'I'}
                    </div>
                  )}
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Active & Verified</span>
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-900">{user?.full_name}</h2>
              <p className="text-xs text-slate-500 font-medium">{user?.position}</p>
              <p className="text-xs font-mono text-sky-700 font-bold mt-0.5">@{user?.username}</p>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Jurisdiction Tier:</span>
                  </span>
                  <span className="font-bold text-slate-800">
                    {user?.authority_type === 'CENTRAL_AUTHORITY' ? 'Central (National)' : `State (${user?.state})`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <FileCheck2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>ID Proof Type:</span>
                  </span>
                  <span className="font-semibold text-slate-800">{user?.id_proof_type || 'Government ID'}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Shield className="w-3.5 h-3.5 text-slate-400" />
                    <span>Masked ID Number:</span>
                  </span>
                  <span className="font-mono font-bold text-slate-800">
                    {user?.masked_id_proof_number || 'XXXX XXXX 1234'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Account Created:</span>
                  </span>
                  <span className="font-mono text-slate-700 text-[11px]">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '05 Sep 2026'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Statutory Security Disclaimer */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Shield className="w-4 h-4 text-gov-700" />
              <span>Institutional Governance Note</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Your account access level governs the sensitivity of predictive cost and time models rendered on the national dashboard. ID Proof changes require supervisory validation.
            </p>
          </div>
        </div>

        {/* Right Column: Edit Profile & Password Reset Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Edit Profile Information */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="border-b border-slate-100 pb-4 mb-5">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-gov-700" />
                <span>Officer Personal & Contact Coordinates</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Update your contact details and active institutional position.
              </p>
            </div>

            {profileSuccessMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{profileSuccessMsg}</span>
              </div>
            )}

            {profileErrorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{profileErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-700/20 focus:border-gov-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-700/20 focus:border-gov-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mobile Number (+91)</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-700/20 focus:border-gov-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Official Position</label>
                  <input
                    type="text"
                    required
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-700/20 focus:border-gov-700"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gov-700 hover:bg-gov-800 active:scale-[0.99] disabled:opacity-60 transition shadow-sm flex items-center gap-1.5"
                >
                  {isUpdatingProfile ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="border-b border-slate-100 pb-4 mb-5">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-gov-700" />
                <span>Change Access Security Password</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Ensure your password meets 256-bit encryption strength standards.
              </p>
            </div>

            {passSuccessMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{passSuccessMsg}</span>
              </div>
            )}

            {passErrorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{passErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Current Password</label>
                <div className="relative">
                  <input
                    type={showOldPass ? 'text' : 'password'}
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-3.5 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-700/20 focus:border-gov-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPass(!showOldPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showOldPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-3.5 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-700/20 focus:border-gov-700"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-700/20 focus:border-gov-700"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isChangingPass}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 active:scale-[0.99] disabled:opacity-60 transition shadow-sm flex items-center gap-1.5"
                >
                  {isChangingPass ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
