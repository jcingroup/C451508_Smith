using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using DotWeb.Controller;
using ProcCore.Business.DB0;
using ProcCore.HandleResult;
using DotWeb.CommSetup;

namespace DotWeb.WebApp.Controllers
{
    public class ProductsController : WebUserController
    {
        // GET: Products
        public ActionResult Index()
        {
            List<m_ProductCategory> items = new List<m_ProductCategory>();
            using (var db0 = getDB0())
            {
                items = db0.ProductCategory.Where(x => !x.i_Hide).OrderByDescending(x => x.sort)
                                                             .Select(x => new m_ProductCategory()
                                                             {
                                                                 product_category_id = x.product_category_id,
                                                                 category_name = x.category_name
                                                             }).ToList();

                foreach (var i in items)
                {
                    i.imgsrc = GetImg(i.product_category_id, "category1", "ProductData", "Photo", null);//顯示圖片
                }
            }
            return View("categorylist", items);
        }
        public ActionResult list(int? id)
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
            return View(items);
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
            if (!this.isLogin)
            {//必免未登入連進產品訂單頁
                return Redirect("~");
            }
            else
            {
                return View();
            }
        }

        public string sendOrderMail(MailContent md)
        {
            ResultInfo r = new ResultInfo();
            try
            {
                if (this.isLogin)
                {
                    using (db0 = getDB0())
                    {
                        #region 設定會員
                        int member_id = int.Parse(this.MemberId);
                        var getMember = db0.Member.Find(member_id);
                        md.member_id = getMember.member_id;
                        md.member_name = getMember.member_name;
                        #endregion
                        #region 信件發送
                        string Body = getMailBody("OrderEmail", md);//套用信件版面
                        Boolean mail;
                        #region 收信人及寄信人
                        string sendMail = openLogic().getReceiveMails()[0];
                        //if (sendMail != "")
                        //{
                        //    var m = sendMail.Split(':');
                        //    sendMail = m[m.Length - 1];
                        //}

                        List<string> r_mails = openLogic().getReceiveMails().ToList();
                        if (!r_mails.Any(x => x == getMember.email) & getMember.email != null) { r_mails.Add(getMember.member_name + ":" + getMember.email); }

                        #endregion
                        mail = Mail_Send(sendMail, //寄信人
                                        r_mails.ToArray(), //收信人
                                        CommWebSetup.OrderMailTitle, //信件標題
                                        Body, //信件內容
                                        true); //是否為html格式
                        if (mail == false)
                        {
                            r.result = false;
                            r.message = "信箱號碼不正確或送信失敗!";
                            return defJSON(r);
                        }
                        postOrderContent(md);
                        #endregion
                    }
                    r.result = true;
                }
                else
                {
                    r.result = false;
                    r.message = "未登入會員無法下單~!";
                }
            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.Message;
            }
            return defJSON(r);
        }
        public class ODetail
        {
            public string c_name { get; set; }
            public string m_type { get; set; }
            public int p_id { get; set; }
            public int qty { get; set; }
        }
        public class MailContent
        {
            public List<ODetail> order_list { get; set; }
            public string memo { get; set; }
            public string member_name { get; set; }
            public int member_id { get; set; }
        }
    }
}