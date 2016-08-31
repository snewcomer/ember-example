from django.conf.urls import url, include
from ticket import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter(trailing_slash=False)
router.register(r'tickets', views.TicketView)

urlpatterns = [
        url(r'^', include(router.urls)),
        ]
