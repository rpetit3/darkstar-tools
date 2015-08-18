/* -----------------------------------------------------------------------------
 * /daily-tasks/
 * ---------------------------------------------------------------------------*/
 var cluster = {
    'jumpjacks':'#earth-cluster',
    'high_knees':'#water-cluster',
    'plank_jumps':'#wind-cluster',
    'pushups':'#fire-cluster',
    'climbers':'#ice-cluster',
    'knee_pull_ins':'#lightning-cluster',
    'cross_crunches':'#dark-cluster',
    'squats':'#light-cluster'
 }

var exp_chain = 0;
 
function init_datepicker() {
    var date = new Date();
    var today = date.getFullYear() + '-' +  (date.getMonth() + 1) + '-' + date.getDate();
    var previous_date = today;
    get_daily_stats(today);
    
    $('#datepicker').datepicker({
        format: 'yyyy-mm-dd',
        startDate: "2014-10-13",
        endDate: '0d'
    }).on('changeDate', function(){
        var new_date = $('#datepicker').datepicker('getDate');
        if ( isNaN( new_date.getTime() ) ) {
            $('#datepicker').datepicker('setDate', previous_date);
        } else {
            new_date = new_date.getFullYear() + '-' +  (new_date.getMonth() + 1) + '-' + new_date.getDate();
            previous_date = new_date;
            get_daily_stats(new_date);
        }
    });
    $('#datepicker').datepicker('setDate', today);

}

function init_stats_form() {
    var frm = $('#save-daily-task');
    frm.submit(function () {
        $.ajax({
            type: 'POST',
            url: '/daily-tasks/',
            data: frm.serialize()+"&steps="+$('#id_steps').val(),
            success: function (data) {
                get_daily_stats($('#id_date').val());
                console.log(data);
            },
            error: function(data) {
                console.log(data);
            }
        });
        return false;
    });
    
    var step_btn = $('#update_steps');
    step_btn.click(function() {
        var date = $('#id_date').val();
        $.ajax({
            type: 'POST',
            url: '/ajax/update-steps/',
            data: "date="+date,
            success: function (data) {
                get_daily_stats(date);
                console.log(data);
            },
            error: function(data) {
                console.log(data);
            }
        });
        return false;
    });
}
function get_daily_stats(date) {
    $.ajax({ 
        type: 'POST',
        url: '/ajax/get-daily-stats/', 
        data: {'date':date},
        dataType: "json",
        success: function(data) { 
            var json = $.parseJSON(data);
            var field = json[0].fields;
            exp_chain = 0;
            update_stats(field, date);
            $('#id_date').val(date);
        },
        error: function(error){
            if (error != 'DoesNotExist') {
                console.log("Error:");
                console.log(error);
            }
        }
    });
}

function get_current_exp_chain(){
    var today = date.getFullYear() + '-' +  (date.getMonth() + 1) + '-' + date.getDate();
    $.ajax({ 
        type: 'POST',
        url: '/ajax/get-current-exp-chain/', 
        data: {'date':date},
        dataType: "json",
        success: function(data) { 
            console.log(data)
        },
        error: function(error){
            if (error != 'DoesNotExist') {
                console.log("Error:");
                console.log(error);
            }
        }
    });
}

function add_exp_chain(date){
    $.ajax({ 
        type: 'POST',
        url: '/ajax/add-exp-chain/', 
        data: {'date':date},
        dataType: "json",
        success: function(data) { 
            var json = $.parseJSON(data);
            console.log(data);
        },
        error: function(error){
            if (error != 'DoesNotExist') {
                console.log("Error:");
                console.log(error);
            }
        }
    });
}

function update_stats(field, date) {
    for (var key in cluster) {
        // Field Values
        $('#id_'+key).val(field[key]);
        // Crystal Opacity
        opacity = set_opacity(key, field[key])
        $(cluster[key]).css('opacity', opacity.toFixed(2));
        exp_chain += opacity;
        if (opacity == 1) {
            $('#div_id_'+key+' label').css('color', '#01FF4E');
        } else {
            $('#div_id_'+key+' label').css('color', '#FFF');
        }
    }
    progress = (exp_chain/8)*100;
    $('.progress-bar').css('width', progress+'%').attr('aria-valuenow', progress); ;
    if (progress == 100) {
        $('.progress-bar').text('EXP Chain Active!');
        add_exp_chain(date);
    } else {
        $('.progress-bar').text(progress.toFixed(0) + '%');
    }
}

function set_opacity(field, val) {
    var status = false;
    
    switch (field) {
        case 'jumpjacks':
            status = val / 200;
            break;
        case 'high_knees':
            status = val / 100;
            break;
        case 'plank_jumps':
            status = val / 50;
            break;
        case 'pushups':
            status = val / 100;
            break;
        case 'climbers':
            status = val / 100;
            break;
        case 'knee_pull_ins':
            status = val / 100;
            break;
        case 'cross_crunches':
            status = val / 100;
            break;
        case 'squats':
            status = val / 100;
            break;
    }

    if (status > 1) {
        status = 1
    }
    return status
}

