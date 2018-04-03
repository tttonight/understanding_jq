/**
 *  $.proxy 用法
 * 
 *  $.proxy(function,context)
 *  $.proxy(context,name)
 */

$(document).ready(function () {

    (function () {

        var validate = function (value) {
            console.log(value)
            if (value == 'sendi')
                return true;
            else {
                return false
            }
        }


        var LoginForm = {
            name: 'sendi',

            init: function () {
                // $('#loginBtn').on('click', function (e) {

                //     if (validate(this.name)) {    //  now this ====>  $(''#loginBtn)
                //         console.log('dologin...')
                //     }//this ===>  $('#loginBtn')
                // });


                // var that = this;//Notice
                // $('#loginBtn').on('click', function (e) {

                //     if (validate(that.name)) {    //  now that ====>  instance of LoginFrom
                //         console.log('dologin...')
                //     }

                // });

                //proxy
                $('#loginBtn').on('click', $.proxy(function (e) {
                    console.log(e)
                    if (validate(this.name)) {    //  now this ====>  instance of LoginFrom
                        console.log('dologin...')
                    }

                }, this));



            }

        }

        LoginForm.init();

    })();


})
