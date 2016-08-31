from rest_framework import serializers
from ticket.models import Ticket


class TicketSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Ticket
        fields = ('request',)
