!function(window, document, $, undefined) {
    var userMng = {
        $myDlg: $('#myDlg'),
        init: function() {
            $('#saveBtn').on('click', this.onSaveBtnClick);
            $('#resetBtn').on('click', this.resetBtnClick);
        },
        resetBtnClick: function() {
            var r = confirm('确定要重置所填内容吗？');
            if(r == false) {
                return false;
            }
        },

        onSaveBtnClick: function() {
            var $gender = $('input[name=gender]');
            var $hobbies = $('input[name=hobbies]');
            var hobby = [];

            $('input[name=hobbies]:checked').each(function(key, val) {
                hobby.push(val.value);
                console.log(hobby);
            });

            var $this = $(this);
            var url = '../server/ajaxReg.php';
            var data = {
                name: $('#name').val(),
                age: $('#age').val(),
                edu: $('#edu').val(),
                gender: $('input[name=gender]:checked').val(),
                address: $('#address').val(),
                mobile: $('#mobile').val(),
                // hobbies: $('input[name=hobbies]:checked').val(),
                hobbies: hobby.join(' ')
                
            };

            var mobileRE = /^1\d{10}$/;

            if($.trim(data.name) == '') {
                alert('姓名不能为空！');
                return false;
            };

            if($.trim(data.age) == '') {
                alert('年龄不能为空！');
                return false;
            };

            if(isNaN(data.age)) {
                alert('请输入正确的年龄！');
                return false;
            };

            if($('input[name=gender]:checked').length < 1) {
                alert('请选择性别！');
                return false;
            };
            
            if($.trim(data.mobile) == '') {
                alert('电话不能为空！');
                return false;
            };

            if(!mobileRE.test(data.mobile)) {
                alert('请输入正确的手机号！')
                return false;
            };

            if($.trim(data.address) == '') {
                alert('地址不能为空！');
                return false;
            };

            if(data.edu == 0) {
                alert('请选择学历！');
                return false;
            };

            if($('input[name=hobbies]:checked').length < 1) {
                alert('请至少选择一个爱好！');
                return false;
            };

        //     console.log('ok')
        
            var valDlet = function() {
                $('#name').val('');
                $('#age').val('');
                $('#edu').val('0');
                $('#address').val('');
                $('#mobile').val('');

                // $('input[name=gender]:checked = false'); // 错的

                $gender.each(function (key,val) {
                    // console.log(val);
                    this.checked = false;
                });

                $hobbies.each(function(key,val) {
                    val.checked = false;
                })
            };
            valDlet();
             
            if($this.hasClass('loading')) {
                return;
            };

        
           
            // if(userMng.check()){
            //     return;
            // }
            // console.log($this)
            $this.addClass('loading');

            // console.log(data.name)
            

            $.get(url, data, function(response) {
               if(response.success) {
                    // valDlet();
                    $this.removeClass('loading')
                    userMng.$myDlg.modal('show');
                    setTimeout(function() {
                        userMng.$myDlg.modal('hide');
                    }, 2000);
               }
            }, 'json');
        },
        
    };

    userMng.init();

}(window, document, jQuery);

