using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DotWeb.WebApp.Models
{

    public class MonthObject
    {
        public int year { get; set; }
        public int month { get; set; }
        public int prve_year { get; set; }
        public int prve_month { get; set; }
        public int next_year { get; set; }
        public int next_month { get; set; }

        public WeekObject[] weekInfo { get; set; }
    }
    public class WeekObject
    {
        public DayObject[] dayInfo { get; set; }
    }
    public class DayObject
    {
        public DateTime meal_day { get; set; }
        public MealState breakfast { get; set; }
        public MealState lunch { get; set; }
        public MealState dinner { get; set; }
        /// <summary>
        /// 日期是否屬於此月份
        /// </summary>
        public bool isNowMonth { get; set; }

    }
    public enum MealState
    {
        AddMeal = 2,//增餐
        CommonMeal = 1,//正常用餐
        NotShow = 0,//不顯示
        CommonNotMeal = -1,//正常不吃
        PauseMeal = -2//停餐
    }

}