using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DotWeb.Controller;
using ProcCore.Business.DB0;

namespace DotWeb.WebApp.Controllers
{
    public class ProductsController : WebUserController
    {
        // GET: Products
        public ActionResult Index(int? id)
        {
            List<m_Product> items = new List<m_Product>();
            using (var db0 = getDB0())
            {
                if (id == null)
                {
                    var getFrist = db0.ProductCategory.Where(x => !x.i_Hide).OrderByDescending(x => x.sort).FirstOrDefault();
                    if (getFrist != null)
                    {
                        id = getFrist.product_category_id;
                    }
                }

                if (id != null)
                {
                    items = db0.Product.Where(x => !x.i_Hide & x.category_id == id).OrderByDescending(x => x.sort)
                                                                 .Select(x => new m_Product()
                                                                 {
                                                                     product_id = x.product_id,
                                                                     product_name = x.product_name
                                                                 }).ToList();
                }
            }
            ViewBag.C_id = id;
            return View("list", items);
        }

        public ActionResult content()
        {
            return View();
        }
    }
}