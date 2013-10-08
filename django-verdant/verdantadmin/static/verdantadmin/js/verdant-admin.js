function makeRichTextEditable(id) {
    var input = $('#' + id);
    var richText = $('<div class="richtext"></div>').html(input.val());
    richText.insertBefore(input);
    input.hide();

    function removeStylingSpans(context) {
        /* Strip the 'style' attribute from spans that have no other attributes.
        (we don't remove the span entirely as that messes with the cursor position,
        and spans will be removed anyway by our whitelisting)
        */
        $('span[style]', context).filter(function() {
            return this.attributes.length === 1;
        }).removeAttr('style');
    }

    richText.hallo({
        toolbar: 'halloToolbarFixed',
        plugins: {
            'halloformat': {},
            'halloheadings': {},
            'hallolists': {},
            'halloreundo': {},
            'halloverdantimage': {},
            'halloverdantlink': {},
            'halloverdantdoclink': {}
        }
    }).bind('hallomodified', function(event, data) {
        input.val(data.content);
    }).bind('paste', function(event, data) {
        setTimeout(function() {
            removeStylingSpans(richText);
        }, 1);
    });
}


function createPageChooser(id, pageType, openAtParentId) {
    var chooserElement = $('#' + id + '-chooser');
    var pageTitle = chooserElement.find('.page-title');
    var input = $('#' + id);

    $('.action-choose', chooserElement).click(function() {
        var initialUrl = '/admin/choose-page/' + pageType + '/';
        /* TODO: don't hard-code this URL, as it may be changed in urls.py */
        if (openAtParentId) {
            initialUrl += openAtParentId + '/';
        }
        ModalWorkflow({
            'url': initialUrl,
            'responses': {
                'pageChosen': function(pageData) {
                    input.val(pageData.id);
                    openAtParentId = pageData.parentId;
                    pageTitle.text(pageData.title);
                    chooserElement.removeClass('blank');
                }
            }
        });
    });

    $('.action-clear', chooserElement).click(function() {
        input.val('');
        openAtParentId = null;
        chooserElement.addClass('blank');
    });
}

function initDateChoosers(context) {
    $('input.friendly_date', context).datepicker({
        dateFormat: 'd M yy', constrainInput: false, /* showOn: 'button', */ firstDay: 1
    });
}
function initDateChooser(id) {
    $('#' + id).datepicker({
        dateFormat: 'd M yy', constrainInput: false, /* showOn: 'button', */ firstDay: 1
    });
}

$(function() {
    initDateChoosers();
});

function InlinePanel(opts) {
    var self = {};

    self.initChildControls = function (prefix) {
        var childId = 'inline_child_' + prefix;
        var deleteInputId = 'id_' + prefix + '-DELETE';
        $('#' + deleteInputId + '-button').click(function() {
            /* set 'deleted' form field to true */
            $('#' + deleteInputId).val('1');
            $('#' + childId).fadeOut(function() {
                self.updateMoveButtonDisabledStates();
            });
        });
        if (opts.canOrder) {
            $('#' + prefix + '-move-up').click(function() {
                var currentChild = $('#' + childId);
                var currentChildOrderElem = currentChild.find('input[name$="-ORDER"]');
                var currentChildOrder = currentChildOrderElem.val();

                /* find the previous visible 'inline_child' li before this one */
                var prevChild = currentChild.prev(':visible');
                if (!prevChild.length) return;
                var prevChildOrderElem = prevChild.find('input[name$="-ORDER"]');
                var prevChildOrder = prevChildOrderElem.val();
                
                // async swap animation must run before the insertBefore line below, but doesn't need to finish first
                self.animateSwap(currentChild, prevChild);

                currentChild.insertBefore(prevChild);
                currentChildOrderElem.val(prevChildOrder);
                prevChildOrderElem.val(currentChildOrder);

                self.updateMoveButtonDisabledStates();
            });

            $('#' + prefix + '-move-down').click(function() {
                var currentChild = $('#' + childId);
                var currentChildOrderElem = currentChild.find('input[name$="-ORDER"]');
                var currentChildOrder = currentChildOrderElem.val();

                /* find the next visible 'inline_child' li after this one */
                var nextChild = currentChild.next(':visible');
                if (!nextChild.length) return;
                var nextChildOrderElem = nextChild.find('input[name$="-ORDER"]');
                var nextChildOrder = nextChildOrderElem.val();

                // async swap animation must run before the insertAfter line below, but doesn't need to finish first
                self.animateSwap(currentChild, nextChild);

                currentChild.insertAfter(nextChild);
                currentChildOrderElem.val(nextChildOrder);
                nextChildOrderElem.val(currentChildOrder);

                self.updateMoveButtonDisabledStates();
            });
        }
    };

    var formsUl = $('#' + opts.formsetPrefix + '-FORMS');
    self.updateMoveButtonDisabledStates = function() {
        if (opts.canOrder) {
            forms = formsUl.children('li:visible');
            forms.each(function(i) {
                $('ul.controls .inline-child-move-up', this).toggleClass('disabled', i == 0);
                $('ul.controls .inline-child-move-down', this).toggleClass('disabled', i == forms.length - 1);
            });
        }
    }

    self.animateSwap = function(item1, item2){
        var item1Y = item1.position().top;
        var item2Y = item2.position().top;
        var parent = item1.parent();

        // Apply moving class to container (ul.multiple) so it can assist absolute positioning of it's children
        // Also set it's relatively calculated height to be an absolute one, to prevent the container collapsing while its children go absolute 
        parent.addClass('moving').css('height', parent.height());
                        
        item1.css('top', item1Y).addClass('moving');
        item2.css('top', item2Y).addClass('moving');

        // animate swapping around
        item1.animate({
            top:item2Y
        }, 200, function(){
            parent.removeClass('moving').removeAttr('style');
            item1.removeClass('moving').removeAttr('style');
        });
        item2.animate({
            top:item1Y
        }, 200, function(){
            parent.removeClass('moving').removeAttr('style');
            item2.removeClass('moving').removeAttr('style');
        })
    }

    buildExpandingFormset(opts.formsetPrefix, {
        onAdd: function(formCount) {
            function fixPrefix(str) {
                return str.replace(/__prefix__/g, formCount);
            }
            self.initChildControls(fixPrefix(opts.emptyChildFormPrefix));
            if (opts.canOrder) {
                $(fixPrefix('#id_' + opts.emptyChildFormPrefix + '-ORDER')).val(formCount);
            }
            self.updateMoveButtonDisabledStates();
            opts.onAdd(fixPrefix);
        }
    });

    return self;
}
