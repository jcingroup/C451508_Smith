using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DotWeb.Controller;
using ProcCore.Business.DB0;

namespace DotWeb.WebApp.Controllers
{
    public class NewsController : WebUserController
    {
        // GET: News
        public ActionResult Index()
        {
            List<m_News> items = new List<m_News>();
            using (var db0 = getDB0())
            {
                if (this.MemberId != null)
                {
                    int member_id = int.Parse(this.MemberId);
                    //有對應
                    items = db0.News.Where(x => !x.i_Hide & x.is_correspond & x.NewsOfMember.Any(y => y.member_id == member_id & y.news_id == x.news_id)).OrderByDescending(x => x.news_date)
                                                                                .Select(x => new m_News()
                                                                                {
                                                                                    news_id = x.news_id,
                                                                                    news_title = x.news_title,
                                                                                    news_date = x.news_date,
                                                                                    news_content = x.news_content
                                                                                }).ToList();

                    //未對應
                    List<m_News> getNews = db0.News.Where(x => !x.i_Hide & !x.is_correspond).OrderByDescending(x => x.news_date)
                                                                     .Select(x => new m_News()
                                                                     {
                                                                         news_id = x.news_id,
                                                                         news_title = x.news_title,
                                                                         news_date = x.news_date,
                                                                         news_content = x.news_content
                                                                     }).ToList();
                    items.AddRange(getNews);
                }


            }

            return View("News", items);
        }
    }
}