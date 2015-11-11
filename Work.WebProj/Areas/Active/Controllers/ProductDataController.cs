using DotWeb.CommSetup;
using DotWeb.Controller;
using ProcCore.Business.LogicConect;
using ProcCore.HandleResult;
using System;
using System.IO;
using System.Web.Mvc;
using System.Linq;
using System.Collections.Generic;

namespace DotWeb.Areas.Active.Controllers
{
    public class ProductDataController : AdminController
    {
        #region Action and function section
        public ActionResult Main()
        {
            ActionRun();
            return View();
        }
        public ActionResult Category()
        {
            ActionRun();
            return View();
        }
        #endregion

        #region ajax call section

        public string aj_Init()
        {

            using (var db0 = getDB0())
            {
                var category_option = db0.ProductCategory.Where(x => !x.i_Hide).OrderByDescending(x => x.sort).Select(x => new { x.category_name, x.product_category_id });
                return defJSON(category_option);
            }
        }
        #endregion
        #region ajax file section
        [HttpPost]
        public string axFUpload(int id, string filekind, string filename)
        {
            UpFileInfo r = new UpFileInfo();
            #region
            try
            {
                if (filekind == "Photo1")
                    handleImageSave(filename, id, ImageFileUpParm.Product, filekind, "ProductData", "Photo");

                r.result = true;
                r.file_name = filename;
            }
            catch (LogicError ex)
            {
                r.result = false;
                r.message = getRecMessage(ex.Message);
            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.Message;
            }
            #endregion
            return defJSON(r);
        }

        [HttpPost]
        public string axFList(int id, string filekind)
        {
            SerializeFileList r = new SerializeFileList();

            r.files = listImgFiles(id, filekind, "ProductData", "Photo");
            r.result = true;
            return defJSON(r);
        }
        [HttpPost]
        public string axFSort(int id, string filekind, IList<JsonFileInfo> file_object)
        {
            ResultInfo r = new ResultInfo();

            rewriteJsonFile(id, filekind, "ProductData", "Photo", file_object);

            r.result = true;
            return defJSON(r);
        }
        [HttpPost]
        public string axFDelete(int id, string filekind, string filename)
        {
            ResultInfo r = new ResultInfo();
            DeleteSysFile(id, filekind, filename, ImageFileUpParm.Product, "ProductData", "Photo");
            r.result = true;
            return defJSON(r);
        }


        [HttpGet]
        public FileResult axFDown(int id, string filekind, string filename)
        {
            string path_tpl = string.Format(upload_path_tpl_o, "ProductData", "Photo", id, filekind, filename);
            string server_path = Server.MapPath(path_tpl);
            FileInfo file_info = new FileInfo(server_path);
            FileStream file_stream = new FileStream(server_path, FileMode.Open, FileAccess.Read);
            string web_path = Url.Content(path_tpl);
            return File(file_stream, "application/*", file_info.Name);
        }
        #endregion
    }
}