using DotWeb.Helpers;
using ProcCore.Business;
using ProcCore.Business.DB0;
using ProcCore.HandleResult;
using ProcCore.WebCore;
using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

namespace DotWeb.Api
{
    public class IssueController : ajaxApi<Issue, q_Issue>
    {
        public async Task<IHttpActionResult> Get(int id)
        {
            using (db0 = getDB0())
            {
                r = new ResultInfo<Issue>();
                item = await db0.Issue.FindAsync(id);
                r.data = item;
            }

            return Ok(r);
        }
        public async Task<IHttpActionResult> Get([FromUri]q_Issue q)
        {
            #region working

            using (db0 = getDB0())
            {
                var items = db0.Issue
                    .OrderByDescending(x => new { c_sort = x.IssueCategory.sort, x.sort })
                    .Select(x => new m_Issue()
                    {
                        issue_id = x.issue_id,
                        issue_category_id = x.issue_category_id,
                        category_name = x.IssueCategory.category_name,
                        issue_q = x.issue_q,
                        sort = x.sort,
                        i_Hide = x.i_Hide
                    }).AsQueryable();

                if (q.name != null)
                {
                    items = items.Where(x => x.issue_q.Contains(q.name));
                }
                if (q.issue_category_id != null)
                {
                    items = items.Where(x => x.issue_category_id == q.issue_category_id);
                }
                int page = (q.page == null ? 1 : (int)q.page);
                int startRecord = PageCount.PageInfo(page, this.defPageSize, items.Count());
                var resultItems = await items.Skip(startRecord).Take(this.defPageSize).ToListAsync();

                return Ok(new GridInfo<m_Issue>()
                {
                    rows = resultItems,
                    total = PageCount.TotalPage,
                    page = PageCount.Page,
                    records = PageCount.RecordCount,
                    startcount = PageCount.StartCount,
                    endcount = PageCount.EndCount
                });
            }
            #endregion
        }
        public async Task<IHttpActionResult> Put([FromBody]Issue md)
        {
            try
            {
                r = new ResultInfo<Issue>();
                db0 = getDB0();

                item = await db0.Issue.FindAsync(md.issue_id);
                item.issue_category_id = md.issue_category_id;
                item.issue_q = md.issue_q;
                item.issue_ans = md.issue_ans;
                item.i_Hide = md.i_Hide;
                item.sort = md.sort;

                md.i_UpdateDateTime = DateTime.Now;
                md.i_UpdateDeptID = this.departmentId;
                md.i_UpdateUserID = this.UserId;

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
        public async Task<IHttpActionResult> Post([FromBody]Issue md)
        {
            md.issue_id = GetNewId(CodeTable.Issue);
            md.i_Hide = false;
            md.i_InsertDateTime = DateTime.Now;
            md.i_InsertDeptID = this.departmentId;
            md.i_InsertUserID = this.UserId;
            md.i_Lang = "zh-TW";
            r = new ResultInfo<Issue>();
            if (!ModelState.IsValid)
            {
                r.message = ModelStateErrorPack();
                r.result = false;
                return Ok(r);
            }

            try
            {
                #region working
                db0 = getDB0();

                db0.Issue.Add(md);
                await db0.SaveChangesAsync();

                r.result = true;
                r.id = md.issue_id;
                return Ok(r);
                #endregion
            }
            catch (DbEntityValidationException ex) //欄位驗證錯誤
            {
                r.message = getDbEntityValidationException(ex);
                r.result = false;
                return Ok(r);
            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.Message + "\r\n" + getErrorMessage(ex);
                return Ok(r);
            }
            finally
            {
                db0.Dispose();
            }
        }
        public async Task<IHttpActionResult> Delete([FromUri]int[] ids)
        {
            try
            {
                db0 = getDB0();
                r = new ResultInfo<Issue>();
                foreach (var id in ids)
                {
                    item = new Issue() { issue_id = id };
                    db0.Issue.Attach(item);
                    db0.Issue.Remove(item);
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
    public class q_Issue : QueryBase
    {
        public string name { get; set; }
        public int? issue_category_id { get; set; }
    }
}
