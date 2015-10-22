using DotWeb.Controller;
using Microsoft.Reporting.WebForms;
using System.Collections.Generic;

namespace DotWeb.Areas.Base.Controllers
{
    public class ReportToPdfController : AdminController
    {
        private byte[] ToPdfReport(ReportData rpt, List<ReportParameter> param)
        {
            Warning[] warnings;
            string[] streamIds;
            string mimeType = string.Empty;
            string encoding = string.Empty;
            string extension = string.Empty;

            ReportViewer rptvw = new ReportViewer();
            rptvw.ProcessingMode = ProcessingMode.Local;
            ReportDataSource rds = new ReportDataSource("ReportDataSet", rpt.Data);

            rptvw.LocalReport.DataSources.Clear();
            rptvw.LocalReport.ReportPath = @"_Code\RPTFile\" + rpt.ReportName;
            rptvw.LocalReport.DataSources.Add(rds);
            foreach (var pa in param)
            {
                rptvw.LocalReport.SetParameters(pa);
            }
            rptvw.LocalReport.Refresh();

            byte[] bytes = rptvw.LocalReport.Render("PDF", null, out mimeType, out encoding, out extension, out streamIds, out warnings);
            return bytes;
        }
    }
}