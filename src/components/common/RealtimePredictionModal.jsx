import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Cpu,
  Loader2,
  IndianRupee,
  Clock,
  Gauge,
  AlertTriangle,
  CheckCircle2,
  Building2,
  Layers,
  MapPin
} from 'lucide-react';
import { api } from '../../services/api';
import { RiskBadge } from './RiskBadge';
import { formatCurrency, formatPercent } from '../../utils/riskUtils';

export const RealtimePredictionModal = ({ isOpen, onClose, initialData = null }) => {
  const [formData, setFormData] = useState({
    project_id: initialData?.projectId || `PROJ-${Math.floor(100000 + Math.random() * 900000)}`,
    project_name: initialData?.projectName || 'National Expressway Corridor Extension',
    Original_Cost_Cr: initialData?.originalCost || 2400.0,
    Cumulative_Expenditure_Cr: initialData?.cumulativeExpenditure || 2150.0,
    Physical_Progress_Pct: initialData?.physicalProgress || 48.0,
    Ministry: initialData?.ministry || 'Ministry of Road Transport & Highways',
    Sector: initialData?.sector || 'Road Transport',
    State: initialData?.state || 'Maharashtra'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const expPct = formData.Original_Cost_Cr > 0
    ? Number(((formData.Cumulative_Expenditure_Cr / formData.Original_Cost_Cr) * 100).toFixed(1))
    : 0;

  const handlePredict = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const payload = {
        project_id: formData.project_id,
        project_name: formData.project_name,
        Original_Cost_Cr: Number(formData.Original_Cost_Cr),
        Cumulative_Expenditure_Cr: Number(formData.Cumulative_Expenditure_Cr),
        Physical_Progress_Pct: Number(formData.Physical_Progress_Pct),
        Expenditure_Pct_of_Original_Cost: expPct,
        Ministry: formData.Ministry,
        Sector: formData.Sector,
        State: formData.State
      };

      const res = await api.predictRisk(payload);
      if (res.success) {
        setPredictionResult(res.data);
      } else {
        setErrorMsg('Unable to generate prediction. Please verify project data.');
      }
    } catch (err) {
      setErrorMsg('Prediction service temporarily unavailable.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight">Run AI Risk Assessment</h3>
              <p className="text-[11px] text-slate-400">Live XGBoost & Random Forest Inference Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handlePredict} className="space-y-4">
            {/* Project Name & ID */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  value={formData.project_name}
                  onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-gov-700/20"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Project ID
                </label>
                <input
                  type="text"
                  value={formData.project_id}
                  onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-gov-700/20"
                />
              </div>
            </div>

            {/* Financial & Physical Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Original Cost (₹ Cr)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  value={formData.Original_Cost_Cr}
                  onChange={(e) => setFormData({ ...formData, Original_Cost_Cr: parseFloat(e.target.value) || 0 })}
                  required
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-gov-700/20"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Cumulative Spend (₹ Cr)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.Cumulative_Expenditure_Cr}
                  onChange={(e) => setFormData({ ...formData, Cumulative_Expenditure_Cr: parseFloat(e.target.value) || 0 })}
                  required
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-gov-700/20"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Physical Progress (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.Physical_Progress_Pct}
                  onChange={(e) => setFormData({ ...formData, Physical_Progress_Pct: parseFloat(e.target.value) || 0 })}
                  required
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-gov-800 focus:outline-none focus:ring-2 focus:ring-gov-700/20"
                />
              </div>
            </div>

            {/* Ministry, Sector, State */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Ministry
                </label>
                <select
                  value={formData.Ministry}
                  onChange={(e) => setFormData({ ...formData, Ministry: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-gov-700/20"
                >
                  <option value="Ministry of Road Transport & Highways">MoRTH</option>
                  <option value="Ministry of Jal Shakti">Ministry of Jal Shakti</option>
                  <option value="Ministry of Railways">Ministry of Railways</option>
                  <option value="Ministry of Petroleum & Natural Gas">Petroleum & Gas</option>
                  <option value="Ministry of Power">Ministry of Power</option>
                  <option value="Ministry of Housing & Urban Affairs">Urban Affairs</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Sector
                </label>
                <select
                  value={formData.Sector}
                  onChange={(e) => setFormData({ ...formData, Sector: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-gov-700/20"
                >
                  <option value="Road Transport">Road Transport</option>
                  <option value="Water Resources">Water Resources</option>
                  <option value="Railways">Railways</option>
                  <option value="Petroleum & Gas">Petroleum & Gas</option>
                  <option value="Power & Renewable">Power & Renewable</option>
                  <option value="Urban Development">Urban Development</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  State
                </label>
                <select
                  value={formData.State}
                  onChange={(e) => setFormData({ ...formData, State: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-gov-700/20"
                >
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Punjab">Punjab</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Karnataka">Karnataka</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-gov-700 hover:bg-gov-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Running AI Risk Assessment...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-sky-300" />
                  <span>Predict Project Risk (ML Inference)</span>
                </>
              )}
            </button>
          </form>

          {/* Results Output Section */}
          {predictionResult && (
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    AI-Assisted Risk Assessment Result
                  </span>
                  <span className="text-sm font-bold text-slate-900">{predictionResult.project_name}</span>
                </div>
                <RiskBadge level={predictionResult.risk_level} score={predictionResult.overall_risk_score} size="md" />
              </div>

              {/* 3 Metric Output Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-red-50/70 border border-red-200 rounded-lg">
                  <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider block">
                    Cost Overrun Risk
                  </span>
                  <span className="text-2xl font-extrabold font-mono text-red-600 mt-1 block">
                    {formatPercent(predictionResult.cost_overrun_probability)}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                    Predicted: {predictionResult.predicted_cost_overrun ? 'YES (≥40% Thresh)' : 'NO'}
                  </span>
                </div>

                <div className="p-3 bg-orange-50/70 border border-orange-200 rounded-lg">
                  <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wider block">
                    Time Overrun Risk
                  </span>
                  <span className="text-2xl font-extrabold font-mono text-orange-600 mt-1 block">
                    {formatPercent(predictionResult.time_overrun_probability)}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                    Delay: {predictionResult.predicted_delay_days ? `+${predictionResult.predicted_delay_days} days` : 'On track'}
                  </span>
                </div>

                <div className="p-3 bg-slate-900 text-white rounded-lg">
                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                    Overall Risk Score
                  </span>
                  <span className="text-2xl font-extrabold font-mono text-white mt-1 block">
                    {Number(predictionResult.overall_risk_score).toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-300 block mt-0.5 font-mono">
                    Tier: {predictionResult.risk_level}
                  </span>
                </div>
              </div>

              {/* Secondary Regression Output */}
              {predictionResult.predicted_cost_overrun_cr && (
                <div className="p-3 bg-white rounded-lg border border-slate-200 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Predicted Cost Overrun</span>
                    <span className="font-mono font-bold text-red-600">
                      {formatCurrency(predictionResult.predicted_cost_overrun_cr)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Estimated Revised Cost</span>
                    <span className="font-mono font-bold text-slate-900">
                      {formatCurrency(predictionResult.estimated_revised_cost_cr)}
                    </span>
                  </div>
                </div>
              )}

              {/* Warnings List */}
              {predictionResult.warnings?.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    AI Early Warning Notices:
                  </span>
                  {predictionResult.warnings.map((w, idx) => (
                    <div key={idx} className="p-2 bg-amber-50 rounded border border-amber-200 text-xs text-amber-900 flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-[10px] text-slate-400 italic text-center">
                AI predictions are model-based estimates intended to support proactive project monitoring and decision-making.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RealtimePredictionModal;

