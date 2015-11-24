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
        model_type?: string;
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
        tel_1?: string;
        tel_2?: string;
        line_id?: string;
        tw_zip?: string;
        tw_city?: string;
        tw_country?: string;
        tw_address?: string;
        member_account?: string;
        member_password?: string;
        is_approve?: boolean;
        newsOfMember?: server.NewsOfMember[];
    }
    interface News extends BaseEntityTable {
        news_id?: number;
        news_type?: number;
        news_title?: string;
        news_content?: string;
        news_date?: any;
        is_top?: boolean;
        i_Hide?: boolean;
        newsOfMember?: server.NewsOfMember[];
    }
    interface NewsOfMember extends BaseEntityTable {
        news_id?: number;
        member_id?: number;
        member?: server.Member;
        news?: server.News;
    }
    interface OrderProduct extends BaseEntityTable {
        product_id?: number;
        category_id: number;
        model_type?: string;
        product_name?: string;
        category_name?: string;

        count?: number;
        isFirst?: boolean;
        qty?: number;
        is_buy?: boolean;
    }
    interface OrderDetailList extends BaseEntityTable {
        p_id?: number;
        qty?: number;
        m_type?: string;
        c_name?: string;
    }

    interface Order extends BaseEntityTable {
        order_id?: number;
        order_day?: any;
        member_id?: number;
        member_name?: string;
        member?: server.Member;
        orderDetail?: Array<server.OrderDetail>;
    }
    interface OrderDetail extends BaseEntityTable {
        order_detail_id?: number;
        order_id?: number;
        product_id?: number;
        category_name?: string;
        product_name?: string;
        model_type?: string;
        qty?: number;
        order?: server.Order;
    }
} 
