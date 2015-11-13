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
    public class GetActionController : BaseApiController
    {
        public async Task<IHttpActionResult> GetInsertRoles()
        {
            var system_roles = await roleManager.Roles.Where(x => x.Name != "Admins").ToListAsync();
            IList<RoleArray> obj = new List<RoleArray>();
            foreach (var role in system_roles)
            {
                obj.Add(new RoleArray() { role_id = role.Id, role_name = role.Name, role_use = false });
            }
            return Ok(obj);
        }

        #region 組合菜單對應基礎菜單
        public async Task<IHttpActionResult> GetLeftData([FromUri]ParmGetCorrespondData parm)
        {
            db0 = getDB0();
            try
            {
                int page_size = 10;
                var member_id = db0.NewsOfMember
                    .Where(x => x.news_id == parm.main_id)
                    .Select(x => x.member_id);

                //設定未啟用i_hide=true的不顯示
                var items = db0.Member.Where(x => !member_id.Contains(x.member_id) & x.is_approve).OrderBy(x => x.member_name).Select(x => new { x.member_id, x.member_name, x.email });


                if (parm.name != null)
                {
                    items = items.Where(x => x.member_name.Contains(parm.name));
                }

                int page = (parm.page == 0 ? 1 : parm.page);
                int startRecord = PageCount.PageInfo(page, page_size, items.Count());
                var resultItems = await items.Skip(startRecord).Take(page_size).ToListAsync();

                return Ok(new
                {
                    rows = resultItems,
                    total = PageCount.TotalPage,
                    page = PageCount.Page,
                    records = PageCount.RecordCount,
                    startcount = PageCount.StartCount,
                    endcount = PageCount.EndCount
                });
            }
            finally
            {
                db0.Dispose();
            }
        }
        public async Task<IHttpActionResult> GetRightData([FromUri]ParmGetCorrespondData parm)
        {
            db0 = getDB0();
            try
            {
                int page_size = 10;
                var items = from x in db0.NewsOfMember
                            join y in db0.Member on x.member_id equals y.member_id
                            where x.news_id == parm.main_id
                            select new { x.member_id, y.member_name, y.email };


                int page = (parm.page == 0 ? 1 : parm.page);
                int startRecord = PageCount.PageInfo(page, page_size, items.Count());
                var resultItems = await items.Skip(startRecord).Take(page_size).ToListAsync();

                return Ok(new
                {
                    rows = resultItems,
                    total = PageCount.TotalPage,
                    page = PageCount.Page,
                    records = PageCount.RecordCount,
                    startcount = PageCount.StartCount,
                    endcount = PageCount.EndCount
                });
            }
            finally
            {
                db0.Dispose();
            }
        }
        [HttpPost]
        public async Task<IHttpActionResult> PostNewsOfMember([FromBody]ParmNewsOfMember parm)
        {
            ResultInfo r = new ResultInfo();

            try
            {
                #region working a
                db0 = getDB0();
                var item = db0.NewsOfMember.Where(x => x.news_id == parm.news_id && x.member_id == parm.member_id).FirstOrDefault();
                if (item == null)
                {
                    item = new NewsOfMember()
                    {
                        news_id = parm.news_id,
                        member_id = parm.member_id,
                        i_InsertUserID = this.UserId,
                        i_InsertDateTime = DateTime.Now,
                        i_InsertDeptID = this.departmentId,
                        i_Lang = "zh-TW"
                    };
                    db0.NewsOfMember.Add(item);
                }

                await db0.SaveChangesAsync();

                r.result = true;
                r.id = item.news_id;
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
        [HttpDelete]
        public async Task<IHttpActionResult> DeleteNewsOfMember([FromBody]ParmNewsOfMember parm)
        {
            ResultInfo r = new ResultInfo();

            try
            {
                #region working a
                db0 = getDB0();
                var item = await db0.NewsOfMember.FindAsync(parm.news_id, parm.member_id);
                if (item != null)
                {
                    db0.NewsOfMember.Remove(item);
                    await db0.SaveChangesAsync();
                }
                else
                {
                    r.result = false;
                    r.message = "未刪除";
                    return Ok(r);
                }
                r.result = true;
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
        #endregion
    }
    #region Parm
    public class ParmGetCorrespondData
    {
        public int? main_id { get; set; }
        public string name { get; set; }
        public int page { get; set; }
    }
    public class ParmNewsOfMember
    {
        public int news_id { get; set; }
        public int member_id { get; set; }
    }
    #endregion
}
