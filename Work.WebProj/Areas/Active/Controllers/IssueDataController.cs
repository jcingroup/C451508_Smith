using DotWeb.CommSetup;
using DotWeb.Controller;
using ProcCore.Business.LogicConect;
using ProcCore.HandleResult;
using System;
using System.IO;
using System.Web.Mvc;
using System.Linq;

namespace DotWeb.Areas.Active.Controllers
{
    public class IssueDataController : AdminController
    {
        #region Action and function section
        public ActionResult Main()
        {
            ActionRun();
            return View();
        }
        public ActionResult Category()
        {
            ActionRun();
            return View();
        }
        #endregion

        #region ajax call section

        public string aj_Init()
        {

            using (var db0 = getDB0())
            {
                var category_option = db0.IssueCategory.Where(x => !x.i_Hide).OrderByDescending(x => x.sort).Select(x => new { x.category_name, x.issue_category_id });
                return defJSON(category_option);
            }
        }
        #endregion
    }
}