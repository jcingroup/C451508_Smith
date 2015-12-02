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
    public class MemberController : ajaxApi<Member, q_Member>
    {
        public async Task<IHttpActionResult> Get(int id)
        {
            using (db0 = getDB0())
            {
                r = new ResultInfo<Member>();
                item = await db0.Member.FindAsync(id);
                r.data = item;
            }

            return Ok(r);
        }
        public async Task<IHttpActionResult> Get([FromUri]q_Member q)
        {
            #region working

            using (db0 = getDB0())
            {
                var items = db0.Member
                    .OrderBy(x => x.member_id)
                    .Select(x => new m_Member()
                    {
                        member_id = x.member_id,
                        member_name = x.member_name,
                        tel_1 = x.tel_1,
                        tel_2 = x.tel_2,
                        email = x.email,
                        is_approve = x.is_approve
                    }).AsQueryable();

                if (q.name != null)
                {
                    items = items.Where(x => x.member_name.Contains(q.name));
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

                return Ok(new GridInfo<m_Member>()
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
        public async Task<IHttpActionResult> Put([FromBody]Member md)
        {
            try
            {
                r = new ResultInfo<Member>();
                db0 = getDB0();

                item = await db0.Member.FindAsync(md.member_id);
                item.member_name = md.member_name;
                item.member_account = md.member_account;
                item.member_password = md.member_password;
                item.tel_1 = md.tel_1;
                item.tel_2 = md.tel_2;
                item.line_id = md.line_id;
                item.email = md.email;
                item.tw_zip = md.tw_zip;
                item.tw_city = md.tw_city;
                item.tw_country = md.tw_country;
                item.tw_address = md.tw_address;
                item.member_joe = md.member_joe;
                item.content_person = md.content_person;
                //item.is_approve = md.is_approve;

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
        public async Task<IHttpActionResult> Post([FromBody]Member md)
        {
            md.member_id = GetNewId(CodeTable.Member);
            md.is_approve = true;
            md.i_Hide = false;
            md.i_InsertDateTime = DateTime.Now;
            md.i_InsertDeptID = this.departmentId;
            md.i_InsertUserID = this.UserId;
            md.i_Lang = "zh-TW";
            r = new ResultInfo<Member>();
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

                #region 帳號不重複驗證
                bool check_account = db0.Member.Any(x => x.member_account == md.member_account);
                if (check_account) {
                    r.result = false;
                    r.message = Resources.Res.Log_Err_Add_MemberAccountExist;
                    return Ok(r);
                }
                #endregion

                db0.Member.Add(md);
                await db0.SaveChangesAsync();

                r.result = true;
                r.id = md.member_id;
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
                r = new ResultInfo<Member>();
                foreach (var id in ids)
                {
                    item = new Member() { member_id = id };
                    db0.Member.Attach(item);
                    db0.Member.Remove(item);
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
    public class q_Member : QueryBase
    {
        public string name { get; set; }
        public string page_size { get; set; }
    }
}
