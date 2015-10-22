using ProcCore.Business;
using ProcCore.Business.DB0;
using ProcCore.HandleResult;
using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

namespace DotWeb.Api
{
    public class ProductCategoryController : ajaxApi<ProductCategory, q_ProductCategory>
    {
        public async Task<IHttpActionResult> Get(int id)
        {
            using (db0 = getDB0())
            {
                item = await db0.ProductCategory.FindAsync(id);
                r = new ResultInfo<ProductCategory>() { data = item };
            }

            return Ok(r);
        }
        public async Task<IHttpActionResult> Get([FromUri]q_ProductCategory q)
        {
            #region working

            using (db0 = getDB0())
            {
                var items = db0.ProductCategory
                    .OrderBy(x => x.sort)
                    .Select(x => new m_ProductCategory()
                    {
                        product_category_id = x.product_category_id,
                        category_name = x.category_name,
                        sort = x.sort
                    }).OrderBy(x => x.sort);
                return Ok(await items.ToListAsync());
            }
            #endregion
        }
        public async Task<IHttpActionResult> Put([FromBody]ProductCategory md)
        {
            ResultInfo rAjaxResult = new ResultInfo();
            try
            {
                db0 = getDB0();

                item = await db0.ProductCategory.FindAsync(md.product_category_id);

                item.sort = md.sort;

                await db0.SaveChangesAsync();
                rAjaxResult.result = true;
            }
            catch (Exception ex)
            {
                rAjaxResult.result = false;
                rAjaxResult.message = ex.ToString();
            }
            finally
            {
                db0.Dispose();
            }
            return Ok(rAjaxResult);
        }
        public async Task<IHttpActionResult> Post([FromBody]ProductCategory md)
        {
            md.product_category_id = GetNewId(CodeTable.Base);
            ResultInfo rAjaxResult = new ResultInfo();
            if (!ModelState.IsValid)
            {
                rAjaxResult.message = ModelStateErrorPack();
                rAjaxResult.result = false;
                return Ok(rAjaxResult);
            }

            try
            {
                #region working
                db0 = getDB0();

                db0.ProductCategory.Add(md);
                await db0.SaveChangesAsync();

                rAjaxResult.result = true;
                rAjaxResult.id = md.product_category_id;
                return Ok(rAjaxResult);
                #endregion
            }
            catch (Exception ex)
            {
                rAjaxResult.result = false;
                rAjaxResult.message = ex.Message;
                return Ok(rAjaxResult);
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
                    item = new ProductCategory() { product_category_id = id };
                    db0.ProductCategory.Attach(item);
                    db0.ProductCategory.Remove(item);
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
    public class q_ProductCategory : QueryBase { }
}
