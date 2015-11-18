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
            string c_name = string.Empty;
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
                                                                     product_name = x.product_name,
                                                                     category_name = x.ProductCategory.category_name,
                                                                     model_type = x.model_type
                                                                 }).ToList();

                    foreach (var i in items)
                    {
                        i.imgsrc = GetImg(i.product_id, "Photo1", "ProductData", "Photo", "list");//顯示圖片
                    }
                    c_name = db0.ProductCategory.Find(id).category_name;
                }
            }
            ViewBag.C_id = id;
            ViewBag.C_name = c_name;
            return View("list", items);
        }

        public ActionResult content(int? id)
        {

            Product item;
            string c_name = string.Empty;
            using (var db0 = getDB0())
            {
                bool Exist = db0.Product.Any(x => x.product_id == id && !x.i_Hide);
                if (id == null || !Exist)
                {
                    return Redirect("~/Products");
                }
                else
                {
                    item = db0.Product.Find(id);
                    c_name = item.ProductCategory.category_name;
                    item.imgsrc = GetImg(item.product_id, "Photo1", "ProductData", "Photo", "content");//顯示圖片
                    item.model_select = db0.Product.Where(x => !x.i_Hide).OrderByDescending(x => x.sort)
                                        .Select(x => new option()
                                        {
                                            val = x.product_id,
                                            Lname = x.model_type
                                        }).ToList();
                }

            }
            ViewBag.C_id = item.category_id;
            ViewBag.C_name = c_name;
            return View(item);
        }

        public ActionResult Order()
        {
               return View();
        }

    }
}