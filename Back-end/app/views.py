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

class ProfessorListCreateView(ListCreateAPIView):
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.IsAuthenticated()]
        return [IsGestor()]
    
class ProfessorRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer
    permission_classes = [IsGestor]
    lookup_field = 'pk'

class DisciplinaListCreateView(ListCreateAPIView):
    queryset = Disciplina.objects.all()
    serializer_class = DisciplinaSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.IsAuthenticated()]
        return [IsGestor()]
    
class DisciplinaRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = Disciplina.objects.all()
    serializer_class = DisciplinaSerializer
    permission_classes = [IsGestor]
    lookup_field = 'pk'

class ReservaAmbienteListCreateView(ListCreateAPIView):
    queryset = ReservaAmbiente.objects.all()
    serializer_class = ReservaAmbienteSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.IsAuthenticated()]
        return [IsGestor()]

class ReservaAmbienteRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = ReservaAmbiente.objects.all()
    serializer_class = ReservaAmbienteSerializer
    permission_classes = [IsGestor]
    lookup_field = 'pk'