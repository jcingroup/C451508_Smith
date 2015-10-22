using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Data;
using System.IO;

using ProcCore.NetExtension;
using ProcCore.ReturnAjaxResult;

namespace DotWeb.Areas.Sys_Base.Controllers
{
    public class XYZController : SourceController
    {
        List<SelectListItem> Items = new List<SelectListItem>();

        public ActionResult Index()
        {
            try
            {
                String BasePath = Request.PhysicalApplicationPath;
                String[] Dirs = Directory.GetDirectories(BasePath);

                foreach (String S in Dirs)
                {
                    DirectoryInfo Di = new DirectoryInfo(S);

                    Items.Add(new SelectListItem() { Value = Di.Name, Text = Di.FullName.Replace(Request.PhysicalApplicationPath, "") });
                    GetFolderList(BasePath, Di.Name);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            ViewData["Folders"] = Items;
            return View();
        }

        public void GetFolderList(String ByPath, String FolderName)
        {
            try
            {
                String BasePath = ByPath + FolderName + @"\";
                String[] Dirs = Directory.GetDirectories(BasePath);

                foreach (String S in Dirs)
                {
                    DirectoryInfo Di = new DirectoryInfo(S);
                    Items.Add(new SelectListItem() { Value = Di.FullName.Replace(Request.PhysicalApplicationPath, ""), Text = Di.FullName.Replace(Request.PhysicalApplicationPath, "") });
                    GetFolderList(BasePath, Di.Name);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        #region Ajax Call Section
        [HttpPost]
        [ValidateInput(false)]
        public String ajax_UploadFiles(HttpPostedFileBase ClientUpFile, String path)
        {
            ReturnAjaxFiles rAjaxResult = new ReturnAjaxFiles();
            JavaScriptSerializer js = new JavaScriptSerializer() { MaxJsonLength = 65536 }; //64K
            try
            {
                if (ClientUpFile != null)
                {
                    //String SaveFolder = Request.PhysicalApplicationPath + path + "\\" + ClientUpFile.FileName.GetFileName();
                    String SaveFolder = Server.MapPath("~\\" + path + "\\" + ClientUpFile.FileName);
                    ClientUpFile.SaveAs(SaveFolder);
                    rAjaxResult.result = true;
                }
                else
                {
                    rAjaxResult.result = false;
                    rAjaxResult.message = "No Files UpLoad!!!";
                }
            }
            catch (Exception ex)
            {
                rAjaxResult.result = false;
                rAjaxResult.message = ex.Message;
            }
            return js.Serialize(rAjaxResult);
        }

        public String GetFilesList(String master_value)
        {
            Dictionary<String, String> dic = new Dictionary<String, String>();
            //String BasePath = Request.PhysicalApplicationPath;
            String BasePath = Server.MapPath("~/");
            ReturnAjaxInfo rAjaxResult = new ReturnAjaxInfo();
            try
            {
                String[] Files = Directory.GetFiles(BasePath + master_value);
                foreach (String S in Files)
                {
                    FileInfo Fi = new FileInfo(S);
                    dic.Add(Fi.Name, Fi.FullName.Replace(BasePath, ""));
                }
                rAjaxResult.result = true;
                //rAjaxResult.data = dic;
            }
            catch (Exception ex)
            {
                rAjaxResult.result = false;
                rAjaxResult.message = ex.Message;
            }
            JavaScriptSerializer js = new JavaScriptSerializer() { MaxJsonLength = 65536 }; //64K
            return js.Serialize(rAjaxResult);
        }

        [HttpPost]
        [ValidateInput(false)]
        public String ajax_SQLExecute(String SQL)
        {
            ReturnAjaxInfo rAjaxResult = new ReturnAjaxInfo();
            JavaScriptSerializer js = new JavaScriptSerializer() { MaxJsonLength = 65536 }; //64K
            String r = String.Empty;

            try
            {
                DataTable dt = getSQLConnection().ExecuteData(SQL);
                List<String> ColumnName = new List<String>();
                foreach (DataColumn dc in dt.Columns)
                {
                    ColumnName.Add(dc.ColumnName);
                }

                List<String[]> Rows = new List<String[]>();
                foreach (DataRow dr in dt.Rows)
                {
                    List<String> Cells = new List<String>();
                    for (int i = 0; i < dt.Columns.Count; i++)
                    {
                        Cells.Add(dr[i].ToString());
                    }
                    Rows.Add(Cells.ToArray());
                }

                r = js.Serialize(new { Columns = ColumnName.ToArray(), DataItems = Rows.ToArray(), result = true, message = "" });
            }
            catch (Exception ex)
            {
                r = js.Serialize(new { result = false, message = ex.Message });
            }
            return r;
        }
        #endregion
    }
}
