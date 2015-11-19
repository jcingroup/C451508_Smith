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

        #region 會員申請功能暫停使用
//        public string ApplyMember(AddMember md)
//        {
//            ResultInfo r = new ResultInfo();
//            if (!ModelState.IsValid)
//            {
//                r.result = false;
//                r.message = "資訊不完整";
//                return defJSON(r);
//            }
//            #region 驗證碼檢查程序
//            if (string.IsNullOrEmpty(Session["MemberApply"].ToString()))
//            {
//                Session["MemberApply"] = Guid.NewGuid();
//                r.result = false;
//                r.message = Resources.Res.Log_Err_ImgValideNotEquel;
//                return defJSON(r);
//            }

//            Boolean vildate = Session["MemberApply"].Equals(md.validate) ? true : false;
//#if DEBUG
//            vildate = true;
//#endif
//            if (!vildate)
//            {
//                Session["MemberApply"] = Guid.NewGuid(); //只要有錯先隨意產生唯一碼 以防暴力破解，新的CheckCode會在Validate產生。
//                r.result = false;
//                r.message = Resources.Res.Log_Err_ImgValideNotEquel;
//                return defJSON(r);
//            }
//            #endregion

//            #region 資料檢查
//            if (md.act == null || md.email == null || md.pwd == null)
//            {
//                r.result = false;
//                r.message = "資料填寫不完整~!";
//                return defJSON(r);
//            }
//            #endregion

//            try
//            {
//                using (var db0 = getDB0())
//                {
//                    bool check_act = db0.Member.Any(x => x.member_account == md.act);

//                    if (check_act)
//                    {
//                        r.result = false;
//                        r.message = "此帳號已有人使用請重新填寫~!";
//                        return defJSON(r);
//                    }

//                    addApplyMember(md);
//                    #region 信件發送
//                    string Body = getMailBody("ApplyMemberEmail", md);//套用信件版面
//                    Boolean mail;
//                    mail = Mail_Send(md.email, //寄信人
//                                    openLogic().getReceiveMails(), //收信人
//                                    CommWebSetup.ApplyMemberMailTitle, //信件標題
//                                    Body, //信件內容
//                                    true); //是否為html格式
//                    #endregion
//                }

//            }
//            catch (Exception ex)
//            {
//                r.result = false;
//                r.message = ex.Message;
//            }
//            return defJSON(r);
//        }
        #endregion
    }
}
