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
    public class SalesController : ajaxApi<Sales, q_Sales>
    {
        public async Task<IHttpActionResult> Get(int id)
        {
            r = new ResultInfo<Sales>();
            using (db0 = getDB0())
            {
                item = await db0.Sales.FindAsync(id);
                r.data = item;
            }

            return Ok(r);
        }
        public async Task<IHttpActionResult> Get([FromUri]q_Sales q)
        {
            #region working

            using (db0 = getDB0())
            {
                var items = db0.Sales
                    .OrderBy(x => x.join_date)
                    .Select(x => new m_Sales()
                    {
                        sales_id = x.sales_id,
                        sales_no = x.sales_no,
                        sales_name = x.sales_name,
                        join_date = x.join_date,
                        sales_state = x.sales_state
                    }).Where(x => x.sales_id > 0);

                int page = (q.page == null ? 1 : (int)q.page);
                int startRecord = PageCount.PageInfo(page, this.defPageSize, items.Count());
                var resultItems = await items.Skip(startRecord).Take(this.defPageSize).ToListAsync();

                return Ok(new GridInfo<m_Sales>()
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
        public async Task<IHttpActionResult> Put([FromBody]Sales md)
        {
            r = new ResultInfo<Sales>();
            try
            {
                db0 = getDB0();

                item = await db0.Sales.FindAsync(md.sales_id);
                item.sales_name = md.sales_name;
                item.join_date = md.join_date;
                item.gender = md.gender;
                item.address = md.address;

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
        public async Task<IHttpActionResult> Post([FromBody]Sales md)
        {
            r = new ResultInfo<Sales>();

            md.sales_id = GetNewId(CodeTable.Base);
            md.i_InsertDateTime = DateTime.Now;
            md.i_InsertDeptID = this.departmentId;
            md.i_InsertUserID = this.UserId;
            md.i_Lang = "zh-TW";
            md.share_id = 0;
            md.share_sort = 0;

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

                db0.Sales.Add(md);
                await db0.SaveChangesAsync();

                r.result = true;
                r.id = md.sales_id;
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
            r = new ResultInfo<Sales>();
            try
            {
                db0 = getDB0();

                foreach (var id in ids)
                {
                    item = new Sales() { sales_id = id };
                    db0.Sales.Attach(item);
                    db0.Sales.Remove(item);
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
    public class q_Sales : QueryBase { }
}
