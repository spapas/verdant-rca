from django.http import HttpResponse, Http404
from django.db.models import Q
from django.shortcuts import render
from core.models import Page
from rca.models import EventItem, EventItemDatesTimes
from constants import SCREEN_CHOICES, SCREEN_CHOICES_DICT
import datetime


class ScreenIndex(Page):
    indexed = False

    def route(self, request, path_components):
        # If this page is not published, raise 404 error
        if not self.live:
            raise Http404

        if path_components:
            # Request is for a screen
            return self.serve(request, screen=path_components[0], extra_path='/'.join(path_components[1:]))
        else:
            # Request is for screens index
            return self.serve(request)

    def serve_screen(self, request, screen, extra_path=None):
        # Check for special event
        special_events = EventItem.objects.filter(screens__screen=screen, special_event=True, live=True)
        if len(special_events) > 0:
            return render(request, 'rca_signage/special_event.html', {
                'screen': dict(slug = screen, name=SCREEN_CHOICES_DICT[screen]),
                'event': special_events[0],
            })
        else:
            # Week start and week end
            week_start = datetime.date(2013, 9, 28)
            week_end = datetime.date(2013, 12, 5)
            day_count = (week_end - week_start).days + 1

            # Get list of dates
            dates = [
                week_start + datetime.timedelta(days=day_num)
                for day_num in range(day_count)
            ]

            # Add a list of events to each day
            days = [{
                'date': date,
                'events': EventItemDatesTimes.objects.filter(page__live=True).filter(
                    Q(date_from__lte=date, date_to__gte=date) | # Multi day events
                    Q(date_from=date, date_to=None) # Single day events
                )
            } for date in dates]

            # Remove days without any events
            days = filter(lambda day: len(day['events']) > 0, days)

            return render(request, 'rca_signage/weeks_events.html', {
                'screen': dict(slug = screen, name=SCREEN_CHOICES_DICT[screen]),
                'week_start': week_start,
                'week_end': week_end,
                'days': days,
            })

        return HttpResponse("This is the screen page '%s' (%s)" % (screen, extra_path))

    def serve(self, request, screen=None, extra_path=None):
        # Check if this request is for a screen
        if screen:
            # Check that screen exists
            if not screen in SCREEN_CHOICES_DICT:
                raise Http404("Screen doesn't exist")

            return self.serve_screen(request, screen, extra_path=extra_path)
        else:
            return render(request, 'rca_signage/index.html', {
                'screens': [dict(slug = screen[0], name=screen[1]) for screen in SCREEN_CHOICES],
            })