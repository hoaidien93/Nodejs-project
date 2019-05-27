$(document).ready(function(){
    $('#submit').on('click',function(e){
        var password = $('#password').val();
        var re_password  = $('#re-password').val();
        if (password !== re_password){
            e.preventDefault();
            alert('Nhập lại mật khẩu không khớp');
        }
    });
});