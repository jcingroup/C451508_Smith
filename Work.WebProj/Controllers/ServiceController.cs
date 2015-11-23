using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DotWeb.Controller;
using ProcCore.HandleResult;
using DotWeb.CommSetup;

namespace DotWeb.WebApp.Controllers
{
    public class ServiceController : WebUserController
    {
        // GET: Service
        public ActionResult Index()
        {
            return View("Service");
        }
        public ActionResult Email()
        {
            return View();
        }
        public string sendMail(ServerMailContent md)
        {
            ResultInfo r = new ResultInfo();
            try
            {
                using (db0 = getDB0())
                {

                    #region 驗證碼檢查程序
                    if (string.IsNullOrEmpty(Session["ServiceCheck"].ToString()))
                    {
                        Session["ServiceCheck"] = Guid.NewGuid();
                        r.result = false;
                        r.message = Resources.Res.Log_Err_ImgValideNotEquel;
                        return defJSON(r);
                    }

                    bool vildate = Session["ServiceCheck"].Equals(md.validate) ? true : false;
//#if DEBUG
//                    vildate = true;
//#endif
                    if (!vildate)
                    {
                        Session["ServiceCheck"] = Guid.NewGuid(); //只要有錯先隨意產生唯一碼 以防暴力破解，新的CheckCode會在Validate產生。
                        r.result = false;
                        r.message = Resources.Res.Log_Err_ImgValideNotEquel;
                        return defJSON(r);
                    }
                    #endregion
                    if (md.email == null)
                    {
                        r.result = false;
                        r.message = "信箱號碼未填寫!";
                        return defJSON(r);
                    }
                    #region 信件發送
                    string Body = getMailBody("ServerEmail", md);//套用信件版面
                    Boolean mail;
                    mail = Mail_Send(md.email, //寄信人
                                    openLogic().getReceiveMails(), //收信人
                                    CommWebSetup.MailTitle, //信件標題
                                    Body, //信件內容
                                    true); //是否為html格式
                    if (mail == false)
                    {
                        r.result = false;
                        r.message = "信箱號碼不正確或送信失敗!";
                        return defJSON(r);
                    }
                    #endregion
                }
                r.result = true;

            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.Message;
            }
            return defJSON(r);
        }
    }
    public class ServerMailContent
    {
        public string contact_person { get; set; }
        public string tel { get; set; }
        public string email { get; set; }
        public string content { get; set; }
        public string validate { get; set; }
    }
}