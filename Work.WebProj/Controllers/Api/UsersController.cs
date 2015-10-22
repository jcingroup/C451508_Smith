using DotWeb.Helpers;
using Microsoft.AspNet.Identity.EntityFramework;
using ProcCore.Business.DB0;
using ProcCore.HandleResult;
using ProcCore.WebCore;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

namespace DotWeb.Api
{
    public class UsersController : BaseApiController
    {
        public async Task<IHttpActionResult> Get(string id)
        {
            using (db0 = getDB0())
            {
                ApplicationUser item = await UserManager.FindByIdAsync(id);
                var get_user_roles = item.Roles;
                var system_roles = await roleManager.Roles.Where(x => x.Name != "Admins").ToListAsync();
                item.role_array = new List<RoleArray>();
                foreach (var role in system_roles)
                {
                    var role_object = get_user_roles.Where(x => x.RoleId == role.Id).FirstOrDefault();
                    if (role_object != null)
                    {
                        item.role_array.Add(new RoleArray() { role_id = role.Id, role_use = true, role_name = role.Name });
                    }
                    else
                    {
                        item.role_array.Add(new RoleArray() { role_id = role.Id, role_use = false, role_name = role.Name });
                    }
                }

                var r = new ResultInfo<ApplicationUser>() { data = item };
                return Ok(r);
            }
        }
        public async Task<IHttpActionResult> Get([FromUri]q_AspNetUsers q)
        {
            #region 連接BusinessLogicLibary資料庫並取得資料

            var items = UserManager.Users
                .OrderBy(x => x.UserName)
                .Select(x => new { x.Id, x.user_name_c, x.UserName, x.Email })
                .Where(x => x.UserName != "admin");

            if (q.UserName != null) {
                items = items.Where(x => x.user_name_c.Contains(q.UserName));
            }

            int page = (q.page == null ? 1 : (int)q.page);
            int startRecord = PageCount.PageInfo(page, this.defPageSize, items.Count());
            var resultItems = await items.Skip(startRecord).Take(this.defPageSize).ToListAsync();

            return Ok(new
            {
                rows = resultItems,
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
                item.sort = md.sort;

                var roles = item.Roles;

                foreach (var role in md.role_array)
                {
                    var get_now_role = roles.Where(x => x.RoleId == role.role_id).FirstOrDefault();
                    if (get_now_role != null && !role.role_use) //要刪除的權限
                    {
                        item.Roles.Remove(get_now_role);
                    }

                    if (get_now_role == null && role.role_use) //要新增的權限
                    {
                        item.Roles.Add(new IdentityUserRole() { RoleId = role.role_id });
                    }
                }

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
        public async Task<IHttpActionResult> Post([FromBody]ApplicationUser md)
        {
            ResultInfo r = new ResultInfo();

            try
            {
                #region working
                foreach (var role in md.role_array)
                {
                    if (role.role_use)
                    {
                        md.Roles.Add(new IdentityUserRole() { RoleId = role.role_id, UserId = md.Id });
                    }
                }

                var result = await UserManager.CreateAsync(md, md.PasswordHash);

                if (result.Succeeded)
                {
                    var user = await UserManager.FindByNameAsync(md.UserName);
                    r.aspnetid = user.Id;
                    r.result = true;
                }
                else
                {
                    r.result = false;
                    r.message = string.Join(":", result.Errors);
                }
                return Ok(r);
                #endregion
            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.Message;
                return Ok(r);
            }
            finally
            {

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
