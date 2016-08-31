from django.core.urlresolvers import reverse
from django.test import TestCase
from ticket.models import Ticket
from rest_framework import status
from rest_framework.test import APITestCase

# Create your tests here.
def createTicket(client):
    url = reverse('ticket-list')
    data = {'request': 'wat'}
    return client.post(url, data, format='json')


class TestCreate(APITestCase):
    def setUp(self):
        self.response = createTicket(self.client)

    def test_201(self):
        self.assertEqual(self.response.status_code, status.HTTP_201_CREATED)

    def test_created(self):
        self.assertEqual(Ticket.objects.count(), 1)
        self.assertEqual(Ticket.objects.get().request, 'wat')


# class TestUpdate(APITestCase):
#     def setUp(self):
#         response = createTicket(self.client)
#         self.assertEqual(Ticket.objects.get().request, 'wat')
#         data = {'request': 'foo'}
#         self.response = self.client.put(url, data, format='json')

#     def test_200(self):
#         self.assertEqual(self.response.status_code, status.HTTP_200_CREATED)

#     def test_created(self):
#         self.assertEqual(Ticket.objects.count(), 1)
#         self.assertEqual(Ticket.objects.get().request, 'foo')
