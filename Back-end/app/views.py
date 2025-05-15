from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import LoginSerializer, UsuarioSerializer, DisciplinaSerializer, ReservaAmbienteSerializer
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .models import Usuario, Disciplina, ReservaAmbiente
from .permissions import IsGestor
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

class DisciplinaListCreateView(ListCreateAPIView):
    queryset = Disciplina.objects.all()
    serializer_class = DisciplinaSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.IsAuthenticated()]
        return [IsGestor()]
    
    def get_queryset(self):
        user = self.request.user
        if user.cargo == 'P':
            return Disciplina.objects.filter(professor=user)
        return Disciplina.objects.all()
    
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
    
    def get_queryset(self):
        user = self.request.user
        if user.cargo == 'P':
            return ReservaAmbiente.objects.filter(professor_responsavel=user)
        return ReservaAmbiente.objects.all()

class ReservaAmbienteRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = ReservaAmbiente.objects.all()
    serializer_class = ReservaAmbienteSerializer
    permission_classes = [IsGestor]
    lookup_field = 'pk'

class ProfessoresListView(ListCreateAPIView):
    queryset = Usuario.objects.filter(cargo='P')
    serializer_class = UsuarioSerializer
    permission_classes = [IsGestor]

    def get_queryset(self):
        return Usuario.objects.filter(cargo='P')