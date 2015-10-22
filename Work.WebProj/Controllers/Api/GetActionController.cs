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

        public async Task<IHttpActionResult> GetModalQuerySales(string keyword)
        {
            using (db0 = getDB0())
            {
                if (keyword != null)
                {
                    var items = await db0.Sales.Where(x => x.sales_name.Contains(keyword))
                        .Select(x => new { x.sales_id, x.sales_no, x.sales_name })
                        .ToListAsync();
                    return Ok(items);
                }
                else
                {
                    var items = await db0.Sales
                        .Select(x => new { x.sales_id, x.sales_no, x.sales_name })
                        .ToListAsync();
                    return Ok(items);
                }
            }
        }
    }
    #region Parm

    #endregion
}
