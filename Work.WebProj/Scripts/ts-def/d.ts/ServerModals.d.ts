declare module server {
    interface BaseEntityTable {
        edit_type?: number;
        check_del?: boolean;
        expland_sub?: boolean;
    }
    interface i_Code {
        code: string;
        langCode: string;
        value: string;
    }
    interface CUYUnit {
        sign: string;
        code: string;
    }
    interface i_Lang extends BaseEntityTable {
        lang: string;
        area: string;
        memo: string;
        isuse: boolean;
        sort: any;
    }
    interface loginField {
        lang: string;
        account: string;
        password: string;
        img_vildate: string;
        rememberme: boolean;

    }
    interface AspNetRoles extends BaseEntityTable {
        Id: string;
        name: string;
        aspNetUsers: any[];
    }
    interface AspNetUsers extends BaseEntityTable {
        Id: string;
        email: string;
        emailConfirmed: boolean;
        passwordHash: string;
        securityStamp: string;
        phoneNumber: string;
        phoneNumberConfirmed: boolean;
        twoFactorEnabled: boolean;
        lockoutEndDateUtc: Date;
        lockoutEnabled: boolean;
        accessFailedCount: number;
        userName: string;
        department_id: number;
        aspNetRoles: server.AspNetRoles[];
        role_array: any;
    }

    interface Product extends BaseEntityTable {
        product_id?: number;
        category_id: number;
        model_type?: number;
        product_name?: string;
        product_content?: string;
        price?: number;
        sort?: number;
        i_Hide?: boolean;
        productCategory?: server.ProductCategory;
    }
    interface ProductCategory extends BaseEntityTable {
        product_category_id?: number;
        category_name?: string;
        sort?: number;
        memo?: string;
        i_Hide?: boolean;
        product?: server.Product[];
    }

    interface Issue extends BaseEntityTable {
        issue_id?: number;
        issue_category_id?: number;
        issue_q?: string;
        sort?: number;
        issue_ans?: string;
        i_Hide?: boolean;
        issueCategory?: server.IssueCategory;
    }
    interface IssueCategory extends BaseEntityTable {
        issue_category_id?: number;
        category_name?: string;
        sort?: number;
        memo?: string;
        i_Hide?: boolean;
        issue?: server.Issue[];
    }
    interface Member extends BaseEntityTable {
        member_id?: number;
        member_name?: string;
        email?: string;
        tel?: string;
        mobile?: string;
        tw_zip?: string;
        tw_city?: string;
        tw_country?: string;
        tw_address?: string;
        member_account?: string;
        member_password?: string;
        is_approve?: boolean;
    }
    interface Purchase extends BaseEntityTable {
        purchase_id?: number;
        purchase_no?: string;
        set_date?: Date;
        sales_id?: number;
        sales_name?: string;
        total?: number;
        state?: number;
    }
    interface PurchaseDetail extends BaseEntityTable {
        purchase_detail_id?: number;
        purchase_id?: number;
        item_no?: number;
        product_name?: string;
        qty?: number;
        price?: number;
        sub_total?: number;
        product_no?: string;
        purchase_no?: string
    }


} 