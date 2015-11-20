namespace Member {
    interface LoginData {
        act?: string;
        pwd?: string;
        validate?: string;
    }
    interface LoginResult {
        result: boolean;
        message: string;
        url: string;
    }
    function uniqid() {
        /*
            Autohr:Jerry
            Date:2014/2/23
            Description:取得唯一值
        */
        var newDate: Date = new Date(); return newDate.getTime();
    }
    $("#MLogin").submit(function (event) {
        event.preventDefault();
        let data: LoginData = {
            "act": $("#m_member_id").val(),
            "pwd": $("#m_member_pwd").val(),
            "validate": $("#m_Mlogin_validate").val()
        };
        $.ajax({
            type: "POST",
            url: gb_approot + 'Base/Login/ajax_MemberLogin',
            data: data,
            dataType: 'json'
        }).done(function (result: LoginResult, textStatus, jqXHRdata) {
            if (result.result) {
                document.location.href = result.url;
            }
            else {
                $("#m_Mlogin_validate").val("");
                $("#m_member_pwd").val("");
                $("#m_Mlogin_img").attr("src", "/_Code/Ashx/ValidateCode.ashx?vn=MemberLogin&t" + uniqid());
                alert(result.message);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        });
    });
    //$("#MApply").submit(function (event) {
    //    event.preventDefault();
    //    let data = {
    //        "email": $("#ma_member_email").val(),
    //        "name": $("#ma_member_name").val(),
    //        "act": $("#ma_member_id").val(),
    //        "pwd": $("#ma_member_pwd").val(),
    //        "validate": $("#m_MApply_validate").val()
    //    };
    //    $.ajax({
    //        type: "POST",
    //        url: gb_approot + 'Index/ApplyMember',
    //        data: data,
    //        dataType: 'json'
    //    }).done(function (result: LoginResult, textStatus, jqXHRdata) {
    //        if (result.result) {
    //            alert("感謝您的加入，我們將盡快作業，請等候通知");
    //        }
    //        else {
    //            alert(result.message);
    //        }
    //        $("#m_MApply_validate").val("");
    //        $("#m_MApply_img").attr("src", "/_Code/Ashx/ValidateCode.ashx?vn=MemberApply&t" + uniqid());
    //    }).fail(function (jqXHR, textStatus, errorThrown) {
    //        alert(errorThrown);
    //    });
    //});
}