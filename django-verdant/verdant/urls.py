from django.conf.urls import patterns, include, url
from django.contrib import admin

from core import urls as verdant_urls


admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'verdant.views.home', name='home'),
    # url(r'^verdant/', include('verdant.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    url(r'^admin/', include(admin.site.urls)),

    # For anything not caught by a more specific rule above, hand over to
    # Verdant's serving mechanism
    url(r'', include(verdant_urls))
)
