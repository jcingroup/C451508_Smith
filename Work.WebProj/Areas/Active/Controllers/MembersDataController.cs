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
    public class MembersDataController : AdminController
    {
        #region Action and function section
        public ActionResult Members()
        {//會員資料管理
            ActionRun();
            return View();
        }
        public ActionResult News()
        {//會員最新消息
            ActionRun();
            return View();
        }
        public ActionResult Orders()
        {//會員下單紀錄
            ActionRun();
            return View();
        }
        #endregion

        #region ajax call section

        public string aj_Init()
        {

            using (var db0 = getDB0())
            {
                var category_option = db0.ProductCategory.Where(x => !x.i_Hide).OrderByDescending(x => x.sort).Select(x => new { x.category_name, x.product_category_id });
                return defJSON(category_option);
            }
        }
        #endregion
    }
}