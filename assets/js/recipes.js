'use strict';
$(document).ready(() => {
  localStorage.removeItem('foodId');

  // On load, open the menu if the window size is greater than 768px
  if ($(window).width() > 768) {
    $('.nav').addClass('nav-open');
  }

  // Menu animations
  $('.nav-container').click(function () {
    $('.nav').addClass('nav-open');
  });
  $('.close').click(function () {
    $('.nav').removeClass('nav-open');
  });

  // Submit search actions
  $('#clear-recipe').click(() => {
    $('.recipe-form-input').val('');
  });

  $('#submit-recipe').click((e) => {
    checkFormSubmission(e);
  });

  // Get & display random fact & trending recipes on page load
  getRandomFact();
  getRandomRecipe();
  getTrendingRecipes();

  // On search, build recipe cards for first 15 results
  // Returns HTML "card" for each item with an image and title
  $('.search-container').on('submit', (e) => {
    e.preventDefault();
    let searchTerm = $('.search-bar').val();
    if (searchTerm == '') {
      $('.search-bar').addClass('error');
      $('.error-message').css('display', 'block').css('height', '100%');
    } else {
      $('.full-recipe-container').remove();
      $('.search-bar').removeClass('error');
      $('.recipe-card-list').css('display', 'flex');
      $('.error-message').css('display', 'none');
      $('#spinner').show();
      $('#showing-results-heading')
        .show()
        .text(`Showing results for '${searchTerm}':`);
      $.ajax({
        url: `https://api.spoonacular.com/recipes/search`,
        type: 'GET',
        data: {
          query: searchTerm,
          number: 15,
          apiKey: RECIPE_API,
        },
        success: (response) => {
          if (response.totalResults > 0) {
            buildThumbnail(response);
          } else {
            $('#showing-results-heading')
              .show()
              .text(`Sorry, no results for '${searchTerm}'!`);
            $('.recipe-card-list').css('display', 'none');
          }
        },

        error: function (xhr, status) {
          if (typeof this.statusCode[xhr.status] != 'undefined') {
            return false;
          }
        },
        statusCode: {
          402: function (response) {
            throttledApiRedirect();
          },
        },
      });
    }
  });
});