/* -----------------------------------------------------------------------------
 * /character/{id}/{name}
 * ---------------------------------------------------------------------------*/
function get_signet_cost(level) {
    $.ajax({ 
        type: 'POST',
        url: '/ajax/get-signet-cost/', 
        data: {'date':date},
        dataType: "json",
        success: function(data) { 
            console.log(data)
        },
        error: function(error){
            if (error != 'DoesNotExist') {
                console.log("Error:");
                console.log(error);
            }
        }
    });
}
 
function disable_input() {
    $('#id_level').attr('readonly', true);
    $('#id_char_cost').attr('readonly', true);
    $('#id_char_exp').attr('readonly', true);

    $('#id_upgrade').attr('disabled', true);
    $('#id_signet_cost').attr('disabled', true);
    $('#id_signet_exp').attr('disabled', true);
}
 
function init_signet_form() {
 
}
 
function init_level_form(exp, charid, charname) {
    
    var frm = $('#character-upgrade');
    frm.submit(function () {
        $.ajax({
            type: 'POST',
            url: '/character/'+charid+'/'+charname+'/',
            data: frm.serialize()+"&charid="+charid+"&form=character",
            success: function (data) {
                $("#id_char_cost").val(0);
                $('#id_char_exp').val(numberWithCommas(data));
                $('#char-exp').text(numberWithCommas(data));
                $('#id_level').attr('min', $('#id_level').val());
                var job = $("#id_jobs option:selected").text();
                $("td.job-"+ convertToSlug(job)).text($('#id_level').val());
                console.log(data);
            },
            error: function(data) {
                console.log(data);
            }
        });
        return false;
    });


    $('#id_jobs').change(function() {
        set_job_level();
    });
    
    $("button.level-down").click(function(){
        var level = parseInt($("#id_level").val()) - 1; 
        if (level < $('#id_level').attr('min')) {
            level = $('#id_level').attr('min')
        }
        $("#id_level").val(level)
        estimate_level_cost(exp);
    }); 
    
    $("button.level-up").click(function(){
        var level = parseInt($("#id_level").val()) + 1;
        if (level > $('#id_level').attr('max')) {
            level = $('#id_level').attr('max')
        }
        $("#id_level").val(level)
        estimate_level_cost(exp);
    }); 
    
    set_job_level();
    get_max_level(charid);
    
    $('#id_char_exp').val(numberWithCommas(exp));
}
 
function set_job_level() {
    var job = $("#id_jobs option:selected").text();
    var level = $("td.job-"+ convertToSlug(job)).text();
    $("#id_start_level").val(level);
    $("#id_level").val(level);
    $('#id_level').attr('min', level);
    $("#id_char_cost").val(0);
    if (level == 75) {
        $('button.level-down').attr('disabled', true);
        $('button.level-up').attr('disabled', true);
    } else {
        $('button.level-down').removeAttr('disabled');
        $('button.level-up').removeAttr('disabled');
    }
 }
 
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function get_max_level(charid) {
    $.ajax({ 
        type: 'POST',
        url: '/ajax/get-max-level/', 
        data: {'charid':charid},
        dataType: "text",
        success: function(data) { 
            console.log(data, exp);
            var json = $.parseJSON(data);
            $('#id_level').attr('max', json["genkai"]);
        },
        error: function(error){
            if (error != 'DoesNotExist') {
                console.log("Error:");
                console.log(error);
            }
        }
    });
}

function estimate_level_cost(exp){
    var start_level = $("#id_start_level").val();
    var final_level = $("#id_level").val()
    $.ajax({ 
        type: 'POST',
        url: '/ajax/get-level-cost/', 
        data: {'start_level':start_level, 'final_level': final_level},
        dataType: "text",
        success: function(data) { 
            console.log(data, exp);
            var json = $.parseJSON(data);
            if (json["cost"] == "None") {
                json["cost"] = 0
            }
            $("#id_char_cost").val( numberWithCommas(json["cost"]) );
            
            if ( parseInt(json["cost"]) > exp){
                console.log("in here");
                $('#submit-id-submit').attr('disabled', true);
            } else {
                $('#submit-id-submit').removeAttr('disabled');
            }
            
        },
        error: function(error){
            if (error != 'DoesNotExist') {
                console.log("Error:");
                console.log(error);
            }
        }
    });
}

function convertToSlug(Text)
{
    return Text
        .toLowerCase()
        .replace(/ /g,'-')
        .replace(/[^\w-]+/g,'')
        ;
}