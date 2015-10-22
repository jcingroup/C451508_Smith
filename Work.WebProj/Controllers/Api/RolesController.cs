using DotWeb.Helpers;
using Microsoft.AspNet.Identity.EntityFramework;
using ProcCore.Business.DB0;
using ProcCore.HandleResult;
using ProcCore.WebCore;
using System;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

namespace DotWeb.Api
{
    public class RolesController : BaseApiController
    {
        public async Task<IHttpActionResult> Get(string id)
        {
            using (db0 = getDB0())
            {
                var item = await roleManager.FindByIdAsync(id);
                var r = new ResultInfo<IdentityRole>() { data = item };
                return Ok(r);
            }
        }
        public async Task<IHttpActionResult> Get([FromUri]q_AspNetRoles q)
        {
            #region 連接BusinessLogicLibary資料庫並取得資料

            var items = await roleManager.Roles.ToArrayAsync();
            return Ok(new GridInfo<IdentityRole>()
            {
                rows = items,
                total = PageCount.TotalPage,
                page = PageCount.Page,
                records = PageCount.RecordCount,
                startcount = PageCount.StartCount,
                endcount = PageCount.EndCount
            });

            #endregion
        }
        public async Task<IHttpActionResult> Put([FromBody]ApplicationUser md)
        {
            ResultInfo r = new ResultInfo();
            try
            {
                ApplicationUser item = await UserManager.FindByIdAsync(md.Id);

                item.UserName = md.UserName;
                item.Email = md.Email;
                item.user_name_c = md.user_name_c;

                var result = await UserManager.UpdateAsync(item);
                if (result.Succeeded)
                {
                    r.result = true;
                }
                else
                {
                    r.message = String.Join(":", result.Errors);
                    r.result = false;
                }
            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.ToString();
            }
            return Ok(r);
        }
        public async Task<IHttpActionResult> Post([FromBody]AspNetRoles md)
        {
            ResultInfo r = new ResultInfo();
            try
            {
                if (!await roleManager.RoleExistsAsync(md.Name))
                {
                    var result = await roleManager.CreateAsync(new IdentityRole(md.Name));
                    if (result.Succeeded)
                    {
                        var item = await roleManager.FindByNameAsync(md.Name);
                        r.result = true;
                        r.aspnetid = item.Id;
                    }
                    else
                    {
                        r.result = false;
                        r.message = string.Join(":", result.Errors.ToArray());
                    }
                }
                else
                {
                    r.result = false;
                    r.message = "The role " + md.Name + " has exist!";
                }
                return Ok(r);
            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.Message;
                return Ok(r);
            }
        }
        public async Task<IHttpActionResult> Delete([FromUri]string[] ids)
        {
            ResultInfo rAjaxResult = new ResultInfo();
            try
            {
                foreach (var id in ids)
                {
                    var item = await UserManager.FindByIdAsync(id);
                    var result = await UserManager.DeleteAsync(item);
                }
                rAjaxResult.result = true;
                return Ok(rAjaxResult);
            }
            catch (Exception ex)
            {
                rAjaxResult.result = false;
                rAjaxResult.message = ex.Message;
                return Ok(rAjaxResult);
            }
            finally
            {
            }
        }
    }
}
