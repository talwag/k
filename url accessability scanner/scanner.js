var waveKey = 'b5NF8BW1923';
$('#submit_btn').keydown(function (e) {
    if (e.which == 13) {

        scan();
    };
});


function replaceKey(){

    waveKey = $('#newKey').val();
}
function scan() {

    $('body').addClass('loading');
    $('.tables-section').css('display', 'none')
    var inputUrl = $('#url').val();
    
    //var waveSearchUrl = '/content/json/report.json'
    var waveSearchUrl = 'http://wave.webaim.org/api/request?key=' + waveKey + '&url=' + inputUrl + '&reporttype=3';
    $.ajax({
        type: 'GET',
        crossOrigin: true,
        url: waveSearchUrl,
        dataType: 'json',
        success: function (data) {
            if (data.status) {

                renderReport(data);

            } else {

                if (data.error.details) {
                    alert('Error: ' + data.error.details);
                } else {
                    $('.replace-key, .wave-link').removeClass('hide-element');                    
                    alert('Error: ' + data.error);
                };
            }

            $('body').removeClass('loading');
        }
    });
};

function renderReport(data) {

    var pieCahart=[];
    var pageurl = data.statistics.pageurl;
    var tbodyCat = ''
    var color = ['#f2c80f', '#fd625e', '#a66999', '#3599b8', '#374649', '#01b8aa'];
    var i = 0
    
    function changeXpath(xpath) {
        
        return xpath
            .substr(1, xpath.length - 1)
            .replace(/\[(\d+?)\]/g, function (s, m1) { return '[' + (m1 - 1) + ']'; })
            .replace(/\/{2}/g, '')
            .replace(/\/+/g, ' > ')
            .replace(/@/g, '')
            .replace(/\[(\d+)\]/g, ':nth($1)')
            .replace(/^\s+/, '');
    };

    function copyToClipboard(element) {
        
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val($(element).text()+'.css("border","solid")').select();
        document.execCommand("copy");
        $temp.remove();
    };

    $('.url').text('URL:' + pageurl);    
    $('#pieChart').text('');
    $.each(data.categories, function (cat, value) {
        var label = cat;
        tbodyCat += '<tr><td class="' + cat + '-color"></td><td>' + cat + '</td><td>' + value.count + '</td></tr>';
        pieCahart.push({ label: label, value: value.count, color: color[i] })
        var tbodyItems = '';
        var index = 0
        
        $.each(value.items, function (item, itemValue) {
            var pXpaths = '';
                $.each(itemValue.xpaths, function (xpath, xpathValue) {
                    var newXpath = changeXpath(xpathValue)
                    pXpaths += '<p class ="xpath">$(\"' + newXpath + '\")<p>' + '<button class="btn-xs btn-info copy">Copy to clipboard</button>';
                });
        
                index += 1;
                tbodyItems += '<tr><td>' + index + '</td><td>' + itemValue.id + '</td><td>' + itemValue.description + '</td><td>' + itemValue.count + '</td><td><button class="btn-xs btn-info toggle-xpaths" type="button">+</button><span class="p-xpath hide-element">' + pXpaths + '</span></td></tr>';
                $('.'+cat+'Table> tbody').html(tbodyItems);        
                
        });
        i += 1;
    });

    pieChart(pieCahart);
    $('#catTable> tbody').html(tbodyCat);

    //set table view
    $('.tables-section').css('display', 'block')
    // $('#urlInput').val('')
    $('.html5-color').parent().insertBefore('#catTable tr:nth(1)')
    $('.structure-color').parent().insertBefore('#catTable tr:nth(1)')
    $('.features-color').parent().insertBefore('#catTable tr:nth(1)')
    $('.alert-color').parent().insertBefore('#catTable tr:nth(1)')
    $('.error-color').parent().insertBefore('#catTable tr:nth(1)')
    $('.tables-section').removeClass('hide-element');
    $('#url').val('')
    $('.toggle-xpaths').click(function () {
        $(this).text($(this).text() == '+' ? '-' : '+');
        $(this).next().toggle();
    });
    $('.toggle-cat').click(function () {

        $(this).text($(this).text() == '+' ? '-' : '+');
        $(this).next().toggle();
    });
    $('.credits').text('Total scans left: ' + Math.floor(data.statistics.creditsremaining / 3));
    $('.copy').click(function () {

        copyToClipboard($(this).parent().prev());
    });

};

function pieChart(pieChart) {


    var pie = new d3pie("pieChart", {
       
     
        "size": {
            "canvasHeight": 285,
            "canvasWidth": 500,
            "pieOuterRadius": "80%"
        },
        "data": {
            "sortOrder": "value-desc",
            "content": pieChart
        },
        "labels": {
            "outer": {
                "pieDistance": 32
            },
            "inner": {
                "hideWhenLessThanPercentage": 3
            },
            "mainLabel": {
                "fontSize": 11
            },
            "percentage": {
                "color": "#ffffff",
                "decimalPlaces": 0
            },
            "value": {
                "color": "#adadad",
                "fontSize": 11
            },
            "lines": {
                "enabled": true
            },
            "truncation": {
                "enabled": true
            }
        },
        "tooltips": {
            "enabled": true,
            "type": "placeholder",
            "string": "{label}: {value}, {percentage}%"
        },
        "effects": {
            "pullOutSegmentOnClick": {
                "effect": "linear",
                "speed": 400,
                "size": 8
            }
        },
        "misc": {
            "gradient": {
                "enabled": true,
                "percentage": 100
            }
        }
    });
};