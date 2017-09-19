var master = function() {

    // Initialize script
    function init() {
        _bindEventsInit();
    }

    // Bind events for the elements initialy rendered on the page
    function _bindEventsInit() {
        $("#btnLoadHotels").click(_loadHotels);
    }

    // Bind events for the elements rendered on demand
    function _bindEventsHotel() {
        $(".ToggleReviews").click(_toggleReviews);
    }

    // Load hotels
    function _loadHotels() {
        var uiHost = $("#Results"); 
        var item;

        $.get("http://fake-hotel-api.herokuapp.com/api/hotels?count=5", function(data) {
            $(uiHost).html("");
            $.each(data, function(key, val) {
                item = _renderItem(val);
                $(uiHost).append(item);
            })
            _bindEventsHotel();
        })
        .fail(function(data) {
            var response = JSON.parse(data.responseText);
            var errorMsg = response.error;

            item = _renderErrorMessage(errorMsg);
            $(uiHost).html(item);
        });
    }

    // Render hotel item
    function _renderItem(item) {
        return  "<article id="+ item.id +" class='HotelItem'>" +
                    "<div class='ContentHost'>" +

                        // Hotel image
                        "<div class='HotelImage' style='background-image: url(" + item.images[0] + ")'>" +
                            "<img alt='Image of " + item.name + "' src='"+ item.images[0] +"'/>" +
                        "</div>" +

                        "<div class='HotelInfoWrapper'>" +
                            // Header = Name, Location, Rating
                            "<header class='ItemHeader'>" +
                                "<div class='HotelMainInfo'>" +
                                    "<h1 class='HotelName'>" + item.name + "</h1>" +
                                    "<h2 class='Location'>" + item.city + " - " + item.country + "</h2>" +
                                "</div>" + 
                                "<div class='Rating'>" +
                                    "<span class='StarsAsText'>" + item.stars + "*</span>" + // This line is not visible in browser, but it's there for sematics because font awesome icons do not tell anything to robots and screen readers 
                                    _renderStars(item.stars) +
                                "</div>" +
                            "</header>" +

                            // Description
                            "<p class='Description'>" + item.description + "</p>" +

                            // Footer = Price, Date, Load reviews button
                            "<footer class='ItemFooter'>" +
                                "<div class='PriceAndDate'>" +
                                    "<p class='OfferPrice'>" + item.price + " &euro;</p>" + 
                                    "<p class='OfferDate'>" +
                                        _formatDate(item.date_start) + " - " + _formatDate(item.date_end) +
                                    "</p>" +
                                "</div>" +
                                "<div class='ButtonHost'>" +
                                    "<button type='button' class='Btn ToggleReviews' data-id='" + item.id + "' data-action='show'>" +
                                        "Show reviews" +
                                    "</button>" +
                                "</div>" +
                            "</footer>" +
                        "</div>" +

                    "</div>" +
                "</aticle>"
    }

    // Render error message
    function _renderErrorMessage(message) {
        return  "<article class='ErrorMessageHost'>" +
                    "<h3 class='ErrorMessage'>" +
                        "<span class='ErrorMessageIcon fa fa-exclamation-triangle' aria-hidden='true'></span>" +
                        "<span class='ErrorMessageText'>" + message + "</span>" +
                    "</h3>" +
                "</article>"
    }

    // Render stars
    function _renderStars(starsCount){
        var blanks = 5 - starsCount;
        var starsMarkup = "";

        // Add rating stars
        for (star = 0; star < starsCount; star++) {
            starsMarkup += "<span class='Star fa fa-star' aria-hidden='true'></span>";
        }

        // Add blank stars to match 5* format
        for (star = 0; star < blanks; star++) {
            starsMarkup += "<span class='Blank fa fa-star-o' aria-hidden='true'></span>";
        }

        return starsMarkup
    }

    // Foramt date
    function _formatDate(isoDate) {
        var rawDate = new Date(isoDate);
        return rawDate.getDate() + "." + (rawDate.getMonth() + 1) + "." + rawDate.getFullYear();
    }

    // Toggle reviews
    function _toggleReviews() {
        var action = $(this).data("action");
        var id = $(this).data("id");
        var hotelItem = $("#" +id);

        if (action === "show") {
            $(this).data("action", "hide").text("Hide reviews");
            $(hotelItem).append("<div class='ReviewsHost'></div>");
            var reviewsHost = $(hotelItem).find(".ReviewsHost");

            $.get("http://fake-hotel-api.herokuapp.com/api/reviews?hotel_id="+id, function(data){
                var reviewItem;
                $.each(data, function(key, value) {
                    reviewItem = _renderReview(value);
                    $(reviewsHost).append(reviewItem);
                });
            });
            
        } else {
            $(hotelItem).find(".ReviewsHost").remove();
            $(this).data("action", "show").text("Show reviews");
        }

    }

    // Render review item
    function _renderReview(item) {
        var moodClass = item.positive ? "plus" : "minus";

        return  "<section class='ReviewItem " + moodClass + "'>" +
                    "<div class='Mood'>" +
                        "<span class='MoodIcon fa fa-" + moodClass + "'></span>" +
                    "</div>" + 
                    "<div class='Content'>" +
                        "<h3 class='ReviewerName'>" + item.name + "</h3>" +
                        "<p class='ReviewComment'>" + item.comment + "</p>" +
                    "</div>" +
                "</section>"
    }

    return {
        init: init
    }

}();

$(function(){
    master.init();
});