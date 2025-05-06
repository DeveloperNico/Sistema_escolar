from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import LoginSerializer, UsuarioSerializer, ProfessorSerializer, DisciplinaSerializer, ReservaAmbienteSerializer
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .models import Usuario, Professor, Disciplina, ReservaAmbiente
from .permissions import IsGestor, IsProfessor
from rest_framework import permissions

class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer

class UsuarioListCreateView(ListCreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsGestor]

class UsuarioRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsGestor]
    lookup_field = 'pk'