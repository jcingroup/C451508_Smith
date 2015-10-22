using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using ProcCore;
using ProcCore.JqueryHelp;
using ProcCore.WebCore;
using ProcCore.NetExtension;
using ProcCore.Business.Logic;
using ProcCore.Business.Logic.TablesDescription;
using ProcCore.ReturnAjaxResult;
using ProcCore.JqueryHelp.JQGridScript;
using DotWeb.CommSetup;

namespace DotWeb.Areas.Sys_Base.Controllers
{
    public class ParmController : BaseAction<m__ParmFloat, a__ParmFloat, q__ParmFloat, _ParmFloat>
    {
        #region Action and function section

        public RedirectResult Index()
        {
            return Redirect(Url.Action("ListGrid"));
        }

        public override ActionResult ListGrid(q__ParmFloat sh)
        {
            operationMode = OperationMode.EnterList;
            HandleRequest HRq = new HandleRequest(); //記錄QueryString            
            HRq.encodeURIComponent = true;
            HRq.Remove("page");

            ViewBag.Page = QueryGridPage();
            ViewBag.Caption = GetSystemInfo().prog_name;
            ViewBag.AppendQuertString = HRq.ToQueryString();
            HRq = null;

            return View("ListData", sh);
        }
        public override ActionResult EditMasterNewData()
        {
            throw new NotImplementedException();
        }
        public override ActionResult EditMasterDataByID(int id)
        {
            throw new NotImplementedException();
        }
        protected override void HandleCollectDataToOptions()
        {
            throw new NotImplementedException();
        }
        #endregion

        #region ajax call section
        /// <summary>
        /// 新增修改提供給Ajax Form Call
        /// </summary>
        /// <returns>JSON format for jquery</returns>
        [HttpPost]
        [ValidateInput(false)]
        public String ajax_MasterUpdata(m__ParmFloat md)
        {
            ReturnAjaxFiles rAjaxResult = new ReturnAjaxFiles();
            String returnPicturePath = String.Empty;

            ac = new a__ParmFloat() { Connection = getSQLConnection(), logPlamInfo = plamInfo }; ;
            //修改
            RunEnd HResult = this.ac.UpdateMaster(md, LoginUserId);
            rAjaxResult = HandleResultAjaxFiles(HResult, Resources.Res.Data_Update_Success);
            JavaScriptSerializer js = new JavaScriptSerializer() { MaxJsonLength = 65536 }; //64K
            return js.Serialize(rAjaxResult);
        }

        /// <summary>
        /// Grid Ajax 刪除資料 Section
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public override String ajax_MasterDeleteData(String id)
        {
            JavaScriptSerializer js = new JavaScriptSerializer() { MaxJsonLength = 65536 }; //64K

            string returnString = string.Empty;

            ReturnAjaxFiles rAjaxResult = new ReturnAjaxFiles();
            ac = new a__ParmFloat() { Connection = getSQLConnection(), logPlamInfo = plamInfo }; ;

            RunDeleteEnd HResult = ac.DeleteMaster(id.Split(',').CInt(), LoginUserId);
            rAjaxResult = HandleResultAjaxFiles(HResult, Resources.Res.Data_Delete_Success);
            return js.Serialize(rAjaxResult);
        }

        /// <summary>
        /// 由ajax從這裡下載資料 並搭配queryObj作為Search條件搜尋
        /// </summary>
        /// <param name="queryObj"></param>
        /// <returns></returns>
        [HttpGet]
        public override String ajax_MasterGridData(q__ParmFloat queryObj)
        {
            #region 連接BusinessLogicLibary資料庫並取得資料
            ac = new a__ParmFloat() { Connection = getSQLConnection(), logPlamInfo = plamInfo }; ;

            RunQueryPackage<m__ParmFloat> HResult = ac.SearchMaster(queryObj, LoginUserId);
            HandleResultCheck(HResult);
            #endregion
            #region 設定 Page物件 頁數 總筆數 每頁筆數
            int page = (queryObj.page == null ? 1 : queryObj.page.CInt());
            int startRecord = PageCount.PageInfo(page, this.DefPageSize, HResult.Count);
            #endregion
            #region 每行及每個欄位資料組成
            List<RowElement> setRowElement = new List<RowElement>();
            var Modules = HResult.SearchData.Skip(startRecord).Take(this.DefPageSize);
            foreach (m__ParmFloat md in Modules)
            {
                List<String> setFields = new List<String>(5);

                setFields.Add(md.ParmName);
                setFields.Add(md.Value.ToString());

                setRowElement.Add(new RowElement() { id = md.ParmName, cell = setFields.ToArray() });
            }
            #endregion
            #region 回傳JSON資料
            JavaScriptSerializer js = new JavaScriptSerializer() { MaxJsonLength = 65536 }; //64K
            return js.Serialize(new JQGridDataObject()
            {
                rows = setRowElement.ToArray(),
                total = PageCount.TotalPage,
                page = PageCount.Page,
                records = PageCount.RecordCount
            });
            #endregion
        }
        #endregion
    }
}