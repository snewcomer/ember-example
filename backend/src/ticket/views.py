from django.shortcuts import render
from ticket.models import Ticket
from ticket.serializers import TicketSerializer
from rest_framework import status
from rest_framework import viewsets
from rest_framework.response import Response


class TicketView(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer

    def perform_create(self, serializer):
        instance = serializer.save()
        instance.save()

