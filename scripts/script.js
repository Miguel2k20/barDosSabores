$(document).ready(function(){
    //Lista de Divs com interação com meu JS
    var listJs = $('#list-js')
    var serverErro = $('#server-error')
    var emptyDrink = $('#drink-empty')
    var loading = $('#loading');

    function startPage(){
        $.ajax({
            url: 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=',
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                if(response && Array.isArray(response.drinks) && response.drinks.length > 0) {
                    listJs.empty();
                    response.drinks.forEach(function(drink) {
                        var newItem = $('<div class="item" id="item-drink" idDrink="'+ drink.idDrink +'"></div>')
                        var imagem = $('<div class="imagem"></div>')
                        imagem.append('<img src="' + drink.strDrinkThumb + '" alt="' + drink.strDrink + '">')
                        newItem.append(imagem)

                        var info = $('<div class="info"></div>');
                        info.append('<h5 class="drink-title">' + drink.strDrink + '</h5>');
                        newItem.append(info);

                        listJs.append(newItem);
                    })
                }
                else {
                    listJs.removeClass('active');
                    emptyDrink.addClass('active');
                }
            },
            error: function(xhr, status, error) {
                listJs.removeClass('active');
                serverErro.addClass('active');
            },
        });
    }
    function getDrinks(formData) {
        loading.addClass('active');
        $.ajax({
            url: 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + encodeURIComponent(formData.get('drink-name')),
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                if (response && Array.isArray(response.drinks) && response.drinks.length > 0) {
                    listJs.empty();
                    response.drinks.forEach(function(drink) {
                        var newItem = $('<div class="item" id="item-drink" idDrink="'+ drink.idDrink +'"></div>')
                        var imagem = $('<div class="imagem"></div>');
                        imagem.append('<img src="' + drink.strDrinkThumb + '" alt="' + drink.strDrink + '">');
                        newItem.append(imagem);
    
                        var info = $('<div class="info"></div>');
                        info.append('<h5 class="drink-title">' + drink.strDrink + '</h5>');
                        newItem.append(info);
    
                        listJs.append(newItem);
                    });
                    listJs.addClass('active');
                    emptyDrink.removeClass('active');
                } else {
                    listJs.removeClass('active');
                    emptyDrink.addClass('active');
                }
            },
            error: function(xhr, status, error) {
                listJs.removeClass('active');
                serverErro.addClass('active');
            },
            complete: function() {
                loading.removeClass('active');
            }
        });
    }
    function getInfoDrink(idDrink) {
        loading.addClass('active');
        $.ajax({
            url: 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=' + encodeURIComponent(idDrink),
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                var drink = response.drinks[0];
                var hasIngredients = false;

                $('#modal-space .modal .title-modal').text(drink.strDrink);
                $('#modal-space .modal .imagem img').attr('src', drink.strDrinkThumb);
                $('#modal-space .modal .info').text(drink.strInstructions);
                $('#modal-space .modal .ingredients').empty();
                for (var i = 1; i <= 15; i++) {
                    var ingredientName = drink['strIngredient' + i];
                    if (ingredientName) {
                        hasIngredients = true;
                        var ingredientItem = $('<li class="ingredient"></li>').text(ingredientName);
                        $('.ingredients').append(ingredientItem);
                    } else {
                        break;
                    }
                }

                if(hasIngredients){
                    $('#ingredients-title').addClass('active')
                } else {
                    $('#ingredients-title').removeClass('active')
                }
           
                $('#modal-space').addClass('active');
            },
            complete: function() {
                loading.removeClass('active');
            }
        });
    }
    $(document).ready(function(){
        startPage()
        $('#search-js').submit(function(event) {
            event.preventDefault();
            var formData = new FormData(this);
            getDrinks(formData);
        });
        $(document).on('click', '#item-drink', function() {
            var idDrink = $(this).attr('iddrink');
            getInfoDrink(idDrink)
        });
        $(document).on('click', '#close-js', function() {
            $('#modal-space').removeClass('active');
        });
        
    });
});