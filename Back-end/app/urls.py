from django.urls import path
from .views import *

urlpatterns = [
    path('login/', view=LoginView.as_view()),
    path('usuarios/', view=UsuarioListCreateView.as_view()),
    path('usuarios/<int:pk>/', view=UsuarioRetrieveUpdateDestroyView.as_view()),
    path('professores/', view=ProfessorListCreateView.as_view()),
    path('professores/<int:pk>/', view=ProfessorRetrieveUpdateDestroyView.as_view()),
    path('disciplinas/', view=DisciplinaListCreateView.as_view()),
    path('disciplinas/<int:pk>/', view=DisciplinaRetrieveUpdateDestroyView.as_view()),
    path('reservas-ambiente/', view=ReservaAmbienteListCreateView.as_view())
]