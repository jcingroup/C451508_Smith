//------------------------------------------------------------------------------
// <auto-generated>
//     這個程式碼是由範本產生。
//
//     對這個檔案進行手動變更可能導致您的應用程式產生未預期的行為。
//     如果重新產生程式碼，將會覆寫對這個檔案的手動變更。
// </auto-generated>
//------------------------------------------------------------------------------

namespace ProcCore.Business.DB0
{
    using System;
    using System.Collections.Generic;
    
    using Newtonsoft.Json;
    public partial class Department : BaseEntityTable
    {
        public Department()
        {
            this.AspNetUsers = new HashSet<AspNetUsers>();
        }
    
        public int department_id { get; set; }
        public string department_name { get; set; }
        public bool i_Hide { get; set; }
    
    	[JsonIgnore]
        public virtual ICollection<AspNetUsers> AspNetUsers { get; set; }
    }
}
