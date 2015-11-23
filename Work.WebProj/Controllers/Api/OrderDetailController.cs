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
    public class OrderDetailController : ajaxApi<OrderDetail, q_OrderDetail>
    {
        public async Task<IHttpActionResult> Get(int id)
        {
            using (db0 = getDB0())
            {
                r = new ResultInfo<OrderDetail>();
                item = await db0.OrderDetail.FindAsync(id);
                r.data = item;
            }

            return Ok(r);
        }
        public async Task<IHttpActionResult> Get([FromUri]q_OrderDetail q)
        {
            #region working

            using (db0 = getDB0())
            {
                var items = db0.OrderDetail
                            .OrderBy(x => new { x.product_name })
                            .Select(x => new m_OrderDetail()
                            {
                                order_id = x.order_id,
                                order_detail_id = x.order_detail_id,
                                product_id = x.product_id,
                                category_name=x.Product.ProductCategory.category_name,
                                product_name = x.product_name,
                                model_type = x.model_type,
                                qty = x.qty,
                                i_Hide = x.i_Hide
                            }).AsQueryable();

                if (q.name != null)
                {
                    items = items.Where(x => x.product_name.Contains(q.name));
                }

                return Ok(items.ToList());

            }
            #endregion
        }
        public async Task<IHttpActionResult> Put([FromBody]OrderDetail md)
        {
            try
            {
                r = new ResultInfo<OrderDetail>();
                db0 = getDB0();

                item = await db0.OrderDetail.FindAsync(md.order_detail_id);
                item.qty = item.qty;

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
        public async Task<IHttpActionResult> Post([FromBody]OrderDetail md)
        {
            md.order_detail_id = GetNewId(CodeTable.OrderDetail);
            md.i_Hide = false;
            md.i_InsertDateTime = DateTime.Now;
            md.i_InsertDeptID = this.departmentId;
            md.i_InsertUserID = this.UserId;
            md.i_Lang = "zh-TW";
            r = new ResultInfo<OrderDetail>();
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

                db0.OrderDetail.Add(md);
                await db0.SaveChangesAsync();

                r.result = true;
                r.id = md.order_id;
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
                r = new ResultInfo<OrderDetail>();
                foreach (var id in ids)
                {
                    item = new OrderDetail() { order_detail_id = id };
                    db0.OrderDetail.Attach(item);
                    db0.OrderDetail.Remove(item);
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
    public class q_OrderDetail : QueryBase
    {
        public string name { get; set; }
    }
}
