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
var caretOffset;
// clear format on paste
$(document).on('paste', '[contenteditable]', function (e) {
    console.log(e);
    // e.preventDefault();
    var $me = $(this);
    var plainText = e.originalEvent.clipboardData.getData('Text');
    var orgHTML = $me.html();

    $me.html(orgHTML.substring(0, caretOffset - 1) + plainText + orgHTML.(caretOffset, orgHTML.length - 1));
}).on('click', '[contenteditable]', function (e) {
    caretOffset = getCaretCharacterOffsetWithin($(this)[0]);
});

function getCaretCharacterOffsetWithin(element) {
    var caretOffset = 0;
    if (typeof window.getSelection != "undefined") {
        var range = window.getSelection().getRangeAt(0);
        var preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
    } else if (typeof document.selection != "undefined" && document.selection.type != "Control") {
        var textRange = document.selection.createRange();
        var preCaretTextRange = document.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
}

// function showCaretPos() {
//     var el = document.getElementById("test");
//     var caretPosEl = document.getElementById("caretPos");
//     caretPosEl.innerHTML = "Caret position: " + getCaretCharacterOffsetWithin(el);
// }

// document.body.onkeyup = showCaretPos;
// document.body.onmouseup = showCaretPos;

// Methods
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