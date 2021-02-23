$(document).ready(() => {
    $('#mycarousel').carousel({ interval: 2000 })
    $('#carouselButton').click(() => {
        if($('#carouselButton').children('span').hasClass('fa-pause')){
            $('#mycarousel').carousel('pause');
            $('#carouselButton').children('span').removeClass('fa-pause');
            $('#carouselButton').children('span').addClass('fa-play');
        } else {
            $('#mycarousel').carousel('cycle');
            $('#carouselButton').children('span').removeClass('fa-play');
            $('#carouselButton').children('span').addClass('fa-pause');
        }
    });

    $('#reserveTableButton').click(() => {
        $('#reserveModal').modal('toggle');
    })
    $('#loginButton').click(() => {
        $('#loginModal').modal('toggle');
    })
})