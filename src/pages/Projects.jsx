import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import PageContainer from '../components/layout/PageContainer';
import ProjectFilters from '../components/projects/ProjectFilters';
import ProjectTable from '../components/projects/ProjectTable';
import { Download } from 'lucide-react';
import { exportProjectsToCSV } from '../utils/riskUtils';

export const Projects = () => {
  const { filteredProjects, stats } = useDashboard();

  return (
    <PageContainer
      breadcrumbs={[{ label: 'Projects Directory' }]}
      title="National Infrastructure Projects Repository"
      subtitle={`Complete database of ${stats.totalProjects ?? filteredProjects.length} infrastructure investments monitored via DRISHTI AI`}
      action={
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportProjectsToCSV(filteredProjects, `drishti_projects_${new Date().toISOString().slice(0, 10)}.csv`)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Filtered (CSV)</span>
          </button>
        </div>
      }
    >
      {/* Search and Multi-Criteria Filters */}
      <ProjectFilters resultsCount={filteredProjects.length} />

      {/* Main Filtered Table */}
      <ProjectTable
        projectsList={filteredProjects}
        pageSize={15}
        enablePagination={true}
      />
    </PageContainer>
  );
};

export default Projects;

