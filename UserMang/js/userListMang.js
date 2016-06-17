!function(window, document, $, undefined) {
    var TOTALPAGE = 0,
        PAGESIZE = 2,
        CURRPAGE = 0,
        QUERY = '';

    var userListMng = {
        $loadingWp: $('.loading-wp'),
        $dlgUpdate: $('#dlgUpdate'),
        $userTable: $('#userTable'),
        $updateBtn: $('.updateBtn'),
        $searchBtn: $('#searchBtn'),
        cache: {},
        init: function() {
            this.initUserList();
            this.initEvent();
        },

        initEvent: function() {
            userListMng.$userTable.on('click', '.del-btn', this.onDelBtnClick);
            userListMng.$userTable.on('click', '.dlgUpdateBtn', this.ondlgUpdateBtnClick);
            userListMng.$updateBtn.on('click', this.onUpDateBtnClick);
            userListMng.$searchBtn.on('click', this.onSearchBtnClick);
            $('#pagingUl').on('click', 'li', this.onPagingLiClick);
            $('#queryIpt').on('keyup', this.onqueryIptKeyup);

            // console.log($('.del-btn'))
        },
        onqueryIptKeyup: function(e) {
            // console.log(e.keyCode)
            if(e.keyCode == 13) {
                userListMng.onSearchBtnClick();
            }
        },

        onSearchBtnClick: function() {
            var query = $('#queryIpt').val();
            QUERY = query;
            CURRPAGE = 0;
            userListMng.initUserList();
            // console.log(query);
        },

        onUpDateBtnClick: function() {
            // userMng.onSaveBtnClick();
            var url = '../server/ajaxUpdateUser.php';
            $this = $(this);
            var hobby = [];

            $('input[name=hobbies]:checked').each(function(key, val) {
                hobby.push(val.value);
                // console.log(hobby);
            });
            var data = {
                id: $('#id').val(),
                name: $('#name').val(),
                age: $('#age').val(),
                edu: $('#edu').val(),
                gender: $('input[name=gender]:checked').val(),
                address: $('#address').val(),
                mobile: $('#mobile').val(),
                hobbies: hobby.join(' ')
                
            };
            // console.log(data)
            $.get(url, data, function(response) {
               if(response.success) {
                    // valDlet();
                    userListMng.$dlgUpdate.modal('hide');
                    userListMng.initUserList();
               }
            }, 'json');
        },

        ondlgUpdateBtnClick: function() {
            var $this = $(this),
                uid = $this.attr('uid'),
                currObj = userListMng.cache[uid];

            userListMng.$dlgUpdate.find('#id').val(currObj.id);
            userListMng.$dlgUpdate.find('input[id=name]').val(currObj.name);
            userListMng.$dlgUpdate.find('input[id=age]').val(currObj.age);
            userListMng.$dlgUpdate.find('input[id=address]').val(currObj.address);
            userListMng.$dlgUpdate.find('input[id=mobile]').val(currObj.mobile);

            initHobbies(currObj.hobbies);
            function initHobbies(hbs) {
                var hobsArr = hbs.split(' ');
                $('input[name=hobbies]').each(function() {
                    var $this = $(this);
                    // console.log($this)

                    if(_.indexOf(hobsArr, this.value) > -1) {
                        $this.prop('checked', true);
                        // $this.checked = true; // 错
                    } else {
                        $this.prop('checked', false);
                        // $this.checked = false; // 错
                    }
                })
                // console.log(hobsArr.join(' '))
            }

            var $gender =$('input[name=gender]');
            // console.log($gender)
            $gender.each(function (key,val) {
                if(val.value == currObj.gender) {
                    this.checked = true;
                    return;
                }
               

            });

            var $option =$('select[id=edu] option');
            $option.each(function (key, val) {
                if(val.value  == currObj.edu) {
                    this.selected = true;
                    return;
                }
                // console.log(val.value)
            });


            userListMng.$dlgUpdate.modal('show');

        },

        onDelBtnClick: function() {
            // var uid = this.getAttribute('uid');

            var $this = $(this),
                uid = $this.attr('uid'),
                url = '../server/ajaxDelUser.php';
            var r = confirm('确定要删除该用户吗？');
            if(!r) {
                return;
            }

            userListMng.$loadingWp.show();

            $.get(url, {id: uid}, function(response) {
                if(response.success) {
                    userListMng.initUserList();
                    userListMng.$loadingWp.hide(); // 异步执行
                    $('#myDlg').modal('show');
                    setTimeout(function() {
                        $('#myDlg').modal('hide');
                    }, 1000)
                }
            }, 'json');
            // console.log(uid)
        },

        initUserList: function() {
            var url = '../server/ajaxUserList.php';
            var param = {
                size: PAGESIZE,
                query: QUERY,
                page: CURRPAGE
            };  

            this.$loadingWp.show();

            // 异步操作
            $.get(url, param, function(response) {
                var $trTpl = $('#trTpl').html(),
                compiled = _.template($trTpl),
                arrTpl = [];

                _.each(response.data, function(val) {
                    arrTpl.push(compiled(val));
                    userListMng.cache[val.id] = val;

                    // console.log(val)
                    // console.log(userListMng.cache[val.id])

                })

                userListMng.renderpaging(response.total);
                // console.log(response.total)
                $('tbody').html(arrTpl.join(''));

                userListMng.$loadingWp.hide(); // 异步执行

                // console.log(this) // this指向 get得到的对象
            },'json');
        },
        onPagingLiClick: function() {
            var $this = $(this);
            var page = $this.attr('page') || 0;
            if($this.hasClass('last-page')) {
                CURRPAGE = TOTALPAGE - 1;
            } else {
                CURRPAGE = page;
            }
            // console.log(CURRPAGE)
            userListMng.initUserList()
        },
        renderpaging: function(total) {
            var liArr = [];
            TOTALPAGE = Math.ceil(total/PAGESIZE);
            // console.log(TOTALPAGE)
            liArr.push(
                '<li class="first-page">',
                    '<a href="javascript:void(0)" aria-label="Previous">',
                        '<span aria-hidden="true">&laquo;</span>',
                    '</a>',
                '</li>'
            );

            for(var i=0; i<TOTALPAGE; i++) {
                if(i == CURRPAGE){
                    liArr.push('<li page="',i, '" class="active"><a href="javascript:;">',i + 1,'</a></li>');
                } else{
                    liArr.push('<li page="',i, '"><a href="javascript:;">',i + 1,'</a></li>');
                }
            };
                
           

            liArr.push(
                '<li class="last-page">',
                    '<a href="javascript:void(0)" aria-label="Next">',
                      '<span aria-hidden="true">&raquo;</span>',
                    '</a>',
                '</li>'
            );

            $('#pagingUl').html(liArr.join(''));
        }
    
    };     
    // console.log(arguments)
    userListMng.init();
}(window, document, jQuery)