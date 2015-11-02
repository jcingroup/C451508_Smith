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
    public partial class AspNetUsers : BaseEntityTable
    {
        public AspNetUsers()
        {
            this.AspNetRoles = new HashSet<AspNetRoles>();
        }
    
        public string Id { get; set; }
        public int department_id { get; set; }
        public string Email { get; set; }
        public bool EmailConfirmed { get; set; }
        public string PasswordHash { get; set; }
        public string SecurityStamp { get; set; }
        public string PhoneNumber { get; set; }
        public bool PhoneNumberConfirmed { get; set; }
        public bool TwoFactorEnabled { get; set; }
        public Nullable<System.DateTime> LockoutEndDateUtc { get; set; }
        public bool LockoutEnabled { get; set; }
        public int AccessFailedCount { get; set; }
        public string UserName { get; set; }
        public string user_name_c { get; set; }
        public int sort { get; set; }
    
    	[JsonIgnore]
        public virtual Department Department { get; set; }
    	[JsonIgnore]
        public virtual ICollection<AspNetRoles> AspNetRoles { get; set; }
    }
}
