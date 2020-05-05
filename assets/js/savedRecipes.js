'use strict';
$(document).ready(() => {
  $('.recipe-card-list').prepend(
    `<div class="recipe-inner-container" id="saved-container"></div>`
  );
  if (localStorage.length > 0) {
    $('#no-recipes-home-link').css('display', 'none');
    Object.keys(localStorage).map((id) => {
      $.ajax({
        url: `https://api.spoonacular.com/recipes/${id}/information`,
        type: 'GET',
        data: {
          apiKey: RECIPE_API,
        },
        success: (response) => {
          $('#saved-container').prepend(
            buildRecipeCard(response.image, response.id, response.title)
          );
          if (localStorage.getItem(response.id) !== null) {
            $(`#heart-fill-${response.id}`).toggle();
            $(`#heart-outline-${response.id}`).toggle();
            $(`#heart-fill-${response.id}`).addClass('saved');
          }

          if ($('.recipe-inner-container').length > 1) {
            $('.recipe-inner-container').next().remove();
          }
        },
      });
    });
  } else {
    $('#saved-recipe-container')
      .prepend(`<h2 id="saved-heading">You don't have any saved recipes!</h2>`)
      .append(
        `<a id="no-recipes-home-link" href="index.html">Search for recipes</a>`
      );
    $('#no-recipes-home-link').css('display', 'block');
  }
});
