using DotWeb.CommSetup;
using MvcSiteMapProvider;
using ProcCore.Business.DB0;
using ProcCore.Business.LogicConect;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DotWeb.Menu
{
    public class MyDynamicNodeProvider : DynamicNodeProviderBase
    {
        public override IEnumerable<DynamicNode> GetDynamicNodeCollection(ISiteMapNode nodes)
        {

            var is_tablet = (new WebInfo()).isTablet();

            //var returnValue = new List<DynamicNode>();

            LogicCenter log = new LogicCenter(CommWebSetup.DB0_CodeString);
            C45A0_SmithEntities db = LogicCenter.getDB0;

            try
            {
                LogicCenter.SetDB0EntityString(CommSetup.CommWebSetup.DB0_CodeString);
                IList<DynamicNode> colle_node = new List<DynamicNode>();
                //if (!is_tablet)
                //{
                    #region PC Menu
                    var items = db.Menu.Where(x => x.is_use == true && x.is_only_tablet == false).ToList();
                    var folder_items = items.Where(x => x.is_folder == true).OrderBy(x => x.sort);

                    foreach (var item in folder_items)
                    {
                        DynamicNode folder_node = new DynamicNode();

                        folder_node.Title = item.menu_name;
                        folder_node.Key = item.menu_id.ToString();
                        //dynamicNode.RouteValues.Add("genreId", item.menu_id); //製作連結參數
                        folder_node.Area = item.area;
                        folder_node.Attributes.Add("IconClass", item.icon_class);
                        folder_node.Clickable = false;
                        
                        folder_node.Roles.Add("Admins");

                        var get_roles = item.AspNetRoles.Select(x => x.Name);

                        foreach (var role_name in get_roles) {
                            folder_node.Roles.Add(role_name);
                        }

                        colle_node.Add(folder_node);
                        var sub_items = items.Where(x => x.parent_menu_id == item.menu_id).OrderBy(x => x.sort);
                        foreach (var sub_item in sub_items)
                        {
                            DynamicNode subNode = new DynamicNode();

                            subNode.Title = sub_item.menu_name;
                            subNode.ParentKey = folder_node.Key;
                            //dynamicNode.RouteValues.Add("genreId", item.menu_id); //製作連結參數
                            if (!string.IsNullOrEmpty(sub_item.area))
                            {
                                subNode.Area = sub_item.area;
                            }
                            subNode.Controller = sub_item.controller;
                            subNode.Action = sub_item.action;
                            subNode.Clickable = true;
                            subNode.Roles.Add("Admins");

                            var get_sub_roles = sub_item.AspNetRoles.Select(x => x.Name);

                            foreach (var role_name in get_sub_roles)
                            {
                                subNode.Roles.Add(role_name);
                            }

                            colle_node.Add(subNode);
                        }
                    }
                    #endregion
                //}
                //else
                //{
                //    #region Tablet
                //    var items = db.Menu
                //        .Where(x => x.is_use == true && x.is_on_tablet == true)
                //        .ToList();

                //    foreach (var item in items)
                //    {
                //        DynamicNode item_node = new DynamicNode();

                //        item_node.Title = item.menu_name;
                //        item_node.Key = item.menu_id.ToString();
                //        //dynamicNode.RouteValues.Add("genreId", item.menu_id); //製作連結參數
                //        item_node.Area = item.area;
                //        item_node.Controller = item.controller;
                //        item_node.Action = item.action;
                //        //item_node.Attributes.Add("IconClass", item.icon_class);
                //        item_node.Clickable = true;
                //        //yield return item_node;
                //        colle_node.Add(item_node);
                //    }
                //    #endregion
                //}
                return colle_node;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
            finally
            {
                db.Dispose();
            }
        }
    }
}