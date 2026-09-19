import React, { useRef, useState } from 'react';
import { 
  ExternalLink, 
  Download, 
  Code, 
  Scale, 
  GitBranch, 
  Loader2 
} from 'lucide-react';
import CodeMetrics from './CodeMetrics';
import CommitActivity from './CommitActivity';
import ContributorStats from './ContributorStats';
import ReportPdfTemplate from './ReportPdfTemplate';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import './Dashboard.css';

const Dashboard = ({ data, onReset }) => {
  const { repository, codeMetrics, commitActivity, contributors, languages = {} } = data;
  const reportRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  // Total code size calculation
  const totalBytes = Object.values(languages).reduce((sum, b) => sum + b, 0);
  const codeSizeText = totalBytes > 1024 * 1024 
    ? `${(totalBytes / (1024 * 1024)).toFixed(1)} MB` 
    : `${Math.round(totalBytes / 1024)} KB`;

  const handleExportPdf = async () => {
    if (!reportRef.current) return;
    
    try {
      setIsExporting(true);
      toast.info('Generating executive PDF report...', {
        description: 'Compiling high-resolution report graphics'
      });

      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(pageHeight, imgHeight));

      const filename = `${repository.owner}-${repository.name}-DevInsights-Report.pdf`;
      pdf.save(filename);

      toast.success('Report downloaded successfully', {
        description: filename,
      });
    } catch (error) {
      console.error('PDF export failed:', error);
      toast.error('PDF generation failed', {
        description: error instanceof Error ? error.message : 'Could not generate report'
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Hidden printable template for PDF export */}
      <ReportPdfTemplate data={data} templateRef={reportRef} />

      {/* Top Header & Export Bar */}
      <div className="dashboard-header-card">
        <div className="dashboard-header-inner">
          <div className="dashboard-header-titles">
            <div className="repo-title-row">
              <h2 className="repo-title-heading">
                <span className="repo-owner-text">{repository.owner}</span>
                <span className="repo-slash-text">/</span>
                <span className="repo-name-text">{repository.name}</span>
              </h2>

              <a
                href={repository.url}
                target="_blank"
                rel="noreferrer"
                className="repo-external-link"
              >
                <span>github.com</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <p className="repo-description-text">
              {repository.description}
            </p>

            <div className="repo-meta-row">
              <span className="repo-meta-item">
                <Code className="h-3.5 w-3.5 text-emerald-400" />
                {repository.language}
              </span>
              <span>&bull;</span>
              <span className="repo-meta-item">
                <Scale className="h-3.5 w-3.5 text-slate-400" />
                {repository.license || 'No License'}
              </span>
              <span>&bull;</span>
              <span className="repo-meta-item repo-meta-mono">
                <GitBranch className="h-3.5 w-3.5 text-slate-400" />
                {repository.defaultBranch || 'main'}
              </span>
            </div>
          </div>

          {/* Aesthetic PDF Export Button */}
          <div>
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isExporting}
              className="export-pdf-btn"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-black" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Download PDF Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Top Stat Highlights with Circular Colored Rings */}
      <div className="ring-stats-grid">
        {/* Metric 1: Stars with Emerald Ring */}
        <div className="ring-stat-card">
          <div className="stat-ring stat-ring-emerald" />
          <div>
            <div className="stat-ring-number">
              {(repository.stars || 0).toLocaleString()}
            </div>
            <div className="stat-ring-label">Total stars</div>
          </div>
        </div>

        {/* Metric 2: Forks with Rose Ring */}
        <div className="ring-stat-card">
          <div className="stat-ring stat-ring-rose" />
          <div>
            <div className="stat-ring-number">
              {(repository.forks || 0).toLocaleString()}
            </div>
            <div className="stat-ring-label">Total forks</div>
          </div>
        </div>

        {/* Metric 3: Issues with Sky Ring */}
        <div className="ring-stat-card">
          <div className="stat-ring stat-ring-sky" />
          <div>
            <div className="stat-ring-number">
              {(repository.issues || 0).toLocaleString()}
            </div>
            <div className="stat-ring-label">Open issues &amp; PRs</div>
          </div>
        </div>

        {/* Metric 4: Code Size with Amber Ring */}
        <div className="ring-stat-card">
          <div className="stat-ring stat-ring-amber" />
          <div>
            <div className="stat-ring-number">
              {codeSizeText}
            </div>
            <div className="stat-ring-label">Tracked code size</div>
          </div>
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="dashboard-main-grid">
        {/* Left 2 columns: Code Architecture & Smooth Velocity Chart */}
        <div className="dashboard-left-col">
          <CodeMetrics metrics={codeMetrics} languages={languages} />
          <CommitActivity data={commitActivity} />
        </div>

        {/* Right column: Ranked Contributor Leaderboard */}
        <div className="dashboard-right-col">
          <ContributorStats contributors={contributors} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
