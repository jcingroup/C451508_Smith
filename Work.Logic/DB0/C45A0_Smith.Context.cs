﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class C45A0_SmithEntities : DbContext
    {
        public C45A0_SmithEntities()
            : base("name=C45A0_SmithEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<AspNetRoles> AspNetRoles { get; set; }
        public virtual DbSet<AspNetUsers> AspNetUsers { get; set; }
        public virtual DbSet<Department> Department { get; set; }
        public virtual DbSet<i_Currency> i_Currency { get; set; }
        public virtual DbSet<i_IDX> i_IDX { get; set; }
        public virtual DbSet<i_Lang> i_Lang { get; set; }
        public virtual DbSet<i_Parm> i_Parm { get; set; }
        public virtual DbSet<i_SN> i_SN { get; set; }
        public virtual DbSet<i_UserLoginLog> i_UserLoginLog { get; set; }
        public virtual DbSet<Menu> Menu { get; set; }
        public virtual DbSet<ProductCategory> ProductCategory { get; set; }
        public virtual DbSet<Purchase> Purchase { get; set; }
        public virtual DbSet<IssueCategory> IssueCategory { get; set; }
        public virtual DbSet<Issue> Issue { get; set; }
        public virtual DbSet<Product> Product { get; set; }
        public virtual DbSet<Member> Member { get; set; }
    }
}
