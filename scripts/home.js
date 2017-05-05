var imgCount;//图片总数
var intervalImg;//图片轮播句柄
var timeoutImg;//轮播延缓句柄
var imgIndex = 1;//起始要换的图片索引
var intervalScroll;//滚动条滚动句柄

$(function () {
    window.onscroll = scrolling;

    $('.leftbar li:not(:last-child) a').on('click', scroll);

    $('#scrolltotop').on('click', function () {
        $('body, html').animate({scrollTop: '0'}, 500);
    });

    $('.leftbar').on('webkitTransitionEnd', function () {
        if ($(this).css('opacity') === '0') {
            $(this).css('display', 'none');
        }
    });

    //根据滚动条位置初始化显示或加载的栏目
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0;
    showOrHide(scrollTop);

    $('#closelogin').on('click', function () {
        $('.logindiv').hide();
        $('body, html').css('overflow', '');
    });

    $('#login, #myaccount').on('click', function () {
        $('.logindiv').show();
        $('body, html').css('overflow', 'hidden');
    });

    imgCount = $('#spotul li').length;

    //自定义换图片事件
    $('#spotul div').on('fadeImg', function () {
        imgIndex = $(this).parent('li').index();
        $('.adimg').css('background', 'url(../images/carousel/ad' + imgIndex + '.jpg) no-repeat center');
        imgIndex++;
        imgIndex = adjust(imgIndex);
        $(this).addClass('hover');
        $('#spotul div').not(this).removeClass('hover');
    });

    //鼠标移动到小圆点上时换图片，并暂停图片轮播
    $('#spotul div').on('mouseover', function () {
        $(this).trigger('fadeImg');
        clearInterval(intervalImg);
    });

    //鼠标移动到图片上时暂停图片轮播
    $('.adimg').on('mouseover', function () {
        clearInterval(intervalImg);
    });

    //鼠标移开小圆点或图片上时重新开启图片轮播
    $('#spotul div, .adimg').on('mouseleave', function () {
        //良好的习惯，重新开启间隔前先清除掉正在进行的间隔
        clearInterval(intervalImg);
        intervalImg = setInterval(fadeImg, 3000);
    });

    intervalImg = setInterval(fadeImg, 3000);

    $('.carouseldiv input').on('click', function () {
        var direction = $(this).hasClass('left') ? 'right' : 'left';
        if (direction === 'right') {
            imgIndex = adjust(imgIndex - 2);
        }

        //点击向左向右时重新计算图片轮播起始时间
        clearInterval(intervalImg);

        //防止连续多次点击，产生多个setInterval
        clearTimeout(timeoutImg);

        //MoveImg(direction);
        fadeImg();

        //并使第一次的轮播间隔加长
        timeoutImg = setTimeout(function () {
            clearInterval(intervalImg);
            intervalImg = setInterval(fadeImg, 3000);
        }, 2000);
    });

    //关闭顶部广告（jquery版）
    $('#closead').on('click', function () {
        $('.topad').fadeOut();
    });

    var listener;
    //判断浏览器是否支持某事件
    if ('onmouseenter' in window)
        listener = 'mouseenter';
    else
        listener = 'mouseover';

    //mouseenter：只有在鼠标进入时触发（低版本浏览器不支持）
    $('#mycart').on(listener, requestCart);
});

//请求购物车
function requestCart() {
    var dropDownCart = $('#dropdowncart');

    dropDownCart.html('');
    dropDownCart.addClass('lazyload');

    $.ajax({
        type: 'GET',
        url: 'http://www.google.com',
        // url: 'test.txt',
        data: {username: '123', password: '456'},
        timeout: 3000,
        success: function (data) {
            dropDownCart.html(data);
        },
        error: function () {
            dropDownCart.html('购物车中还没有商品，赶紧选购吧！');
        },
        complete: function () {
            dropDownCart.removeClass('lazyload');
        }
    });
}

//滚动到特定位置
function scroll() {
    var index = $(this).parent().index();
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0;

    var st;
    if (scrollTop >= 1300 + index * 100)
        st = 1300 + index * 100 - 20;
    else if (scrollTop <= 1200 + index * 100)
        st = 1200 + index * 100 + 20;
    $('body, html').animate({scrollTop: st}, 500);
}

//滚动条滚动相关显示/隐藏
function scrolling() {
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0;
    showOrHide(scrollTop);

    //左侧导航栏随滚动条滚动样式
    for (var i = 0; i < 11; i++) {
        var start = 1200 + i * 100;
        var end = start + 100;
        if (scrollTop > start && scrollTop < end) {
            //清楚动态样式，使静态样式生效
            $('.leftbar li').not(':last-child').attr('style', '');
            $('.leftbar li').not(':last-child').next().attr('style', '');
            if (i == 10)
                break;
            $('.leftbar li:eq(' + i + ')').css({'background-color': '#d70b1c', 'border-top': '1px solid #d70b1c'});
            $('.leftbar li:eq(' + i + ')').next().css('border-top', '1px solid #d70b1c');
            break;
        }
    }
}

