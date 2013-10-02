from verdantimages.formats import Format, unregister_image_format, register_image_format
from django.utils.html import escape

class CaptionedImageFormat(Format):
    def editor_attributes(self, image, alt_text):
        # need to add contenteditable=false to prevent editing within the embed
        original_attrs = super(CaptionedImageFormat, self).editor_attributes(image, alt_text)
        return 'contenteditable="false" ' + original_attrs

    def image_to_html(self, image, alt_text, extra_attributes=''):
        rendition = image.get_rendition(self.filter_spec)

        if self.classnames:
            class_attr = 'class="%s" ' % escape(self.classnames)
        else:
            class_attr = ''

        caption = "%s. %s, %s" % (image.title, image.creator, image.year)

        return """<figure %s%s>
            <img src="%s" width="%d" height="%d" alt="%s" />
            <figcaption class="a4">%s</figcaption>
        </figure>""" % (
            extra_attributes, class_attr,
            escape(rendition.url), rendition.width, rendition.height, alt_text,
            escape(caption)
        )

unregister_image_format('fullwidth')
# unregister_image_format('left')
# unregister_image_format('right')

register_image_format(
    CaptionedImageFormat('fullwidth', 'Full width', 'bodytext-image', 'fill-304x171')
)
register_image_format(
    CaptionedImageFormat('halfwidthright', 'Half width right aligned', 'bodytext-image small', 'fill-304x171')
)
