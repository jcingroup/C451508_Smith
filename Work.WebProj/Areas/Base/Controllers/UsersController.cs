using DotWeb.Controller;
using DotWeb.Helpers;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using ProcCore.Business.DB0;
using ProcCore.HandleResult;
using ProcCore.NetExtension;
using ProcCore.WebCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace DotWeb.Areas.Base.Controllers
{
    public class UsersController : AdminController
    {
        #region Working
        public ActionResult Main()
        {
            ActionRun();
            return View(new c_AspNetUsers());
        }
        public ActionResult ChangePassword()
        {
            ActionRun();
            return View();
        }
        #endregion
        [HttpPost]
        public async Task<string> aj_MasterPasswordUpdate(ManageUserViewModel md)
        {
            ResultInfo rAjaxResult = new ResultInfo();
            try
            {
                if (ModelState.IsValid)
                {
                    IdentityResult result = await UserManager.ChangePasswordAsync(User.Identity.GetUserId(), md.OldPassword, md.NewPassword);

                    if (result.Succeeded)
                    {
                        rAjaxResult.result = true;
                    }
                    else
                    {
                        rAjaxResult.message = String.Join(":", result.Errors);
                        rAjaxResult.result = false;
                    }
                }
                else
                {
                    List<string> errMessage = new List<string>();
                    foreach (ModelState modelState in ModelState.Values)
                        foreach (ModelError error in modelState.Errors)
                            errMessage.Add(error.ErrorMessage);

                    rAjaxResult.message = String.Join(":", errMessage);
                    rAjaxResult.result = false;
                }
            }
            catch (Exception ex)
            {
                rAjaxResult.result = false;
                rAjaxResult.message = ex.Message;
            }

            return defJSON(rAjaxResult);

        }
    }
}