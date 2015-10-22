using DotWeb.CommSetup;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Newtonsoft.Json;
using ProcCore;
using ProcCore.Business;
using ProcCore.Business.DB0;
using ProcCore.Business.LogicConect;
using ProcCore.HandleResult;
using ProcCore.NetExtension;
using ProcCore.WebCore;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;
using System.Web;
using System.Web.Mvc;

namespace DotWeb
{
    public class ReportData
    {
        public string ReportName { get; set; }
        public object[] Parms { get; set; }
        public object[] Data { get; set; }
    }
    public class PageImgShow
    {

        public string icon_path { get; set; }
        public string link_path { get; set; }
    }
    public class WebInfo
    {
        /// <summary>
        /// 是否為行動裝置
        /// </summary>
        /// <returns></returns>
        public bool isTablet()
        {

            string m = System.Web.HttpContext.Current.Request.QueryString["q"];
            string b = System.Web.HttpContext.Current.Request.UserAgent;

            if (m != null && m == "pc")
            {
                System.Web.HttpContext.Current.Response.Cookies.Add(new HttpCookie("q", "pc"));
                return false;
            }

            if (m != null && m == "mobile")
            {
                System.Web.HttpContext.Current.Response.Cookies.Add(new HttpCookie("q", "mobile"));
                return true;
            }

            var c = System.Web.HttpContext.Current.Request.Cookies["q"];

            if (m != "pc" && m != "mobile" && !string.IsNullOrEmpty(m) && c != null)
            {
                c.Values.Clear();
                c.Expires = DateTime.Now.AddDays(-1);
                System.Web.HttpContext.Current.Response.SetCookie(c);
            }


            if (c != null && c.Value == "pc")
            {
                return false;
            }

            if (c != null && c.Value == "mobile")
            {
                return true;
            }
            
            if (
                b.IndexOf("iPad", StringComparison.OrdinalIgnoreCase) >= 0 ||
                b.IndexOf("iPhone", StringComparison.OrdinalIgnoreCase) >= 0 || 
                b.IndexOf("Android", StringComparison.OrdinalIgnoreCase) >= 0
                )
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
    public class StringResult : ViewResult
    {
        public string ToHtmlString { get; set; }
        public override void ExecuteResult(ControllerContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException("context");
            }

            if (string.IsNullOrEmpty(this.ViewName))
            {
                this.ViewName = context.RouteData.GetRequiredString("action");
            }

            ViewEngineResult result = null;

            if (this.View == null)
            {
                result = this.FindView(context);
                this.View = result.View;
            }

            MemoryStream stream = new MemoryStream();
            StreamWriter writer = new StreamWriter(stream);

            ViewContext viewContext = new ViewContext(context, this.View, this.ViewData, this.TempData, writer);

            this.View.Render(viewContext, writer);

            writer.Flush();

            ToHtmlString = Encoding.UTF8.GetString(stream.ToArray());

            if (result != null)
                result.ViewEngine.ReleaseView(context, this.View);
        }
    }
    public class CReportInfo
    {
        public CReportInfo()
        {
            SubReportDataSource = new List<SubReportData>();
        }
        public static string ReportCompany = "";
        public String ReportFile { get; set; }
        public DataTable ReportData { get; set; }
        public List<SubReportData> SubReportDataSource { get; set; }
        public DataSet ReportMDData { get; set; }
        public Dictionary<string, object> ReportParm { get; set; }
    }
    public class SubReportData
    {
        public string SubReportName { get; set; }
        public DataTable DataSource { get; set; }
    }
}