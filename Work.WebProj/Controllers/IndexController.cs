using System.Linq;
using System.Web.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Text;
using System.IO;
using System;
using System.Collections.Generic;
using System.Net.Mail;
using ProcCore.HandleResult;
using DotWeb.CommSetup;
using DotWeb.Controller;
using ProcCore.Business.DB0;

namespace DotWeb.Controllers
{
    public class IndexController : WebUserController
    {
        public ActionResult Index()
        {
            List<option> items = new List<option>();
            using (var db0 = getDB0())
            {

                items = db0.ProductCategory.Where(x => !x.i_Hide).OrderByDescending(x => x.sort)
                                                             .Select(x => new option()
                                                             {
                                                                 val = x.product_category_id,
                                                                 Lname = x.category_name
                                                             }).Take(6).ToList();
            }
            return View(items);
        }

        public RedirectResult Login()
        {
            return Redirect("~/Base/Login");
        }
    }
}
