import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  User,
  Building2,
  FileCheck2,
  Lock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  Eye,
  EyeOff,
  AlertCircle,
  FileText,
  Sparkles,
  MapPin,
  Check,
  X,
  Layers,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const INDIAN_STATES_AND_UTS = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka',
  'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const ID_PROOF_TYPES = [
  'Government ID',
  'Official Service / Employee ID Card',
  'Departmental ID Card',
  'Other Statutory Government ID'
];

const DESIGNATIONS = [
  'Chief Project Officer',
  'Principal Secretary (Infrastructure)',
  'Executive Engineer (Nodal)',
  'Chief Engineer (Monitoring)',
  'Superintending Engineer',
  'Joint Secretary / Director',
  'Project Monitoring Officer',
  'Other Statutory Authority'
];

export const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    // Step 1
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    // Step 2
    authorityType: 'CENTRAL_AUTHORITY', // or 'STATE_AUTHORITY'
    position: 'Chief Project Officer',
    customPosition: '',
    state: 'Maharashtra',
    // Step 3
    idProofType: 'Government ID',
    idProofNumber: '',
    idProofFile: null,
    // Step 4
    username: '',
    password: '',
    confirmPassword: '',
    // Step 5
    declarationAccepted: false,
  });

  const [idFilePreviewName, setIdFilePreviewName] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [registeredUser, setRegisteredUser] = useState(null);

  // Field change helper
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // ID Proof file select
  const handleIdProofFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, idProofFile: 'Document must be under 10MB.' }));
        return;
      }
      setFormData((prev) => ({ ...prev, idProofFile: file }));
      setIdFilePreviewName(file.name);
      setErrors((prev) => ({ ...prev, idProofFile: null }));
    }
  };

  // Password evaluation
  const evaluatePassword = (pass) => {
    const checks = {
      length: pass.length >= 8,
      upper: /[A-Z]/.test(pass),
      lower: /[a-z]/.test(pass),
      digit: /[0-9]/.test(pass),
      special: /[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]/.test(pass),
    };
    const score = Object.values(checks).filter(Boolean).length;
    let label = 'Very Weak';
    let color = 'bg-red-500';
    let percent = 20;

    if (score === 5) {
      label = 'Strong';
      color = 'bg-emerald-500';
      percent = 100;
    } else if (score >= 4) {
      label = 'Good';
      color = 'bg-sky-500';
      percent = 80;
    } else if (score >= 3) {
      label = 'Fair';
      color = 'bg-amber-500';
      percent = 60;
    } else if (score >= 2) {
      label = 'Weak';
      color = 'bg-orange-500';
      percent = 40;
    }

    return { checks, score, label, color, percent };
  };

  const passwordEval = evaluatePassword(formData.password);

  // Step Validations
  const validateStep1 = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required.';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required.';
    const cleanMobile = formData.mobileNumber.replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length !== 10 || !['6', '7', '8', '9'].includes(cleanMobile[0])) {
      errs.mobileNumber = 'Enter a valid 10-digit Indian mobile number (e.g. 9876543210).';
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = 'Enter a valid official email address.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (formData.position === 'Other Statutory Authority' && !formData.customPosition.trim()) {
      errs.customPosition = 'Please specify your official position.';
    }
    if (formData.authorityType === 'STATE_AUTHORITY' && !formData.state) {
      errs.state = 'Please select your assigned State / UT.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs = {};
    if (!formData.idProofNumber.trim()) {
      errs.idProofNumber = 'Identity Proof document number is required.';
    } else if (formData.idProofNumber.trim().length < 4) {
      errs.idProofNumber = 'Enter a valid document number.';
    }
    if (!formData.idProofFile) {
      errs.idProofFile = 'Please upload a PDF/JPG/PNG document of your ID proof.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep4 = () => {
    const errs = {};
    const cleanUser = formData.username.trim().toLowerCase();
    if (!cleanUser || cleanUser.length < 4) {
      errs.username = 'Username must be at least 4 characters long.';
    } else if (!/^[a-zA-Z0-9_]+$/.test(cleanUser)) {
      errs.username = 'Username can only contain alphanumeric letters and underscores.';
    }

    if (passwordEval.score < 4) {
      errs.password = 'Password must meet at least 4 out of 5 security requirements.';
    }

    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep5 = () => {
    const errs = {};
    if (!formData.declarationAccepted) {
      errs.declaration = 'You must accept the official declaration to proceed.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    let isValid = false;
    if (currentStep === 1) isValid = validateStep1();
    else if (currentStep === 2) isValid = validateStep2();
    else if (currentStep === 3) isValid = validateStep3();
    else if (currentStep === 4) isValid = validateStep4();

    if (isValid) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setSubmitError('');
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit Final Registration Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validateStep5()) return;

    setIsSubmitting(true);
    try {
      const formPayload = new FormData();
      formPayload.append('first_name', formData.firstName.trim());
      formPayload.append('last_name', formData.lastName.trim());
      formPayload.append('mobile_number', formData.mobileNumber.replace(/\D/g, ''));
      formPayload.append('email', formData.email.trim().toLowerCase());
      formPayload.append('authority_type', formData.authorityType);

      const effectivePosition = formData.position === 'Other Statutory Authority'
        ? formData.customPosition.trim()
        : formData.position;
      formPayload.append('position', effectivePosition);

      if (formData.authorityType === 'STATE_AUTHORITY') {
        formPayload.append('state', formData.state);
      }

      formPayload.append('id_proof_type', formData.idProofType);
      formPayload.append('id_proof_number', formData.idProofNumber.trim());
      formPayload.append('id_proof_file', formData.idProofFile);

      formPayload.append('username', formData.username.trim().toLowerCase());
      formPayload.append('password', formData.password);
      formPayload.append('confirm_password', formData.confirmPassword);

      const result = await register(formPayload);

      if (result.success) {
        setRegisteredUser(result.data);
        setCurrentStep(6); // Success Step
      } else {
        setSubmitError(result.error || 'Registration failed. Please check your data.');
      }
    } catch (err) {
      setSubmitError('An unexpected server error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mask ID for summary
  const getMaskedId = (val) => {
    if (!val) return 'XXXX XXXX XXXX';
    const clean = val.replace(/\s+/g, '');
    if (clean.length <= 4) return clean;
    const last4 = clean.slice(-4);
    return `XXXX XXXX ${last4}`;
  };

  const stepsList = [
    { num: 1, title: 'Personal Info', icon: User },
    { num: 2, title: 'Authority Scope', icon: Building2 },
    { num: 3, title: 'Identity & ID Proof', icon: FileCheck2 },
    { num: 4, title: 'Credentials', icon: Lock },
    { num: 5, title: 'Review & Submit', icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gov-950 py-8 px-4 sm:px-6 lg:px-8 text-slate-100 relative overflow-hidden flex flex-col justify-between">
      {/* Background Ambience */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between mb-8 z-10">
        <Link to="/login" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gov-700/80 border border-sky-400/30 flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-wider text-white">DRISHTI AI</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Official Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Officer Registration & Authority Onboarding
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 transition"
          >
            Already Registered? Sign In
          </Link>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-3xl mx-auto z-10 my-auto">
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800/90 rounded-2xl shadow-2xl p-6 sm:p-8">
          
          {/* Top Wizard Steps Tracker (only for steps 1-5) */}
          {currentStep <= 5 && (
            <div className="mb-8">
              <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 w-full -z-0" />
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-sky-500 transition-all duration-300 -z-0"
                  style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
                />

                {stepsList.map((step) => {
                  const Icon = step.icon;
                  const isDone = currentStep > step.num;
                  const isCurrent = currentStep === step.num;

                  return (
                    <div key={step.num} className="flex flex-col items-center z-10 relative">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                          isDone
                            ? 'bg-emerald-500 border-emerald-400 text-white'
                            : isCurrent
                            ? 'bg-sky-600 border-sky-400 text-white ring-4 ring-sky-500/20 shadow-lg'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                      >
                        {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : <Icon className="w-4 h-4" />}
                      </div>
                      <span
                        className={`text-[11px] mt-1.5 font-medium hidden sm:block ${
                          isCurrent ? 'text-sky-300 font-bold' : isDone ? 'text-emerald-400' : 'text-slate-500'
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Submission Error Banner */}
          {submitError && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <div>
                <p className="font-bold text-red-200">Registration Error</p>
                <p className="mt-0.5">{submitError}</p>
              </div>
            </div>
          )}

          {/* ================================================================
              STEP 1: PERSONAL INFORMATION
              ================================================================ */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-sky-400" />
                  <span>Step 1: Personal & Contact Information</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your official name and verified contact coordinates.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    First Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    placeholder="e.g. Aarav"
                    className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700 focus:border-sky-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                  {errors.firstName && <p className="text-xs text-red-400 mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Last Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    placeholder="e.g. Sharma"
                    className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700 focus:border-sky-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                  {errors.lastName && <p className="text-xs text-red-400 mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Indian Mobile Number (10 Digits) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={formData.mobileNumber}
                      onChange={(e) => handleChange('mobileNumber', e.target.value)}
                      placeholder="9876543210"
                      className="w-full pl-12 pr-4 py-2.5 bg-slate-950/70 border border-slate-700 focus:border-sky-500 rounded-xl text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    />
                  </div>
                  {errors.mobileNumber && <p className="text-xs text-red-400 mt-1">{errors.mobileNumber}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Official Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="e.g. officer@gov.in or dept@nic.in"
                    className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700 focus:border-sky-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                  {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl text-xs text-sky-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>An official email (gov.in, nic.in, state.gov.in) is recommended for fast-track statutory access.</span>
              </div>
            </div>
          )}

          {/* ================================================================
              STEP 2: AUTHORITY TYPE & JURISDICTION
              ================================================================ */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-sky-400" />
                  <span>Step 2: Authority Scope & Designation</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Define your institutional authority tier and operational state jurisdiction.
                </p>
              </div>

              {/* Authority Type Cards */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Select Authority Tier <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Central Authority */}
                  <div
                    onClick={() => handleChange('authorityType', 'CENTRAL_AUTHORITY')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition relative ${
                      formData.authorityType === 'CENTRAL_AUTHORITY'
                        ? 'bg-gov-900/40 border-sky-400 shadow-lg shadow-sky-950/50'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {formData.authorityType === 'CENTRAL_AUTHORITY' && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center text-white text-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="text-xl">🇮🇳</span>
                      <h4 className="font-bold text-sm text-white">Central Authority</h4>
                    </div>
                    <p className="text-xs text-slate-400">
                      National Portfolio Scope. Oversight across all Union Ministries, Sectors & Inter-State Corridors.
                    </p>
                    <span className="inline-block mt-2.5 text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/15 text-sky-300 font-semibold border border-sky-500/30">
                      National Level Access
                    </span>
                  </div>

                  {/* State Authority */}
                  <div
                    onClick={() => handleChange('authorityType', 'STATE_AUTHORITY')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition relative ${
                      formData.authorityType === 'STATE_AUTHORITY'
                        ? 'bg-amber-950/40 border-amber-400 shadow-lg shadow-amber-950/50'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {formData.authorityType === 'STATE_AUTHORITY' && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-slate-950 text-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <MapPin className="w-5 h-5 text-amber-400" />
                      <h4 className="font-bold text-sm text-white">State Authority</h4>
                    </div>
                    <p className="text-xs text-slate-400">
                      Regional State Scope. High-priority risk surveillance and asset management for assigned State / UT.
                    </p>
                    <span className="inline-block mt-2.5 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30">
                      State-Scoped Access
                    </span>
                  </div>
                </div>
              </div>

              {/* State Selection Dropdown (Only for State Authority) */}
              {formData.authorityType === 'STATE_AUTHORITY' && (
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2 animate-in fade-in duration-150">
                  <label className="block text-xs font-semibold text-amber-300">
                    Assigned State / Union Territory <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-amber-500/50 focus:border-amber-400 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  >
                    {INDIAN_STATES_AND_UTS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                  {errors.state && <p className="text-xs text-red-400">{errors.state}</p>}
                  <p className="text-[11px] text-amber-400/80">
                    Your account will be scoped exclusively to monitor projects situated within {formData.state}.
                  </p>
                </div>
              )}

              {/* Position / Designation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Official Position / Designation <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.position}
                    onChange={(e) => handleChange('position', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700 focus:border-sky-500 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  >
                    {DESIGNATIONS.map((pos) => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.position === 'Other Statutory Authority' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Specify Designation <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.customPosition}
                      onChange={(e) => handleChange('customPosition', e.target.value)}
                      placeholder="e.g. Chief Vigilance Officer"
                      className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700 focus:border-sky-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    />
                    {errors.customPosition && <p className="text-xs text-red-400 mt-1">{errors.customPosition}</p>}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================
              STEP 3: IDENTITY VERIFICATION & DOCUMENTS
              ================================================================ */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-sky-400" />
                  <span>Step 3: Government ID & Verification Document</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Provide your official Government ID details and upload document for statutory verification.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Government ID Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.idProofType}
                    onChange={(e) => handleChange('idProofType', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700 focus:border-sky-500 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  >
                    {ID_PROOF_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Government ID Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.idProofNumber}
                    onChange={(e) => handleChange('idProofNumber', e.target.value)}
                    placeholder="e.g. GOV-ID-8812 or 5432109876"
                    className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700 focus:border-sky-500 rounded-xl text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                  {errors.idProofNumber && <p className="text-xs text-red-400 mt-1">{errors.idProofNumber}</p>}
                </div>
              </div>

              {/* ID Proof File Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Upload Government ID Document (PDF, JPG, PNG - Max 10MB) <span className="text-red-400">*</span>
                </label>
                <div className="relative border-2 border-dashed border-slate-700 hover:border-sky-500 bg-slate-950/50 rounded-xl p-5 text-center transition">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleIdProofFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-sky-400">
                      <Upload className="w-5 h-5" />
                    </div>
                    {idFilePreviewName ? (
                      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Attached: {idFilePreviewName}</span>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs font-semibold text-slate-300">
                          Click or drag and drop to upload document
                        </p>
                        <p className="text-[11px] text-slate-500">PDF, JPG, or PNG up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>
                {errors.idProofFile && <p className="text-xs text-red-400 mt-1">{errors.idProofFile}</p>}
              </div>
            </div>
          )}

          {/* ================================================================
              STEP 4: ACCOUNT CREDENTIALS & SECURITY
              ================================================================ */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-sky-400" />
                  <span>Step 4: Account Credentials & Password Setup</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Create your unique username and configure a high-security access key.
                </p>
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Desired Username <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleChange('username', e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                    placeholder="e.g. aarav_sharma"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700 focus:border-sky-500 rounded-xl text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
                {errors.username && <p className="text-xs text-red-400 mt-1">{errors.username}</p>}
                <p className="text-[11px] text-slate-500 mt-1">Alphanumeric characters and underscores only.</p>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Account Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-11 py-2.5 bg-slate-950/70 border border-slate-700 focus:border-sky-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}

                {/* Live Password Strength Meter */}
                {formData.password && (
                  <div className="mt-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Password Strength:</span>
                      <span className={`font-bold ${
                        passwordEval.label === 'Strong' ? 'text-emerald-400' :
                        passwordEval.label === 'Good' ? 'text-sky-400' :
                        passwordEval.label === 'Fair' ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {passwordEval.label}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passwordEval.color} transition-all duration-300`}
                        style={{ width: `${passwordEval.percent}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1 text-[11px]">
                      <div className={`flex items-center gap-1.5 ${passwordEval.checks.length ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {passwordEval.checks.length ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        <span>8+ Characters</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${passwordEval.checks.upper ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {passwordEval.checks.upper ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        <span>Uppercase (A-Z)</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${passwordEval.checks.lower ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {passwordEval.checks.lower ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        <span>Lowercase (a-z)</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${passwordEval.checks.digit ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {passwordEval.checks.digit ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        <span>Number (0-9)</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${passwordEval.checks.special ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {passwordEval.checks.special ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        <span>Special Symbol</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Confirm Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-11 py-2.5 bg-slate-950/70 border border-slate-700 focus:border-sky-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>}
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match perfectly.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ================================================================
              STEP 5: REVIEW & OFFICIAL DECLARATION
              ================================================================ */}
          {currentStep === 5 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Step 5: Review Details & Official Submission</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Please inspect your credentials and accept the statutory declaration.
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden text-sky-400">
                      <User className="w-5 h-5 text-sky-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {formData.firstName} {formData.lastName}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {formData.position === 'Other Statutory Authority' ? formData.customPosition : formData.position}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                      formData.authorityType === 'CENTRAL_AUTHORITY'
                        ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                        : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {formData.authorityType === 'CENTRAL_AUTHORITY' ? '🇮🇳 Central Authority' : `State: ${formData.state}`}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">Official Email:</span>
                    <p className="font-semibold text-slate-200 mt-0.5">{formData.email}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Mobile (+91):</span>
                    <p className="font-semibold text-slate-200 mt-0.5 font-mono">{formData.mobileNumber}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Government ID Type:</span>
                    <p className="font-semibold text-slate-200 mt-0.5">{formData.idProofType}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Government ID (Masked):</span>
                    <p className="font-semibold text-slate-200 mt-0.5 font-mono">
                      {getMaskedId(formData.idProofNumber)}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Account Username:</span>
                    <p className="font-semibold text-sky-400 mt-0.5 font-mono">@{formData.username}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Government ID Document:</span>
                    <p className="font-semibold text-emerald-400 mt-0.5 truncate">{idFilePreviewName || 'Attached'}</p>
                  </div>
                </div>
              </div>

              {/* Official Declaration Checkbox */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.declarationAccepted}
                    onChange={(e) => handleChange('declarationAccepted', e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500/30 focus:ring-offset-0"
                  />
                  <div className="text-xs text-slate-300 leading-relaxed">
                    <p className="font-bold text-white mb-1">Official Declaration & Verification Acknowledgment</p>
                    I solemnly declare that all particulars entered are true and authentic. I understand that DRISHTI AI is a protected Government Infrastructure Intelligence System and unauthorized misrepresentation is subject to statutory penalties under the Information Technology Act.
                  </div>
                </label>
                {errors.declaration && <p className="text-xs text-red-400">{errors.declaration}</p>}
              </div>
            </div>
          )}

          {/* ================================================================
              STEP 6: REGISTRATION SUCCESS SCREEN
              ================================================================ */}
          {currentStep === 6 && (
            <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-950/50 animate-bounce">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold font-mono uppercase tracking-wider mb-2 border border-emerald-500/30">
                  Account Verified & Registered
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Welcome to DRISHTI AI Platform
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Your official credentials have been registered and access tokens have been provisioned in the central security registry.
                </p>
              </div>

              {/* User Card */}
              <div className="bg-slate-950/80 max-w-md mx-auto rounded-xl border border-slate-800 p-4 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Username:</span>
                  <span className="text-xs font-mono font-bold text-sky-400">@{registeredUser?.username || formData.username}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Officer Name:</span>
                  <span className="text-xs font-bold text-white">{registeredUser?.full_name || `${formData.firstName} ${formData.lastName}`}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Authority Role:</span>
                  <span className="text-xs font-semibold text-amber-300">{registeredUser?.authority_type || formData.authorityType}</span>
                </div>
                {formData.authorityType === 'STATE_AUTHORITY' && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Assigned Jurisdiction:</span>
                    <span className="text-xs font-semibold text-emerald-400">{formData.state}</span>
                  </div>
                )}
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="w-full max-w-md mx-auto py-3 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-gov-700 to-sky-600 hover:from-gov-600 hover:to-sky-500 active:scale-[0.99] transition shadow-lg shadow-sky-950/50 flex items-center justify-center gap-2"
                >
                  <span>Proceed to Secure Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Navigation Controls (Steps 1 to 5) */}
          {currentStep <= 5 && (
            <div className="mt-8 pt-5 border-t border-slate-800 flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous Step</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
                >
                  Cancel
                </Link>
              )}

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 active:scale-[0.99] transition shadow-md shadow-sky-950/40 flex items-center gap-2"
                >
                  <span>Continue to Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] disabled:opacity-60 transition shadow-lg shadow-emerald-950/40 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting Registration...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Officer Registration</span>
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-5xl mx-auto text-center text-xs text-slate-500 border-t border-slate-800/60 pt-4 z-10">
        DRISHTI AI • Ministry of Statistics and Programme Implementation (MoSPI) • Government of India
      </div>
    </div>
  );
};

export default Register;
