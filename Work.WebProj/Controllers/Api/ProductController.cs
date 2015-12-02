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
    public class ProductController : ajaxApi<Product, q_Product>
    {
        public async Task<IHttpActionResult> Get(int id)
        {
            using (db0 = getDB0())
            {
                r = new ResultInfo<Product>();
                item = await db0.Product.FindAsync(id);
                r.data = item;
            }

            return Ok(r);
        }
        public async Task<IHttpActionResult> Get([FromUri]q_Product q)
        {
            #region working

            using (db0 = getDB0())
            {
                var items = db0.Product
                            .OrderByDescending(x => new { c_sort = x.ProductCategory.sort, x.sort })
                            .Select(x => new m_Product()
                            {
                                product_id = x.product_id,
                                product_name = x.product_name,
                                category_name = x.ProductCategory.category_name,
                                category_id = x.category_id,
                                model_type = x.model_type,
                                price = x.price,
                                sort = x.sort,
                                i_Hide = x.i_Hide
                            }).Where(x => x.product_id > 0).AsQueryable();

                if (q.name != null)
                {
                    items = items.Where(x => x.product_name.Contains(q.name));
                }
                if (q.product_category_id != null)
                {
                    items = items.Where(x => x.category_id == q.product_category_id);
                }
                int PageSize = 10;//預設10頁
                if (q.page_size != null)
                {
                    try { PageSize = q.page_size == "All" ? items.Count() : int.Parse(q.page_size); }
                    catch (Exception) { PageSize = 10; }
                }
                int page = (q.page == null ? 1 : (int)q.page);
                int startRecord = PageCount.PageInfo(page, PageSize, items.Count());
                var resultItems = await items.Skip(startRecord).Take(PageSize).ToListAsync();

                return Ok(new GridInfo<m_Product>()
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
        public async Task<IHttpActionResult> Put([FromBody]Product md)
        {
            try
            {
                r = new ResultInfo<Product>();
                db0 = getDB0();

                item = await db0.Product.FindAsync(md.product_id);
                item.product_name = md.product_name;
                item.product_content = md.product_content;
                item.category_id = md.category_id;
                item.model_type = md.model_type;
                item.price = md.price;
                item.sort = md.sort;
                item.i_Hide = md.i_Hide;

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
        public async Task<IHttpActionResult> Post([FromBody]Product md)
        {
            md.product_id = GetNewId(CodeTable.Product);
            md.i_Hide = false;
            md.i_InsertDateTime = DateTime.Now;
            md.i_InsertDeptID = this.departmentId;
            md.i_InsertUserID = this.UserId;
            md.i_Lang = "zh-TW";
            r = new ResultInfo<Product>();
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

                db0.Product.Add(md);
                await db0.SaveChangesAsync();

                r.result = true;
                r.id = md.product_id;
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
                r = new ResultInfo<Product>();
                foreach (var id in ids)
                {
                    item = new Product() { product_id = id };
                    db0.Product.Attach(item);
                    db0.Product.Remove(item);
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
    public class q_Product : QueryBase
    {
        public string name { get; set; }
        public int? product_category_id { get; set; }
        public string page_size { get; set; }
    }
}
