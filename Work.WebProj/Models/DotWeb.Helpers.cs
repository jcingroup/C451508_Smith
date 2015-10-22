using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Resources;
using System.Runtime.Caching;
using System.Web.Mvc;
using System.Web.WebPages;

namespace DotWeb.Helpers
{
    public static class LocalizationHelpe
    {
        public static string Lang(this HtmlHelper htmlHelper, String key)
        {
            return Lang(htmlHelper.ViewDataContainer as WebViewPage, key);
        }

        public static string Lang<TModel, TProperty>(this HtmlHelper<TModel> h, Expression<Func<TModel, TProperty>> e)
        where TModel : class
        {
            var n = ExpressionHelper.GetExpressionText(e);
            String m = n.Split('.').LastOrDefault();
            return Lang(h.ViewDataContainer as WebViewPage, m);
        }

        public static string Lang<TModel, TProperty>(this HtmlHelper<TModel> h, Expression<Func<TModel, TProperty>> e, String prefx)
        where TModel : class
        {
            var n = ExpressionHelper.GetExpressionText(e);
            String m = n.Split('.').LastOrDefault();
            var i = prefx + m;
            return Lang(h.ViewDataContainer as WebViewPage, i);
        }

        private static IEnumerable<DictionaryEntry> GetResx(String LocalResourcePath)
        {
            //System.Resources.
            ObjectCache cache = MemoryCache.Default;
            IEnumerable<DictionaryEntry> resxs = null;

            if (cache.Contains(LocalResourcePath))
                resxs = cache.GetCacheItem(LocalResourcePath).Value as IEnumerable<DictionaryEntry>;
            else
            {
                if (File.Exists(LocalResourcePath))
                {
                    resxs = new ResXResourceReader(LocalResourcePath).Cast<DictionaryEntry>();
                    cache.Add(LocalResourcePath, resxs, new CacheItemPolicy() { Priority = CacheItemPriority.NotRemovable });
                }
            }
            return resxs;
        }
        public static string Lang(this WebPageBase page, String key)
        {
            var pagePath = page.VirtualPath;
            var pageName = pagePath.Substring(pagePath.LastIndexOf('/'), pagePath.Length - pagePath.LastIndexOf('/')).TrimStart('/');
            var filePath = page.Server.MapPath(pagePath.Substring(0, pagePath.LastIndexOf('/') + 1)) + "App_LocalResources";

            String lang = System.Globalization.CultureInfo.CurrentCulture.Name;
            String resxKey = String.Empty;
            String def_resKey = String.Format(@"{0}\{1}.resx", filePath, pageName);
            String lng_resKey = String.Format(@"{0}\{1}.{2}.resx", filePath, pageName, lang);

            resxKey = File.Exists(lng_resKey) ? lng_resKey : def_resKey;
            IEnumerable<DictionaryEntry> resxs = GetResx(resxKey);
            if (resxs != null)
                return (String)resxs.FirstOrDefault<DictionaryEntry>(x => x.Key.ToString() == key).Value;
            else
                return "";
        }
    }
    public static class NGName
    {
        public static string ngSH(this HtmlHelper htmlHelper)
        {
            return "sd";
        }
        public static string ngGD(this HtmlHelper htmlHelper)
        {
            return "gd";
        }
        /// <summary>
        /// 明細Grid變數
        /// </summary>
        /// <param name="htmlHelper"></param>
        /// <returns></returns>
        public static string ngGT(this HtmlHelper htmlHelper)
        {
            return "subgd";
        }
        /// <summary>
        /// 編輯欄位變數
        /// </summary>
        /// <param name="htmlHelper"></param>
        /// <returns></returns>
        public static string ngFD(this HtmlHelper htmlHelper)
        {
            return "fd";
        }
    }
    public class GridInfo<T>
    {
        public int total;
        public int page;
        public int records;
        public int startcount;
        public int endcount;

        public IList<T> rows;
    }
    public class GridInfo
    {
        public int total;
        public int page;
        public int records;
        public int startcount;
        public int endcount;

        public IList<object> rows;
    }
    public class IncludePagerParm
    {
        public IncludePagerParm()
        {
            this.show_add = true;
            this.show_del = true;
            this.edit_form_id = "Edit";
        }
        public bool show_add { get; set; }
        public bool show_del { get; set; }
        public string edit_form_id { get; set; }
    }
}