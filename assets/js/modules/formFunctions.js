// import '../libs/jquery.validate.js';

// (function($) {
//     $.fn.formSubmit = function() {
//         $(this).each(function() {
//             var that = this;
//             $(this).validate({
//                 rules: {
//                     name: "required",
//                     message: "required",
//                     text: "required",
//                     email: {
//                         required: true,
//                         email: true
//                     }
//                 },
//                 messages: {
//                     name: formValidateSettings.name,
//                     message: formValidateSettings.messageEmpty,
//                     text: formValidateSettings.textEmpty,
//                     email: {
//                         required: formValidateSettings.emailEmpty,
//                         email: formValidateSettings.emailIncorrect
//                     }
//                 },

//                 submitHandler: function submitHandler(form, e) {
//                     e.preventDefault();
//                     var $form = $(that);
//                         $.ajax({
//                             type: $form.attr('method'),
//                             url: $form.attr('action'),
//                             dataType: 'json',
//                             data: $form.serialize()
//                         }).done(function (data) {
//                             if(data.title === undefined) data.title = '';
//                             if(data.message === undefined) data.message = '';
//                             if (data.success == true) {
//                                 $form.hide(200);
//                                 $form[0].reset();

//                                 var formSuccess = $('<div></div>').addClass('form-success');
//                                 formSuccess.html('<div class="state-icon"></div> <div class="form-title">' + data.title + '</div> <div class="form-descr">' + data.message + '</div>');
//                                 $form.parent().append(formSuccess);

//                                 setTimeout(function () {
//                                     $form.parent().find('.form-success').show(200);
//                                 }, 200);

//                                 setTimeout(function () {
//                                     $form.parent().find('.form-success').hide(200);
//                                 }, 3000);

//                                 setTimeout(function () {
//                                     $form.parent().find('.form-success').remove();
//                                     $form.parent().find('.form-success');
//                                     $form.show(200);
//                                 }, 3200);
//                             } else {
//                                 $form.hide(200);

//                                 var formError = $('<div></div>').addClass('form-error');
//                                 formError.html('<div class="state-icon"></div> <div class="form-title">' + data.title + '</div> <div class="form-descr">' + data.message + '</div><a href="#" class="btn">' + formValidateSettings.send_again + '</a>');
//                                 $form.parent().append(formError);

//                                 setTimeout(function () {
//                                     $form.parent().find('.form-error').show(200);
//                                 }, 200);

//                                 $form.parent().find('.form-error').find('a').on('click', function (e) {
//                                     e.preventDefault();
//                                     $form.parent().find('.form-error').hide(200);

//                                     setTimeout(function () {
//                                         $form.parent().find('.form-error').remove();
//                                         $form.show(200);
//                                     }, 200);
//                                 });
//                             }
//                         }).fail(function () {
//                             $form.hide(200);

//                             var formError = $('<div></div>').addClass('form-error');
//                             formError.html('<div class="state-icon"></div> <div class="form-title">' + formValidateSettings.send_error_title + '</div> <div class="form-descr">' + formValidateSettings.send_error_message + '</div> <a href="#" class="btn">' + formValidateSettings.send_again + '</a>');
//                             $form.parent().append(formError);

//                             setTimeout(function () {
//                                 $form.parent().find('.form-error').show(200);
//                             }, 200);

//                             $form.parent().find('.form-error').find('a').on('click', function (e) {
//                                 e.preventDefault();
//                                 $form.parent().find('.form-error').hide(200);

//                                 setTimeout(function () {
//                                     $form.parent().find('.form-error').remove();
//                                     $form.show(200);
//                                 }, 200);
//                             });
//                         });

//                 }
//             });
//         })
//     }
// })(jQuery);

export default {
    init() {
        this.validation();
    },

    validation() {
        // $('form').formSubmit();

        $(".mat-input").focus(function(){
            $(this).parent().addClass("is-active is-completed");
        });

        $(".mat-input").focusout(function(){
            if($(this).val() === "")
                $(this).parent().removeClass("is-completed");
            $(this).parent().removeClass("is-active");
        });
    }
}