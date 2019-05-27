$(document).ready(function(){
    $('#submit').on('click',function(e){
        var isCheckedPolicy = $('#agree-term:checkbox:checked').length > 0;
        if (!isCheckedPolicy){
            e.preventDefault();
            alert('Vui lòng đồng ý các điều khoản dịch vụ');
        }
        // Check match repassword

        var password = $('#password').val();
        var re_password  = $('#re_password').val();

        if (password !== re_password){
            e.preventDefault();
            alert('Nhập lại mật khẩu không khớp');
        }
    });
});