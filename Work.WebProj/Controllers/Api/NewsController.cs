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
    public class NewsController : ajaxApi<News, q_News>
    {
        public async Task<IHttpActionResult> Get(int id)
        {
            using (db0 = getDB0())
            {
                r = new ResultInfo<News>();
                item = await db0.News.FindAsync(id);
                r.data = item;
            }

            return Ok(r);
        }
        public async Task<IHttpActionResult> Get([FromUri]q_News q)
        {
            #region working

            using (db0 = getDB0())
            {
                var items = db0.News
                            .OrderByDescending(x => new { x.news_date, x.news_id })
                            .Select(x => new m_News()
                            {
                                news_id=x.news_id,
                                news_title=x.news_title,
                                news_date=x.news_date,
                                is_correspond=x.is_correspond,
                                i_Hide=x.i_Hide
                            }).AsQueryable();

                if (q.name != null)
                {
                    items = items.Where(x => x.news_title.Contains(q.name));
                }
                if (q.is_correspond != null)
                {
                    items = items.Where(x => x.is_correspond == q.is_correspond);
                }

                int page = (q.page == null ? 1 : (int)q.page);
                int startRecord = PageCount.PageInfo(page, this.defPageSize, items.Count());
                var resultItems = await items.Skip(startRecord).Take(this.defPageSize).ToListAsync();

                return Ok(new GridInfo<m_News>()
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
        public async Task<IHttpActionResult> Put([FromBody]News md)
        {
            try
            {
                r = new ResultInfo<News>();
                db0 = getDB0();

                item = await db0.News.FindAsync(md.news_id);
                item.news_title = md.news_title;
                item.news_date = md.news_date;
                item.is_correspond = md.is_correspond;
                item.i_Hide = md.i_Hide;
                item.news_content = md.news_content;

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
        public async Task<IHttpActionResult> Post([FromBody]News md)
        {
            md.news_id = GetNewId(CodeTable.News);
            md.i_Hide = false;
            md.i_InsertDateTime = DateTime.Now;
            md.i_InsertDeptID = this.departmentId;
            md.i_InsertUserID = this.UserId;
            md.i_Lang = "zh-TW";
            r = new ResultInfo<News>();
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

                db0.News.Add(md);
                await db0.SaveChangesAsync();

                r.result = true;
                r.id = md.news_id;
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
                r = new ResultInfo<News>();
                foreach (var id in ids)
                {
                    item = new News() { news_id = id };
                    db0.News.Attach(item);
                    db0.News.Remove(item);
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
    public class q_News : QueryBase
    {
        public string name { get; set; }
        public bool? is_correspond { get; set; }
    }
}
