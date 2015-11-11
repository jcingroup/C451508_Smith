using DotWeb.Controller;
using ProcCore.Business.LogicConect;
using ProcCore.HandleResult;
using System;
using System.Web.Mvc;

namespace DotWeb.Areas.Base.Controllers
{
    public class ChangeParmController : AdminController
    {
        public ActionResult Main()
        {
            ActionRun();
            return View();
        }
        public string aj_init()
        {
            parm r;
            var open = openLogic();
            using (db0 = getDB0())
            {
                //email 修改
                string receiveMails = (string)open.getParmValue(ParmDefine.receiveMails);

                r = new parm()
                {
                    receiveMails = receiveMails,
                };
            }

            return defJSON(r);
        }
        //[ValidateInput(false)]
        public string aj_MasterUpdate(parm md)
        {
            ResultInfo r = new ResultInfo();
            try
            {
                var open = openLogic();
                using (db0 = getDB0())
                {
                    open.setParmValue(ParmDefine.receiveMails, md.receiveMails);
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
    public class parm
    {
        public string receiveMails { get; set; }
    }
}
