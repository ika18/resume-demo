// Sort section
$(".page-content").sortable({
    cursor: "move",
    placeholder: "sortable-placeholder",
    forcePlaceholderSize: true,
    handle: "h2",
    axis: "y",
    start: function (e, ui) {
        ui.item.addClass('moving');
    },
    stop: function (e, ui) {
        ui.item.removeClass('moving');  
    }
});

// Methods
var methods = {
    list: function ($root) {
        $root.html('<ul><li>new item</li><li>new item</li><ul>');
    },
    pair: function (el) {
        var $root = $(el).closest('section');
        $root.append('<div class="row-fluid item"><div class="span4" contenteditable="true">Name</div><div class="span8" contenteditable="true">Value</div><a href="#" class="item-remove"><span class="icon-remove"></span></a></div>');
    },
    row: function (el) {
        var $root = $(el).closest('section').find('table tbody');
        $root.append('<tr class="item"><td contenteditable="true"><a href="#" class="item-remove"><span class="icon-remove"></span></a>New item</td><td contenteditable="true">New item</td><td contenteditable="true">New item</td></tr>');
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


$('section').on('click', '.item-remove', function (e) {
    e.preventDefault();
    var $row = $(e.target).closest('.item');
    $row.remove();
});