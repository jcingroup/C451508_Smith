using DotWeb.Controller;
using ProcCore.Business.DB0;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Xml;

namespace DotWeb.Areas.Base.Controllers
{
    public class DocController : AdminController
    {
        public RedirectResult Index()
        {
            return Redirect(Url.Action("ListGrid"));
        }

        public ActionResult ListGrid()
        {
            XmlDocument xml = new XmlDocument();
            xml.Load(Server.MapPath("~/_Code/SysDoc/Doc.xml"));
            XmlNodeList xmlE = xml.GetElementsByTagName("file");
            List<DocInfo> l = new List<DocInfo>();
            foreach (XmlElement f in xmlE)
            {
                String f_name = f.GetElementsByTagName("name").Item(0).FirstChild.Value;
                String f_sort = f.GetElementsByTagName("sort").Item(0).FirstChild.Value;
                String f_memo = f.GetElementsByTagName("memo").Item(0).FirstChild.Value;

                if (System.IO.File.Exists(Server.MapPath("~/_Code/SysDoc/" + f_name)))
                {
                    DocInfo d = new DocInfo()
                    {
                        Name = f_name,
                        Sort = int.Parse(f_sort),
                        Momo = f_memo,
                        Link = Url.Content("~/_Code/SysDoc/" + f_name)
                    };
                    l.Add(d);
                }
            }
            return View("ListData", l.ToArray().OrderBy(x => x.Sort));
        }
    }
    public class DocInfo
    {
        public String Name { get; set; }
        public int Sort { get; set; }
        public String Momo { get; set; }
        public String Link { get; set; }
    }
}
