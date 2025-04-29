from rest_framework import serializers
from .models import Usuario, Professor, Disciplina, ReservaAmbiente
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'
    
class ProfessorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Professor
        fields = '__all__'

class DisciplinaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disciplina
        fields = '__all__'

class ReservaAmbienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReservaAmbiente
        fields = '__all__'
    
class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['usuario'] = {
            'username': self.user.username,
            'cargo': self.user.cargo
        }
        return data
