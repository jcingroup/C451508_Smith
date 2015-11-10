using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DotWeb.Controller;
using ProcCore.Business.DB0;

namespace DotWeb.WebApp.Controllers
{
    public class FAQController : WebUserController
    {
        // GET: FAQ
        public ActionResult Index()
        {
            List<m_Issue> items = new List<m_Issue>();
            List<IssueGroup> result = new List<IssueGroup>();
            using (var db0 = getDB0())
            {
                items = db0.Issue.Where(x => !x.i_Hide).OrderByDescending(x => x.sort)
                                               .Select(x => new m_Issue()
                                               {
                                                   issue_id = x.issue_id,
                                                   issue_category_id = x.issue_category_id,
                                                   category_name = x.IssueCategory.category_name,
                                                   issue_q = x.issue_q,
                                                   issue_ans = x.issue_ans
                                               }).ToList();

                result = db0.IssueCategory.Where(x => !x.i_Hide).OrderByDescending(x => x.sort)
                                                                .Select(x => new IssueGroup()
                                                                {
                                                                    c_id = x.issue_category_id,
                                                                    Lname = x.category_name
                                                                }).ToList();
                foreach (var group in result)
                {
                    group.issue = items.Where(x => x.issue_category_id == group.c_id).ToList();
                }
            }
            return View("FAQ", result);
        }
    }
}