function showOrHide(scrollTop) {
    //显示/隐藏搜索栏
    if (scrollTop > 700) {
        $('.searchbar').css('top', '0');
    }
    else {
        $('.searchbar').css('top', '-50px');
    }

    //显示/隐藏左侧导航栏
    if (scrollTop > 1200) {
        $('.leftbar').css('display', 'block');
        //防止连续滚动造成的过渡消失
        if ($('.leftbar').css('opacity') !== '1') {
            $('.leftbar').css('opacity', '1');
        }
    }
    else {
        //if ($('.LeftBar').css('opacity') === '1')
        $('.leftbar').css('opacity', '0');
    }

    //京东秒杀的懒加载
    if (scrollTop > 160 && $('.kill').attr('loaded') === 'no') {
        $('.kill').attr('loaded', 'yes');
        $.ajax({
            type: 'GET',
            url: 'kill.html',
            data: {},
            timeout: 3000,
            /*beforeSend: function(request) {
             request.setRequestHeader('Origin', 'http://localhost:63342');
             },*/
            success: function (data) {
                $('.kill').removeClass('lazyload2');
                $('.kill').html(data);
                //图片的懒加载
                $('.kill img').each(function () {
                    $(this).attr('src', $(this).attr('data-lazy-img'));
                });
            },
            error: function (data) {
                console.log(data);
            }
        });
    }

    //发现好货一栏的懒加载
    if (scrollTop > 500 && $('.threecolumnul').attr('loaded') === 'no') {
        $('.threecolumnul').attr('loaded', 'yes');
        $.ajax({
            type: 'GET',
            url: 'threecolumnui.html',
            data: {},
            timeout: 3000,
            success: function (data) {
                $('.threecolumnul').removeClass('lazyload2');
                $('.threecolumnul').html(data);
                $('.threecolumnul img').each(function () {
                    $(this).attr('src', $(this).attr('data-lazy-img'));
                });

                //初始滑动标签处的宽度
                var width_a = $('.middlediv').width() / 5;

                //滑动标签
                $('#sliderul li').on('mouseover', function () {
                    $('#sliderul i').css('left', (8 + width_a * $(this).index()) + 'px');
                    $('#sliderul ol').hide();
                    $('#sliderul ol:eq(' + $(this).index() + ')').show();
                });
            }
        });
    }

    //3C一栏的懒加载
    if (scrollTop > 1100 && $('.twocolumnul').attr('loaded') === 'no') {
        $('.twocolumnul').attr('loaded', 'yes');
        $.ajax({
            type: 'GET',
            url: 'twocolumnui.html',
            data: {},
            timeout: 3000,
            success: function (data) {
                $('.twocolumnul').removeClass('lazyload2');
                $('.twocolumnul').html(data);
                $('.twocolumnul img').each(function () {
                    $(this).attr('src', $(this).attr('data-lazy-img'));
                });

                //图片滚动
                slideImg();
            }
        });
    }
}

function slideImg() {
    //复制一份滚动队列
    $('.scrollimg p').each(function () {
        $(this).append($(this).html());
    });

    $('.leftbtn').on('click', function () {
        //相对值计算时包括静态样式
        var p = $(this).parent().find('p');
        //使用jquery队列动画，一个执行完后紧接着执行另一个
        p.animate({left: '-=600px'}, 500);
        p.animate({left: '+=30px'}, 100, function () {
            var part1 = $(this).find('a:lt(6)');
            $(this).find('a:last').addClass('tmpclass');

            /*//方法一：after，但必须clone，且添加完后remove
             $('.tmpclass').after(part1.clone());
             part1.remove();*/

            //方法二：insertAfter，直接移动
            part1.insertAfter('.tmpclass');

            $('.tmpclass').removeClass('tmpclass');
            $(this).css('left', '-570px');
        });
    });

    $('.rightbtn').on('click', function () {
        //相对值计算时包括静态样式
        var p = $(this).parent().find('p');
        p.animate({left: '+=600px'}, 500);
        p.animate({left: '-=30px'}, 100, function () {
            var part1 = $(this).find('a:gt(17)');
            $(this).find('a:first').addClass('tmpclass');
            part1.insertBefore('.tmpclass');
            $('.tmpclass').removeClass('tmpclass');
            $(this).css('left', '-570px');
        });
    });
}

function fadeImg() {
    $('#spotul div:eq(' + imgIndex + ')').trigger('fadeImg');
}

/**
 *该函数用循环取余的方式将任何数字调节为0~图片数量-1之间的数字
 * @param number 要调节的数字
 * @returns {*} 调节后的数字
 */
function adjust(number) {
    var result;
    if (number > 0) {
        result = number % imgCount;
    }
    else {
        for (; number < 0;) {
            number = number + imgCount;
        }
        result = number;
    }
    return result;
}
