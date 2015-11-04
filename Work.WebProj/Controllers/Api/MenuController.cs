using DotWeb.Helpers;
using ProcCore.Business.DB0;
using ProcCore.HandleResult;
using ProcCore.WebCore;
using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Collections.Generic;
using ProcCore.Business;

namespace DotWeb.Api
{
    public class MenuController : ajaxApi<ProcCore.Business.DB0.Menu, q_Menu>
    {
        public async Task<IHttpActionResult> Get(int id)
        {
            using (db0 = getDB0())
            {
                item = await db0.Menu.FindAsync(id);
                var get_menu_roles = item.AspNetRoles;
                var system_roles = await roleManager.Roles.Where(x => x.Name != "Admins").ToListAsync();
                item.role_array = new List<MenuRoleArray>();
                foreach (var role in system_roles)
                {
                    var role_object = get_menu_roles.Where(x => x.Id == role.Id).FirstOrDefault();
                    if (role_object != null)
                    {
                        item.role_array.Add(new MenuRoleArray() { role_id = role.Id, role_use = true, role_name = role.Name });
                    }
                    else
                    {
                        item.role_array.Add(new MenuRoleArray() { role_id = role.Id, role_use = false, role_name = role.Name });
                    }
                }
                r = new ResultInfo<ProcCore.Business.DB0.Menu>() { data = item };
            }

            return Ok(r);
        }
        public async Task<IHttpActionResult> Get([FromUri]q_Menu q)
        {
            #region 連接BusinessLogicLibary資料庫並取得資料

            using (db0 = getDB0())
            {
                var qr = db0.Menu
                    .OrderBy(x => new { x.menu_id }).AsQueryable();


                if (q.word != null)
                {
                    qr = qr.Where(x => x.menu_name.Contains(q.word));
                }
                if (q.is_folder != null)
                {
                    qr = qr.Where(x => x.is_folder == q.is_folder);
                }
                var result = qr.Select(x => new m_Menu()
                {
                    menu_id = x.menu_id,
                    parent_menu_id = x.parent_menu_id,
                    menu_name = x.menu_name,
                    area = x.area,
                    controller = x.controller,
                    action = x.action,
                    icon_class = x.icon_class,
                    sort = x.sort,
                    is_folder = x.is_folder,
                    is_use = x.is_use
                });


                int page = (q.page == null ? 1 : (int)q.page);
                int position = PageCount.PageInfo(page, this.defPageSize, qr.Count());
                var segment = await result.Skip(position).Take(this.defPageSize).ToListAsync();

                return Ok<GridInfo<m_Menu>>(new GridInfo<m_Menu>()
                {
                    rows = segment,
                    total = PageCount.TotalPage,
                    page = PageCount.Page,
                    records = PageCount.RecordCount,
                    startcount = PageCount.StartCount,
                    endcount = PageCount.EndCount
                });
            }
            #endregion
        }
        public async Task<IHttpActionResult> Put([FromBody]ProcCore.Business.DB0.Menu md)
        {
            ResultInfo r = new ResultInfo();
            try
            {
                db0 = getDB0();

                item = await db0.Menu.FindAsync(md.menu_id);
                item.parent_menu_id = md.parent_menu_id;
                item.menu_name = md.menu_name;
                item.area = md.area;
                item.controller = md.controller;
                item.action = md.action;
                item.icon_class = md.icon_class;
                item.sort = md.sort;
                item.is_folder = md.is_folder;
                item.is_use = md.is_use;

                var roles = item.AspNetRoles;

                foreach (var role in md.role_array)
                {
                    var get_now_role = roles.Where(x => x.Id == role.role_id).FirstOrDefault();
                    if (get_now_role != null && !role.role_use) //要刪除的權限
                    {
                        item.AspNetRoles.Remove(get_now_role);
                    }

                    if (get_now_role == null && role.role_use) //要新增的權限
                    {
                        var asp_role = db0.AspNetRoles.Where(x => x.Id == role.role_id).FirstOrDefault();
                        item.AspNetRoles.Add(asp_role);
                    }
                }

                await db0.SaveChangesAsync();
                r.result = true;
            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.ToString();
            }
            finally
            {
                db0.Dispose();
            }
            return Ok(r);
        }
        public async Task<IHttpActionResult> Post([FromBody]ProcCore.Business.DB0.Menu md)
        {
            md.menu_id = GetNewId(ProcCore.Business.CodeTable.Menu);
            ResultInfo r = new ResultInfo();
            if (!ModelState.IsValid)
            {
                r.message = ModelStateErrorPack();
                r.result = false;
                return Ok(r);
            }

            try
            {
                #region working a
                db0 = getDB0();

                foreach (var role in md.role_array)
                {
                    if (role.role_use)
                    {
                        var asp_role = db0.AspNetRoles.Where(x => x.Id == role.role_id).FirstOrDefault();
                        md.AspNetRoles.Add(asp_role);
                    }
                }

                db0.Menu.Add(md);
                await db0.SaveChangesAsync();

                r.result = true;
                r.id = md.menu_id;
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
                db0.Dispose();
            }
        }
        public async Task<IHttpActionResult> Delete([FromUri]int[] ids)
        {
            ResultInfo r = new ResultInfo();
            try
            {
                db0 = getDB0();

                foreach (var id in ids)
                {
                    item = new ProcCore.Business.DB0.Menu() { menu_id = id };
                    db0.Menu.Attach(item);
                    db0.Menu.Remove(item);
                }

                await db0.SaveChangesAsync();

                r.result = true;
                return Ok(r);
            }
            catch (DbUpdateException ex)
            {
                r.result = false;
                if (ex.InnerException != null)
                {
                    r.message = Resources.Res.Log_Err_Delete_DetailExist
                        + "\r\n" + getErrorMessage(ex);
                }
                else
                {
                    r.message = ex.Message;
                }
                return Ok(r);
            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.Message;
                return Ok(r);
            }
            finally
            {
                db0.Dispose();
            }
        }
    }
    public class q_Menu : QueryBase
    {
        public string word { get; set; }
        public bool? is_folder { get; set; }
    }
}
