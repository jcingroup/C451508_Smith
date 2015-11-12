using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DotWeb.Controller;

namespace DotWeb.WebApp.Controllers
{
    public class NewsController : WebUserController
    {
        // GET: News
        public ActionResult Index()
        {
            if (this.isLogin)
            {
                return View("News");
            }
            else
            {//非會員連News轉址到首頁
                return Redirect("~");
            }

        }
    }
}