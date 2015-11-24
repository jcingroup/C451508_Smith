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
                    List<int> news_id = new List<int>();
                    //有對應
                    news_id = db0.News.Where(x => !x.i_Hide & x.news_type == (byte)NewsType.assign & x.NewsOfMember.Any(y => y.member_id == member_id & y.news_id == x.news_id)).OrderByDescending(x => x.news_date)
                                                                                .Select(x => x.news_id).ToList();

                    //未對應&一般
                    List<int> getNews = db0.News.Where(x => !x.i_Hide & x.news_type != (byte)NewsType.assign).OrderByDescending(x => x.news_date)
                                                                     .Select(x => x.news_id).ToList();
                    news_id.AddRange(getNews);
                    items = db0.News.Where(x => news_id.Contains(x.news_id)).OrderByDescending(x => new { x.is_top, x.news_date })
                                 .Select(x => new m_News()
                                 {
                                     news_id = x.news_id,
                                     news_title = x.news_title,
                                     news_date = x.news_date,
                                     news_content = x.news_content
                                 }).ToList();
                }
                else
                {
                    //一般
                    items = db0.News.Where(x => !x.i_Hide & x.news_type == (byte)NewsType.general).OrderByDescending(x => new { x.is_top, x.news_date })
                                                                                .Select(x => new m_News()
                                                                                {
                                                                                    news_id = x.news_id,
                                                                                    news_title = x.news_title,
                                                                                    news_date = x.news_date,
                                                                                    news_content = x.news_content
                                                                                }).ToList();

                }


            }

            return View("News", items);
        }
    }
}