from django.urls import path
from .views import *

urlpatterns = [
    path('login/', view=LoginView.as_view()),
    path('usuarios/', view=UsuarioListCreateView.as_view()),
    path('usuarios/<int:pk>/', view=UsuarioRetrieveUpdateDestroyView.as_view()),
]