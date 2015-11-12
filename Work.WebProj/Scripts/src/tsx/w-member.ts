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
    $("#MLogin").submit(function (event) {
        event.preventDefault();
        var data: LoginData = {
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
                $("#m_Mlogin_img").attr("src", "~/_Code/Ashx/ValidateCode.ashx?vn=MemberLogin&t" + uniqid());
                alert(result.message);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        });
    });
}