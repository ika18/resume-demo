// Sort section
$(".container").sortable({
    cursor: "move",
    placeholder: "sortable-placeholder",
    forcePlaceholderSize: true,
    handle: "h4",
    axis: "y",
    start: function (e, ui) {
        ui.item.addClass('moving');
    },
    stop: function (e, ui) {
        ui.item.removeClass('moving');  
    }
});


var methods = {
    list: function ($root) {
        $root.html('<ul><li>new item</li><li>new item</li><ul>');
    },
    pair: function (el) {
        var $root = $(el).closest('section').find('.row');
        $root.append('<div class="span2" contenteditable="true">Name</div><div class="span10" contenteditable="true">Value</div>');
    },
    row: function (el) {
        var $root = $(el).closest('section').find('table tbody');
        $root.append('<tr><td contenteditable="true">New item</td><td contenteditable="true">New item</td><td contenteditable="true">New item</td></tr>');
    }
}

// Reset
function reset(el, type) {
    var $root = $(el).closest('section').find('[contenteditable="true"]');
    methods[type]($root);
}

// Add new
function addNew(el, type) {
    methods[type](el);
}